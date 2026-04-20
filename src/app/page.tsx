import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Users,
  Calendar,
  Zap,
  Shield,
  MessageCircle,
} from "lucide-react";
import { SITE, STATS } from "@/lib/constants";
import { getAllBlogPosts, getUpcomingEvents, getAllEvents } from "@/lib/content";
import { getFAQSchema } from "@/lib/schema";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import {
  FadeIn,
  FadeInStagger,
  FadeInItem,
  ScaleIn,
} from "@/components/ui/AnimatedSection";

function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <FadeInItem>
      <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-brand-red mb-4" />
        <h3 className="font-semibold text-brand-white mb-2">{title}</h3>
        <p className="text-sm text-brand-grey leading-relaxed">{description}</p>
      </div>
    </FadeInItem>
  );
}

const HOMEPAGE_FAQS = [
  {
    question: "What is BSTC?",
    answer:
      "BSTC (Bali Startup & Tech Community) is Southeast Asia's largest founder-led tech community. Founded in October 2023, it connects 2,500+ funded founders, ex-FAANG engineers, VCs, and operators from 40+ countries through high-signal events across Bali and Southeast Asia.",
  },
  {
    question: "Is BSTC free to join?",
    answer:
      "Yes. Joining BSTC is free. You can join the WhatsApp community and RSVP to most networking events at no cost. Some specialised formats like hackathons, founder roundtables, and ticketed editions of How I Build with AI may have a ticket fee to cover venue and operations.",
  },
  {
    question: "Who should join BSTC?",
    answer:
      "Funded founders, engineers, operators, angel investors, and VCs who are actively building or investing. BSTC is curated for signal over noise: no hard selling, no generic networking, no recruiters or service providers using it as a lead list. The average event has 40 to 80 serious builders in the room.",
  },
  {
    question: "Where does BSTC operate?",
    answer:
      "BSTC is headquartered in Canggu, Bali with active nodes in Ubud, Sanur, and Uluwatu. We are the largest founder-led tech community in Southeast Asia and expanding across the region. Members attend from 40+ countries and from across Southeast Asia.",
  },
  {
    question: "What events does BSTC run?",
    answer:
      "Three core formats. (1) Networking Nights: 40 to 80 builders, every third Thursday. (2) How I Build with AI: live AI builds from real practitioners with Intel Drops and Builder Spotlights. (3) Hackathons: one-day builds with team demos and prizes. Cadence is 4 to 6 events per month.",
  },
  {
    question: "How do I join BSTC?",
    answer:
      "Three steps. (1) Join the WhatsApp community to get event announcements. (2) RSVP to your first Networking Night on MeetUp. (3) Show up, introduce yourself, and add value. There is no application process and no membership fee.",
  },
];

