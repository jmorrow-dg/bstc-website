"use client";

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
import { motion } from "framer-motion";
import { SITE, STATS } from "@/lib/constants";
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

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-red/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-red/10 rounded-full blur-[120px] opacity-30" />

        <div className="relative max-w-site mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4"
            >
              {SITE.fullName}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6"
            >
              Where Southeast Asia&apos;s{" "}
              <span className="text-brand-red">Builders</span> Connect
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg md:text-xl text-brand-grey max-w-2xl mb-8 leading-relaxed"
            >
              2,500+ founders, engineers, and operators building the future from
              Bali. High-signal events. Zero noise. The community that{" "}
              <span className="text-brand-white">
                ex-FAANG engineers, funded founders, and VCs
              </span>{" "}
              actually show up to.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
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
            </motion.div>
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
                  <div className="relative aspect-[3/2] overflow-hidden">
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
          </FadeIn>

          <FadeInStagger className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The highest-signal tech community I've been part of. No fluff, just real builders helping each other.",
                name: "Community Member",
                role: "Startup Founder",
              },
              {
                quote:
                  "I've met more relevant connections at one BSTC event than six months of conferences.",
                name: "Community Member",
                role: "Software Engineer",
              },
              {
                quote:
                  "The 'no hard selling' rule makes all the difference. You can actually have real conversations here.",
                name: "Community Member",
                role: "VC Partner",
              },
            ].map((testimonial, i) => (
              <FadeInItem key={i}>
                <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:border-brand-red/20 transition-all duration-300">
                  <p className="text-brand-grey text-sm leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-medium text-brand-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-brand-grey">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Latest from the Blog */}
      <section className="py-20 md:py-28">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Latest from the Blog
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              Thought leadership on Bali&apos;s tech ecosystem, AI, and the
              future of building in Southeast Asia.
            </p>
          </FadeIn>

          <FadeInStagger className="grid md:grid-cols-3 gap-6">
            {[
              {
                title:
                  "Bali's Tech Ecosystem in 2026: Why the World's Best Builders Are Moving Here",
                slug: "bali-tech-ecosystem-2026-guide",
                category: "Bali Tech Scene",
                readTime: "8 min read",
              },
              {
                title:
                  "The State of AI in Southeast Asia: Where the Opportunities Are",
                slug: "state-of-ai-southeast-asia-2026",
                category: "Thought Leadership",
                readTime: "9 min read",
              },
              {
                title:
                  "How Founders Are Actually Making Money with AI in 2026",
                slug: "making-money-with-ai-2026",
                category: "Thought Leadership",
                readTime: "7 min read",
              },
            ].map((post) => (
              <FadeInItem key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all duration-300 h-full"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
                    {post.category}
                  </span>
                  <h3 className="text-base font-semibold text-brand-white group-hover:text-brand-red transition-colors mt-2 mb-3">
                    {post.title}
                  </h3>
                  <span className="text-xs text-brand-grey">
                    {post.readTime}
                  </span>
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
