import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, Wrench } from "lucide-react";
import {
  getAllEvents,
  getHIWAEvents,
  formatEventDate,
  ContentItem,
  EventFrontmatter,
} from "@/lib/content";
import { getFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How I Build with AI",
  description:
    "Watch real builders share their actual AI workflows. Live demos, real tools, real products. BSTC's flagship practitioner-led event series.",
};

const HIWA_FAQS = [
  {
    question: "What is 'How I Build with AI'?",
    answer:
      "It's BSTC's flagship event series where real builders share their actual AI workflows live. No slides, no theory: just practitioners showing how they ship products using AI tools.",
  },
  {
    question: "Who can attend 'How I Build with AI' events?",
    answer:
      "Anyone interested in practical AI applications. Our audience includes founders, engineers, operators, and anyone curious about building with AI. Events are held in Bali.",
  },
  {
    question: "What AI tools are typically demonstrated?",
    answer:
      "Builders use a range of tools including Claude, ChatGPT, Cursor, n8n, Vercel, and many more. Each session features different tools based on what the builder actually uses in their workflow.",
  },
  {
    question: "Are 'How I Build with AI' sessions recorded?",
    answer:
      "Yes. Every session is recorded and published as a podcast episode and video. Transcripts and key takeaways are published on our website.",
  },
];

function EpisodeCard({ event }: { event: ContentItem<EventFrontmatter> }) {
  const { frontmatter: e } = event;
  const isUpcoming = e.status === "upcoming";

  return (
    <Link
      href={`/how-i-build-with-ai/${e.slug}`}
      className="group block rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all overflow-hidden"
    >
      {/* Cover image */}
      {e.coverImage ? (
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={e.coverImage}
            alt={e.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="aspect-[3/2] bg-gradient-to-br from-brand-red/10 to-brand-charcoal flex items-center justify-center border-b border-white/5">
          <div className="text-center">
            <p className="text-brand-red font-bold text-lg">HOW I AI</p>
            <p className="text-brand-grey text-xs mt-1">
              {isUpcoming ? "Coming Soon" : "Watch Now"}
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
              isUpcoming
                ? "bg-brand-red/10 text-brand-red"
               : "bg-white/5 text-brand-grey"
            }`}
          >
            {isUpcoming ? "Upcoming": "Episode"}
          </span>
          <span className="text-xs text-brand-grey">
            {formatEventDate(e.date)}
          </span>
        </div>

        <h3 className="font-semibold text-brand-white group-hover:text-brand-red transition-colors mb-2">
          {e.title}
        </h3>

        {e.builder && (
          <p className="text-sm text-brand-grey mb-3">
            with {e.builder.name}, {e.builder.role} at {e.builder.company}
          </p>
        )}

        {e.tools && e.tools.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-brand-grey">
            <Wrench size={12} />
            {e.tools.slice(0, 3).join(", ")}
            {e.tools.length > 3 && ` +${e.tools.length - 3} more`}
          </div>
        )}
      </div>
    </Link>
  );
}

export default async function HIWAPage() {
  const allEvents = await getAllEvents();
  const hiwaEvents = getHIWAEvents(allEvents);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFAQSchema(HIWA_FAQS)),
        }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              Flagship Series
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              How I Build
              <br />
              <span className="text-brand-red">with AI</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed mb-8">
              Watch real builders share their actual AI workflows. Live demos.
              Real tools. Real products. No slides, no theory: just
              practitioners showing how they ship.
            </p>
            <p className="text-sm text-brand-grey">
              Presented by{" "}
              <span className="text-brand-white">
                Bali Startup & Tech Community
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          {hiwaEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hiwaEvents.map((event) => (
                <EpisodeCard key={event.frontmatter.slug} event={event} />
              ))}
            </div>
          ): (
            <div className="text-center py-16 border border-white/5 rounded-lg bg-white/[0.02]">
              <p className="text-brand-red font-bold text-2xl mb-2">
                Edition #1 Coming Soon
              </p>
              <p className="text-brand-grey">
                The first episode is in the works. Join the community to be
                notified.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-12 text-center">
            What to Expect
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              {
                time: "0:00",
                title: "Welcome",
                desc: "Host frames the session. Sponsor mention.",
              },
              {
                time: "0:05",
                title: "The Build",
                desc: "Builder shares screen and builds live for 35 minutes.",
              },
              {
                time: "0:40",
                title: "Q&A",
                desc: "Audience asks tough questions directly to the builder.",
              },
              {
                time: "0:55",
                title: "Roundtable",
                desc: "Open floor: share what you're building with AI.",
              },
            ].map((step) => (
              <div key={step.time} className="text-center">
                <div className="text-brand-red font-mono text-sm mb-2">
                  {step.time}
                </div>
                <h3 className="font-semibold text-brand-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-brand-grey">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl font-display font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {HIWA_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="p-6 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <h3 className="font-semibold text-brand-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-brand-grey leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Want to Be a Featured Builder?
          </h2>
          <p className="text-brand-grey max-w-lg mx-auto mb-8">
            If you build with AI daily and can demo your workflow live, we want
            to hear from you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            Get in Touch
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
