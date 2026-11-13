// Run with: npm test
// Event pages, the Drinks & Dinner hub and /events (11 Nov 2026): Event schema
// address, geo, endDate, isAccessibleForFree and photo; the dated Meetup record;
// honest photo captions; real 404s for unknown event slugs.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

// Transpile the lib modules to CommonJS in a temp dir (no build needed).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bstc-events-test-"));
for (const name of ["schema", "constants", "event-status", "venues", "event-history", "event-photos"]) {
  const src = fs.readFileSync(path.join(root, "src/lib", `${name}.ts`), "utf8");
  let out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, resolveJsonModule: true },
  }).outputText;
  out = out.replace(/require\("\.\/([\w-]+)"\)/g, 'require("./$1.cjs")');
  out = out.replace(/require\("\.\.\/data\/([\w-]+\.json)"\)/g, (_, f) => `require(${JSON.stringify(path.join(root, "src/data", f))})`);
  fs.writeFileSync(path.join(tmp, `${name}.cjs`), out);
}
const { getEventSchema, getEventOrganizer } = require(path.join(tmp, "schema.cjs"));
const { SITE } = require(path.join(tmp, "constants.cjs"));
const { getVenue } = require(path.join(tmp, "venues.cjs"));
const H = require(path.join(tmp, "event-history.cjs"));
const P = require(path.join(tmp, "event-photos.cjs"));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const dir = path.join(root, "content/events");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
const raw = Object.fromEntries(files.map((f) => [f, fs.readFileSync(path.join(dir, f), "utf8")]));
const events = files.map((f) => matter(raw[f]).data);
const NOW = new Date("2026-11-11T08:00:00+08:00");
const PHOTO = "/images/photos/events/undated_bstc_founder-long-table.jpg";

const schemaFor = (e) =>
  getEventSchema(
    {
      title: e.title, description: e.description, date: e.date, time: e.time, endTime: e.endTime,
      venue: e.venue, url: `${SITE.url}/events/${e.slug}`, image: e.coverImage, photo: PHOTO,
      status: e.status, rsvpUrl: e.rsvpUrl, announced: e.announced, organizer: getEventOrganizer(e),
    },
    NOW
  );

test("known venues carry the full street address, postcode, country ID and geo", () => {
  const want = {
    "Yema Kitchen": ["Jl. Tanah Barak No.31", "80351", -8.650064, 115.13376],
    "Seoul Soul Project": ["Jl. Canggu Padang Linjong No.61", "80361", -8.645777, 115.134895],
    "Mata Berawa": ["Jl. Subak Sari 13, Tibubeneng", "80361", -8.66646, 115.144295],
  };
  let checked = 0;
  for (const e of events) {
    const v = getVenue(e.venue);
    if (!v) continue;
    checked++;
    const s = schemaFor(e);
    const [street, postcode, lat, lon] = want[v.name];
    assert.equal(s.location.name, v.name, e.slug);
    assert.equal(s.location.address.streetAddress, street, e.slug);
    assert.equal(s.location.address.postalCode, postcode, e.slug);
    assert.equal(s.location.address.addressRegion, "Bali", e.slug);
    assert.equal(s.location.address.addressCountry, "ID", e.slug);
    assert.ok(s.location.address.addressLocality, e.slug);
    assert.deepEqual([s.location.geo.latitude, s.location.geo.longitude], [lat, lon], e.slug);
  }
  assert.ok(checked >= 34, `expected most events at a known venue, got ${checked}`);
});

test("every Event is free, has a real photo first in image, and keeps the cover", () => {
  for (const e of events) {
    const s = schemaFor(e);
    assert.equal(s.isAccessibleForFree, true, e.slug);
    assert.ok(Array.isArray(s.image) && s.image[0] === `${SITE.url}${PHOTO}`, e.slug);
    if (e.coverImage) assert.ok(s.image.includes(`${SITE.url}${e.coverImage}`), e.slug);
  }
});

