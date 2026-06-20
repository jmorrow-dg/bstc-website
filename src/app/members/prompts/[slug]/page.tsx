import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isMember } from "@/lib/members";
import { getPromptBySlug } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const prompt = await getPromptBySlug(params.slug);
  if (!prompt) return { title: "Prompt not found" };
  return {
    title: prompt.frontmatter.title,
    description: prompt.frontmatter.excerpt,
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!isMember()) redirect("/members");
  const prompt = await getPromptBySlug(params.slug);
  if (!prompt) notFound();
  const { frontmatter: p, htmlContent } = prompt;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/members/prompts"
          className="inline-flex items-center gap-1 text-sm text-brand-grey hover:text-brand-red transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All prompts
        </Link>
        <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-3">
          {p.category}
        </p>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{p.title}</h1>
        {p.useCase && <p className="text-brand-grey text-lg mb-8">{p.useCase}</p>}
        <div
          className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-brand-red prose-strong:text-brand-white prose-code:text-brand-red prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/10"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
}
