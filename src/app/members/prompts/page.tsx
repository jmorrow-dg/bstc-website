import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { isMember } from "@/lib/members";
import { getAllPrompts } from "@/lib/content";

export const metadata: Metadata = {
  title: "AI Prompt Library",
  description: "Community-sourced prompts for founders building with AI.",
};

const CATEGORY_LABELS: Record<string, string> = {
  sales: "Sales",
  marketing: "Marketing",
  product: "Product",
  fundraising: "Fundraising",
  operations: "Operations",
  "ai-workflow": "AI Workflow",
};

export default async function PromptsPage() {
  if (!isMember()) redirect("/members");
  const prompts = await getAllPrompts();

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Member resource
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">AI Prompt Library</h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Battle-tested prompts from the BSTC community. Copy, adapt, ship.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          {prompts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((p) => (
                <Link
                  key={p.frontmatter.slug}
                  href={`/members/prompts/${p.frontmatter.slug}`}
                  className="group block rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all p-6"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
                    {CATEGORY_LABELS[p.frontmatter.category] || p.frontmatter.category}
                  </span>
                  <h3 className="text-lg font-semibold text-brand-white group-hover:text-brand-red transition-colors mt-1 mb-2">
                    {p.frontmatter.title}
                  </h3>
                  <p className="text-sm text-brand-grey line-clamp-3 mb-4">
                    {p.frontmatter.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-red">
                    View prompt <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/5 rounded-lg bg-white/[0.02]">
              <BookOpen className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-brand-white font-semibold mb-1">Prompts are being added</p>
              <p className="text-brand-grey text-sm">
                The first batch is on its way. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
