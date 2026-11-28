// "+N new members in the last 30 days", read from Remote Builders' llms.txt
// Facts list, which its team refreshes weekly:
//   "- 304 new members signed up in the 30 days before (as of 2026-11-28)"
// The figure counts people who signed up directly with Remote Builders or
// Bali Startup & Tech. It is shown only while its own date is 14 days old or
// less (Bali days), so it can never sit on the page stale: a missing, unreadable
// or older figure makes the line disappear.

export const RB_FACTS_URL = "https://remotebuilders.io/llms.txt";
export const GROWTH_FRESH_DAYS = 14;

export type Growth = { count: number; asOf: string };

export function parseGrowth(text: unknown): Growth | null {
  if (typeof text !== "string") return null;
  const m = text.match(
    /^-\s*([\d,]+)\s+new members signed up in the 30 days before \(as of (\d{4}-\d{2}-\d{2})\)/m
  );
  if (!m) return null;
  const count = Number(m[1].replace(/,/g, ""));
  if (!Number.isInteger(count) || count <= 0) return null;
  return { count, asOf: m[2] };
}

const dayNumber = (iso: string): number => Date.parse(`${iso}T00:00:00Z`) / 864e5;

/** Today's date in Bali (WITA, UTC+8) as YYYY-MM-DD. */
export function baliToday(now: Date = new Date()): string {
  return new Date(now.getTime() + 8 * 36e5).toISOString().slice(0, 10);
}

/** The figure, only while it is at most 14 days old and not dated in the future. */
export function freshGrowth(growth: Growth | null, now: Date = new Date()): Growth | null {
  if (!growth || Number.isNaN(dayNumber(growth.asOf))) return null;
  const age = dayNumber(baliToday(now)) - dayNumber(growth.asOf);
  return age >= 0 && age <= GROWTH_FRESH_DAYS ? growth : null;
}

/** "28 Nov 2026" from "2026-11-28". */
export function growthDate(iso: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [y, mo, d] = iso.split("-").map(Number);
  return `${d} ${months[mo - 1]} ${y}`;
}

/** Fails soft: any outage returns null and the home page leaves the line out. */
export async function getGrowth(now: Date = new Date()): Promise<Growth | null> {
  try {
    const res = await fetch(RB_FACTS_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return freshGrowth(parseGrowth(await res.text()), now);
  } catch {
    return null;
  }
}
