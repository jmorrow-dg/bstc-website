import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  Users,
  Zap,
  Shield,
  Star,
  MessageCircle,
  Globe,
  Calendar,
} from "lucide-react";
import { STATS } from "@/lib/constants";
import { getFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join 2,500+ founders, engineers, and operators in Southeast Asia's most active tech community. Learn about our values, events, and how to get involved.",
};

const COMMUNITY_FAQS = [
  {
    question: "How do I join BSTC?",
    answer:
      "Join our WhatsApp group for community updates, RSVP on MeetUp for events, and show up. It's free to join and attend most events.",
  },
  {
    question: "Is BSTC only for people in Bali?",
    answer:
      "Our events are in Bali, but our WhatsApp community includes members from across Southeast Asia and globally. If you're visiting Bali, you're welcome at any event.",
  },
  {
    question: "Do I need to be a founder to join?",
    answer:
      "No. We welcome founders, engineers, investors, operators, and anyone who is actively building in tech. The common thread is a builder mindset, not a specific title.",
  },
  {
    question: "What does 'Signal > Noise' mean?",
    answer:
      "It's our core philosophy. Every interaction should add value. We focus on substance over hype, real builders over talkers, and genuine connections over transactional networking.",
  },
  {
    question: "Are events free?",
    answer:
      "Core networking nights are always free. Some premium events like Founder Roundtables and workshops may have a ticket price. It's always listed on the event page.",
  },
];

function StatBlock({
  value,
  suffix,
  label,
  icon: Icon,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] text-center">
      <Icon className="w-5 h-5 text-brand-red mx-auto mb-3" />
      <div className="text-3xl font-display font-bold text-brand-white">
        {value.toLocaleString()}
        <span className="text-brand-red">{suffix}</span>
      </div>
      <div className="text-sm text-brand-grey mt-1">{label}</div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFAQSchema(COMMUNITY_FAQS)),
        }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              The Community
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Built by Builders,
              <br />
              <span className="text-brand-red">for Builders</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed">
              BSTC is the largest founder-led tech community in Bali and
              Southeast Asia. We connect founders, engineers, investors, and
              operators through high-signal events and a private community
              network. No fluff. No noise. Just builders helping builders.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBlock
              value={STATS.members}
              suffix="+"
              label="Members"
              icon={Users}
            />
            <StatBlock
              value={STATS.events}
              suffix="+"
              label="Events Hosted"
              icon={Calendar}
            />
            <StatBlock
              value={STATS.rating}
              suffix="/5"
              label="Avg Rating"
              icon={Star}
            />
            <StatBlock
              value={STATS.countries}
              suffix="+"
              label="Countries"
              icon={Globe}
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Zap className="w-6 h-6 text-brand-red mx-auto mb-4" />
              <h3 className="font-semibold text-brand-white mb-2">
                Signal &gt; Noise
              </h3>
              <p className="text-sm text-brand-grey leading-relaxed">
                Every interaction should add value. We focus on substance over
                hype, builders over talkers, quality over quantity.
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-brand-red mx-auto mb-4" />
              <h3 className="font-semibold text-brand-white mb-2">
                No Hard Selling
              </h3>
              <p className="text-sm text-brand-grey leading-relaxed">
                Build relationships, not transactions. Leave the pitch at the
                door. Connect authentically. This rule is enforced.
              </p>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 text-brand-red mx-auto mb-4" />
              <h3 className="font-semibold text-brand-white mb-2">
                Builders First
              </h3>
              <p className="text-sm text-brand-grey leading-relaxed">
                We prioritise founders and operators who are actually building
                things. Doers, not dreamers. Operators, not spectators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Member Journey */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-3xl font-display font-bold mb-4 text-center">
            Your Journey
          </h2>
          <p className="text-brand-grey text-center mb-12 max-w-xl mx-auto">
            From first event to community leader: there&apos;s a path for
            everyone.
          </p>
          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "Find us on MeetUp, WhatsApp, or through a friend",
              },
              {
                step: "02",
                title: "First Event",
                desc: "Show up, do your 60-second intro, meet real builders",
              },
              {
                step: "03",
                title: "Get Active",
                desc: "Come back. Build relationships. Attend regularly.",
              },
              {
                step: "04",
                title: "Contribute",
                desc: "Bring others, share knowledge, become a connector",
              },
              {
                step: "05",
                title: "Lead",
                desc: "Apply to become a BSTC Lead and host events",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-4 rounded-lg border border-white/5 bg-white/[0.02] text-center"
              >
                <div className="text-brand-red font-mono text-sm mb-2">
                  {item.step}
                </div>
                <h3 className="font-semibold text-brand-white text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-grey">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            From the Community
          </h2>
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-lg ${star <= 4 ? "text-brand-red" : "text-brand-red/40"}`}>
                  &#9733;
                </span>
              ))}
            </div>
            <span className="text-sm text-brand-grey">
              4.6/5 from 116 reviews on MeetUp
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                quote:
                  "This is the first time I've eaten fish in 15 years. Thanks for hosting the night.",
                name: "Tom",
                role: "LinkedIn Agency, $50K+ MRR",
              },
              {
                quote:
                  "The quality of people in the room is unmatched. More relevant connections in one night than six months of conferences.",
                name: "BSTC Member",
                role: "SaaS Founder, Series A",
              },
              {
                quote:
                  "Best tech community I've been part of anywhere in the world. The signal-to-noise ratio is unreal.",
                name: "BSTC Member",
                role: "Ex-FAANG Engineer",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <p className="text-sm text-brand-grey leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-medium text-brand-white">{t.name}</p>
                <p className="text-xs text-brand-grey">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {COMMUNITY_FAQS.map((faq) => (
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
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Join?
          </h2>
          <p className="text-brand-grey max-w-lg mx-auto mb-8">
            It takes 30 seconds. Join WhatsApp, RSVP on MeetUp, and show up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
            >
              <MessageCircle size={18} />
              Join the Community
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors"
            >
              See Upcoming Events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
