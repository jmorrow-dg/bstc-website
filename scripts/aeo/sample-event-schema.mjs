#!/usr/bin/env node
// Parse JSON-LD on a sample of event routes and on /events.
// Usage: node scripts/aeo/sample-event-schema.mjs --base http://localhost:3000
// Exit 1 when a block does not parse or a required Event field is wrong.
// endDate may be absent: this script records that and does not invent a time.

const SAMPLE = [
  "/events",
  "/events/networking-drinks-dinner-canggu-42",
  "/events/networking-drinks-dinner-canggu-50",
  "/events/networking-drinks-dinner-canggu-39",
  "/events/how-i-ai-edition-19",
  "/events/how-i-ai-edition-10",
  "/events/networking-night-january-2026",
  "/events/flagship-networking-night-may-2026",
  "/events/builder-session-ai-automation-march-2026",
  "/events/hackathon-edition-1",
];

const REQUIRED_ON_EVENT = ["isAccessibleForFree", "organizer", "contributor"];

function args() {
  let base = "http://localhost:3000";
  let allEvents = false;
  const routes = [];
  const rest = process.argv.slice(2);
  while (rest.length) {
    const arg = rest.shift();
    if (arg === "--base") {
      base = rest.shift();
      if (!base) throw new Error("Missing base URL");
    } else if (arg === "--all-events") {
      allEvents = true;
    } else if (arg === "--help") {
      console.log("Usage: node scripts/aeo/sample-event-schema.mjs [--base URL] [--all-events] [/route ...]");
      process.exit(0);
    } else {
      routes.push(arg);
    }
  }
  return { base, allEvents, routes };
}

function blocks(html) {
  const found = [];
  const errors = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([^]*?)<\/script\s*>/gi)) {
    if (!/\btype\s*=\s*(["'])application\/ld\+json\1/i.test(match[1])) continue;
    try {
      found.push(JSON.parse(match[2]));
    } catch (error) {
      errors.push(`JSON parse: ${error.message}`);
    }
  }
  return { found, errors };
}

function* nodes(value) {
  if (!value || typeof value !== "object") return;
  if (!Array.isArray(value)) yield value;
  for (const child of Object.values(value)) yield* nodes(child);
}

function typesOf(node) {
  return [].concat(node["@type"] ?? []);
}

function eventNodes(data) {
  const events = [];
  for (const node of nodes(data)) {
    if (typesOf(node).includes("Event")) events.push(node);
  }
  return events;
}

function checkEvent(event, errors, allowMissingEnd) {
  if (event.isAccessibleForFree !== true) {
    errors.push(`${event.url || event.name}: isAccessibleForFree is not true`);
  }
  for (const field of REQUIRED_ON_EVENT) {
    if (event[field] == null) errors.push(`${event.url || event.name}: missing ${field}`);
  }
  const organizerName = event.organizer?.name ?? "";
  if (/bstc|bali startup/i.test(organizerName)) {
    errors.push(`${event.url}: organiser must not be BSTC (${organizerName})`);
  }
  if (event.offers) {
    const offers = [].concat(event.offers);
    for (const offer of offers) {
      if (offer.price !== "0") errors.push(`${event.url}: offer price is not 0`);
    }
  }
  if (event.endDate) {
    const startDay = String(event.startDate).slice(0, 10);
    if (!String(event.endDate).startsWith(startDay)) {
      errors.push(`${event.url}: endDate ${event.endDate} is not on start day ${startDay}`);
    }
  } else if (!allowMissingEnd) {
    errors.push(`${event.url}: missing endDate`);
  }
  return {
    url: event.url,
    endDate: Boolean(event.endDate),
    isAccessibleForFree: event.isAccessibleForFree === true,
    organizer: organizerName,
    contributor: Boolean(event.contributor),
  };
}

async function load(base, route) {
  const response = await fetch(new URL(route, base), { redirect: "manual", signal: AbortSignal.timeout(30000) });
  const html = await response.text();
  const parsed = blocks(html);
  if (response.status !== 200) parsed.errors.unshift(`HTTP ${response.status}`);
  return parsed;
}

async function main() {
  const { base, allEvents, routes } = args();
  let list = routes.length ? routes : SAMPLE;
  if (allEvents) {
    const sitemap = await fetch(new URL("/sitemap.xml", base), { signal: AbortSignal.timeout(30000) });
    if (!sitemap.ok) throw new Error(`Sitemap HTTP ${sitemap.status}`);
    const xml = await sitemap.text();
    const fromSitemap = [];
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const path = new URL(match[1]).pathname;
      if (path === "/events" || path.startsWith("/events/")) fromSitemap.push(path);
    }
    list = [...new Set([...list, ...fromSitemap])];
  }

  const rows = [];
  let failed = 0;
  const listingEvents = new Map();

  for (const route of list) {
    const parsed = await load(base, route);
    const errors = [...parsed.errors];
    const events = parsed.found.flatMap(eventNodes);
    if (route === "/events") {
      const lists = parsed.found.flatMap((data) => [...nodes(data)].filter((node) => typesOf(node).includes("ItemList")));
      if (!lists.length) errors.push("/events has no ItemList");
      if (!events.length) errors.push("/events ItemList has no Event");
      for (const event of events) {
        const row = checkEvent(event, errors, true);
        if (row.url) listingEvents.set(row.url, row);
      }
    } else if (route.endsWith("hackathon-edition-1")) {
      if (events.length) errors.push("hackathon page emitted Event schema");
    } else {
      if (!parsed.found.length) errors.push("No JSON-LD blocks");
      if (events.length !== 1) errors.push(`expected 1 Event, found ${events.length}`);
      for (const event of events) rows.push(checkEvent(event, errors, true));
    }
    const status = errors.length ? "FAIL" : "ok";
    if (errors.length) failed += 1;
    console.log(`${status}\t${route}\t${errors.join("; ") || `${events.length} event(s)`}`);
  }

  console.log("\nslug\tendDate\tfree\torganizer\tcontributor\tmatches_listing");
  for (const row of rows) {
    const listed = listingEvents.get(row.url);
    const same = listed
      && listed.endDate === row.endDate
      && listed.isAccessibleForFree === row.isAccessibleForFree
      && listed.organizer === row.organizer
      && listed.contributor === row.contributor;
    console.log([
      row.url,
      row.endDate,
      row.isAccessibleForFree,
      row.organizer,
      row.contributor,
      listed ? (same ? "yes" : "DIFF") : "not-in-list",
    ].join("\t"));
    if (listed && !same) failed += 1;
  }

  if (failed) {
    console.error(`\n${failed} check(s) failed`);
    process.exit(1);
  }
  console.log(`\n${list.length} routes ok`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
