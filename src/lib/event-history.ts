// Every BSTC night since the first dinner on 9 Nov 2023, from the BSTC Meetup
// group (src/data/event-history.json, checked 11 Nov 2026). Feeds the dated
// proof and the history tables on /events, /drinks-and-dinner,
// /how-i-build-with-ai and each event page.
//
// RSVP counts are Meetup RSVPs only: many people register on Luma instead, so
// always label them "RSVPs on Meetup" and show the checked date and source.
import history from "../data/event-history.json";

export type SeriesSlug = "drinks-and-dinner" | "how-i-ai";

export interface HistoryNight {
  date: string;
  starts: string;
  ends?: string | null;
  series: SeriesSlug;
  number: number | null;
  title: string;
  venue: string;
  locality: string;
  rsvps: number;
  url: string;
}

export interface EventHistory {
  checked: string;
  source: { title: string; url: string };
  group: { members: number; ratingAverage: number; ratingCount: number };
  nights: HistoryNight[];
}

export const EVENT_HISTORY = history as EventHistory;

// The group's main Meetup page, the public source a reader can check.
export const MEETUP_GROUP_URL = "https://www.meetup.com/bali-start-ups-tech-community/";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-11" gives "11 Nov 2026". */
export function shortDate(isoDay: string): string {
  const [y, m, d] = isoDay.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** The date the history was read, e.g. "11 Nov 2026". */
export const HISTORY_CHECKED = shortDate(EVENT_HISTORY.checked);

export function formatCount(n: number): string {
  return n.toLocaleString("en-AU");
}

/**
 * One consistent label per night, whatever the old listing was called:
 * "Drinks & Dinner #37", "Melbourne Drinks & Dinner #1", "How I AI Edition 18".
 */
export function nightLabel(n: Pick<HistoryNight, "series" | "number" | "title" | "locality">): string {
  if (n.series === "how-i-ai") {
    return n.number ? `How I AI Edition ${n.number}` : "How I AI";
  }
  if (/saas/i.test(n.title)) return "SaaS Founders Dinner";
  const place = /melbourne/i.test(`${n.title} ${n.locality}`) ? "Melbourne " : "";
  return n.number ? `${place}Drinks & Dinner #${n.number}` : `${place}Drinks & Dinner`;
}

/** Newest first. */
export function getNights(series?: SeriesSlug, h: EventHistory = EVENT_HISTORY): HistoryNight[] {
  return h.nights
    .filter((n) => !series || n.series === series)
    .slice()
    .sort((a, b) => b.starts.localeCompare(a.starts));
}

export interface HistoryStats {
  nights: number;
  dinners: number;
  howIAi: number;
  rsvps: number;
  firstDate: string;
}

export function getHistoryStats(series?: SeriesSlug, h: EventHistory = EVENT_HISTORY): HistoryStats {
  const nights = getNights(series, h);
  return {
    nights: nights.length,
    dinners: nights.filter((n) => n.series === "drinks-and-dinner").length,
    howIAi: nights.filter((n) => n.series === "how-i-ai").length,
    rsvps: nights.reduce((sum, n) => sum + n.rsvps, 0),
    firstDate: nights.length ? nights[nights.length - 1].date : "",
  };
}

/** The site's event `type` for a series. */
export function seriesOfEventType(type?: string): SeriesSlug | undefined {
  if (type === "networking") return "drinks-and-dinner";
  if (type === "how-i-build-with-ai") return "how-i-ai";
  return undefined;
}

/** The edition or dinner number in a site event's slug or title, if any. */
export function eventNumber(e: { slug: string; title: string }): number | null {
  const m =
    e.slug.match(/edition-(\d+)$/) ||
    e.slug.match(/canggu-(\d+)$/) ||
    e.title.match(/(?:#|edition\s+)(\d+)\s*$/i);
  return m ? Number(m[1]) : null;
}

/**
 * This site's page for a past night, when there is one: same series and same
 * Bali date, and the same number when both give one. Otherwise undefined, and
 * the history row links to the Meetup listing instead.
 */
export function findEventPageForNight<T extends { slug: string; title: string; date: string; type: string }>(
  night: HistoryNight,
  events: T[]
): T | undefined {
  return events.find((e) => {
    if (seriesOfEventType(e.type) !== night.series || e.date !== night.date) return false;
    const n = eventNumber(e);
    return n === null || night.number === null || n === night.number;
  });
}
