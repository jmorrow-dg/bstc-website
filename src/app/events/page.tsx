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

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past events from Bali Startup & Tech Community. Networking nights, founder roundtables, builder sessions, and How I Build with AI.",
};

function EventCard({ event }: { event: ContentItem<EventFrontmatter> }) {
  const { frontmatter: e } = event;
  const isUpcoming = e.status === "upcoming";

  return (
    <Link
      href={`/events/${e.slug}`}
      className="group block rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all overflow-hidden"
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
              : "bg-white/5 text-brand-grey"
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
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
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
  const upcoming = getUpcomingEvents(allEvents);
  const past = getPastEvents(allEvents);

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Events
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Where Builders Gather
          </h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Monthly networking nights, founder roundtables, builder sessions,
            and our flagship &ldquo;How I Build with AI&rdquo; series. Every
            event is designed for signal over noise.
          </p>
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
                <EventCard key={event.frontmatter.slug} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="max-w-site mx-auto px-6">
            <h2 className="text-2xl font-display font-bold mb-8">
              Past Events
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {past.map((event) => (
                <EventCard key={event.frontmatter.slug} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-white/5">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            Join on MeetUp
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
