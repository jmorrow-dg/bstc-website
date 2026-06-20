import { Metadata } from "next";
import { redirect } from "next/navigation";
import { isMember } from "@/lib/members";
import { getResources } from "@/lib/resources";
import ResourceGrid from "@/components/members/ResourceGrid";

export const metadata: Metadata = {
  title: "Legal & Setup Guides",
  description: "Member-vetted guidance and recommended agents for company setup, tax, and visas in Indonesia.",
};

export default async function LegalGuidesPage() {
  if (!isMember()) redirect("/members");
  const resources = await getResources("Legal & Setup");

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Member resource
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Legal &amp; Setup Guides</h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Starting and running a business here: company setup, tax, and visas, with agents,
            lawyers, and accountants vetted and recommended by the community.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <ResourceGrid
            resources={resources}
            emptyTitle="The legal & setup guides are being built"
            emptyBody="Members are adding their recommended agents, lawyers, and step-by-step guides. Check back soon."
          />
          <p className="text-xs text-brand-grey/60 mt-8 max-w-2xl">
            Community recommendations are shared in good faith and are not legal, tax, or financial
            advice. Always do your own due diligence.
          </p>
        </div>
      </section>
    </>
  );
}
