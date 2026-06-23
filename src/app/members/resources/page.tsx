import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isMember } from "@/lib/members";
import { getResources } from "@/lib/resources";
import ResourceGrid from "@/components/members/ResourceGrid";

export const metadata: Metadata = {
  title: "Community Resource Hub",
  description: "Tools, templates, and know-how contributed by BSTC's expert members.",
};

export default async function ResourceHubPage() {
  if (!isMember()) redirect("/members");
  const resources = await getResources("Community Resource");

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Member resource
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Community Resource Hub
          </h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Tools, templates, and hard-won know-how, contributed and kept current by the experts in
            our community.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <ResourceGrid
            resources={resources}
            emptyTitle="The resource hub is being built"
            emptyBody="Our community experts are adding their best tools and templates. Check back soon."
          />
          <div className="mt-12 rounded-lg border border-brand-red/20 bg-brand-red/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-semibold text-brand-white mb-1">Are you an expert in something?</h2>
              <p className="text-sm text-brand-grey">
                Members contribute resources in their area. Reach out to get edit access.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-brand-white text-sm font-medium rounded transition-colors flex-shrink-0"
            >
              Contribute <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
