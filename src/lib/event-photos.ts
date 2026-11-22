// Real photos from Bali Startup & Tech nights in Canggu (src/data/event-photos.json,
// the 25 the Remote Builders site publishes, copied 11 Nov 2026).
//
// Nobody recorded which night, series or venue each photo shows. So captions
// only ever say they're from Bali Startup & Tech nights in Canggu, never a
// particular night, series or venue. The order below only picks what looks
// right at the top of each page; it says nothing about where a photo was taken.
import data from "../data/event-photos.json";

export interface EventPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const EVENT_PHOTOS: EventPhoto[] = (data as { photos: EventPhoto[] }).photos;

export const PHOTO_CAPTION =
  "Photos from Bali Startup & Tech nights in Canggu. They aren't tagged to a particular night.";

const byName = (name: string) => EVENT_PHOTOS.find((p) => p.src.endsWith(`undated_bstc_${name}.jpg`));

// Table and crowd shots first for the dinner, talk shots first for How I AI.
const DINNER_FIRST = ["founder-long-table", "canggu-packed-night", "night-12", "night-13", "night-06", "night-08", "night-11", "night-14"];
const TALKS_FIRST = ["speaker-slides", "audience-talk", "night-19", "night-05", "canggu-crowd-garden", "night-18", "speaker-time-to-scale", "night-09"];

export type PhotoMix = "dinner" | "talks" | "all";

/** Every photo, with the mix's preferred shots first. */
export function getEventPhotos(mix: PhotoMix = "all"): EventPhoto[] {
  const first = mix === "dinner" ? DINNER_FIRST : mix === "talks" ? TALKS_FIRST : [];
  const lead = first.map(byName).filter((p): p is EventPhoto => Boolean(p));
  return [...lead, ...EVENT_PHOTOS.filter((p) => !lead.includes(p))];
}

/** Landscape photos only, for strips where tall photos would crop badly. */
export function landscape(photos: EventPhoto[]): EventPhoto[] {
  return photos.filter((p) => p.width > p.height);
}
