"use client";

import { useEffect, useState } from "react";

// Canggu runs on WITA (Asia/Makassar), the same zone the event dates use.
export const HOME_TZ = "Asia/Makassar";

const LONG_DAYS: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

type Parts = {
  weekday: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const formatters = new Map<string, Intl.DateTimeFormat>();

function parts(tz: string, d: Date): Parts {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    formatters.set(tz, f);
  }
  const o: Record<string, string> = {};
  f.formatToParts(d).forEach((p) => {
    o[p.type] = p.value;
  });
  return {
    weekday: o.weekday,
    year: Number(o.year),
    month: Number(o.month),
    day: Number(o.day),
    hour: Number(o.hour) % 24,
    minute: Number(o.minute),
  };
}

/** Minutes east of UTC for a zone at a moment. */
function offsetMinutes(tz: string, d: Date): number {
  const p = parts(tz, d);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return Math.round((asUtc - Math.floor(d.getTime() / 60000) * 60000) / 60000);
}

export function diffFromHome(tz: string, d: Date): string {
  const m = offsetMinutes(tz, d) - offsetMinutes(HOME_TZ, d);
  if (m === 0) return "Same time as Canggu";
  const a = Math.abs(m);
  const h = Math.floor(a / 60);
  const mm = a % 60;
  const text =
    (h ? `${h} ${h === 1 ? "hour" : "hours"}` : "") +
    (mm ? `${h ? " " : ""}${mm} min` : "");
  return `${text} ${m > 0 ? "ahead of" : "behind"} Canggu`;
}

/** The current time, refreshed every 15 seconds; null until mounted so the
 * server render and the first client render match. */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 15000);
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return now;
}

function safeParts(tz: string, d: Date | null): Parts | null {
  if (!d) return null;
  try {
    return parts(tz, d);
  } catch {
    return null;
  }
}

/**
 * Live local time for a zone: "7:42pm" plus the weekday. Before JavaScript
 * runs it shows the static fallback (for example "UTC+8").
 */
export default function LiveClock({
  tz,
  fallback,
  fallbackDay = "",
  longDay = false,
}: {
  tz: string;
  fallback: string;
  fallbackDay?: string;
  longDay?: boolean;
}) {
  const p = safeParts(tz, useNow());
  if (!p) {
    return (
      <>
        <span className="gl-clk-t">{fallback}</span>
        {fallbackDay && <span className="gl-clk-d"> {fallbackDay}</span>}
      </>
    );
  }
  const h12 = p.hour % 12 || 12;
  const mm = String(p.minute).padStart(2, "0");
  return (
    <>
      <span className="gl-clk-t">
        {h12}:{mm}
        <small>{p.hour < 12 ? "am" : "pm"}</small>
      </span>
      <span className="gl-clk-d"> {longDay ? LONG_DAYS[p.weekday] || p.weekday : p.weekday}</span>
    </>
  );
}

/** "3 hours ahead of Canggu", live. */
export function TimeDiff({ tz, fallback }: { tz: string; fallback: string }) {
  const now = useNow();
  let text = fallback;
  if (now) {
    try {
      text = diffFromHome(tz, now);
    } catch {
      text = fallback;
    }
  }
  return <>{text}</>;
}

/** The visitor's own clock, read from their browser's time zone. Renders
 * nothing until it knows the zone. */
export function VisitorClock() {
  const now = useNow();
  const [tz, setTz] = useState<string | null>(null);
  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || null);
    } catch {
      setTz(null);
    }
  }, []);
  const p = tz ? safeParts(tz, now) : null;
  if (!tz || !now || !p) return null;
  const h12 = p.hour % 12 || 12;
  const mm = String(p.minute).padStart(2, "0");
  return (
    <p className="gl-you-time">
      Your clock: {h12}:{mm}
      {p.hour < 12 ? "am" : "pm"} {p.weekday}. {diffFromHome(tz, now)}.
    </p>
  );
}
