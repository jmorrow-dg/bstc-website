import Link from "next/link";
import { Metadata } from "next";
import {
  MessageCircle,
  ArrowRight,
  Wallet,
  Smartphone,
  QrCode,
  Star,
  Check,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { FadeIn } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "BSTC Member Card",
  description:
    "Your BSTC community member card. Show it at partner venues across Canggu to claim member perks. Apple Wallet and Google Wallet coming soon.",
  alternates: { canonical: `${SITE.url}/card` },
};

const STEPS = [
  {
    title: "Join the community",
    blurb:
      "Sign up once. You're in the BSTC WhatsApp community and on the member list.",
  },
  {
    title: "Get your card",
    blurb:
      "Your digital member card, ready to save to your phone. Apple and Google Wallet support is on the way.",
  },
  {
    title: "Show it at venues",
    blurb:
      "Flash the card at a partner cafe, gym, or coworking space to claim the member perk. Codes stay in WhatsApp.",
  },
];

export default function MemberCardPage() {
  return (
    <>
      {/* Hero + card */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Copy */}
            <FadeIn>
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
                Member Card
              </p>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-[1.08]">
                One card.
                <br />
                <span className="text-brand-red">Every member perk.</span>
              </h1>
              <p className="text-lg text-brand-grey leading-relaxed mb-8">
                Your BSTC member card is how you claim perks at partner venues
                across Canggu. Show it at the counter, get the member rate. The
                discount code stays in the WhatsApp community.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm glow-red"
                >
                  <MessageCircle size={16} />
                  Join to get your card
                </Link>
                <Link
                  href="/welcome"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
                >
                  See the perks
                  <ArrowRight size={14} />
                </Link>
              </div>
            </FadeIn>

            {/* The card */}
            <FadeIn>
              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute -inset-6 bg-brand-red/10 blur-3xl rounded-full" />
                <div className="relative aspect-[1.586/1] rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c1c1c] to-[#0e0e0e] p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
                  {/* glow accent */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-red/20 blur-2xl rounded-full" />
                  {/* top row */}
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="font-display font-bold text-xl tracking-tight text-brand-white">
                        BSTC
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-brand-grey mt-0.5">
                        Community Member
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-brand-red bg-brand-red/10 border border-brand-red/30 px-2 py-0.5 rounded">
                      <Star size={10} />
                      Member
                    </span>
                  </div>
                  {/* name */}
                  <div className="relative">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-grey mb-1">
                      Member
                    </p>
                    <p className="font-display text-2xl text-brand-white leading-none">
                      Your Name
                    </p>
                  </div>
                  {/* bottom row */}
                  <div className="relative flex items-end justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-brand-grey mb-1">
                        Member since
                      </p>
                      <p className="font-mono text-sm text-brand-white/90">
                        2026 &middot; BSTC&middot;0000
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center text-brand-grey">
                      <QrCode size={28} />
                    </div>
                  </div>
                </div>

                {/* wallet buttons (phase 2 placeholders) */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <span className="relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-brand-white/80 text-xs font-medium cursor-default">
                    <Smartphone size={15} />
                    Apple Wallet
                    <span className="absolute -top-2 -right-2 text-[8px] font-mono uppercase tracking-wider text-brand-red bg-brand-charcoal border border-brand-red/30 px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  </span>
                  <span className="relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-brand-white/80 text-xs font-medium cursor-default">
                    <Wallet size={15} />
                    Google Wallet
                    <span className="absolute -top-2 -right-2 text-[8px] font-mono uppercase tracking-wider text-brand-red bg-brand-charcoal border border-brand-red/30 px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  </span>
                </div>
                <p className="mt-3 text-center text-[11px] text-brand-grey">
                  Card design preview. Name and code populate when you join.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              How it works
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              Three steps from landing in Bali to claiming your first perk.
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="p-6 rounded-lg border border-white/5 bg-white/[0.02] h-full"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-brand-red/40 text-brand-red font-mono text-sm mb-4">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-brand-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-brand-grey leading-relaxed">
                  {step.blurb}
                </p>
              </div>
            ))}
          </div>
          <FadeIn className="max-w-2xl mx-auto mt-10 flex items-start gap-3 text-sm text-brand-grey">
            <Check size={16} className="text-brand-red flex-shrink-0 mt-0.5" />
            <p>
              The card proves you&apos;re a member so venue staff can apply the
              perk on the spot. The actual discount code is always shared inside
              the WhatsApp community, never printed on the card.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6 text-center">
          <FadeIn className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Get your card,
              <br />
              <span className="text-brand-red">start claiming perks.</span>
            </h2>
            <p className="text-brand-grey mb-8 max-w-lg mx-auto leading-relaxed">
              Join the community, save your member card, and use it the next time
              you work, train, or eat at a partner venue.
            </p>
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
            >
              <MessageCircle size={18} />
              Join the community
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
