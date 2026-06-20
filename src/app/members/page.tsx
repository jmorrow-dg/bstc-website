import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, Users, MapPin, Scale, Tag, ArrowRight, Check, Lock } from "lucide-react";
import { isMember } from "@/lib/members";
import MemberUnlockForm from "@/components/members/MemberUnlockForm";

export const metadata: Metadata = {
  title: "Members Hub",
  description:
    "The BSTC member hub: the AI Prompt Library, a community resource hub, the BSTC guide to Bali, member discounts, and legal & setup guides. Free to join.",
};

const SECTIONS = [
  {
    href: "/members/prompts",
    icon: BookOpen,
    title: "AI Prompt Library",
    desc: "Battle-tested prompts from the community for sales, fundraising, product, and shipping with AI.",
  },
  {
    href: "/members/resources",
    icon: Users,
    title: "Community Resource Hub",
    desc: "Tools, templates, and know-how contributed and kept current by our expert members.",
  },
  {
    href: "/members/bali-guide",
    icon: MapPin,
    title: "BSTC Guide to Bali",
    desc: "The best cafes, gyms, coworking, and restaurants, curated by people who build here.",
  },
  {
    href: "/members/legal",
    icon: Scale,
    title: "Legal & Setup Guides",
    desc: "Company setup, tax, and visas, with agents and lawyers vetted by the community.",
  },
  {
    href: "/members/perks",
    icon: Tag,
    title: "Member Discounts",
    desc: "Member-only deals on local spots and the software & AI tools founders actually use.",
  },
];

const BENEFITS = [
  "The AI Prompt Library: community-sourced prompts that ship work",
  "A living resource hub maintained by the community's experts",
  "The BSTC guide to Bali: cafes, gyms, coworking, and more",
  "Member discounts on local spots and software & AI tools",
  "Legal & setup guides with vetted agents, lawyers, and accountants",
];

export default function MembersPage() {
  const member = isMember();

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              {member ? "Members Hub" : "Members Only"}
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              {member ? (
                <>
                  Welcome to the
                  <br />
                  <span className="text-brand-red">BSTC member hub</span>
                </>
              ) : (
                <>
                  The BSTC
                  <br />
                  <span className="text-brand-red">member hub</span>
                </>
              )}
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed">
              {member
                ? "Everything the community has built for you, in one place. Dive in below."
                : "Join the community to unlock the AI Prompt Library, a member-maintained resource hub, the BSTC guide to Bali, member discounts, and legal & setup guides. Free to join."}
            </p>
          </div>
        </div>
      </section>

      {member ? (
        <section className="pb-16 md:pb-24">
          <div className="max-w-site mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECTIONS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group block rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all p-6"
                >
                  <s.icon className="w-6 h-6 text-brand-red mb-4" />
                  <h2 className="font-display font-bold text-lg text-brand-white group-hover:text-brand-red transition-colors mb-2">
                    {s.title}
                  </h2>
                  <p className="text-sm text-brand-grey leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-red">
                    Open <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="pb-16 md:pb-24">
          <div className="max-w-site mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div className="space-y-4">
                {SECTIONS.map((s) => (
                  <div
                    key={s.href}
                    className="rounded-lg border border-white/5 bg-white/[0.02] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <s.icon className="w-5 h-5 text-brand-red mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-brand-white mb-1 flex items-center gap-2">
                          {s.title}
                          <Lock size={12} className="text-brand-grey" />
                        </h3>
                        <p className="text-sm text-brand-grey leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-brand-red/20 bg-brand-red/5 p-6 md:p-8">
                <h2 className="font-display font-bold text-xl text-brand-white mb-2">
                  Claim your free membership
                </h2>
                <p className="text-sm text-brand-grey mb-6">
                  Drop your details to unlock the hub. Takes 10 seconds.
                </p>
                <MemberUnlockForm />
                <ul className="mt-6 space-y-2">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-brand-grey">
                      <Check size={15} className="text-brand-red mt-0.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
