import { Metadata } from "next";
import { Rocket, Search, Zap } from "lucide-react";
import StartupForm from "@/components/forms/StartupForm";
import { STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "For Startups Raising Capital",
  description:
    "Get connected to angels and VCs through Southeast Asia's largest founder-led tech community. Warm intros to investors who match your stage and sector — no cold emails.",
  keywords: [
    "raise capital Southeast Asia",
    "Bali startup funding",
    "find investors Indonesia",
    "pre-seed funding SEA",
    "VC intro Southeast Asia",
    "startup fundraising Bali",
    "BSTC startups",
  ],
  openGraph: {
    title: "For Startups | Bali Startup & Tech Community",
    description:
      "Warm intros to angels and VCs who match your stage and sector. From the community where investors actually show up.",
    type: "website",
  },
};

export default function StartupsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              For Startups
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Meet Investors Who{" "}
              <span className="text-brand-red">Actually Show Up</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed">
              Angels, VCs, and family offices are in the BSTC room every month
              — 10% of our {STATS.members.toLocaleString()}+ members are
              investors. Tell us what you&apos;re building and we&apos;ll make
              the warm intro when there&apos;s a genuine fit. No cold emails,
              no pitch-deck black holes.
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
                icon: Search,
                title: "Matched to Your Stage",
                desc: "We match you against investor theses in the community — stage, sector, and check size — so intros land with investors who actually write your kind of cheque.",
              },
              {
                icon: Zap,
                title: "Warm Intros Only",
                desc: "An intro from the community that runs the room beats a cold email every time. We only connect both sides when there's mutual interest.",
              },
              {
                icon: Rocket,
                title: "Build Your Reputation First",
                desc: "Demo at hackathons, share your build at How I Build with AI, meet investors at networking nights. Fundraising is easier when they already know you ship.",
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
                Join the Startup Pipeline
              </h2>
              <p className="text-brand-grey">
                Free for founders. Takes 90 seconds.
              </p>
            </div>
            <StartupForm />
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <p className="text-sm text-brand-grey">
            {STATS.members.toLocaleString()}+ members &middot; 10% investors
            &middot; {STATS.events}+ events hosted &middot; {STATS.rating}/5
            rated
          </p>
        </div>
      </section>
    </>
  );
}
