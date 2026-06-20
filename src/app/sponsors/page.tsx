import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Users,
  MessageCircle,
  Mic,
  Mail,
  FileText,
  Utensils,
  ExternalLink,
} from "lucide-react";
import { SITE, STATS, SPONSOR_CONFIG } from "@/lib/constants";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Sponsor BSTC — Reach Southeast Asia's Top Founder Community",
  description:
    "Reach 100+ SEA founders, operators, and VCs every week. Event, quarterly, and annual sponsor packages from $2,000.",
  alternates: { canonical: `${SITE.url}/sponsors` },
};

const TIERS = [
  {
    id: "event",
    slug: "supporting",
    name: "Supporting Sponsor",
    commitment: "Per Event",
    price: SPONSOR_CONFIG.tiers.event.price,
    period: SPONSOR_CONFIG.tiers.event.period,
    description: "Targeted single-event exposure to our builder audience.",
    includes: [
      "Logo on MeetUp event page",
      "60-second on-stage mention by host",
      "Optional table presence at event",
      "Recap recognition (WhatsApp + LinkedIn)",
      "Logo on /sponsors page",
    ],
    featured: false,
  },
  {
    id: "quarterly",
    slug: "community",
    name: "Community Partner",
    commitment: "Quarterly",
    price: SPONSOR_CONFIG.tiers.quarterly.price,
    period: SPONSOR_CONFIG.tiers.quarterly.period,
    description:
      "Sustained presence and deeper integration across a full quarter.",
    includes: [
      "Everything in Supporting",
      "8 events per quarter",
      "Quarterly value-driven talk (10–15 min)",
      "Dedicated social feature post",
      "Founder dinner co-host (1 per quarter)",
      "Co-authored case study on the BSTC blog",
      "Post-event sponsor report",
    ],
    featured: true,
  },
  {
    id: "annual",
    slug: "strategic",
    name: "Strategic Partner",
    commitment: "Annual",
    price: SPONSOR_CONFIG.tiers.annual.price,
    period: SPONSOR_CONFIG.tiers.annual.period,
    description:
      "Own a category in the BSTC ecosystem with year-round, exclusive presence.",
    includes: [
      "Everything in Community Partner ×4",
      "Category exclusivity (one per vertical)",
      "Naming rights on a recurring series",
      "Podcast pre-roll (full year)",
      "Quarterly strategy sessions with founders",
      "Annual Summit presence",
      "Custom activations",
    ],
    featured: false,
    limit: "Limited to 2 per year",
  },
];

const CHANNELS = [
  {
    icon: Users,
    title: "Live Events",
    metric: "2× weekly",
    body: "100+ founders, operators, and VCs in the room every week — Networking Nights and \"How I AI\" sessions.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Community",
    metric: "1,200+ members",
    body: "Daily-active group of SEA-based founders, engineers, and investors.",
  },
  {
    icon: Mic,
    title: "Podcast",
    metric: "Launching Q2 2026",
    body: "Founder interviews recorded at BSTC events. Pre-roll and per-episode placements available.",
  },
  {
    icon: Mail,
    title: "BSTC Weekly",
    metric: "Launching Q2 2026",
    body: "Curated weekly newsletter for the BSTC audience. Sponsor slot in every issue.",
  },
  {
    icon: FileText,
    title: "Blog & SEO",
    metric: "30+ SEA founder guides",
    body: "Top-ranking content read by SEA founders researching VCs, taxes, hiring, and more.",
  },
  {
    icon: Utensils,
    title: "Founder Dinners",
    metric: "8–12 / quarter",
    body: "Invite-only, 12-seat dinners with funded founders. Co-host slots reserved for partners.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The quality of people in the room is unmatched. I've met more relevant connections at one BSTC event than six months of conferences.",
    name: "BSTC Member",
    role: "SaaS Founder, Series A",
  },
  {
    quote:
      "Thank you very much Bali Startup and Tech for being one of the best tech communities in Bali. Super social and community vibe — so needed especially when everyone is scaling with AI.",
    name: "Mia",
    role: "Founder / CEO",
  },
  {
    quote:
      "The 'no hard selling' rule changes everything. You can have real conversations without watching your back.",
    name: "BSTC Member",
    role: "Angel Investor",
  },
];

