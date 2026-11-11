// Run with: npm test
// Asserts that every event page's Event JSON-LD carries `organizer` and, when
// it advertises an offer, `offers.validFrom`. Uses the same frontmatter as the
// pages and the same getEventSchema, with the page's argument shape.
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

// Transpile the three schema modules to CommonJS in a temp dir (no build needed).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bstc-schema-test-"));
for (const name of ["schema", "constants", "event-status"]) {
  const src = fs.readFileSync(path.join(root, "src/lib", `${name}.ts`), "utf8");
  let out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  out = out.replace(/require\("\.\/([\w-]+)"\)/g, 'require("./$1.cjs")');
  fs.writeFileSync(path.join(tmp, `${name}.cjs`), out);
}
const { getEventSchema, getEventOrganizer, isIsoDateTimeWithZone } = require(path.join(tmp, "schema.cjs"));
const { SITE } = require(path.join(tmp, "constants.cjs"));

const dir = path.join(root, "content/events");
const events = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => matter(fs.readFileSync(path.join(dir, f), "utf8")).data);

// The site checks "now" on the Bali calendar; pin it so the test is stable.
const NOW = new Date("2026-11-10T08:00:00+08:00");

function schemaFor(e, now = NOW) {
  return getEventSchema(
    {
      title: e.title,
      description: e.description,
      date: e.date,
      time: e.time,
      endTime: e.endTime,
      venueAddress: e.venueAddress,
      series: e.series,
      venue: e.venue,
      url: `${SITE.url}/events/${e.slug}`,
      image: e.coverImage,
      status: e.status,
      rsvpUrl: e.rsvpUrl,
      announced: e.announced,
      organizer: getEventOrganizer(e),
    },
    now
  );
}

// Josh, 10 Nov 2026: the venue is the organiser of every event, the BSTC team is
// the moderator (schema `contributor`). An event whose venue is still TBA has no
// venue data, so it gets no organiser (never an invented one, never BSTC).
const hasVenue = (e) => !/^(tba|tbc|tbd)$/i.test(String(e.venue).split(",")[0].trim());
const isBstc = (o) => /bali start-?up (&|and) tech|bstc/i.test(o?.name ?? "") || String(o?.url ?? "").includes("balistartupandtech.com");

test("every event with venue data has an Organization organizer that is the venue, never BSTC", () => {
  assert.ok(events.length > 0);
  for (const e of events.filter(hasVenue)) {
    const s = schemaFor(e);
    assert.ok(s, `${e.slug}: no Event schema`);
    assert.equal(s["@type"], "Event");
    assert.equal(s.organizer?.["@type"], "Organization", `${e.slug}: organizer missing`);
    assert.ok(s.organizer.name, `${e.slug}: organizer.name empty`);
    assert.ok(!isBstc(s.organizer), `${e.slug}: organizer must be the venue, not BSTC`);
    const venueName = String(e.venue).split(",")[0].trim();
    const own = typeof e.organizer === "string" ? e.organizer : e.organizer?.name;
    assert.equal(s.organizer.name, own || venueName, `${e.slug}: organizer is not the venue`);
  }
});

test("events with no venue data (TBA) get no organizer, not an invented one", () => {
  for (const e of events.filter((x) => !hasVenue(x))) {
    assert.equal(schemaFor(e).organizer, undefined, `${e.slug}`);
  }
});

test("every Event has the BSTC team as contributor (Organization, name and url)", () => {
  for (const e of events) {
    const s = schemaFor(e);
    assert.equal(s.contributor?.["@type"], "Organization", `${e.slug}: contributor missing`);
    assert.equal(s.contributor.name, "Bali Startup & Tech Community");
    assert.equal(s.contributor.url, SITE.url);
    assert.equal(s.contributor.name, SITE.fullName);
  }
});

test("every event that offers an RSVP has offers.validFrom (ISO 8601 with offset, before startDate)", () => {
  let withOffers = 0;
  for (const e of events) {
    const s = schemaFor(e);
    if (!s.offers) continue;
    withOffers++;
    assert.ok(isIsoDateTimeWithZone(s.offers.validFrom), `${e.slug}: offers.validFrom missing or invalid (add frontmatter "announced")`);
    assert.ok(
      Date.parse(s.offers.validFrom) <= Date.parse(s.startDate),
      `${e.slug}: validFrom is after startDate`
    );
    assert.ok(
      Date.parse(s.offers.validFrom) <= NOW.getTime(),
      `${e.slug}: validFrom is in the future`
    );
  }
  assert.ok(withOffers >= 16, `expected the 16 open events to carry offers, got ${withOffers}`);
});

test("upcoming events with an RSVP link all have an announced date in frontmatter", () => {
  for (const e of events.filter((x) => x.status === "upcoming" && x.rsvpUrl)) {
    assert.ok(isIsoDateTimeWithZone(e.announced), `${e.slug}: frontmatter "announced" missing or invalid`);
  }
});

test("validFrom is omitted, never invented, when no valid announced date is given", () => {
  const e = events.find((x) => x.status === "upcoming");
  const s = schemaFor({ ...e, announced: undefined });
  assert.equal(s.offers.validFrom, undefined);
  const s2 = schemaFor({ ...e, announced: "2026-11-02" });
  assert.equal(s2.offers.validFrom, undefined);
});

test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
