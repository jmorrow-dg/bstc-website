import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ExternalLink,
  Wrench,
  Star,
  Users,
} from "lucide-react";
import {
  getAllEvents,
  getEventBySlug,
  getHIWAEvents,
  formatEventDate,
} from "@/lib/content";
import { getEventSchema } from "@/lib/schema";
import { SITE } from "@/lib/constants";

export async function generateStaticParams() {
  const allEvents = await getAllEvents();
  const hiwa = getHIWAEvents(allEvents);
  return hiwa.map((event) => ({ slug: event.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: "Episode Not Found" };

  const { frontmatter: e } = event;
  return {
    title: e.seo?.title || `${e.title} | How I Build with AI`,
    description: e.seo?.description || e.description,
    keywords: e.seo?.keywords,
    openGraph: {
      title: e.seo?.title || e.title,
      description: e.seo?.description || e.description,
      type: "article",
      images: [
        {
          url: e.coverImage || `/api/og?title=${encodeURIComponent(e.title)}&subtitle=${encodeURIComponent(e.description.slice(0, 100))}&type=hiwa`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function HIWAEpisodePage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEventBySlug(params.slug);
  if (!event || event.frontmatter.type !== "how-i-build-with-ai") notFound();

  const { frontmatter: e, htmlContent } = event;
  const isUpcoming = e.status === "upcoming";
  const hasRecap = e.status === "completed" && e.recap;

  const eventSchema = getEventSchema({
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    venue: e.venue,
    url: `${SITE.url}/how-i-build-with-ai/${e.slug}`,
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

      {/* Back */}
      <div className="max-w-site mx-auto px-6 pt-6">
        <Link
          href="/how-i-build-with-ai"
          className="inline-flex items-center gap-2 text-sm text-brand-grey hover:text-brand-white transition-colors"
        >
          <ArrowLeft size={14} />
          All Episodes
        </Link>
      </div>

      {/* Header */}
      <section className="py-12 md:py-20">
        <div className="max-w-site mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_380px] gap-12">
            <div>
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-3">
                How I Build with AI
              </p>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {e.title}
              </h1>
              <p className="text-lg text-brand-grey mb-6">{e.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-brand-grey mb-8">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-brand-red" />
                  {formatEventDate(e.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-brand-red" />
                  {e.time} WITA
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-brand-red" />
                  {e.venue}
                </span>
              </div>

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

            {/* Sidebar: Builder + Tools */}
            <div className="space-y-6">
              {e.builder && (
                <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-brand-grey mb-4">
                    Builder
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold">
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
                    </div>
                  </div>
                  {e.builder.bio && (
                    <p className="text-sm text-brand-grey leading-relaxed">
                      {e.builder.bio}
                    </p>
                  )}
                  {e.builder.linkedin && (
                    <a
                      href={e.builder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-red hover:text-brand-white mt-3 transition-colors"
                    >
                      LinkedIn <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              )}

              {e.tools && e.tools.length > 0 && (
                <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
                  <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-grey mb-4">
                    <Wrench size={12} />
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
              )}

              {hasRecap && e.recap && (
                <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-brand-grey mb-4">
                    Results
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-brand-red" />
                      <span className="text-sm text-brand-grey">
                        {e.recap.attendees} attendees
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star
                        size={14}
                        className="text-brand-red fill-brand-red"
                      />
                      <span className="text-sm text-brand-grey">
                        {e.recap.rating}/5.0 rating
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    {e.recap.videoUrl && (
                      <a
                        href={e.recap.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-brand-red hover:text-brand-white transition-colors"
                      >
                        Watch Recording <ExternalLink size={12} />
                      </a>
                    )}
                    {e.recap.podcastUrl && (
                      <a
                        href={e.recap.podcastUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-brand-red hover:text-brand-white transition-colors"
                      >
                        Listen to Episode <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recap Takeaways */}
      {hasRecap && e.recap?.keyTakeaways && (
        <section className="pb-12 md:pb-20">
          <div className="max-w-site mx-auto px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-display font-bold mb-6">
                Key Takeaways
              </h2>
              <ul className="space-y-3">
                {e.recap.keyTakeaways.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-brand-grey"
                  >
                    <span className="text-brand-red mt-1 font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
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
            {isUpcoming ? "Be There": "Catch the Next One"}
          </h2>
          <p className="text-brand-grey mb-6">
            {isUpcoming
              ? "This is live, in-person, and unrepeatable. RSVP now."
             : "Every edition features a different builder, different tools, different build."}
          </p>
          <Link
            href={isUpcoming ? e.rsvpUrl : "/how-i-build-with-ai"}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            {isUpcoming ? "RSVP Now": "See All Episodes"}
          </Link>
        </div>
      </section>
    </>
  );
}
