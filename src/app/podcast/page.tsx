import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Mic, Headphones, Radio } from "lucide-react";
import { SITE } from "@/lib/constants";
import { getFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Podcast — Signal from Southeast Asia's Builder Community",
  description:
    "The BSTC podcast features founders, engineers, and operators building from Bali and Southeast Asia. AI workflows, startup stories, and real revenue numbers.",
  keywords: [
    "tech podcast Bali",
    "startup podcast Southeast Asia",
    "AI podcast founders",
    "BSTC podcast",
    "builder podcast",
  ],
};

const PODCAST_FAQS = [
  {
    question: "What is the BSTC podcast about?",
    answer:
      "The BSTC podcast features conversations with founders, engineers, and operators building tech companies from Bali and Southeast Asia. Topics include AI workflows, startup strategies, revenue generation, and the growing tech ecosystem in the region.",
  },
  {
    question: "Where can I listen to the BSTC podcast?",
    answer:
      "The podcast will be available on Spotify, Apple Podcasts, YouTube, and all major podcast platforms. Subscribe to get notified when episodes drop.",
  },
  {
    question: "How can I be a guest on the BSTC podcast?",
    answer:
      "If you're building something interesting with AI or running a tech company from Southeast Asia, reach out via our contact page. We look for practitioners with real results, not just theory.",
  },
];

export default function PodcastPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFAQSchema(PODCAST_FAQS)),
        }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              Podcast
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Signal from the
              <br />
              <span className="text-brand-red">Builder Community</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed mb-8">
              Conversations with the founders, engineers, and operators building
              the future from Southeast Asia. Real tools. Real revenue. Real
              stories. No fluff.
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

      {/* Coming Soon */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl mx-auto p-10 rounded-lg border border-brand-red/20 bg-brand-red/5 text-center">
            <Radio className="w-10 h-10 text-brand-red mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold text-brand-white mb-3">
              Launching Soon
            </h2>
            <p className="text-brand-grey mb-8 max-w-md mx-auto">
              The BSTC podcast is in production. Subscribe to be the first to
              know when the first episode drops.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm"
              >
                Get Notified via WhatsApp
              </a>
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl font-display font-bold mb-12 text-center">
            What to Expect
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-lg border border-white/5 bg-white/[0.02]">
              <Mic className="w-6 h-6 text-brand-red mx-auto mb-4" />
              <h3 className="font-semibold text-brand-white mb-2">
                Builder Interviews
              </h3>
              <p className="text-sm text-brand-grey">
                Deep conversations with founders who are building real products
                with AI. Their stack, their revenue, their lessons.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-white/5 bg-white/[0.02]">
              <Radio className="w-6 h-6 text-brand-red mx-auto mb-4" />
              <h3 className="font-semibold text-brand-white mb-2">
                AI Intel Drops
              </h3>
              <p className="text-sm text-brand-grey">
                Weekly breakdowns of the most important AI developments. What
                matters, what doesn&apos;t, and what founders should be paying
                attention to.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-white/5 bg-white/[0.02]">
              <Headphones className="w-6 h-6 text-brand-red mx-auto mb-4" />
              <h3 className="font-semibold text-brand-white mb-2">
                Live Event Audio
              </h3>
              <p className="text-sm text-brand-grey">
                Recordings from &ldquo;How I Build with AI&rdquo; sessions. Hear
                the live builds, Q&A, and Money Round — even if you
                couldn&apos;t be there.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div>
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
                Sponsor the Podcast
              </p>
              <h2 className="text-2xl font-display font-bold mb-4">
                Reach Southeast Asia&apos;s Most Active Builders
              </h2>
              <p className="text-brand-grey mb-6 leading-relaxed">
                The BSTC podcast audience is founders, engineers, and operators
                who are actively building. Pre-roll, mid-roll, and season
                sponsorship packages available.
              </p>
              <Link
                href="/sponsors/apply"
                className="inline-flex items-center gap-2 text-brand-red hover:text-brand-white font-medium transition-colors"
              >
                Enquire About Sponsorship
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
              <h3 className="text-xs font-medium uppercase tracking-wider text-brand-grey mb-4">
                Audience Profile
              </h3>
              <ul className="space-y-3">
                {[
                  "Startup founders (pre-seed to Series C)",
                  "Engineers & developers (including ex-FAANG)",
                  "Investors (VCs, angels, family offices)",
                  "Operators & executives (C-suite, VP-level)",
                  "Based in or connected to Southeast Asia",
                  "Actively building with AI",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-brand-grey"
                  >
                    <span className="text-brand-red mt-0.5">&#9656;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl font-display font-bold mb-8 text-center">
            FAQ
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {PODCAST_FAQS.map((faq) => (
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
    </>
  );
}
