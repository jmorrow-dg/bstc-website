// Member perks data and helpers.
//
// Open programmes in src/data/perks.json come from the Remote Builders feed,
// where those programmes are edited (scripts/refresh-perks.mjs). Each was read
// on the vendor's page on its own "checked" date, and claim_route says whether
// you apply direct or through a partner.
//
// "exclusive" and "local" entries are example listings. Ones still marked
// example are members-only deals being negotiated, so every one shows a visible
// "Example" stamp, no link and no value. Local partners are unnamed on purpose.
// An example marked unavailable is not currently available and must not be
// described as in negotiation.
//
// Community offers in src/data/member-offers.json are separate. confirmed and
// approved entries have terms we can state. activation_pending is agreed and
// not active. terms_pending has an offer in, without confirmed terms. None of
// them render a claim link. Counts below are derived from these entries.
import perksFile from "@/data/perks.json";
import memberOffersFile from "@/data/member-offers.json";

export type PerkType = "open" | "exclusive" | "local" | "member";

export type MemberStatus = "confirmed" | "approved" | "activation_pending" | "terms_pending";

export type Perk = {
  id: string;
  company: string;
  programme?: string;
  website?: string;
  type: PerkType;
  status: string;
  verified: boolean;
  category: string;
  headline?: string;
  offer: string;
  value_usd?: number;
  one_line?: string;
  eligibility?: string;
  bootstrapped_ok?: boolean;
  claim_url?: string;
  claim_route?: string;
  claim_status?: string;
  status_note?: string;
  member_status?: MemberStatus;
  agreed_on?: string;
  indonesia?: { status: string; note: string };
  notes?: string;
  featured?: boolean;
  checked?: string;
};

type PerksFile = {
  checked: string;
  note: string;
  categories: string[];
  perks: Perk[];
};

type MemberOffersFile = {
  note: string;
  perks: Perk[];
};

const DATA = perksFile as PerksFile;
const MEMBER_DATA = memberOffersFile as MemberOffersFile;

export const PERKS_CHECKED = DATA.checked;
export const PERK_CATEGORIES = DATA.categories;
export const ALL_PERKS: Perk[] = [...DATA.perks, ...MEMBER_DATA.perks];

export function isOpen(perk: Perk): boolean {
  return perk.type === "open";
}

export function isExample(perk: Perk): boolean {
  return perk.type === "exclusive" || perk.type === "local";
}

export function isMember(perk: Perk): boolean {
  return perk.type === "member";
}

export function isUnavailable(perk: Perk): boolean {
  return isExample(perk) && perk.status === "unavailable";
}

export const OPEN_PERKS = ALL_PERKS.filter(isOpen);
export const EXAMPLE_PERKS = ALL_PERKS.filter(isExample);
export const LOCAL_EXAMPLES = ALL_PERKS.filter((p) => p.type === "local");
export const MEMBER_PERKS = ALL_PERKS.filter(isMember);

export type PerkFacts = {
  open: number;
  direct: number;
  partner: number;
  examples: number;
  negotiating: number;
  negotiatingLocal: number;
  negotiatingTools: number;
  unavailable: number;
  local: number;
  confirmed: number;
  approved: number;
  withTerms: number;
  activation: number;
  terms: number;
  pending: number;
};

export function perkFacts(): PerkFacts {
  const partner = OPEN_PERKS.filter((p) => p.claim_route === "partner").length;
  const negotiating = EXAMPLE_PERKS.filter((p) => !isUnavailable(p));
  const unavailable = EXAMPLE_PERKS.filter(isUnavailable);
  const confirmed = MEMBER_PERKS.filter((p) => p.member_status === "confirmed");
  const approved = MEMBER_PERKS.filter((p) => p.member_status === "approved");
  const activation = MEMBER_PERKS.filter((p) => p.member_status === "activation_pending");
  const terms = MEMBER_PERKS.filter((p) => p.member_status === "terms_pending");
  const negotiatingLocal = negotiating.filter((p) => p.type === "local").length;
  return {
    open: OPEN_PERKS.length,
    direct: OPEN_PERKS.length - partner,
    partner,
    examples: EXAMPLE_PERKS.length,
    negotiating: negotiating.length,
    negotiatingLocal,
    negotiatingTools: negotiating.length - negotiatingLocal,
    unavailable: unavailable.length,
    local: LOCAL_EXAMPLES.length,
    confirmed: confirmed.length,
    approved: approved.length,
    withTerms: confirmed.length + approved.length,
    activation: activation.length,
    terms: terms.length,
    pending: activation.length + terms.length,
  };
}

export function perksMetaDescription(checkedLabel: string): string {
  const f = perkFacts();
  const offer = f.withTerms === 1 ? "offer has" : "offers have";
  const claim = f.withTerms === 1 ? "is" : "are";
  const dated = `${f.open} open founder perks, checked on each vendor's page by ${checkedLabel}.`;
  const terms = `${f.withTerms} ${offer} agreed terms and ${claim} not claimable on this page yet.`;
  const full = `${dated} ${terms}`;
  // Search titles stay at 155 characters or fewer. The page still lists the
  // activation, terms and example counts in the body.
  if (full.length <= 155) return full;
  const shorter = `${f.open} open founder perks, checked by ${checkedLabel}. ${terms}`;
  return shorter.length <= 155 ? shorter : dated;
}

export type MemberGroup = {
  id: string;
  title: string;
  intro: string;
  perks: Perk[];
};

