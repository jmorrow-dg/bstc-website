import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import {
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  formatEventDate,
  formatEventType,
  EventFrontmatter,
  ContentItem,
} from "@/lib/content";
import { getEventState } from "@/lib/event-status";
import PhotoGallery from "@/components/events/PhotoGallery";
import EventProof from "@/components/events/EventProof";
import { getEventPhotos } from "@/lib/event-photos";
import { HISTORY_CHECKED, getHistoryStats, shortDate } from "@/lib/event-history";

const HISTORY = getHistoryStats();

// Upcoming vs past is derived from the current Bali date, so re-render hourly.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Startup and Tech Events in Bali",
  description: `Free startup and tech events in Canggu, Bali: Drinks & Dinner, the monthly founder dinner at Yema Kitchen, and How I AI every Wednesday at Seoul Soul Project. ${HISTORY.nights} nights since ${shortDate(HISTORY.firstDate)} (Meetup, ${HISTORY_CHECKED}).`,
  keywords: [
    "Bali tech events",
    "startup events Bali",
    "Southeast Asia founder events",
    "Canggu networking events",
    "tech meetups Bali",
    "founder roundtable Bali",
    "How I Build with AI",
    "Bali hackathons",
    "BSTC events",
    "AI events Southeast Asia",
  ],
  openGraph: {
    title: "Startup and tech events in Bali | Bali Startup & Tech Community",
    description:
      "Free founder and builder nights in Canggu, Bali: the monthly Drinks & Dinner and How I AI every Wednesday.",
    type: "website",
  },
  alternates: { canonical: "/events" },
};

function EventCard({ event, now }: { event: ContentItem<EventFrontmatter>; now: Date }) {
  const { frontmatter: e } = event;
  const isUpcoming = getEventState(e, now) === "upcoming";

  return (
    <Link
      href={`/events/${e.slug}`}
      className="group block rounded-lg border border-ink/10 bg-white/70 hover:bg-white hover:border-brand-red/20 transition-all overflow-hidden"
    >
      {/* Cover image */}
      {e.coverImage ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={e.coverImage}
            alt={e.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-brand-red/10 via-brand-charcoal to-brand-charcoal flex items-center justify-center">
          <span className="text-brand-red/40 font-display font-bold text-2xl">
            {formatEventType(e.type)}
          </span>
        </div>
      )}

      <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <span
          className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded ${
            isUpcoming
              ? "bg-brand-red/10 text-brand-red"
              : "bg-ink/5 text-brand-grey"
          }`}
        >
          {isUpcoming ? "Upcoming": "Past Event"}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-brand-grey">
          {formatEventType(e.type)}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-brand-white group-hover:text-brand-red transition-colors mb-3">
        {e.title}
      </h3>

      <p className="text-sm text-brand-grey mb-4 line-clamp-2">
        {e.description}
      </p>

      <div className="flex flex-wrap gap-4 text-xs text-brand-grey">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatEventDate(e.date)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {e.venue}
        </span>
        {e.recap?.attendees && (
          <span className="flex items-center gap-1">
            <Users size={12} />
            {e.recap.attendees} attended
          </span>
        )}
      </div>

      {e.builder && (
        <div className="mt-4 pt-4 border-t border-ink/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red text-xs font-bold">
            {e.builder.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="text-sm text-brand-white">{e.builder.name}</p>
            <p className="text-xs text-brand-grey">
              {e.builder.role}, {e.builder.company}
            </p>
          </div>
        </div>
      )}
      </div>
    </Link>
  );
}

export default async function EventsPage() {
  const allEvents = await getAllEvents();
  const now = new Date();
  const upcoming = getUpcomingEvents(allEvents, now);
  const past = getPastEvents(allEvents, now);

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Where Builders Gather
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Startup and tech events in Bali
          </h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Free nights for founders and builders in Canggu. Drinks &amp;
            Dinner is the monthly founder dinner at Yema Kitchen, and How I AI
            runs every Wednesday at Seoul Soul Project. Come to one, meet the
            room, then join the community.
          </p>
        </div>
      </section>

      {/* The two series */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-site mx-auto px-6 grid gap-6 md:grid-cols-2">
          {[
            {
              href: "/drinks-and-dinner",
              kicker: "Monthly, usually a Thursday",
              title: "Drinks & Dinner",
              text: "The monthly founder night at Yema Kitchen, Canggu. A couple of short founder talks, then open networking. Free; you pay for your own food and drinks.",
              count: `${HISTORY.dinners} nights since ${shortDate(HISTORY.firstDate)}`,
            },
            {
              href: "/how-i-build-with-ai",
              kicker: "Every Wednesday",
              title: "How I AI",
              text: "The weekly AI builder night at Seoul Soul Project, Canggu. Builders show the AI tools and workflows behind what they ship. Free.",
              count: `${HISTORY.howIAi} editions since ${shortDate(getHistoryStats("how-i-ai").firstDate)}`,
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block min-w-0 rounded-lg border border-ink/10 bg-white/70 p-6 hover:bg-white hover:border-brand-red/20 transition-colors"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-brand-red mb-2">{s.kicker}</p>
              <h2 className="text-2xl font-display font-bold mb-3 group-hover:text-brand-red">{s.title}</h2>
              <p className="text-sm text-brand-grey mb-4">{s.text}</p>
              <p className="text-xs text-brand-grey">
                {s.count} (Meetup, {HISTORY_CHECKED})
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-red">
                Dates, photos and every past night <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="max-w-site mx-auto px-6">
            <h2 className="text-2xl font-display font-bold mb-8">
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcoming.map((event) => (
                <EventCard key={event.frontmatter.slug} event={event} now={now} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Proof and photos */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6 space-y-16">
          <EventProof title="Every BSTC night since 2023" />
          <PhotoGallery photos={getEventPhotos("all").slice(0, 12)} />
        </div>
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="max-w-site mx-auto px-6">
            <h2 className="text-2xl font-display font-bold mb-3">
              Past Events
            </h2>
            <p className="text-sm text-brand-grey mb-8 max-w-3xl">
              The listings below go back to 2026. For every night since{" "}
              {shortDate(HISTORY.firstDate)}, see the full history on{" "}
              <Link href="/drinks-and-dinner#history" className="gl-link">Drinks &amp; Dinner</Link>{" "}
              and{" "}
              <Link href="/how-i-build-with-ai#history" className="gl-link">How I AI</Link>.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {past.map((event) => (
                <EventCard key={event.frontmatter.slug} event={event} now={now} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-ink/10">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Never Miss an Event
          </h2>
          <p className="text-brand-grey mb-8">
            Join our MeetUp group to get notified when new events are posted.
          </p>
          <a
            href="https://www.meetup.com/bali-start-ups-tech-community/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white font-medium rounded transition-colors"
          >
            Join on MeetUp
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
