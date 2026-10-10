export const EVENT_TIME_ZONE = "Asia/Makassar";

type EventSchedule = {
  date: string;
  status?: string;
};

export type EventState = "upcoming" | "past" | "unavailable";

/** Event frontmatter uses a Bali calendar date, not a UTC timestamp. */
export function isValidEventDate(date: string): boolean {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export function getBaliDate(now: Date = new Date()): string | null {
  if (Number.isNaN(now.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (name: string) => parts.find((value) => value.type === name)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function getEventState(
  event: EventSchedule,
  now: Date = new Date()
): EventState {
  const today = getBaliDate(now);
  if (!today || !isValidEventDate(event.date)) return "unavailable";

  // An elapsed date is historical; it does not prove that the event took place.
  if (event.status === "completed" || event.date < today) return "past";
  return event.status === "upcoming" ? "upcoming" : "unavailable";
}

export function canRsvpToEvent(
  event: EventSchedule & { rsvpUrl?: string },
  now: Date = new Date()
): boolean {
  if (getEventState(event, now) !== "upcoming" || !event.rsvpUrl) return false;

  try {
    const url = new URL(event.rsvpUrl);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function formatBaliEventDate(date: string): string {
  if (!isValidEventDate(date)) return "Date to be confirmed";

  return new Date(`${date}T00:00:00+08:00`).toLocaleDateString("en-US", {
    timeZone: EVENT_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
