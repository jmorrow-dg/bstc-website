"use client";

import Link from "next/link";
import {
  ArrowRight,
  Users,
  Calendar,
  Globe,
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
  SlideInLeft,
  SlideInRight,
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

      {/* Flagship Networking Night */}
      <section className="py-20 md:py-28 border-b border-white/5">
        <div className="max-w-site mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <SlideInLeft className="order-2 md:order-1">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-brand-red/10 via-brand-charcoal to-brand-charcoal flex items-center justify-center">
                <div className="text-center p-8">
                  <p
                    className="text-brand-red font-bold text-3xl tracking-tight mb-1"
                    style={{ fontFamily: "Impact, sans-serif" }}
                  >
                    BSTC
                  </p>
                  <p
                    className="text-brand-white font-bold text-xl tracking-tight mb-4"
                    style={{ fontFamily: "Impact, sans-serif" }}
                  >
                    NETWORKING NIGHT
                  </p>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                    <span className="text-5xl">&#127758;</span>
                  </div>
                  <p className="text-brand-grey text-xs uppercase tracking-widest">
                    GTA-Style Cover Art Coming Soon
                  </p>
                  <p className="text-brand-red text-xs mt-2">
                    3rd Thursday &middot; Every Month &middot; Yema Kitchen
                  </p>
                </div>
              </div>
            </SlideInLeft>

            <SlideInRight className="order-1 md:order-2">
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
                Flagship Monthly Event
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Networking Night
              </h2>
              <p className="text-brand-grey mb-6 leading-relaxed">
                The beating heart of BSTC. Every 3rd Thursday, 40-80 founders,
                engineers, investors, and operators gather at Yema Kitchen in
                Canggu. Open mic intros, host-facilitated connections, and the
                highest-signal room in Bali.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Free entry — always",
                  "60-second intros — sharp and respectful",
                  "Host connects you with the right people",
                  "No hard selling — enforced, not suggested",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-brand-grey"
                  >
                    <span className="text-brand-red mt-0.5">&#9656;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.meetup.com/bali-start-ups-tech-community/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm"
                >
                  <Calendar size={16} />
                  RSVP on MeetUp
                </a>
                <Link
                  href="/events/flagship-networking-night-may-2026"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
                >
                  Learn More
                  <ArrowRight size={14} />
                </Link>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Who's in the Room */}
      <section className="py-20 md:py-28">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Who&apos;s in the Room
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              This isn&apos;t a casual meetup. The people who show up are
              building real things.
            </p>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                label: "Startup Founders",
                detail: "Pre-seed to Series C",
                pct: "40%",
              },
              {
                icon: Globe,
                label: "Engineers & Devs",
                detail: "Including ex-FAANG",
                pct: "25%",
              },
              {
                icon: Users,
                label: "Investors",
                detail: "VCs, Angels, Family Offices",
                pct: "10%",
              },
              {
                icon: Shield,
                label: "Operators",
                detail: "C-suite & VP-level",
                pct: "25%",
              },
            ].map((role) => (
              <FadeInItem key={role.label}>
                <div className="text-center p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:border-brand-red/20 transition-all duration-300">
                  <role.icon className="w-6 h-6 text-brand-red mx-auto mb-3" />
                  <div className="text-2xl font-display font-bold text-brand-red mb-1">
                    {role.pct}
                  </div>
                  <div className="font-medium text-brand-white text-sm">
                    {role.label}
                  </div>
                  <div className="text-xs text-brand-grey mt-1">
                    {role.detail}
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* How I Build with AI Feature */}
      <section className="py-20 md:py-28 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-site mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <SlideInLeft>
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
                Flagship Series
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                How I Build with AI
              </h2>
              <p className="text-brand-grey mb-6 leading-relaxed">
                Watch real builders share their actual AI workflows. Live demos.
                Real tools. Real products. No slides, no theory — just
                practitioners showing how they ship.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "AI Intel Drop — top stories, fast and opinionated",
                  "Builder Spotlights — real tools, real revenue",
                  "The Money Round — who made money with AI this month?",
                  "Every session recorded for podcast & video",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-brand-grey"
                  >
                    <span className="text-brand-red mt-0.5">&#9656;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/how-i-build-with-ai"
                className="inline-flex items-center gap-2 text-brand-red hover:text-brand-white font-medium transition-colors"
              >
                View All Episodes
                <ArrowRight size={16} />
              </Link>
            </SlideInLeft>
            <SlideInRight>
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-brand-red/5 via-brand-charcoal to-brand-charcoal flex items-center justify-center">
                <div className="text-center p-8">
                  <p
                    className="text-brand-red font-bold text-4xl tracking-tight mb-1"
                    style={{ fontFamily: "Impact, sans-serif" }}
                  >
                    HOW I AI
                  </p>
                  <p className="text-brand-white text-sm mb-4">Edition #1</p>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                    <span className="text-5xl">&#x1F916;</span>
                  </div>
                  <p className="text-brand-grey text-xs uppercase tracking-widest">
                    GTA-Style Cover Art Coming Soon
                  </p>
                  <p className="text-brand-red text-xs mt-2">
                    Seoul Seoul Project &middot; Canggu
                  </p>
                </div>
              </div>
            </SlideInRight>
          </div>
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

      {/* Join CTA */}
      <section className="py-20 md:py-28">
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