export default async function Home() {
  const [allPosts, allEvents] = await Promise.all([
    getAllBlogPosts(),
    getAllEvents(),
  ]);
  const latestPosts = allPosts.slice(0, 3);
  const upcomingEvents = getUpcomingEvents(allEvents).slice(0, 3);
  const faqSchema = getFAQSchema(HOMEPAGE_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-red/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-red/10 rounded-full blur-[120px] opacity-30" />

        <div className="relative max-w-site mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-3xl">
            <FadeIn delay={0.1}>
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
                {SITE.fullName}
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
                Where Southeast Asia&apos;s{" "}
                <span className="text-brand-red">Best Builders</span> Actually
                Show Up
              </h1>
            </FadeIn>
            <FadeIn delay={0.35}>
              <p className="text-lg md:text-xl text-brand-grey max-w-2xl mb-8 leading-relaxed">
                2,500+ founders, engineers, and operators building the future
                from Bali. High-signal events. Zero noise. The community that{" "}
                <span className="text-brand-white">
                  ex-FAANG engineers, funded founders, and VCs
                </span>{" "}
                actually show up to.
              </p>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/join"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
                >
                  Join the Community
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors"
                >
                  See Upcoming Events
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter
              value={STATS.members}
              suffix="+"
              label="Community Members"
            />
            <AnimatedCounter
              value={STATS.events}
              suffix="+"
              label="Events Hosted"
            />
            <AnimatedCounter
              value={STATS.rating}
              suffix="/5"
              label="Average Rating"
            />
            <AnimatedCounter
              value={STATS.countries}
              suffix="+"
              label="Countries Represented"
            />
          </div>
        </div>
      </section>

      {/* Credibility band */}
      <section className="py-16 md:py-20 border-b border-white/5">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-8">
            <p className="text-xs font-medium uppercase tracking-widest text-brand-grey">
              Members building at
            </p>
          </FadeIn>
          <FadeInStagger className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-60 hover:opacity-80 transition-opacity">
            {[
              "Ex-Google",
              "Ex-Meta",
              "Ex-Stripe",
              "Ex-Shopify",
              "Ex-Uber",
              "Ex-Grab",
              "Ex-Sea",
              "Ex-Gojek",
              "YC Alumni",
              "Techstars",
            ].map((org) => (
              <FadeInItem key={org}>
                <span className="text-sm md:text-base font-medium text-brand-white/70 tracking-wide">
                  {org}
                </span>
              </FadeInItem>
            ))}
          </FadeInStagger>
          <FadeIn className="text-center mt-8">
            <p className="text-xs text-brand-grey/60 italic">
              Representing the career backgrounds of active BSTC members.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Flagship Events */}
      <section className="py-20 md:py-28">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              Our Events
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Three Ways to Connect
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              Monthly networking. Live AI builds. Full-day hackathons. Every
              format designed for signal over noise.
            </p>
          </FadeIn>

          <FadeInStagger className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Networking Night",
                desc: "40-80 founders, engineers, and VCs. Open mic intros. Host-facilitated connections. Every 3rd Thursday.",
                image: "/images/events/networking-night.png",
                href: "/events/flagship-networking-night-may-2026",
                badge: "Monthly",
                imagePosition: "object-center",
              },
              {
                title: "How I AI",
                desc: "Live AI builds by real practitioners. Intel Drop. Builder Spotlights. The Money Round. Real tools, real revenue.",
                image: "/images/events/how-i-ai-edition-1.png",
                href: "/how-i-build-with-ai",
                badge: "New Series",
                imagePosition: "object-[center_60%]",
              },
              {
                title: "Hackathon",
                desc: "Build something real in one day. Teams compete to ship products, demo in 3 minutes, and win prizes.",
                image: "/images/events/hackathon-edition-1.png",
                href: "/events/hackathon-edition-1",
                badge: "Coming Soon",
                imagePosition: "object-center",
              },
            ].map((event) => (
              <FadeInItem key={event.title}>
                <Link
                  href={event.href}
                  className="group block rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${event.imagePosition}`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider bg-brand-red/90 text-brand-white px-2 py-1 rounded">
                        {event.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-brand-white group-hover:text-brand-red transition-colors mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-brand-grey line-clamp-3">
                      {event.desc}
                    </p>
                  </div>
                </Link>
              </FadeInItem>
            ))}
          </FadeInStagger>

          <FadeIn className="text-center mt-10">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
            >
              See All Events
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Upcoming Events (dynamic) */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 md:py-20 border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-site mx-auto px-6">
            <FadeIn className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-2">
                  On the calendar
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-bold">
                  Next up in the community
                </h2>
              </div>
              <Link
                href="/events"
                className="text-sm text-brand-red hover:text-brand-white font-medium inline-flex items-center gap-1"
              >
                All events <ArrowRight size={14} />
              </Link>
            </FadeIn>
            <FadeInStagger className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((e) => (
                <FadeInItem key={e.frontmatter.slug}>
                  <Link
                    href={`/events/${e.frontmatter.slug}`}
                    className="group block p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all h-full"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
                      {new Date(e.frontmatter.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <h3 className="text-base font-semibold text-brand-white group-hover:text-brand-red transition-colors mt-2 mb-2">
                      {e.frontmatter.title}
                    </h3>
                    <p className="text-sm text-brand-grey line-clamp-2">
                      {e.frontmatter.description}
                    </p>
                  </Link>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </section>
      )}

      {/* Who's in the Room */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Who&apos;s in the Room
            </h2>
            <p className="text-brand-grey text-sm max-w-lg mx-auto">
              This isn&apos;t a casual meetup. The people who show up are
              building real things.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Startup Founders", pct: "40%" },
              { label: "Engineers & Devs", pct: "25%" },
              { label: "Investors & VCs", pct: "10%" },
              { label: "Operators", pct: "25%" },
            ].map((role) => (
              <FadeInItem key={role.label}>
                <div className="text-center p-4 rounded-lg border border-white/5 bg-white/[0.02]">
                  <div className="text-xl font-display font-bold text-brand-red mb-1">
                    {role.pct}
                  </div>
                  <div className="text-xs text-brand-grey">{role.label}</div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Community Values */}
      <section className="py-20 md:py-28">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What We Stand For
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              These aren&apos;t just words. They&apos;re enforced at every
              event.
            </p>
          </FadeIn>

          <FadeInStagger className="grid md:grid-cols-3 gap-6">
            <ValueCard
              icon={Zap}
              title="Signal > Noise"
              description="Every interaction should add value. We focus on substance over hype, builders over talkers."
            />
            <ValueCard
              icon={Shield}
              title="No Hard Selling"
              description="Build relationships, not transactions. Leave the pitch at the door. Connect authentically."
            />
            <ValueCard
              icon={Users}
              title="Builders First"
              description="We prioritise founders and operators who are actually building things. Doers, not dreamers."
            />
          </FadeInStagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              From the Community
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4">
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
          </FadeIn>

          <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                quote:
                  "This is the first time I've eaten fish in 15 years. Thanks for hosting the night.",
                name: "Tom",
                role: "LinkedIn Agency, $50K+ MRR",
                context: "At a BSTC private dinner",
              },
              {
                quote:
                  "The quality of people in the room is unmatched. I've met more relevant connections at one BSTC event than six months of conferences.",
                name: "BSTC Member",
                role: "SaaS Founder, Series A",
                context: "Networking Night",
              },
              {
                quote:
                  "The 'no hard selling' rule changes everything. You can have real conversations without watching your back. This is how tech events should be.",
                name: "BSTC Member",
                role: "Angel Investor",
                context: "Networking Night",
              },
              {
                quote:
                  "Best tech community I've been part of anywhere in the world. The signal-to-noise ratio is unreal.",
                name: "BSTC Member",
                role: "Ex-FAANG Engineer",
                context: "Regular attendee",
              },
            ].map((testimonial, i) => (
              <FadeInItem key={i}>
                <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:border-brand-red/20 transition-all duration-300 h-full flex flex-col">
                  <p className="text-brand-grey text-sm leading-relaxed mb-4 flex-grow">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-medium text-brand-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-brand-grey">
                      {testimonial.role}
                    </p>
                    {testimonial.context && (
                      <p className="text-[10px] text-brand-red mt-1">
                        {testimonial.context}
                      </p>
                    )}
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Latest from the Blog (dynamic) */}
      <section className="py-20 md:py-28">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Latest from the Blog
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              Operator-written guides on building from Bali and Southeast Asia.
            </p>
          </FadeIn>

          <FadeInStagger className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <FadeInItem key={post.frontmatter.slug}>
                <Link
                  href={`/blog/${post.frontmatter.slug}`}
                  className="group block p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all duration-300 h-full"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
                    {post.frontmatter.category.replace(/-/g, " ")}
                  </span>
                  <h3 className="text-base font-semibold text-brand-white group-hover:text-brand-red transition-colors mt-2 mb-3">
                    {post.frontmatter.title}
                  </h3>
                  {post.frontmatter.readTime && (
                    <span className="text-xs text-brand-grey">
                      {post.frontmatter.readTime}
                    </span>
                  )}
                </Link>
              </FadeInItem>
            ))}
          </FadeInStagger>

          <FadeIn className="text-center mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-red hover:text-brand-white font-medium transition-colors"
            >
              View All Posts
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 md:py-28 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <ScaleIn>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Ready to Join?
            </h2>
            <p className="text-brand-grey max-w-lg mx-auto mb-8">
              Join 2,500+ founders, engineers, and operators building the future
              from Southeast Asia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
              >
                <MessageCircle size={18} />
                Join WhatsApp
              </a>
              <a
                href={SITE.meetup}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors"
              >
                <Calendar size={18} />
                RSVP on MeetUp
              </a>
            </div>
          </ScaleIn>
        </div>
      </section>
    </>
  );
}
