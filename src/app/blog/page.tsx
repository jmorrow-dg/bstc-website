import Link from "next/link";
import { Metadata } from "next";
import { Calendar, ArrowRight } from "lucide-react";
import { getAllBlogPosts, ContentItem, BlogFrontmatter } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Event recaps, founder stories, community guides, and insights from Bali Startup & Tech Community.",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    "event-recap": "Event Recap",
    "founder-story": "Founder Story",
    guide: "Guide",
    tools: "Tools & Resources",
  };
  return labels[cat] || cat;
}

function BlogCard({ post }: { post: ContentItem<BlogFrontmatter> }) {
  const { frontmatter: p } = post;

  return (
    <Link
      href={`/blog/${p.slug}`}
      className="group block p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
          {categoryLabel(p.category)}
        </span>
        <span className="text-xs text-brand-grey flex items-center gap-1">
          <Calendar size={10} />
          {formatDate(p.date)}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-brand-white group-hover:text-brand-red transition-colors mb-2">
        {p.title}
      </h3>

      <p className="text-sm text-brand-grey line-clamp-2 mb-4">{p.excerpt}</p>

      <span className="inline-flex items-center gap-1 text-sm text-brand-red group-hover:text-brand-white transition-colors">
        Read More <ArrowRight size={14} />
      </span>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Insights & Recaps
          </h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Event recaps, founder stories, community guides, and tools from the
            BSTC community.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.frontmatter.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-white/5 rounded-lg bg-white/[0.02]">
              <p className="text-brand-grey">
                Blog posts coming soon. Check back after our next event.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
