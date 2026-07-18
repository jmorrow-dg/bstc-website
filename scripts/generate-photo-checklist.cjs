// Regenerates scripts/photo-checklist.md from the welcome-guide data so the
// list of photos we need can never drift from the venues actually on /welcome.
// Run: node scripts/generate-photo-checklist.cjs
//
// Filenames here MUST match photoSlug() in src/data/welcome-guide.ts, which is
// what the /welcome card uses to auto-resolve each venue's photo.

const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../src/data/welcome-guide.ts");
const outPath = path.join(__dirname, "photo-checklist.md");
const src = fs.readFileSync(dataPath, "utf8");

// Keep in sync with photoSlug() in src/data/welcome-guide.ts.
function photoSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pull out the CATEGORIES array literal (pure literals, no refs) and eval it.
const marker = "export const CATEGORIES";
const eq = src.indexOf("=", src.indexOf(marker));
const open = src.indexOf("[", eq);
let depth = 0;
let end = -1;
for (let i = open; i < src.length; i++) {
  if (src[i] === "[") depth++;
  else if (src[i] === "]" && --depth === 0) {
    end = i;
    break;
  }
}
const CATEGORIES = eval(src.slice(open, end + 1));

// Venues we don't photograph: placeholder slots and the BSTC-arranged stay.
const skip = (v) => v.placeholder === true || v.name === "Founder House";

const total = CATEGORIES.reduce(
  (sum, c) => sum + c.venues.filter((v) => !skip(v)).length,
  0
);

const lines = [
  `# Welcome guide photo checklist (${total} venues)`,
  "",
  "One landscape photo each (~1600x900, jpg/webp, the place not the logo). " +
    "Name the file as shown and drop it in public/images/welcome/ - the " +
    "/welcome card picks it up automatically on the next build. No code change " +
    "needed.",
  "",
];

let n = 0;
for (const c of CATEGORIES) {
  const venues = c.venues.filter((v) => !skip(v));
  lines.push(`## ${c.name} (${venues.length})`, "");
  for (const v of venues) {
    n++;
    lines.push(
      `${n}. [ ] ${v.name} - ${v.area}  (\`/images/welcome/${photoSlug(
        v.name
      )}.jpg\`)`
    );
  }
  lines.push("");
}

fs.writeFileSync(outPath, lines.join("\n").trimEnd() + "\n");
console.log(`Wrote ${outPath} (${total} venues)`);