const FAQS = [
  {
    q: "Can we sponsor a single specific event?",
    a: "Yes. Supporting Sponsor packages are per-event and let you choose which Networking Night or \"How I AI\" session to attach to.",
  },
  {
    q: "Is the attendee list shareable?",
    a: "Opt-in only. We share contact details for attendees who explicitly consent at registration.",
  },
  {
    q: "What's the typical sponsor profile?",
    a: "VC funds, B2B SaaS targeting founders, dev tools, infrastructure, fintech, and SEA-resident services (legal, banking, coworking).",
  },
  {
    q: "Do you offer category exclusivity?",
    a: "Yes — included in the Strategic Partner tier. Limited to 2 partners per year, one per vertical.",
  },
  {
    q: "Can we co-create content?",
    a: "Yes. Community Partner and Strategic Partner tiers include co-created content (podcast episodes, dinner topics, blog case studies).",
  },
  {
    q: "What's the lead time?",
    a: "2–4 weeks for event sponsorship, 6+ weeks for quarterly partnerships.",
  },
  {
    q: "What are the payment terms?",
    a: "50% on signature, 50% on activation start. Annual partners can elect quarterly billing.",
  },
  {
    q: "Can we get a custom package?",
    a: "Anything outside these tiers — book an intro call and we'll tailor it.",
  },
];

