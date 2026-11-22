// Validates Event JSON-LD in the built HTML (run `npm run build` first):
//   node scripts/check-event-jsonld.mjs [--dir .next/server/app]
// Google Rich Results Event fields: required name, startDate, location;
// recommended description, endDate, eventStatus, image, offers, organizer, performer.
// Josh, 10 Nov 2026: organizer = venue (never BSTC), contributor = BSTC.
// Google also requires organizer.url whenever organizer is present.
// Scans event pages, the /events list, and the series pages
// (/drinks-and-dinner, /how-i-build-with-ai), including an Event nested in an ItemList
// and an EventSeries organiser.
// Exits 1 when any Event with venue data lacks organizer, names BSTC as organizer,
// has an organizer without an http(s) url, or has an offer without validFrom.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROUTES = ["events", "how-i-build-with-ai", "drinks-and-dinner"];

export function isHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function typesOf(node) {
  return [].concat(node?.["@type"] ?? []);
}

// Events can sit at the top, in @graph, or inside an ItemList on a list page.
export function collectNodes(value, want, out = []) {
  if (!value || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    for (const item of value) collectNodes(item, want, out);
    return out;
  }
  if (typesOf(value).some((type) => want.has(type))) out.push(value);
  for (const child of Object.values(value)) collectNodes(child, want, out);
  return out;
}

export function jsonLdNodes(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.flatMap((match) => {
    const data = JSON.parse(match[1]);
    return collectNodes(data, new Set(["Event", "EventSeries"]));
  });
}

// Shared organiser rules. requireName is for an Event that has a real venue.
export function organizerProblems(node, { requireName = false } = {}) {
  const problems = [];
  const noVenue = /^(tba|tbc|tbd)\b/i.test(node.location?.name ?? "");
  if (!node.organizer?.name) {
    if (requireName && !noVenue) problems.push("missing organizer");
    return problems;
  }
  if (node.organizer["@type"] !== "Organization") problems.push("organizer is not an Organization");
  if (/bali start-?up (&|and) tech|bstc/i.test(node.organizer.name) || String(node.organizer.url ?? "").includes("balistartupandtech.com")) {
    problems.push("organizer is BSTC (must be the venue)");
  }
  if (!isHttpUrl(node.organizer.url)) problems.push("organizer.url missing or not an http(s) URL");
  return problems;
}

function htmlFiles(base) {
  const found = [];
  const add = (file, where) => {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) found.push({ file, where });
  };
  const walk = (dir, prefix) => {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return;
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      if (fs.statSync(file).isDirectory()) walk(file, `${prefix}/${name}`);
      else if (name.endsWith(".html")) found.push({ file, where: `${prefix}/${name.replace(/\.html$/, "")}` });
    }
  };
  for (const route of ROUTES) {
    add(path.join(base, `${route}.html`), route);
    walk(path.join(base, route), route);
  }
  return found;
}

export function checkEventHtmlDir(base) {
  const required = ["name", "startDate", "location"];
  const recommended = ["description", "endDate", "eventStatus", "image", "offers", "organizer", "performer"];
  const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
  let pages = 0;
  let events = 0;
  let failures = 0;
  const missingRecommended = {};
  const organizers = {};
  const noVenueData = [];
  const lines = [];
  for (const { file, where } of htmlFiles(base)) {
    const html = fs.readFileSync(file, "utf8");
    const nodes = jsonLdNodes(html);
    const evs = nodes.filter((node) => typesOf(node).includes("Event"));
    const series = nodes.filter((node) => typesOf(node).includes("EventSeries") && !typesOf(node).includes("Event"));
    if (!evs.length && !series.length) continue;
    pages++;
    for (const ev of evs) {
      events++;
      const problems = [];
      for (const key of required) if (!ev[key]) problems.push(`missing required ${key}`);
      const noVenue = /^(tba|tbc|tbd)\b/i.test(ev.location?.name ?? "");
      if (!ev.organizer?.name && noVenue) noVenueData.push(where);
      problems.push(...organizerProblems(ev, { requireName: true }));
      if (ev.organizer?.name) organizers[ev.organizer.name] = { n: (organizers[ev.organizer.name]?.n ?? 0) + 1, url: ev.organizer.url ?? "" };
      if (ev.contributor?.["@type"] !== "Organization" || ev.contributor.name !== "Bali Startup & Tech Community" || ev.contributor.url !== "https://www.balistartupandtech.com") {
        problems.push("contributor is not the BSTC Organization");
      }
      if (ev.offers) {
        if (!ev.offers.validFrom) problems.push("offers.validFrom missing");
        else if (!ISO.test(ev.offers.validFrom)) problems.push(`offers.validFrom not ISO 8601 with offset: ${ev.offers.validFrom}`);
        else if (Date.parse(ev.offers.validFrom) > Date.parse(ev.startDate)) problems.push("offers.validFrom after startDate");
      }
      for (const key of recommended) if (!ev[key]) (missingRecommended[key] ??= []).push(where);
      if (problems.length) {
        failures++;
        lines.push(`FAIL ${where}: ${problems.join("; ")}`);
      }
    }
    for (const node of series) {
      const problems = organizerProblems(node, { requireName: true });
      if (node.organizer?.name) organizers[node.organizer.name] = { n: (organizers[node.organizer.name]?.n ?? 0) + 1, url: node.organizer.url ?? "" };
      if (problems.length) {
        failures++;
        lines.push(`FAIL ${where}: ${problems.join("; ")}`);
      }
    }
  }
  return { pages, events, failures, missingRecommended, organizers, noVenueData, lines };
}

function main() {
  const dirArg = process.argv.indexOf("--dir");
  const base = dirArg > -1 ? process.argv[dirArg + 1] : ".next/server/app";
  const report = checkEventHtmlDir(base);
  for (const line of report.lines) console.log(line);
  console.log("Organizers:", JSON.stringify(report.organizers));
  if (report.noVenueData.length) console.log("No venue data (organizer omitted):", report.noVenueData.join(", "));
  console.log(`Event pages: ${report.pages}, Event nodes: ${report.events}, failing: ${report.failures}`);
  for (const [key, pages] of Object.entries(report.missingRecommended)) console.log(`  recommended ${key} absent on ${pages.length} node(s)`);
  process.exit(report.failures || !report.events ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
