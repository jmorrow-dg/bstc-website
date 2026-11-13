import Link from "next/link";
import { MapPin } from "lucide-react";
import PhotoGallery from "@/components/events/PhotoGallery";
import EventProof from "@/components/events/EventProof";
import { getEventPhotos, landscape } from "@/lib/event-photos";
import { seriesOfEventType } from "@/lib/event-history";
import { formatVenueAddress, getVenue, venueMapsUrl } from "@/lib/venues";

/** "18:30 to 22:00 WITA", or "18:30 WITA" when the listing gives no finish time. */
export function eventTimeRange(e: { time: string; endTime?: string }): string {
  return `${e.time}${e.endTime && e.endTime > e.time ? ` to ${e.endTime}` : ""} WITA`;
}

/** The venue, its street address and a Google Maps link, when the venue is known. */
export function EventVenueLine({ venue, iconSize = 16 }: { venue: string; iconSize?: number }) {
  const v = getVenue(venue);
  return (
    <span className="flex items-start gap-2 min-w-0">
      <MapPin size={iconSize} className="text-brand-red mt-0.5 flex-shrink-0" aria-hidden="true" />
      {v ? (
        <span className="min-w-0">
          {v.name}, {formatVenueAddress(v)}.{" "}
          <a
            href={venueMapsUrl(v)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-red underline hover:text-brand-white"
          >
            Map
          </a>
        </span>
      ) : (
        <span className="min-w-0">{venue}</span>
      )}
    </span>
  );
}

/** The first real photo for an event page's schema `image`. */
export function eventSchemaPhoto(type: string): string | undefined {
  return landscape(getEventPhotos(type === "networking" ? "dinner" : "talks"))[0]?.src;
}

/** A strip of night photos, the dated record and a link to the series hub. */
export function EventPageProof({ type }: { type: string }) {
  const series = seriesOfEventType(type);
  const photos = landscape(getEventPhotos(series === "drinks-and-dinner" ? "dinner" : "talks")).slice(0, 6);
  const hub =
    series === "drinks-and-dinner"
      ? { href: "/drinks-and-dinner#history", label: "See every Drinks & Dinner since 2023" }
      : series === "how-i-ai"
        ? { href: "/how-i-build-with-ai#history", label: "See every How I AI edition" }
        : { href: "/events", label: "See all events" };

  return (
    <section className="pb-12 md:pb-16">
      <div className="max-w-site mx-auto px-6 space-y-10">
        <PhotoGallery photos={photos} variant="strip" headingLevel="h2" title="From past nights" />
        <div>
          <EventProof series={series} compact headingLevel="h2" title="The record so far" />
          <Link href={hub.href} className="inline-block mt-4 text-sm gl-link">
            {hub.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
