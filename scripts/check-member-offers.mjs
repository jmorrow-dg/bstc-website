// Checks community-offer classification against src/data. Does not refresh
// the open-programme feed and does not write files.
import { readFileSync } from "node:fs";

const perks = JSON.parse(readFileSync(new URL("../src/data/perks.json", import.meta.url), "utf8"));
const members = JSON.parse(
  readFileSync(new URL("../src/data/member-offers.json", import.meta.url), "utf8")
);
const llms = readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8");
const page = readFileSync(new URL("../src/app/perks/page.tsx", import.meta.url), "utf8");
const home = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const refresh = readFileSync(new URL("./refresh-perks.mjs", import.meta.url), "utf8");

const errors = [];
const fail = (message) => errors.push(message);

const expected = {
  confirmed: ["circleback", "zendesk-partner", "riverside", "apollo-community", "carta-referral"],
  approved: ["beehiiv"],
  activation_pending: ["apify"],
  terms_pending: ["clevertap"],
};

const byStatus = Object.fromEntries(Object.keys(expected).map((status) => [status, []]));
for (const perk of members.perks) {
  if (!byStatus[perk.member_status]) fail(`${perk.id} has unexpected member_status ${perk.member_status}`);
  else byStatus[perk.member_status].push(perk.id);
  if (perk.type !== "member") fail(`${perk.id} is not type member`);
  if (perk.claim_url) fail(`${perk.id} publishes a claim URL`);
  if (perk.code || perk.member_code) fail(`${perk.id} publishes a code field`);
  const blob = JSON.stringify(perk);
  if (/[—–]/.test(blob)) fail(`${perk.id} contains an em or en dash`);
  if (/partner_account|zendesk\.com\/lp|dub\.co|dashboard/i.test(blob)) {
    fail(`${perk.id} publishes a private or partner application URL`);
  }
  if (/@/.test(blob)) fail(`${perk.id} contains an email address`);
  if (/\bJosh\b|D&G|davidandgoliath/i.test(blob)) fail(`${perk.id} contains member or agency data`);
}
for (const [status, ids] of Object.entries(expected)) {
  const got = byStatus[status] || [];
  if (got.join() !== ids.join()) fail(`${status}: expected ${ids.join(", ")} but got ${got.join(", ")}`);
}

const text = (id) => JSON.stringify(members.perks.find((p) => p.id === id));
const circle = text("circleback");
if (/Remote Builders/.test(circle)) fail("Circleback must not claim Remote Builders coverage");
if (!/first six months/.test(circle)) fail("Circleback must say first six months");
if (!/first-time/.test(circle)) fail("Circleback must be limited to first-time customers");
if (!/No funding required/.test(circle)) fail("Circleback must say no funding is required");
if (!/not open/.test(circle)) fail("Circleback claiming must stay closed");

const zendesk = text("zendesk-partner");
if (!/up to \$25k/.test(zendesk)) fail("Zendesk must say up to $25k");
if (/US\$/.test(zendesk)) fail("Zendesk must not assert US dollars");
if (!/Remote Builders and BSTC/.test(zendesk)) fail("Zendesk must name Remote Builders and BSTC");
if (!/not open on this page/.test(zendesk)) fail("Zendesk link must stay unpublished");
if (!/five help centres/.test(zendesk)) fail("Zendesk must keep the help centre term");

const riverside = text("riverside");
if (!/riverside\.com/.test(riverside) || /riverside\.fm/.test(riverside)) {
  fail("Riverside must use riverside.com and not riverside.fm");
}
if (!/first payment/.test(riverside)) fail("Riverside must be the first payment only");
if (!/Business plan is not included/.test(riverside)) fail("Riverside must exclude the Business plan");
if (!/Remote Builders coverage is not confirmed/.test(riverside)) {
  fail("Riverside must say Remote Builders coverage is not confirmed");
}
if (!/not published here/.test(riverside)) fail("Riverside claim route must stay pending");

const apollo = text("apollo-community");
if (!/annual plans/.test(apollo)) fail("Apollo must be limited to annual plans");
if (!/up to 5 seats/.test(apollo)) fail("Apollo must keep the 5 seat cap");
if (!/20 or fewer employees/.test(apollo)) fail("Apollo eligibility must stay at 20 or fewer employees");
if (!/including Remote Builders/.test(apollo)) fail("Apollo must record Remote Builders coverage");
if (!/not published here/.test(apollo)) fail("Apollo application link must stay unpublished");

const carta = text("carta-referral");
if (!/Referral introduction required before signing/.test(carta)) {
  fail("Carta must require the introduction before signing");
}
if (!/not apply retroactively/.test(carta)) fail("Carta must say the offer is not retroactive");
if (!/under \$1 million/.test(carta) || !/25 or fewer stakeholders/.test(carta)) {
  fail("Carta Launch threshold is missing");
}
if (!/Remote Builders coverage was confirmed/.test(carta)) fail("Carta must record Remote Builders coverage");

