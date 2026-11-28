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
const homeData = readFileSync(new URL("../src/data/home.ts", import.meta.url), "utf8");
const lib = readFileSync(new URL("../src/lib/perks.ts", import.meta.url), "utf8");

const errors = [];
const fail = (message) => errors.push(message);

const expected = {
  available_now: ["zendesk-partner", "apollo-community", "circleback", "carta-referral", "beehiiv"],
  coming_soon: ["riverside", "jepto"],
  in_discussion: [
    "clevertap",
    "close-crm",
    "granola",
    "slack-community",
    "fraudblocker",
    "airwallex-community",
    "algolia-community",
  ],
};

const byStatus = Object.fromEntries(Object.keys(expected).map((status) => [status, []]));
for (const perk of members.perks) {
  if (!byStatus[perk.member_status]) fail(`${perk.id} has unexpected member_status ${perk.member_status}`);
  else byStatus[perk.member_status].push(perk.id);
  if (perk.status !== perk.member_status) fail(`${perk.id} status and member_status differ`);
  if (perk.type !== "member") fail(`${perk.id} is not type member`);
  if (perk.claim_url) fail(`${perk.id} publishes a claim URL`);
  if (perk.code || perk.member_code) fail(`${perk.id} publishes a code field`);
  if (perk.verified !== (perk.member_status !== "in_discussion")) {
    fail(`${perk.id}: verified must be true only for available_now and coming_soon`);
  }
  const blob = JSON.stringify(perk);
  if (/[—–]/.test(blob)) fail(`${perk.id} contains an em or en dash`);
  if (/partner_account|zendesk\.com\/lp|dub\.co|dashboard/i.test(blob)) {
    fail(`${perk.id} publishes a private or partner application URL`);
  }
  if (/@/.test(blob)) fail(`${perk.id} contains an email address`);
  if (/\bJosh\b|D&G|davidandgoliath/i.test(blob)) fail(`${perk.id} contains member or agency data`);
  if (/sign in first/i.test(blob)) fail(`${perk.id} implies a member login exists`);
  if (/US\$|A\$/.test(blob)) fail(`${perk.id} asserts a currency the offer does not name`);
  if (perk.member_status !== "in_discussion" && !/not open/i.test(perk.claim_status || "")) {
    fail(`${perk.id}: claiming must stay closed on this page`);
  }
  if (perk.member_status === "in_discussion") {
    const copy = [perk.headline, perk.offer, perk.eligibility, perk.claim_status, perk.notes].join(" ");
    if (/\d+\s*%|\$\s*\d|\d+\s*(seats?|months?|years?)\b|\b(one|two|three|six|twelve)\s+(months?|years?)\b|\byear free\b/i.test(copy)) {
      fail(`${perk.id} is in discussion and must not state a figure`);
    }
    if (/\b(Confirmed|Agreed)\b/.test(perk.headline || "")) fail(`${perk.id} headline overstates the status`);
  }
}
for (const [status, ids] of Object.entries(expected)) {
  const got = byStatus[status] || [];
  if (got.join() !== ids.join()) fail(`${status}: expected ${ids.join(", ")} but got ${got.join(", ")}`);
}

const text = (id) => JSON.stringify(members.perks.find((p) => p.id === id) || {});
const circle = text("circleback");
if (/Remote Builders/.test(circle)) fail("Circleback must not claim Remote Builders coverage");
if (!/first six months/.test(circle)) fail("Circleback must say first six months");
if (!/first-time/.test(circle)) fail("Circleback must be limited to first-time customers");
if (!/No funding required/.test(circle)) fail("Circleback must say no funding is required");
if (!/BSTC members only/.test(circle)) fail("Circleback must be BSTC members only");

const zendesk = text("zendesk-partner");
if (!/up to \$25k/.test(zendesk)) fail("Zendesk must say up to $25k");
if (!/Remote Builders and BSTC/.test(zendesk)) fail("Zendesk must name Remote Builders and BSTC");
if (!/Series B or earlier/.test(zendesk)) fail("Zendesk must say Series B or earlier");
if (!/fewer than 250 employees/.test(zendesk)) fail("Zendesk must keep the 250 employee cap");
if (!/unique partner link is not published here/.test(zendesk)) fail("Zendesk link must stay unpublished");
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
if (!/BSTC members only/.test(riverside)) fail("Riverside must be BSTC members only");
if (!/not published here/.test(riverside)) fail("Riverside partner link and code must stay unpublished");