export function memberGroups(perks: Perk[] = MEMBER_PERKS): MemberGroup[] {
  const confirmed = perks.filter((p) => p.member_status === "confirmed").length;
  const approved = perks.filter((p) => p.member_status === "approved").length;
  const agreed = perks.filter(
    (p) => p.member_status === "confirmed" || p.member_status === "approved"
  );
  const activation = perks.filter((p) => p.member_status === "activation_pending");
  const terms = perks.filter((p) => p.member_status === "terms_pending");
  const groups: MemberGroup[] = [
    {
      id: "agreed-terms",
      title: "Agreed terms",
      intro: [
        confirmed
          ? `${confirmed} ${confirmed === 1 ? "confirmed member offer" : "confirmed member offers"}`
          : "",
        approved
          ? `${approved} ${approved === 1 ? "approved partner programme" : "approved partner programmes"}`
          : "",
      ]
        .filter(Boolean)
        .join(" and ") +
        ". The terms are stated on each card. None of these can be claimed from this page. Codes stay private, and partner or application links are not published here.",
      perks: agreed,
    },
    {
      id: "activation-pending",
      title: "Agreed, activation pending",
      intro: `${activation.length} ${activation.length === 1 ? "offer is" : "offers are"} agreed and not active yet, so ${activation.length === 1 ? "it is" : "they are"} not claimable.`,
      perks: activation,
    },
    {
      id: "terms-pending",
      title: "Offer received, terms being confirmed",
      intro: `${terms.length} ${terms.length === 1 ? "offer has" : "offers have"} been received and the terms are still being confirmed. ${terms.length === 1 ? "It is" : "They are"} not a confirmed discount and not claimable.`,
      perks: terms,
    },
  ];
  return groups.filter((group) => group.perks.length > 0);
}

export function memberStamp(status: MemberStatus): string {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "approved":
      return "Approved";
    case "activation_pending":
      return "Not active";
    case "terms_pending":
      return "Terms pending";
  }
}

export function memberDateLabel(status: MemberStatus): string {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "approved":
      return "Approved";
    case "activation_pending":
      return "Agreed";
    case "terms_pending":
      return "Offer received";
  }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function claimDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/** "2026-10-25" -> "25 Oct 2026" (Australian order, no time zone shifts). */
export function formatChecked(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!y || !m || !d) return iso;
  return `${d} ${months[m - 1]} ${y}`;
}

/** Display tidy only: a few notes shout "NEEDS"; the data stays as it is. */
export function tidy(text: string): string {
  return text.replace(/\bNEEDS\b/g, "Needs");
}

// Within a category: open programmes first, then examples; featured first
// inside each kind; otherwise data order. Member offers are not in this list.
function rank(perk: Perk): number {
  return (isOpen(perk) ? 0 : 2) + (perk.featured ? 0 : 1);
}

export type PerkGroup = {
  category: string;
  slug: string;
  perks: Perk[];
  open: number;
  examples: number;
  unavailable: number;
};

export function groupPerks(perks: Perk[] = ALL_PERKS): PerkGroup[] {
  return PERK_CATEGORIES.map((category) => {
    const inCat = perks
      .map((perk, index) => ({ perk, index }))
      .filter(({ perk }) => perk.category === category && (isOpen(perk) || isExample(perk)))
      .sort((a, b) => rank(a.perk) - rank(b.perk) || a.index - b.index)
      .map(({ perk }) => perk);
    const open = inCat.filter(isOpen).length;
    const unavailable = inCat.filter(isUnavailable).length;
    const examples = inCat.filter((p) => isExample(p) && !isUnavailable(p)).length;
    return {
      category,
      slug: slugify(category),
      perks: inCat,
      open,
      examples,
      unavailable,
    };
  }).filter((group) => group.perks.length > 0);
}

export function catalogueCount(group: Pick<PerkGroup, "open" | "examples" | "unavailable">): string {
  const bits: string[] = [];
  if (group.open) bits.push(`${group.open} ${group.open === 1 ? "programme" : "programmes"}`);
  if (group.examples) bits.push(`${group.examples} ${group.examples === 1 ? "example" : "examples"}`);
  if (group.unavailable) bits.push(`${group.unavailable} not available`);
  return bits.join(", ");
}

export function memberCount(perks: Perk[]): string {
  return `${perks.length} ${perks.length === 1 ? "member offer" : "member offers"}`;
}

/** The minimal index the client-side finder needs. */
export type PerkKind = "open" | "member" | "example";

export type PerkIndexEntry = {
  id: string;
  kind: PerkKind;
  category: string;
  bootstrappedOk: boolean | null;
  unavailable: boolean;
  hay: string;
};

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function perkKind(perk: Perk): PerkKind {
  if (isOpen(perk)) return "open";
  if (isMember(perk)) return "member";
  return "example";
}

export function perkIndex(perks: Perk[] = ALL_PERKS): PerkIndexEntry[] {
  return perks.map((p) => ({
    id: p.id,
    kind: perkKind(p),
    category: p.category,
    bootstrappedOk: typeof p.bootstrapped_ok === "boolean" ? p.bootstrapped_ok : null,
    unavailable: isUnavailable(p),
    hay: normalise(
      [
        p.company,
        p.programme,
        p.headline,
        p.offer,
        p.one_line,
        p.eligibility,
        p.claim_status,
        p.status_note,
        p.notes,
        p.category,
      ]
        .filter(Boolean)
        .join(" ")
    ),
  }));
}

export function pickPerks(ids: string[]): Perk[] {
  return ids
    .map((id) => ALL_PERKS.find((p) => p.id === id))
    .filter((p): p is Perk => Boolean(p));
}