const beehiiv = text("beehiiv");
if (!/20% off their first 3 months/.test(beehiiv)) fail("beehiiv benefit is missing");
if (/trial|commission|Dub/i.test(beehiiv)) fail("beehiiv copy includes an unsourced or non-member term");
if (!/not a BSTC-exclusive deal/.test(beehiiv)) fail("beehiiv must stay a standard partner programme");
if (!/Apply through the community partner link/.test(beehiiv)) fail("beehiiv must use the generic partner-link status");
if (!/not a member benefit/.test(beehiiv)) fail("beehiiv must keep the partner reward off the member benefit");

const apify = text("apify");
if (!/Extra US\$10 of usage on the Starter plan/.test(apify)) fail("Apify must be US$10 of Starter usage");
if (!/not a percentage discount/.test(apify)) fail("Apify must say it is not a percentage discount");
if (!/activation pending/.test(apify) || !/not claimable/.test(apify)) fail("Apify must stay not claimable");
if (!/end of January 2027/.test(apify) || !/150 redemptions/.test(apify)) fail("Apify limits are missing");

const clevertap = text("clevertap");
if (/50%|Remote Builders|enterprise/.test(clevertap)) fail("CleverTap terms must stay unconfirmed");
if (!/terms are still being confirmed/.test(clevertap)) fail("CleverTap must say terms are being confirmed");
if (!/not claimable/.test(clevertap)) fail("CleverTap must not look claimable");

const openai = perks.perks.find((p) => p.id === "openai");
if (!openai) fail("OpenAI example was removed");
if (openai?.status !== "unavailable") fail("OpenAI must be unavailable");
if (openai?.offer !== "2 Years Business Free") fail("OpenAI example offer was thinned");
if (!/declined on 4 Nov 2026/.test(openai?.status_note || "")) fail("OpenAI decline note is missing");
if (/negotiat/i.test(openai?.status_note || "")) fail("OpenAI note must not say we are negotiating");

const open = perks.perks.filter((p) => p.type === "open");
const examples = perks.perks.filter((p) => p.type === "exclusive" || p.type === "local");
const partner = open.filter((p) => p.claim_route === "partner").length;
if (open.length !== 145) fail(`open programmes changed: ${open.length}`);
if (examples.length !== 62) fail(`example listings changed: ${examples.length}`);
if (partner !== 18) fail(`partner routes changed: ${partner}`);
for (const [id, headline] of [
  ["zendesk", "6 months free Zendesk Suite"],
  ["apollo", "50% off Apollo for 12 months"],
  ["carta", "Free cap table and SAFEs"],
]) {
  const row = open.find((p) => p.id === id);
  if (!row) fail(`open programme ${id} was removed`);
  else if (row.headline !== headline) fail(`open programme ${id} was thinned`);
}

const ids = [...perks.perks, ...members.perks].map((p) => p.id);
const dup = ids.filter((id, index) => ids.indexOf(id) !== index);
if (dup.length) fail(`duplicate ids: ${dup.join(", ")}`);

if (/none are agreed/i.test(perks.note + refresh + llms + page + home)) {
  fail("a public source still says none are agreed");
}
if (/None are live yet/.test(home)) fail("home still says no member deals are live");

function noun(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const [y, m, d] = perks.checked.split("-").map(Number);
const checked = `${d} ${months[m - 1]} ${y}`;
const confirmed = expected.confirmed.length;
const approved = expected.approved.length;
const withTerms = confirmed + approved;
const activation = expected.activation_pending.length;
const terms = expected.terms_pending.length;
const negotiating = examples.filter((p) => p.status !== "unavailable").length;
const unavailable = examples.filter((p) => p.status === "unavailable").length;
const sentence = [
  `${open.length} open startup programmes (each checked on the vendor's own page by ${checked}; ${open.length - partner} you apply for direct, ${partner} through a partner referral).`,
  `${noun(withTerms, "offer has", "offers have")} agreed terms (${[
    noun(confirmed, "confirmed member offer", "confirmed member offers"),
    noun(approved, "approved partner programme", "approved partner programmes"),
  ].join(" and ")}), and claiming is not open on this page.`,
  `${noun(activation, "offer is", "offers are")} agreed and waiting on activation.`,
  `${noun(terms, "offer has", "offers have")} been received, with terms still being confirmed.`,
  `${noun(negotiating, "example listing is", "example listings are")} still being negotiated, each labelled Example, and ${noun(unavailable, "example is", "examples are")} not currently available.`,
].join(" ");
if (!llms.includes(sentence)) fail(`llms.txt is missing the derived perks sentence:\n${sentence}`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(sentence);
console.log("member offer checks passed");