test("endDate comes only from an endTime that names its listing, and is never guessed", () => {
  for (const f of files) {
    const e = matter(raw[f]).data;
    const s = schemaFor(e);
    if (!e.endTime) {
      assert.equal(s.endDate, undefined, `${e.slug}: endDate without an endTime`);
      continue;
    }
    assert.match(raw[f], /^endTime: "\d\d:\d\d" # from the (Luma|Meetup) .+ listing, read \d+ \w+ 20\d\d$/m, `${e.slug}: endTime needs its source`);
    assert.equal(s.endDate, `${e.date}T${e.endTime}:00+08:00`, e.slug);
    assert.ok(Date.parse(s.endDate) > Date.parse(s.startDate), `${e.slug}: ends before it starts`);
  }
  const withEnd = events.filter((e) => e.endTime);
  assert.ok(withEnd.length >= 17, `every upcoming event should have its listing's end time, got ${withEnd.length}`);
  for (const e of events.filter((x) => x.status === "upcoming")) assert.ok(e.endTime, `${e.slug}: upcoming without endTime`);
});

test("past pages that match a Meetup night use that night's end time", () => {
  for (const e of events.filter((x) => x.endTime && x.status === "completed")) {
    const night = H.EVENT_HISTORY.nights.find((n) => H.findEventPageForNight(n, [e]));
    assert.ok(night, `${e.slug}: past endTime with no matching Meetup night`);
    assert.equal(night.ends.slice(11, 16), e.endTime, e.slug);
  }
});

test("the dated record matches the Meetup group check of 11 Nov 2026", () => {
  const all = H.getHistoryStats();
  assert.equal(H.HISTORY_CHECKED, "11 Nov 2026");
  assert.equal(all.nights, 53);
  assert.equal(all.dinners, 37);
  assert.equal(all.howIAi, 16);
  assert.equal(all.rsvps, 2620);
  assert.equal(all.firstDate, "2023-11-09");
  assert.deepEqual(H.EVENT_HISTORY.group, { members: 2788, ratingAverage: 4.65, ratingCount: 155 });
});

test("history labels are consistent and newest first", () => {
  const dinners = H.getNights("drinks-and-dinner");
  assert.ok(dinners.every((n, i) => i === 0 || dinners[i - 1].starts >= n.starts));
  const label = (d) => H.nightLabel(dinners.find((n) => n.date === d));
  assert.equal(label("2026-06-18"), "Drinks & Dinner #37");
  assert.equal(label("2026-04-30"), "Drinks & Dinner #36");
  assert.equal(label("2026-03-24"), "Melbourne Drinks & Dinner #1");
  assert.equal(H.nightLabel(H.getNights("how-i-ai")[0]), "How I AI Edition 18");
});

test("a history row links this site's page only for the same series, date and number", () => {
  const link = (date, series) => {
    const n = H.EVENT_HISTORY.nights.find((x) => x.date === date && x.series === series);
    return H.findEventPageForNight(n, events)?.slug;
  };
  assert.equal(link("2026-06-18", "drinks-and-dinner"), "flagship-networking-night-june-2026");
  assert.equal(link("2026-04-30", "drinks-and-dinner"), "networking-drinks-berawa-april-2026");
  assert.equal(link("2026-11-04", "how-i-ai"), "how-i-ai-season-2-edition-18");
  // Meetup's Edition 6 was on 27 May; this site's 27 May page says Edition 7, so the row goes to Meetup.
  assert.equal(link("2026-05-27", "how-i-ai"), undefined);
  assert.equal(link("2023-11-09", "drinks-and-dinner"), undefined);
});

test("photos exist at their stated size, and captions never name a night, series or venue", () => {
  assert.equal(P.EVENT_PHOTOS.length, 25);
  for (const p of P.EVENT_PHOTOS) {
    assert.ok(fs.existsSync(path.join(root, "public", p.src)), p.src);
    assert.ok(p.alt && p.width > 0 && p.height > 0, p.src);
    assert.doesNotMatch(p.alt, /#\d|edition|how i ai|drinks|dinner #|yema|seoul soul|berawa|melbourne/i, p.src);
  }
  assert.match(P.PHOTO_CAPTION, /Bali Startup & Tech nights in Canggu/);
  assert.doesNotMatch(P.PHOTO_CAPTION, /yema|seoul|how i ai|drinks & dinner|#\d/i);
  for (const mix of ["dinner", "talks", "all"]) assert.equal(new Set(P.getEventPhotos(mix).map((p) => p.src)).size, 25);
});

test("unknown event slugs are real 404s (dynamicParams = false on both event routes)", () => {
  for (const route of ["src/app/events/[slug]/page.tsx", "src/app/how-i-build-with-ai/[slug]/page.tsx"]) {
    const src = fs.readFileSync(path.join(root, route), "utf8");
    assert.match(src, /^export const dynamicParams = false;$/m, route);
  }
});

test("the dinner hub is in the nav, the sitemap and llms.txt", () => {
  assert.match(fs.readFileSync(path.join(root, "src/lib/constants.ts"), "utf8"), /href: "\/drinks-and-dinner"/);
  assert.match(fs.readFileSync(path.join(root, "src/app/sitemap.ts"), "utf8"), /\/drinks-and-dinner`/);
  assert.match(fs.readFileSync(path.join(root, "public/llms.txt"), "utf8"), /balistartupandtech\.com\/drinks-and-dinner\)/);
});

test("new events copy has no em or en dashes, invite links or phone numbers", () => {
  const touched = [
    "src/app/drinks-and-dinner/page.tsx",
    "src/app/events/page.tsx",
    "src/components/events/EventProof.tsx",
    "src/components/events/HistoryTable.tsx",
    "src/components/events/PhotoGallery.tsx",
    "src/components/events/EventPageExtras.tsx",
    "src/lib/event-photos.ts",
    "src/lib/event-history.ts",
    "src/lib/venues.ts",
  ];
  for (const f of touched) {
    const s = fs.readFileSync(path.join(root, f), "utf8");
    assert.doesNotMatch(s, /[\u2013\u2014]/, `${f}: dash`);
    assert.doesNotMatch(s, /chat\.whatsapp\.com|t\.me\/\+|\+62\s?\d/, `${f}: invite link or phone`);
  }
});
