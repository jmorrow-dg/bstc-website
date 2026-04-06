import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  ExternalLink,
  Wrench,
  Star,
} from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import {
  getAllEvents,
  getEventBySlug,
  formatEventDate,
  formatEventType,
} from "@/lib/content";
import { getEventSchema } from "@/lib/schema";
import { SITE } from "@/lib/constants";

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({ slug: event.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: "Event Not Found" };

  const { frontmatter: e } = event;
  return {
    title: e.seo?.title || e.title,
    description: e.seo?.description || e.description,
    openGraph: {
      title: e.seo?.title || e.title,
      description: e.seo?.description || e.description,
      type: "article",
      images: [
        {
          url: e.coverImage || `/api/og?title=${encodeURIComponent(e.title)}&subtitle=${encodeURIComponent(e.description.slice(0, 100))}&type=event`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  const { frontmatter: e, htmlContent } = event;
  const isUpcoming = e.status === "upcoming";
  const hasRecap = e.status === "completed" && e.recap;

  const eventSchema = getEventSchema({
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    venue: e.venue,
    url: `${SITE.url}/events/${e.slug}`,
    image: e.coverImage,
    status: e.status,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Hero Cover Image */}
      {e.coverImage && (
        <div className="max-w-site mx-auto px-6 pt-8">
          <div className="relative aspect-[3/2] rounded-lg overflow-hidden border border-white/10">
            <Image
              src={e.coverImage}
              alt={e.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-site mx-auto px-6 pt-6 space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
            { label: e.title },
          ]}
        />
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-brand-grey hover:text-brand-white transition-colors"
        >
          <ArrowLeft size={14} />
          All Events
        </Link>
      </div>

      {/* Event Header */}
      <section className="py-12 md:py-20">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
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

            <h1 className="text-3xl md:text-5xl font-display font-bold mb-6">
              {e.title}
            </h1>

            <p className="text-lg text-brand-grey mb-8">{e.description}</p>

            {/* Event Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-brand-grey mb-8">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-red" />
                {formatEventDate(e.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-brand-red" />
                {e.time} WITA
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-red" />
                {e.venue}
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="text-brand-red" />
                {hasRecap
                  ? `${e.recap!.attendees} attended`
                 : `${e.capacity} spots`}
              </span>
            </div>

            {/* RSVP Button */}
            {isUpcoming && (
              <a
                href={e.rsvpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
              >
                RSVP on MeetUp
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Builder Profile */}
      {e.builder && (
        <section className="pb-12 md:pb-20">
          <div className="max-w-site mx-auto px-6">
            <div className="max-w-3xl p-6 rounded-lg border border-white/5 bg-white/[0.02]">
              <h3 className="text-xs font-medium uppercase tracking-wider text-brand-grey mb-4">
                {isUpcoming ? "Featured Builder": "Builder"}
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold flex-shrink-0">
                  {e.builder.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-brand-white">
                    {e.builder.name}
                  </p>
                  <p className="text-sm text-brand-grey">
                    {e.builder.role}, {e.builder.company}
                  </p>
                  {e.builder.bio && (
                    <p className="text-sm text-brand-grey mt-2 leading-relaxed">
                      {e.builder.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tools Used */}
      {e.tools && e.tools.length > 0 && (
        <section className="pb-12 md:pb-20">
          <div className="max-w-site mx-auto px-6">
            <div className="max-w-3xl">
              <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-grey mb-4">
                <Wrench size={14} />
                Tools Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {e.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 text-sm rounded-full border border-white/10 text-brand-grey bg-white/[0.03]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recap Section */}
      {hasRecap && e.recap && (
        <section className="pb-12 md:pb-20">
          <div className="max-w-site mx-auto px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-display font-bold mb-6">
                Event Recap
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <Star size={16} className="text-brand-red fill-brand-red" />
                <span className="text-brand-white font-semibold">
                  {e.recap.rating}/5.0
                </span>
                <span className="text-brand-grey text-sm">average rating</span>
              </div>

              {/* Key Takeaways */}
              {e.recap.keyTakeaways && e.recap.keyTakeaways.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-brand-grey mb-3">
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {e.recap.keyTakeaways.map((takeaway, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-brand-grey"
                      >
                        <span className="text-brand-red mt-0.5">&#9656;</span>
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Video */}
              {e.recap.videoUrl && (
                <a
                  href={e.recap.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-brand-red hover:text-brand-white transition-colors mr-6"
                >
                  Watch Recording
                  <ExternalLink size={14} />
                </a>
              )}

              {/* Podcast */}
              {e.recap.podcastUrl && (
                <a
                  href={e.recap.podcastUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-brand-red hover:text-brand-white transition-colors"
                >
                  Listen to Episode
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content Body */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div
            className="max-w-3xl prose prose-invert prose-sm prose-headings:font-display prose-headings:text-brand-white prose-p:text-brand-grey prose-strong:text-brand-white prose-li:text-brand-grey prose-a:text-brand-red"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">
            {isUpcoming ? "See You There": "Join the Next One"}
          </h2>
          <p className="text-brand-grey mb-6">
            {isUpcoming
              ? "RSVP on MeetUp to secure your spot."
             : "Don't miss the next BSTC event."}
          </p>
          <Link
            href={isUpcoming ? e.rsvpUrl : "/events"}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            {isUpcoming ? "RSVP Now": "See Upcoming Events"}
          </Link>
        </div>
      </section>
    </>
  );
}
