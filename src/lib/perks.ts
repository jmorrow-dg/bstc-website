// Member perks data and helpers.
//
// src/data/perks.json is a copy of the Remote Builders perks file
// (content/perks.json, 25 Oct 2026), where perks are edited. Its own note:
// open programmes were read on each vendor's page on 25 Oct 2026 and anyone
// eligible can apply via claim_url; "exclusive" and "local" entries are
// EXAMPLES of members-only deals still being negotiated, so every one shows a
// visible "Example" stamp, no link and no value. Local partners are unnamed on
// purpose.
import perksFile from "@/data/perks.json";

export type PerkType = "open" | "exclusive" | "local";

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

const DATA = perksFile as PerksFile;

export const PERKS_CHECKED = DATA.checked;
export const PERK_CATEGORIES = DATA.categories;
export const ALL_PERKS = DATA.perks;

export function isOpen(perk: Perk): boolean {
  return perk.type === "open";
}

export const OPEN_PERKS = ALL_PERKS.filter(isOpen);
export const EXAMPLE_PERKS = ALL_PERKS.filter((p) => !isOpen(p));
export const LOCAL_EXAMPLES = ALL_PERKS.filter((p) => p.type === "local");

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
// inside each kind; otherwise data order.
function rank(perk: Perk): number {
  return (isOpen(perk) ? 0 : 2) + (perk.featured ? 0 : 1);
}

export type PerkGroup = {
  category: string;
  slug: string;
  perks: Perk[];
  open: number;
  examples: number;
};

export function groupPerks(perks: Perk[] = ALL_PERKS): PerkGroup[] {
  return PERK_CATEGORIES.map((category) => {
    const inCat = perks
      .map((perk, index) => ({ perk, index }))
      .filter(({ perk }) => perk.category === category)
      .sort((a, b) => rank(a.perk) - rank(b.perk) || a.index - b.index)
      .map(({ perk }) => perk);
    const open = inCat.filter(isOpen).length;
    return {
      category,
      slug: slugify(category),
      perks: inCat,
      open,
      examples: inCat.length - open,
    };
  }).filter((group) => group.perks.length > 0);
}

/** The minimal index the client-side finder needs. */
export type PerkIndexEntry = {
  id: string;
  kind: "open" | "example";
  category: string;
  bootstrappedOk: boolean | null;
  hay: string;
};

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function perkIndex(perks: Perk[] = ALL_PERKS): PerkIndexEntry[] {
  return perks.map((p) => ({
    id: p.id,
    kind: isOpen(p) ? "open" : "example",
    category: p.category,
    bootstrappedOk: typeof p.bootstrapped_ok === "boolean" ? p.bootstrapped_ok : null,
    hay: normalise(
      [p.company, p.programme, p.headline, p.offer, p.one_line, p.category]
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
