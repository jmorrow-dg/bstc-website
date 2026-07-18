/**
 * Generates a Google My Maps import CSV from the /welcome guide data.
 *
 *   node scripts/generate-welcome-map.cjs   (or: npm run map:csv)
 *
 * Output: scripts/welcome-map.csv
 *
 * Import into Google My Maps (mymaps.google.com):
 *   1. Create map > Import > upload scripts/welcome-map.csv
 *   2. Position pins by: "Location"   |   Title by: "Name"
 *   3. Style > "Group places by" > Category, then pick a colour per layer
 *
 * welcome-guide.ts has no imports and the CATEGORIES value is a plain literal,
 * so we read the file, slice out the array literal, and evaluate it. No deps,
 * no TS runner needed. Placeholder slots (placeholder: true) are skipped.
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src", "data", "welcome-guide.ts");
const OUT = path.join(__dirname, "welcome-map.csv");

const text = fs.readFileSync(SRC, "utf8");
const start = text.indexOf("CATEGORIES: GuideCategory[] =");
if (start === -1) throw new Error("Could not find CATEGORIES in welcome-guide.ts");
const open = text.indexOf("[", start);
const close = text.indexOf("\n];", open);
if (open === -1 || close === -1) throw new Error("Could not slice CATEGORIES literal");
const literal = text.slice(open, close + 2); // include the closing ]

// The literal is plain JS (object literals, arrays, strings, comments). Safe to
// evaluate here because the source is our own committed data file.
const CATEGORIES = new Function("return " + literal)();

function csv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function perkText(perk) {
  if (!perk) return "";
  return perk.status === "live" ? perk.label : `${perk.label} (to verify)`;
}

const rows = [["Name", "Location", "Category", "Area", "Perk", "Description"]];
let count = 0;

for (const cat of CATEGORIES) {
  for (const v of cat.venues) {
    if (v.placeholder) continue; // skip slots still to fill
    const perk = perkText(v.perk);
    const desc = [v.blurb, `Best for: ${v.bestFor}`];
    if (v.price) desc.push(`Price: ${v.price}`);
    if (perk) desc.push(`BSTC perk: ${perk}`);
    rows.push([
      v.name,
      `${v.name}, ${v.area}, Bali`,
      cat.name,
      v.area,
      perk,
      desc.join(" | "),
    ]);
    count++;
  }
}

const out = rows.map((r) => r.map(csv).join(",")).join("\n") + "\n";
fs.writeFileSync(OUT, out);
console.log(`Wrote ${count} venues across ${CATEGORIES.length} categories to ${path.relative(process.cwd(), OUT)}`);