const formatPrice = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const ctaHref = (tierSlug?: string) => {
  if (SPONSOR_CONFIG.calUrl) return SPONSOR_CONFIG.calUrl;
  return tierSlug ? `/sponsors/apply?tier=${tierSlug}` : "/sponsors/apply";
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function SponsorsPage() {
  const press = SPONSOR_CONFIG.press;
  const partners = SPONSOR_CONFIG.partners;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              Partnerships
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-[1.05]">
              Reach Southeast Asia&apos;s
              <br />
              <span className="text-brand-red">Highest-Signal Founder Community.</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed mb-8">
              Two weekly events. {STATS.members.toLocaleString()}+ community members. 1,200+ operators on
              WhatsApp. Podcast and newsletter launching Q2 2026. Founders, VCs,
              and senior engineers building across SEA.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#tiers"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm glow-red"
              >
                See sponsor tiers
                <ArrowRight size={14} />
              </a>
              <a
                href={ctaHref()}
                target={SPONSOR_CONFIG.calUrl ? "_blank" : undefined}
                rel={SPONSOR_CONFIG.calUrl ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
              >
                Book an intro call
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-xs text-brand-grey">
              <span className="flex items-center gap-1">
                <span className="text-brand-red">★★★★★</span>
                <span>{STATS.rating}/5 from 116 MeetUp reviews</span>
              </span>
              <span>·</span>
              <span>100+ attendees / week</span>
              <span>·</span>
              <span>{STATS.countries}+ countries represented</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats band */}
      <section className="pb-16">
        <div className="max-w-site mx-auto px-6">
          <FadeInStagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: `${STATS.members.toLocaleString()}+`, label: "Community Members" },
              { num: "1,200+", label: "WhatsApp Members" },
              { num: "100+", label: "Per-Week Attendance" },
              { num: `${STATS.rating}★`, label: "/116 MeetUp Reviews" },
            ].map((s) => (
              <FadeInItem key={s.label}>
                <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] text-center hover:border-brand-red/20 transition-colors h-full">
                  <div className="text-3xl md:text-4xl font-display font-bold text-brand-white">
                    {s.num}
                  </div>
                  <div className="text-xs text-brand-grey mt-2">{s.label}</div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* As featured in (press) — only renders if configured */}
      {press.title && (
        <section className="pb-16">
          <div className="max-w-site mx-auto px-6">
            <FadeIn>
              <p className="text-xs uppercase tracking-widest text-brand-grey text-center mb-4">
                As featured in
              </p>
              {press.url ? (
                <a
                  href={press.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block max-w-2xl mx-auto p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:border-brand-red/30 transition-colors text-center"
                >
                  {press.quote && (
                    <p className="text-brand-grey italic mb-3 text-sm">
                      &ldquo;{press.quote}&rdquo;
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-brand-white font-medium text-sm">
                    {press.title}
                    <ExternalLink size={12} className="text-brand-red" />
                  </span>
                </a>
              ) : (
                <div className="block max-w-2xl mx-auto p-6 rounded-lg border border-white/5 bg-white/[0.02] text-center">
                  {press.quote && (
                    <p className="text-brand-grey italic mb-3 text-sm">
                      &ldquo;{press.quote}&rdquo;
                    </p>
                  )}
                  <span className="text-brand-white font-medium text-sm">
                    {press.title}
                  </span>
                </div>
              )}
            </FadeIn>
          </div>
        </section>
      )}

      {/* Trusted by (partners) */}
      {partners.length > 0 && (
        <section className="pb-16">
          <div className="max-w-site mx-auto px-6">
            <FadeIn>
              <p className="text-xs uppercase tracking-widest text-brand-grey text-center mb-6">
                Trusted by
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {partners.map((p) => {
                  const inner = p.logoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logoSrc}
                      alt={p.name}
                      className="h-8 md:h-10 opacity-70 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <span className="font-display font-semibold text-xl md:text-2xl text-brand-white/80 hover:text-brand-white transition-colors tracking-tight">
                      {p.name}
                    </span>
                  );
                  return p.url ? (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.name}
                    >
                      {inner}
                    </a>
                  ) : (
                    <span key={p.name}>{inner}</span>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Audience breakdown */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Who&apos;s in the room
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              The audience you&apos;re actually buying access to.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
              <p className="text-xs uppercase tracking-widest text-brand-red mb-4">
                Who attends
              </p>
              <ul className="space-y-3 text-sm">
                {[
                  { pct: "40%", label: "Startup founders" },
                  { pct: "25%", label: "Senior engineers / PMs" },
                  { pct: "15%", label: "Investors & angels" },
                  { pct: "20%", label: "Operators & advisors" },
                ].map((row) => (
                  <li key={row.label} className="flex items-center justify-between">
                    <span className="text-brand-white">{row.label}</span>
                    <span className="text-brand-red font-display font-semibold">
                      {row.pct}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02]">
              <p className="text-xs uppercase tracking-widest text-brand-red mb-4">
                What they do
              </p>
              <ul className="space-y-3 text-sm text-brand-grey">
                <li>Pre-seed → Series B founders</li>
                <li>SaaS, AI, fintech, e-commerce, dev tools</li>
                <li>$50k–$5M+ MRR brackets</li>
                <li>Building for SEA + global markets</li>
                <li>Based across {STATS.countries}+ countries</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Channels you reach */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              The channels you reach
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              Six surfaces where your brand can integrate naturally — not as a banner.
            </p>
          </FadeIn>

          <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHANNELS.map((c) => {
              const Icon = c.icon;
              return (
                <FadeInItem key={c.title}>
                  <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:border-brand-red/20 transition-colors h-full">
                    <Icon className="w-5 h-5 text-brand-red mb-4" />
                    <h3 className="text-base font-semibold text-brand-white mb-1">
                      {c.title}
                    </h3>
                    <p className="text-xs text-brand-red mb-3 font-medium">
                      {c.metric}
                    </p>
                    <p className="text-sm text-brand-grey leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                </FadeInItem>
              );
            })}
          </FadeInStagger>
        </div>
      </section>

      {/* Why BSTC — kept from prior page, reframed */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Why sponsor BSTC
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto mb-12">
              We&apos;re not a conference. We&apos;re a recurring weekly community —
              52 chances to engage instead of one.
            </p>
          </FadeIn>
          <FadeInStagger className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
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
                before: "One-time conference exposure",
                after: "Recurring weekly community presence",
              },
              {
                before: "No feedback loop",
                after: "Direct attendee interaction + post-event reports",
              },
            ].map((row, i) => (
              <FadeInItem key={i}>
                <div className="p-5 rounded-lg border border-white/5 bg-white/[0.02] h-full">
                  <p className="text-sm text-brand-grey line-through mb-1">
                    {row.before}
                  </p>
                  <p className="text-sm text-brand-white font-medium">
                    {row.after}
                  </p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="py-16 md:py-24 scroll-mt-24">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Sponsorship tiers
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              Pricing visible, no haggling. Custom packages also available.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`p-6 rounded-lg border flex flex-col relative ${
                  tier.featured
                    ? "border-brand-red/40 bg-brand-red/5"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-6 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-white bg-brand-red rounded">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-brand-white mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-brand-red mb-4">{tier.commitment}</p>

                <div className="mb-4">
                  <span className="text-3xl font-display font-bold text-brand-white">
                    {formatPrice(tier.price)}
                  </span>
                  <span className="text-sm text-brand-grey ml-2">{tier.period}</span>
                  {tier.limit && (
                    <p className="text-xs text-brand-grey mt-1">{tier.limit}</p>
                  )}
                </div>

                <p className="text-sm text-brand-grey mb-6">{tier.description}</p>
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
                <a
                  href={ctaHref(tier.slug)}
                  target={SPONSOR_CONFIG.calUrl ? "_blank" : undefined}
                  rel={SPONSOR_CONFIG.calUrl ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium rounded transition-colors text-sm ${
                    tier.featured
                      ? "bg-brand-red hover:bg-brand-red-dark text-brand-white"
                      : "border border-white/10 hover:border-white/20 text-brand-white"
                  }`}
                >
                  {SPONSOR_CONFIG.calUrl ? "Book a call" : "Inquire"}
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>

          <p className="text-xs text-brand-grey text-center mt-8 max-w-2xl mx-auto">
            All tiers include sponsor logo on /sponsors, mention in event recap
            posts, and a quarterly performance report.
          </p>
        </div>
      </section>

      {/* HIWA Series Sponsor — premium spotlight */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <FadeIn>
            <div className="max-w-3xl mx-auto p-8 rounded-lg border border-brand-red/20 bg-brand-red/5">
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-3">
                Premium opportunity
              </p>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-white mb-4">
                &ldquo;How I Build with AI&rdquo; series sponsor
              </h3>
              <p className="text-brand-grey mb-6 leading-relaxed">
                Be the presenting sponsor of BSTC&apos;s most content-rich event
                format. Every session generates video clips, podcast episodes,
                blog posts, and social content — all co-branded with your logo.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Presenting sponsor: "How I Build with AI, presented by [You]"',
                  "Logo on all content — videos, podcast, blog, social",
                  "Product featured in builds (when authentic and relevant)",
                  "One season = 6–12 sessions of branded content",
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
              <a
                href={ctaHref("hiwa")}
                target={SPONSOR_CONFIG.calUrl ? "_blank" : undefined}
                rel={SPONSOR_CONFIG.calUrl ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm"
              >
                Enquire about series sponsorship
                <ArrowRight size={14} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              What the room says
            </h2>
          </FadeIn>
          <FadeInStagger className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <FadeInItem key={i}>
                <div className="p-6 rounded-lg border border-white/5 bg-white/[0.02] h-full flex flex-col">
                  <p className="text-sm text-brand-grey leading-relaxed mb-4 flex-grow">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-medium text-brand-white">{t.name}</p>
                    <p className="text-xs text-brand-grey">{t.role}</p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Frequently asked
            </h2>
          </FadeIn>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-medium text-brand-white">
                    {f.q}
                  </span>
                  <span className="text-brand-red text-lg group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-sm text-brand-grey mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Let&apos;s build something
              <br />
              <span className="text-brand-red">memorable in SEA.</span>
            </h2>
            <p className="text-brand-grey mb-8 max-w-xl mx-auto leading-relaxed">
              Tell us about your goals. We&apos;ll come back within 48 hours
              with a tailored package.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={ctaHref()}
                target={SPONSOR_CONFIG.calUrl ? "_blank" : undefined}
                rel={SPONSOR_CONFIG.calUrl ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm glow-red"
              >
                {SPONSOR_CONFIG.calUrl ? "Book an intro call" : "Submit an inquiry"}
                <ArrowRight size={14} />
              </a>
              {SPONSOR_CONFIG.calUrl && (
                <Link
                  href="/sponsors/apply"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
                >
                  Send a detailed brief
                </Link>
              )}
            </div>
            <p className="text-xs text-brand-grey mt-6">
              Or email{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-brand-white hover:text-brand-red transition-colors"
              >
                {SITE.email}
              </a>
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
