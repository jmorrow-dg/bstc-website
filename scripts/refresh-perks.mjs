// Refreshes open programmes in src/data/perks.json from the Remote Builders
// feed. Example listings already in this file are kept, including any marked
// unavailable. Community offers live in src/data/member-offers.json and this
// script does not read or write that file.
// Run: node scripts/refresh-perks.mjs, then update the perks line in public/llms.txt
// so it matches the counts from both files. Do not describe agreed offers as
// claimable while their claim route is still pending.
import { readFileSync, writeFileSync } from "node:fs";

const FEED = "https://remotebuilders.io/perks/perks.json";
const FILE = new URL("../src/data/perks.json", import.meta.url);

const res = await fetch(FEED);
if (!res.ok) throw new Error(`${FEED} answered ${res.status}`);
const feed = await res.json();
const current = JSON.parse(readFileSync(FILE, "utf8"));

const open = feed.perks
  .filter((p) => p.type === "open" && p.status === "live")
  .map(({ added, page, ...p }) => ({
    ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== null)),
    verified: true,
  }));
if (!open.length) throw new Error("The feed has no open programmes, so nothing was written");
const examples = current.perks.filter((p) => p.type !== "open");

// A category missing from this list would hide its perks while the count still
// included them, so new ones go in ahead of the Bali categories.
const categories = [...current.categories];
for (const { category } of open) {
  if (!categories.includes(category)) {
    categories.splice(categories.findIndex((c) => c.startsWith("Bali:")), 0, category);
  }
}

writeFileSync(
  FILE,
  JSON.stringify(
    {
      checked: open.map((p) => p.checked).sort().at(-1),
      note: `Open programmes come from ${FEED} (scripts/refresh-perks.mjs), each read on the vendor's own page on its 'checked' date. Community offers with agreed or in-progress terms live in src/data/member-offers.json and are kept off this file so a refresh cannot drop them. 'exclusive' and 'local' entries are example listings. Entries still marked example are members-only deals BSTC is negotiating: every one shown must carry a visible 'Example' label, no claim links, no values. Entries marked unavailable are not currently available and must not be described as in negotiation. Local partners are unnamed on purpose.`,
      categories,
      perks: [...open, ...examples],
    },
    null,
    1
  ) + "\n"
);
const partner = open.filter((p) => p.claim_route === "partner").length;
console.log(`${open.length} open (${open.length - partner} direct, ${partner} partner), ${examples.length} examples`);
