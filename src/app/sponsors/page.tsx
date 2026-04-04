import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Check, Users, Calendar, Globe, Zap } from "lucide-react";
import { STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Partner with Southeast Asia's most active tech community. Reach 2,500+ founders, engineers, and VCs through BSTC sponsorship.",
};

const TIERS = [
  {
    name: "Supporting Sponsor",
    commitment: "Per Event",
    description: "Targeted, single-event exposure to our builder audience.",
    includes: [
      "Logo on MeetUp event page",
      "60-second on-stage mention by host",
      "Optional table presence at event",
      "Recap recognition (WhatsApp + LinkedIn)",
      "Logo on website /sponsors page",
    ],
    featured: false,
  },
  {
    name: "Community Partner",
    commitment: "Quarterly",
    description:
      "Sustained presence and deeper integration across 3 events per quarter.",
    includes: [
      "Everything in Supporting",
      "Prominent logo on all event materials",
      "Quarterly value-driven talk (10-15 min)",
      "Dedicated social media feature post",
      "Founder Roundtable collaboration",
      "Post-event sponsor report",
    ],
    featured: true,
  },
  {
    name: "Strategic Partner",
    commitment: "Annual",
    description:
      "Own a category within the BSTC ecosystem with exclusive, year-round presence.",
    includes: [
      "Everything in Community Partner",
      "Category exclusivity (one per vertical)",
      "Co-branded content series",
      "Podcast sponsorship",
      "Annual Summit presence",
      "Quarterly strategy sessions with founders",
      "Homepage hero feature",
    ],
    featured: false,
  },
];

export default function SponsorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              Partnerships
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Reach the Builders
              <br />
              <span className="text-brand-red">Who Matter</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed">
              BSTC sponsors don&apos;t buy ads. They buy trust. Every mention is
              host-endorsed, every activation is curated, and every attendee is a
              pre-qualified builder.
            </p>
          </div>
        </div>
      </section>

      {/* Audience Stats */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] text-center">
              <Users className="w-5 h-5 text-brand-red mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-brand-white">
                {STATS.members.toLocaleString()}+
              </div>
              <div className="text-xs text-brand-grey mt-1">
                Community Members
              </div>
            </div>
            <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] text-center">
              <Calendar className="w-5 h-5 text-brand-red mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-brand-white">
                4-6
              </div>
              <div className="text-xs text-brand-grey mt-1">Events / Month</div>
            </div>
            <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] text-center">
              <Zap className="w-5 h-5 text-brand-red mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-brand-white">
                60%
              </div>
              <div className="text-xs text-brand-grey mt-1">
                Founders & Decision-Makers
              </div>
            </div>
            <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] text-center">
              <Globe className="w-5 h-5 text-brand-red mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-brand-white">
                {STATS.countries}+
              </div>
              <div className="text-xs text-brand-grey mt-1">
                Countries Represented
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-3xl font-display font-bold mb-4 text-center">
            Sponsorship Tiers
          </h2>
          <p className="text-brand-grey text-center mb-12 max-w-xl mx-auto">
            Choose the level of partnership that fits your goals. All tiers are
            built around our core principle: additive, not extractive.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`p-6 rounded-lg border ${
                  tier.featured
                    ? "border-brand-red/30 bg-brand-red/5"
                    : "border-white/5 bg-white/[0.02]"
                } flex flex-col`}
              >
                {tier.featured && (
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-red mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-brand-white mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-brand-red mb-3">{tier.commitment}</p>
                <p className="text-sm text-brand-grey mb-6">
                  {tier.description}
                </p>
                <ul className="space-y-2 mb-8 flex-grow">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-brand-grey"
                    >
                      <Check
                        size={14}
                        className="text-brand-red mt-0.5 flex-shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sponsors/apply"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium rounded transition-colors text-sm ${
                    tier.featured
                      ? "bg-brand-red hover:bg-brand-red-dark text-brand-white"
                      : "border border-white/10 hover:border-white/20 text-brand-white"
                  }`}
                >
                  Book a Call
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIWA Series Sponsor */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl mx-auto p-8 rounded-lg border border-brand-red/20 bg-brand-red/5">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-3">
              Premium Opportunity
            </p>
            <h3 className="text-2xl font-display font-bold text-brand-white mb-4">
              &ldquo;How I Build with AI&rdquo; Series Sponsor
            </h3>
            <p className="text-brand-grey mb-6 leading-relaxed">
              Be the presenting sponsor of BSTC&apos;s most content-rich event
              format. Every session generates video clips, podcast episodes,
              blog posts, and social content — all co-branded with your logo.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'Presenting sponsor: "How I Build with AI, presented by [You]"',
                "Logo on all content: videos, podcast, blog, social",
                "Product featured in builds (when authentic and relevant)",
                "One season = 6-12 sessions of branded content",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-brand-grey"
                >
                  <Check
                    size={14}
                    className="text-brand-red mt-0.5 flex-shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sponsors/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm"
            >
              Enquire About Series Sponsorship
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why BSTC */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-12">
            Why Sponsor BSTC?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            {[
              {
                before: "Banner ads with no context",
                after: "In-room with your exact ICP",
              },
              {
                before: "Vanity metrics",
                after: "Real conversations at the table",
              },
              {
                before: "One-time exposure",
                after: "Ongoing community presence",
              },
              {
                before: "No feedback loop",
                after: "Direct attendee interaction + post-event reports",
              },
            ].map((row, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <p className="text-sm text-brand-grey line-through mb-1">
                  {row.before}
                </p>
                <p className="text-sm text-brand-white font-medium">
                  {row.after}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
