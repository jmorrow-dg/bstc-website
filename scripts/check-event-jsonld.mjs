// Validates Event JSON-LD in the built HTML (run `npm run build` first):
//   node scripts/check-event-jsonld.mjs [--dir .next/server/app]
// Google Rich Results Event fields: required name, startDate, location;
// recommended description, endDate, eventStatus, image, offers, organizer, performer.
// Exits 1 when any Event lacks organizer, or has an offer without validFrom.
import fs from "node:fs";
import path from "node:path";

const dirArg = process.argv.indexOf("--dir");
const base = dirArg > -1 ? process.argv[dirArg + 1] : ".next/server/app";
const required = ["name", "startDate", "location"];
const recommended = ["description", "endDate", "eventStatus", "image", "offers", "organizer", "performer"];
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

let pages = 0, events = 0, failures = 0;
const missingRecommended = {};
for (const sub of ["events", "how-i-build-with-ai"]) {
  const dir = path.join(base, sub);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(dir, f), "utf8");
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    const nodes = blocks.flatMap((m) => {
      const j = JSON.parse(m[1]);
      return Array.isArray(j) ? j : j["@graph"] ?? [j];
    });
    const evs = nodes.filter((n) => n["@type"] === "Event");
    if (!evs.length) continue;
    pages++;
    for (const ev of evs) {
      events++;
      const where = `${sub}/${f.replace(".html", "")}`;
      const problems = [];
      for (const k of required) if (!ev[k]) problems.push(`missing required ${k}`);
      if (!ev.organizer?.name) problems.push("missing organizer");
      else if (ev.organizer["@type"] !== "Organization") problems.push("organizer is not an Organization");
      if (ev.offers) {
        if (!ev.offers.validFrom) problems.push("offers.validFrom missing");
        else if (!ISO.test(ev.offers.validFrom)) problems.push(`offers.validFrom not ISO 8601 with offset: ${ev.offers.validFrom}`);
        else if (Date.parse(ev.offers.validFrom) > Date.parse(ev.startDate)) problems.push("offers.validFrom after startDate");
      }
      for (const k of recommended) if (!ev[k]) (missingRecommended[k] ??= []).push(where);
      if (problems.length) { failures++; console.log(`FAIL ${where}: ${problems.join("; ")}`); }
    }
  }
}
console.log(`Event pages: ${pages}, Event nodes: ${events}, failing: ${failures}`);
for (const [k, v] of Object.entries(missingRecommended)) console.log(`  recommended ${k} absent on ${v.length} node(s)`);
process.exit(failures || !events ? 1 : 0);
