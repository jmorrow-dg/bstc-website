// Bali members from the Remote Builders member directory feed. Profiles live on
// remotebuilders.io; this site only lists the Bali ones and links to each
// profile there, so the two sites never carry the same profile page.
//
// Feed shape (Directory stream, 27 Oct 2026):
// { source, count, profiles: [{ slug, name, business, one_liner, city,
//   industry, photo_url, profile_url, joined }] }

export const RB_DIRECTORY_FEED = "https://remotebuilders.io/directory/profiles.json";
export const RB_DIRECTORY_URL = "https://remotebuilders.io/directory/";

// Below this many Bali members the page stays noindex, so search engines never
// see a thin list.
export const MIN_INDEXABLE_MEMBERS = 6;

export type BaliMember = {
  slug: string;
  /** The member's name when they chose to show it, else their business. */
  displayName: string;
  business: string;
  oneLiner: string;
  city: string;
  industry: string;
  photoUrl: string | null;
  profileUrl: string;
  /** "YYYY-MM" */
  joined: string;
};

const BALI_PLACES = [
  "bali", "canggu", "ubud", "uluwatu", "seminyak", "sanur", "denpasar",
  "pererenan", "berawa", "kerobokan", "umalas", "kuta", "legian", "jimbaran",
  "nusa dua", "bukit", "bingin", "padang padang", "tabanan", "amed", "lovina",
  "sidemen", "nusa penida", "nusa lembongan", "keramas", "medewi",
];

export function isBaliCity(city: unknown): boolean {
  if (typeof city !== "string") return false;
  const c = city.toLowerCase();
  return BALI_PLACES.some((place) => c.includes(place));
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const https = (v: unknown) => {
  const s = str(v);
  return /^https:\/\/[^\s"'<>]+$/.test(s) ? s : "";
};

export function toBaliMembers(feed: unknown): BaliMember[] {
  const profiles = (feed as { profiles?: unknown })?.profiles;
  if (!Array.isArray(profiles)) return [];
  const members: BaliMember[] = [];
  for (const p of profiles as Record<string, unknown>[]) {
    const profileUrl = https(p?.profile_url);
    const business = str(p?.business);
    const displayName = str(p?.name) || business;
    // Every card links to its canonical profile on remotebuilders.io.
    if (!profileUrl.startsWith("https://remotebuilders.io/") || !displayName) continue;
    if (!isBaliCity(p?.city)) continue;
    members.push({
      slug: str(p.slug),
      displayName,
      business,
      oneLiner: str(p.one_liner).slice(0, 140),
      city: str(p.city),
      industry: str(p.industry),
      photoUrl: https(p.photo_url) || null,
      profileUrl,
      joined: /^\d{4}-\d{2}$/.test(str(p.joined)) ? str(p.joined) : "",
    });
  }
  // Newest members first, then by name.
  return members.sort((a, b) => b.joined.localeCompare(a.joined) || a.displayName.localeCompare(b.displayName));
}

/** Fails soft: a feed outage returns ok: false and the page shows the join CTA. */
export async function getBaliMembers(): Promise<{ ok: boolean; members: BaliMember[] }> {
  try {
    const res = await fetch(RB_DIRECTORY_FEED, { next: { revalidate: 86400 } });
    if (!res.ok) return { ok: false, members: [] };
    return { ok: true, members: toBaliMembers(await res.json()) };
  } catch {
    return { ok: false, members: [] };
  }
}