const jepto = text("jepto");
if (!/six months free/i.test(jepto)) fail("Jepto must say six months free");
if (/Remote Builders/.test(jepto)) fail("Jepto must not claim Remote Builders coverage");
if (/agreed_on/.test(jepto)) fail("Jepto has no firm agreement date in the records");

const apollo = text("apollo-community");
if (!/annual plan/.test(apollo)) fail("Apollo must be limited to annual plans");
if (!/up to 5 seats/.test(apollo)) fail("Apollo must keep the 5 seat cap");
if (!/20 or fewer employees/.test(apollo)) fail("Apollo eligibility must stay at 20 or fewer employees");
if (!/Covers Remote Builders and BSTC/.test(apollo)) fail("Apollo must record Remote Builders coverage");
if (!/unique partner link is not published here/.test(apollo)) fail("Apollo link must stay unpublished");

const carta = text("carta-referral");
if (!/before you sign/.test(carta)) fail("Carta must require the introduction before signing");
if (!/not retroactive/.test(carta) || !/not backdated/.test(carta)) fail("Carta must say the offer is not retroactive");
if (!/Request an intro/.test(carta)) fail("Carta must route through a community intro request");
if (/pending/i.test(carta)) fail("Carta must not describe the agreed route as pending");
if (!/under 25 stakeholders/.test(carta)) fail("Carta referral notes must give the Launch cutoff as under 25 stakeholders");

const beehiiv = text("beehiiv");
if (!/20% off their first 3 months/.test(beehiiv)) fail("beehiiv benefit is missing");
if (/trial|commission|Dub|Remote Builders/i.test(beehiiv)) fail("beehiiv copy includes an unsourced or non-member term");
if (!/not a BSTC-exclusive deal/.test(beehiiv)) fail("beehiiv must stay a standard partner programme");
if (!/not a member benefit/.test(beehiiv)) fail("beehiiv must keep the partner reward off the member benefit");

const clevertap = text("clevertap");
if (/50%|Remote Builders|enterprise|Series B/i.test(clevertap) || /\bConfirmed\b/.test(clevertap)) {
  fail("CleverTap terms must stay unconfirmed");
}
if (!/Leap\+/.test(clevertap)) fail("CleverTap must name the Leap+ programme");
for (const [id, banned] of [
  ["close-crm", /35%|Annual Plans|negotiating/i],
  ["granola", /1 year free|Business|seats?\b/i],
  ["slack-community", /50% off|3 months/i],
  ["airwallex-community", /AUD|3 months|fee-free/i],
  ["algolia-community", /credits|\$10,000/i],
  ["fraudblocker", /\d+\s*%/],
]) {
  if (banned.test(text(id))) fail(`${id} carries an unagreed figure or public-programme term`);
}
if (!/onboarding call/.test(text("fraudblocker"))) fail("FraudBlocker must keep the onboarding call as under discussion");

// Apify is a Remote Builders offer only until BSTC cover is confirmed.
if (/apify/i.test(JSON.stringify(members) + llms + page + home)) fail("Apify must not be listed on BSTC");

const openai = perks.perks.find((p) => p.id === "openai");
if (!openai) fail("OpenAI example was removed");
if (openai?.status !== "unavailable") fail("OpenAI must be unavailable");
if (openai?.offer !== "2 Years Business Free") fail("OpenAI example offer was thinned");
if (!/declined on 4 Nov 2026/.test(openai?.status_note || "")) fail("OpenAI decline note is missing");
if (/negotiat/i.test(openai?.status_note || "")) fail("OpenAI note must not say we are negotiating");

