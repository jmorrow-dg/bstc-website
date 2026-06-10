import { Metadata } from "next";
import { Handshake, Target, Users } from "lucide-react";
import InvestorForm from "@/components/forms/InvestorForm";
import { STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "For Investors & VCs",
  description:
    "Get curated dealflow from Southeast Asia's largest founder-led tech community. 2,500+ members, 40% startup founders. Meet vetted startups in person in Bali — before everyone else does.",
  keywords: [
    "Southeast Asia dealflow",
    "Bali startups investment",
    "VC dealflow Indonesia",
    "angel investing Southeast Asia",
    "startup scouting Bali",
    "pre-seed deals SEA",
    "BSTC investors",
  ],
  openGraph: {
    title: "For Investors & VCs | Bali Startup & Tech Community",
    description:
      "Curated dealflow from 2,500+ builders in Southeast Asia's largest founder-led tech community.",
    type: "website",
  },
};

export default function InvestorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              For Investors
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Dealflow From the Room Where{" "}
              <span className="text-brand-red">Builders Actually Are</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed">
              {STATS.members.toLocaleString()}+ members. 40% startup founders.
              Funded teams, ex-FAANG engineers, and bootstrapped operators
              building from Bali and across Southeast Asia. Join the investor
              list and we&apos;ll connect you with startups that match your
              thesis — in person, before they hit anyone else&apos;s radar.
            </p>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Curated, Not Cold",
                desc: "Tell us your thesis — stage, sectors, check size — and we surface matching founders from the community instead of an inbox full of cold decks.",
              },
              {
                icon: Users,
                title: "Meet Founders in Person",
                desc: "Monthly networking nights with 40-80 serious builders, founder roundtables, and hackathons. See how founders actually operate before you invest.",
              },
              {
                icon: Handshake,
                title: "Warm Intros Both Ways",
                desc: "We broker the introduction only when there's a genuine fit. No spray-and-pray. Signal over noise applies to dealflow too.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <item.icon className="w-5 h-5 text-brand-red mb-4" />
                <h3 className="font-semibold text-brand-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-grey leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                Join the Investor List
              </h2>
              <p className="text-brand-grey">
                Free for active investors. Takes 60 seconds.
              </p>
            </div>
            <InvestorForm />
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <p className="text-sm text-brand-grey">
            {STATS.members.toLocaleString()}+ members &middot; {STATS.events}+
            events hosted &middot; {STATS.rating}/5 rated &middot; Members from{" "}
            {STATS.countries}+ countries
          </p>
        </div>
      </section>
    </>
  );
}
