import { Metadata } from "next";
import { redirect } from "next/navigation";
import { isMember } from "@/lib/members";
import { getResources } from "@/lib/resources";
import ResourceGrid from "@/components/members/ResourceGrid";

export const metadata: Metadata = {
  title: "BSTC Guide to Bali",
  description: "The community's living guide to the best cafes, gyms, coworking, and restaurants in Bali.",
};

export default async function BaliGuidePage() {
  if (!isMember()) redirect("/members");
  const resources = await getResources("Bali Guide");

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Member resource
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">BSTC Guide to Bali</h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            The community&apos;s living guide to the best cafes, gyms, coworking spaces, and
            restaurants on the island, curated by people who actually live and build here.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <ResourceGrid
            resources={resources}
            emptyTitle="The Bali guide is being built"
            emptyBody="Members are adding their favourite spots for working, training, and eating. Check back soon."
          />
        </div>
      </section>
    </>
  );
}