const open = perks.perks.filter((p) => p.type === "open");
const examples = perks.perks.filter((p) => p.type === "exclusive" || p.type === "local");
const partner = open.filter((p) => p.claim_route === "partner").length;
if (open.length !== 146) fail(`open programmes changed: ${open.length}`);
if (examples.length !== 60) fail(`example listings changed: ${examples.length}`);
if (partner !== 18) fail(`partner routes changed: ${partner}`);
for (const [id, headline] of [
  ["zendesk", "6 months free Zendesk Suite"],
  ["apollo", "50% off Apollo for 12 months"],
  ["carta", "Free cap table and SAFEs"],
  ["slack", "50% off Slack for 3 months"],
  ["airwallex", "3 months free + fee-free FX"],
  ["algolia", "$10,000 Algolia credits"],
  ["fibery", "Six months of Fibery Pro free"],
  ["amplitude", "One year of Amplitude Growth free, then 40% off annual Plus"],
]) {
  const row = open.find((p) => p.id === id);
  if (!row) fail(`open programme ${id} was removed`);
  else if (row.headline !== headline) fail(`open programme ${id} was thinned`);
}
for (const id of ["close-crm", "granola"]) {
  if (examples.some((p) => p.id === id)) fail(`${id} must not be an example listing`);
}
const cartaLaunch = JSON.stringify(open.find((p) => p.id === "carta") || {});
if (!/under 25 stakeholders/.test(cartaLaunch) || /25 (stakeholders )?or fewer/.test(cartaLaunch)) {
  fail("Carta Launch must say under 25 stakeholders");
}
const amplitude = JSON.stringify(open.find((p) => p.id === "amplitude") || {});
if (!/annual Plus plan in year 2/.test(amplitude)) fail("Amplitude year 2 must name the annual Plus plan");
if (!/fewer than 20 employees and less than \$10 million raised/.test(amplitude)) {
  fail("Amplitude must keep its official caps");
}
if (/no funding needed/i.test(amplitude)) fail("Amplitude must not carry the no funding needed stamp");
const fibery = open.find((p) => p.id === "fibery");
if (fibery?.claim_url !== "https://fibery.com/startup-program") fail("Fibery must link its startup programme page");
if (!/fewer than 42 employees/.test(JSON.stringify(fibery || {}))) fail("Fibery must keep the 42 employee cap");
if (typeof fibery?.value_usd === "number") fail("Fibery must not state a USD value");
if (!/PRESERVE/.test(refresh) || !/KEEP_IF_MISSING = \["fibery"\]/.test(refresh)) {
  fail("refresh-perks.mjs must preserve Fibery, Carta Launch and Amplitude wording");
}
if (/"granola"/.test(homeData)) fail("Granola must not be on the home teaser");

const ids = [...perks.perks, ...members.perks].map((p) => p.id);
const dup = ids.filter((id, index) => ids.indexOf(id) !== index);
if (dup.length) fail(`duplicate ids: ${dup.join(", ")}`);

if (/none are agreed/i.test(perks.note + refresh + llms + page + home)) {
  fail("a public source still says none are agreed");
}
if (/None are live yet/.test(home)) fail("home still says no member deals are live");
if (/Agreed terms|activation pending|terms being confirmed|Terms pending|Not active/.test(page + home + lib)) {
  fail("an old member status label is still in the UI");
}

function noun(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const [y, m, d] = perks.checked.split("-").map(Number);
const checked = `${d} ${months[m - 1]} ${y}`;
const negotiating = examples.filter((p) => p.status !== "unavailable").length;
const unavailable = examples.filter((p) => p.status === "unavailable").length;
const sentence = [
  `${open.length} open startup programmes (each checked on the vendor's own page by ${checked}; ${open.length - partner} you apply for direct, ${partner} through a partner referral).`,
  `Community offers: ${expected.available_now.length} available now, ${expected.coming_soon.length} coming soon and ${expected.in_discussion.length} in discussion, and claiming is not open on this page.`,
  `${noun(negotiating, "example listing is", "example listings are")} still being negotiated, each labelled Example, and ${noun(unavailable, "example is", "examples are")} not currently available.`,
].join(" ");
if (!llms.includes(sentence)) fail(`llms.txt is missing the derived perks sentence:\n${sentence}`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(sentence);
console.log("member offer checks passed");
