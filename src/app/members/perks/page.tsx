import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ExternalLink, MapPin, Sparkles } from "lucide-react";
import { isMember } from "@/lib/members";
import { getAllPerks, PerkFrontmatter, ContentItem } from "@/lib/content";

export const metadata: Metadata = {
  title: "Member Discounts",
  description: "Member-only discounts on local spots and the software & AI tools founders use.",
};

const GROUPS: { key: PerkFrontmatter["category"]; label: string; blurb: string; icon: typeof MapPin }[] = [
  {
    key: "local",
    label: "Local",
    blurb: "Gyms, cafes, restaurants, and coworking spaces around Bali.",
    icon: MapPin,
  },
  {
    key: "software",
    label: "Software & AI tools",
    blurb: "Domains and hosting, AI tools, fintech, and the rest of the builder stack.",
    icon: Sparkles,
  },
];

function PerkCard({ perk }: { perk: ContentItem<PerkFrontmatter> }) {
  const p = perk.frontmatter;
  const isLive = p.status !== "coming-soon";
  const inner = (
    <>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-brand-white group-hover:text-brand-red transition-colors text-sm">
          {p.title}
        </h3>
        <span
          className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
            isLive ? "text-brand-red bg-brand-red/10" : "text-brand-grey bg-white/5"
          }`}
        >
          {isLive ? "Live" : "Soon"}
        </span>
      </div>
      <p className="text-brand-white text-sm font-medium mb-1">{p.offer}</p>
      {p.code && isLive && (
        <p className="text-xs text-brand-grey">
          Code: <span className="text-brand-red font-mono">{p.code}</span>
        </p>
      )}
      {isLive && p.url && (
        <span className="inline-flex items-center gap-1 text-xs text-brand-red mt-2">
          Claim <ExternalLink size={11} />
        </span>
      )}
    </>
  );
  return isLive && p.url ? (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all"
    >
      {inner}
    </a>
  ) : (
    <div className="p-5 rounded-lg border border-white/5 bg-white/[0.02]">{inner}</div>
  );
}

export default async function PerksPage() {
  if (!isMember()) redirect("/members");
  const all = await getAllPerks();

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Member discounts
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Discounts &amp; perks</h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Member-only deals we&apos;re securing on the local spots and the software you use every
            day. Partnerships are in progress, more landing soon.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6 space-y-12">
          {GROUPS.map((g) => {
            const perks = all.filter((p) => p.frontmatter.category === g.key);
            return (
              <div key={g.key}>
                <div className="flex items-center gap-3 mb-2">
                  <g.icon className="w-5 h-5 text-brand-red" />
                  <h2 className="text-xl font-display font-bold text-brand-white">{g.label}</h2>
                </div>
                <p className="text-sm text-brand-grey mb-6">{g.blurb}</p>
                {perks.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {perks.map((perk) => (
                      <PerkCard key={perk.frontmatter.slug} perk={perk} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-6 text-sm text-brand-grey">
                    Discounts coming soon. We&apos;re securing partnerships now.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
