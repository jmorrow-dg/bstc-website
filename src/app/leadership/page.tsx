import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getPersonSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Meet the leaders behind BSTC: Lachlan McRitchie, Josh Morrow, and Matthew Carr. Our tiered leadership model recognises contribution and consistency, not titles.",
  keywords: [
    "BSTC founders",
    "Bali Startup and Tech Community leadership",
    "Lachlan McRitchie",
    "Josh Morrow BSTC",
    "Matthew Carr BSTC",
    "Southeast Asia tech community leaders",
    "Bali tech community organisers",
  ],
};

const FOUNDERS = [
  {
    name: "Lachlan McRitchie",
    role: "Co-founder & Primary Organiser",
    bio: "Built BSTC from the ground up. Runs community operations, governance, and brand strategy.",
    tier: "Founder",
  },
  {
    name: "Josh Morrow",
    role: "Co-founder & Growth Lead",
    bio: "Leads revenue, sponsorships, and the 'How I Build with AI' flagship series. Also runs David & Goliath, an AI growth agency.",
    tier: "Founder",
  },
  {
    name: "Matthew Carr",
    role: "Co-founder & Community Lead",
    bio: "Manages community engagement and event operations across Bali nodes.",
    tier: "Founder",
  },
];

const TIERS = [
  {
    name: "BSTC Lead",
    events: "1-10 Events",
    role: "Event Operator",
    description:
      "Runs approved event formats. Suggests venues and speakers. The starting point of the leadership journey.",
  },
  {
    name: "Senior Lead",
    events: "11-30 Events",
    role: "Event Owner",
    description:
      "Runs recurring event series. Mentors 1-2 BSTC Leads. Proposes pilot improvements.",
  },
  {
    name: "Community Lead",
    events: "31-50 Events",
    role: "Node Builder",
    description:
      "Owns and operates a pilot geography. Manages venue relationships. Co-leads sponsor discussions.",
  },
  {
    name: "Executive Council",
    events: "50+ Events",
    role: "Strategic Steward",
    description:
      "Expansion recommendations. Partnership evaluation. Quality oversight. Strategic advisory.",
  },
];

export default function LeadershipPage() {
  const personSchemas = FOUNDERS.map((f) =>
    getPersonSchema({ name: f.name, role: f.role, bio: f.bio })
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchemas) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Leadership
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Earned Through Contribution
          </h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Leadership at BSTC is earned through contribution and consistency, 
            not titles. We are stewards of culture, operators of experience, and
            protectors of signal.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl font-display font-bold mb-8">Founders</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FOUNDERS.map((person) => (
              <div
                key={person.name}
                className="p-6 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <div className="w-14 h-14 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold text-lg mb-4">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
                  {person.tier}
                </span>
                <h3 className="text-lg font-semibold text-brand-white mt-1 mb-1">
                  {person.name}
                </h3>
                <p className="text-sm text-brand-grey mb-3">{person.role}</p>
                <p className="text-sm text-brand-grey leading-relaxed">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier System */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl font-display font-bold mb-4 text-center">
            Leadership Tiers
          </h2>
          <p className="text-brand-grey text-center mb-12 max-w-xl mx-auto">
            Authority scales slowly to protect quality. Promotion is quarterly,
            never automatic, and based on event count, feedback score (4.3+
            minimum), reporting reliability, and cultural alignment.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className="p-6 rounded-lg border border-white/5 bg-white/[0.02]"
              >
                <div className="text-brand-red font-mono text-xs mb-3">
                  Tier {i + 1}
                </div>
                <h3 className="font-semibold text-brand-white mb-1">
                  {tier.name}
                </h3>
                <p className="text-xs text-brand-red mb-1">{tier.events}</p>
                <p className="text-xs text-brand-grey mb-3">{tier.role}</p>
                <p className="text-sm text-brand-grey leading-relaxed">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Leader */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Want to Lead?
          </h2>
          <p className="text-brand-grey max-w-lg mx-auto mb-8">
            Attend 5+ events. Add value. Express interest. Co-host a trial
            event. Get approved by founders. It starts with showing up.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            Join the Community First
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
