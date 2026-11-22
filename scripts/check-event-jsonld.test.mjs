// The built-HTML check must fail when an Event organiser has no url.
//   node --test scripts/check-event-jsonld.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { isHttpUrl, organizerProblems } from "./check-event-jsonld.mjs";

const script = fileURLToPath(new URL("./check-event-jsonld.mjs", import.meta.url));

const contributor = {
  "@type": "Organization",
  name: "Bali Startup & Tech Community",
  url: "https://www.balistartupandtech.com",
};

function eventNode(organizer) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Drinks and Dinner",
    startDate: "2026-11-19T18:30:00+08:00",
    location: { "@type": "Place", name: "Yema Kitchen" },
    contributor,
    ...(organizer ? { organizer } : {}),
  };
}

function page(nodes) {
  const blocks = [].concat(nodes).map((node) => `<script type="application/ld+json">${JSON.stringify(node)}</script>`).join("\n");
  return `<!doctype html><html><head>${blocks}</head><body></body></html>`;
}

function runDir(files) {
  const dir = mkdtempSync(join(tmpdir(), "bstc-jsonld-"));
  try {
    for (const [rel, html] of Object.entries(files)) {
      const file = join(dir, rel);
      mkdirSync(join(file, ".."), { recursive: true });
      writeFileSync(file, html);
    }
    const result = spawnSync(process.execPath, [script, "--dir", dir], { encoding: "utf8" });
    return result;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("an http(s) url is required, and anything else is rejected", () => {
  assert.equal(isHttpUrl("https://yemabali.com/"), true);
  assert.equal(isHttpUrl("http://yemabali.com/"), true);
  assert.equal(isHttpUrl(""), false);
  assert.equal(isHttpUrl("/events"), false);
  assert.equal(isHttpUrl("javascript:alert(1)"), false);
});

test("organizerProblems fails a venue organiser with no url", () => {
  const missing = organizerProblems(eventNode({ "@type": "Organization", name: "Yema Kitchen" }), { requireName: true });
  assert.ok(missing.includes("organizer.url missing or not an http(s) URL"));
  const present = organizerProblems(
    eventNode({ "@type": "Organization", name: "Yema Kitchen", url: "https://yemabali.com/" }),
    { requireName: true },
  );
  assert.deepEqual(present, []);
});

test("a TBA event with no organiser is allowed, and the community url is still rejected", () => {
  const tba = {
    "@type": "Event",
    location: { "@type": "Place", name: "TBA, Canggu" },
  };
  assert.deepEqual(organizerProblems(tba, { requireName: true }), []);
  const bstc = organizerProblems(
    eventNode({ "@type": "Organization", name: "Yema Kitchen", url: "https://www.balistartupandtech.com" }),
    { requireName: true },
  );
  assert.ok(bstc.includes("organizer is BSTC (must be the venue)"));
});

test("the script fails the list page, a series page, and a detail page when organizer.url is missing", () => {
  const bad = page(eventNode({ "@type": "Organization", name: "Yema Kitchen" }));
  const good = page(eventNode({ "@type": "Organization", name: "Yema Kitchen", url: "https://yemabali.com/" }));
  const list = page({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [{ "@type": "ListItem", item: eventNode({ "@type": "Organization", name: "Yema Kitchen" }) }],
  });
  const series = page({
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "How I AI",
    organizer: { "@type": "Organization", name: "Seoul Soul Project" },
    location: { "@type": "Place", name: "Seoul Soul Project" },
  });

  const detail = runDir({ "events/yema.html": bad });
  assert.notEqual(detail.status, 0);
  assert.match(detail.stdout, /organizer\.url missing/);

  const listing = runDir({ "events/yema.html": good, "events.html": list });
  assert.notEqual(listing.status, 0);
  assert.match(listing.stdout, /FAIL events:/);

  const seriesPage = runDir({ "events/yema.html": good, "how-i-build-with-ai.html": series });
  assert.notEqual(seriesPage.status, 0);
  assert.match(seriesPage.stdout, /FAIL how-i-build-with-ai:/);

  const ok = runDir({
    "events/yema.html": good,
    "events.html": page({ "@context": "https://schema.org", "@type": "FAQPage" }),
    "drinks-and-dinner.html": page({ "@context": "https://schema.org", "@type": "FAQPage" }),
    "how-i-build-with-ai.html": page({
      "@context": "https://schema.org",
      "@type": "EventSeries",
      name: "How I AI",
      organizer: { "@type": "Organization", name: "Seoul Soul Project", url: "https://seoulsoulproject.com/" },
      location: { "@type": "Place", name: "Seoul Soul Project" },
    }),
  });
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
});
