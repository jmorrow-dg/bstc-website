import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "BSTC is the largest founder-led tech community in Bali and Southeast Asia. Founded in 2023. 2,500+ members from 40+ countries. 34+ events. Signal over noise. Builders first.",
  keywords: [
    "Bali Startup and Tech Community",
    "BSTC",
    "Southeast Asia tech community",
    "Bali founder community",
    "Canggu tech meetup",
    "Bali startup network",
    "founder community Southeast Asia",
    "Indonesia tech community",
    "about BSTC",
  ],
  openGraph: {
    title: "About Bali Startup & Tech Community",
    description:
      "How BSTC grew from 20 founders in Canggu to 2,500+ builders across Southeast Asia. Signal over noise.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              About BSTC
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Building Southeast Asia&apos;s #1 Tech Community
            </h1>
            <p className="text-brand-grey text-lg max-w-2xl">
              It started with 20 founders in a Canggu restaurant. Today, 2,500+
              builders from 40+ countries. The goal hasn&apos;t changed: the
              highest-signal tech community in Southeast Asia.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl space-y-6 text-brand-grey leading-relaxed">
            <p className="text-lg">
              BSTC started in October 2023 with a simple idea: Southeast Asia
              had thousands of founders, engineers, and tech operators, but no
              high-signal community connecting them. We started in Bali because
              that is where the density was.
            </p>
            <p>
              The meetups that existed were either too casual (no structure, no
              follow-through) or too corporate (sponsored panels with no genuine
              interaction). We wanted something different: a community built by
              builders, for builders. Where the room is curated. Where hard
              selling is banned. Where every conversation adds value.
            </p>
            <p>
              We ran our first networking night at a restaurant in Canggu. 20
              people showed up. Then 40. Then 60. Word spread because the
              experience was different: people actually came back.
            </p>
            <p>
              Today, BSTC has{" "}
              <span className="text-brand-white font-medium">
                {STATS.members.toLocaleString()}+ members
              </span>{" "}
              across MeetUp and WhatsApp,{" "}
              <span className="text-brand-white font-medium">
                {STATS.events}+ events
              </span>{" "}
              hosted, and a{" "}
              <span className="text-brand-white font-medium">
                {STATS.rating}/5.0 average rating
              </span>
              . We run monthly networking nights, founder roundtables, builder
              sessions, and our flagship &ldquo;How I Build with AI&rdquo;
              series.
            </p>
            <p>
              Our audience includes ex-FAANG engineers, funded startup founders,
              VCs, angel investors, and senior operators from{" "}
              <span className="text-brand-white font-medium">
                {STATS.countries}+ countries
              </span>
              . The community is international, professional, and builder-first.
            </p>
            <p>
              We&apos;re based in Canggu, Bali with active nodes in Ubud,
              Sanur, and Uluwatu. We are the largest founder-led tech community
              in Southeast Asia, and every event we run is built to keep it
              that way.
            </p>
            <p className="text-brand-white font-medium text-lg">
              Signal over noise. Builders first. Always.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl font-display font-bold mb-12 text-center">
            Milestones
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                date: "Oct 2023",
                event: "First BSTC networking night in Canggu. 20 attendees.",
              },
              {
                date: "Dec 2023",
                event: "Crossed 500 MeetUp members. Monthly events established.",
              },
              {
                date: "Mid 2024",
                event:
                  "1,000+ members. Expanded to 4 event formats. Pilot nodes in Ubud and Sanur.",
              },
              {
                date: "Late 2024",
                event:
                  "2,000+ members. 4.6/5 average rating. Community leadership tier system launched.",
              },
              {
                date: "2025",
                event:
                  '2,500+ members. 34+ events hosted. "How I Build with AI" series announced.',
              },
              {
                date: "2026",
                event:
                  "Website launch. Podcast launch. Sponsor partnerships active. Targeting $1M+ ARR.",
              },
            ].map((milestone) => (
              <div
                key={milestone.date}
                className="flex gap-6 items-start p-4 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <span className="text-brand-red font-mono text-sm flex-shrink-0 w-20">
                  {milestone.date}
                </span>
                <p className="text-sm text-brand-grey">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Be Part of It
          </h2>
          <p className="text-brand-grey max-w-lg mx-auto mb-8">
            Whether you&apos;re a founder, engineer, investor, or operator. 
            if you&apos;re building something, you belong here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
            >
              Join the Community
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/leadership"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors"
            >
              Meet the Leaders
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
