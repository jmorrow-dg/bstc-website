// Display helpers for the homepage fixture board. Everything is derived from
// content/events frontmatter, so the board updates when an event file is
// added or its date passes (see event-status.ts).
import type { ContentItem, EventFrontmatter } from "./content";
import { canRsvpToEvent, isValidEventDate } from "./event-status";

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LONG_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type Fixture = {
  slug: string;
  name: string;
  /** Edition or dinner number, or the day of the month when there is none. */
  number: string;
  numberLabel: string;
  /** "Wed 4 Nov" */
  shortDate: string;
  /** "Wednesday 4 November" */
  longDate: string;
  /** "2026-11-04T18:00+08:00" */
  isoStart: string;
  /** "6pm" or "6:30pm"; empty when the frontmatter has no usable time. */
  time: string;
  venue: string;
  /** The event's frontmatter description, shown under the name (kept from the old homepage cards). */
  description: string;
  isDinner: boolean;
  rsvpUrl: string | null;
};

/** Frontmatter dates are Bali calendar dates ("2026-11-04"). */
function dateParts(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, weekday };
}

export function formatTime(time: string | undefined): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec((time || "").trim());
  if (!match) return "";
  const h = Number(match[1]);
  const min = match[2];
  const h12 = h % 12 || 12;
  const suffix = h < 12 ? "am" : "pm";
  return min === "00" ? `${h12}${suffix}` : `${h12}:${min}${suffix}`;
}

function fixtureName(fm: EventFrontmatter): string {
  if (fm.type === "how-i-build-with-ai") return "How I AI";
  if (fm.type === "networking") {
    return /drinks\s*&\s*dinner/i.test(fm.title) ? "Networking Drinks & Dinner" : "Networking Night";
  }
  // Fall back to the title, without brand prefixes and edition suffixes.
  return fm.title
    .replace(/^(BSTC|Bali Startup (and|&) Tech)\s+/i, "")
    .split(/\s+[|·]\s+|\s+-\s+|:\s+/)[0]
    .trim();
}

function fixtureNumber(fm: EventFrontmatter): string | null {
  const match = /(?:edition\s*#?|#)\s*(\d+)/i.exec(fm.title);
  return match ? match[1] : null;
}

export function toFixture(event: ContentItem<EventFrontmatter>): Fixture | null {
  const fm = event.frontmatter;
  if (!isValidEventDate(fm.date)) return null;
  const { m, d, weekday } = dateParts(fm.date);
  const time = formatTime(fm.time);
  const hhmm = /^\d{1,2}:\d{2}$/.test(fm.time || "") ? fm.time.padStart(5, "0") : null;
  const number = fixtureNumber(fm);
  const isDinner = fm.type === "networking";
  return {
    slug: fm.slug,
    name: fixtureName(fm),
    number: number ?? String(d),
    numberLabel: number ? (isDinner ? "Dinner" : "Edition") : SHORT_MONTHS[m - 1],
    shortDate: `${SHORT_DAYS[weekday]} ${d} ${SHORT_MONTHS[m - 1]}`,
    longDate: `${LONG_DAYS[weekday]} ${d} ${LONG_MONTHS[m - 1]}`,
    isoStart: hhmm ? `${fm.date}T${hhmm}+08:00` : fm.date,
    time,
    venue: fm.venue,
    description: fm.description || "",
    isDinner,
    rsvpUrl: canRsvpToEvent(fm) ? fm.rsvpUrl : null,
  };
}

/** "How I AI, edition 18." / "Networking Drinks & Dinner #39." */
export function fixtureLabel(f: Fixture): string {
  if (f.numberLabel === "Edition") return `${f.name}, edition ${f.number}.`;
  if (f.numberLabel === "Dinner") return `${f.name} #${f.number}.`;
  return `${f.name}.`;
}

/** "Wed 4 Nov, 6pm, Seoul Soul Project, Canggu." */
export function fixtureWhen(f: Fixture): string {
  return [f.shortDate, f.time, f.venue].filter(Boolean).join(", ") + ".";
}

/** "23 April 2026" for blog dates (ISO date strings). */
export function formatLongDate(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(date)) return date;
  const { y, m, d } = dateParts(date.slice(0, 10));
  return `${d} ${LONG_MONTHS[m - 1]} ${y}`;
}

/** "9 min" and "9 min read" both become "9 min read". */
export function formatReadTime(readTime?: string): string {
  if (!readTime) return "";
  const t = readTime.trim().replace(/\s*read$/i, "");
  return `${t} read`;
}
