import Link from "next/link";
import { Metadata } from "next";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { getAllBlogPosts, ContentItem, BlogFrontmatter } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — Insights on Bali's Tech Scene, AI, and Startup Culture",
  description:
    "Thought leadership on Bali's growing tech ecosystem, AI trends, founder stories, and community insights from Southeast Asia's largest startup community.",
  keywords: [
    "Bali tech scene",
    "startup Bali",
    "AI Southeast Asia",
    "tech community Bali",
    "founder stories Bali",
    "startup ecosystem Indonesia",
  ],
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  "event-recap": "Event Recap",
  "founder-story": "Founder Story",
  guide: "Guide",
  tools: "Tools & Resources",
  "thought-leadership": "Thought Leadership",
  "bali-tech-scene": "Bali Tech Scene",
};

function FeaturedPost({ post }: { post: ContentItem<BlogFrontmatter> }) {
  const { frontmatter: p } = post;
  return (
    <Link
      href={`/blog/${p.slug}`}
      className="group block p-8 md:p-10 rounded-lg border border-brand-red/20 bg-brand-red/5 hover:bg-brand-red/10 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
          {CATEGORY_LABELS[p.category] || p.category}
        </span>
        <span className="text-xs text-brand-grey flex items-center gap-1">
          <Calendar size={10} />
          {formatDate(p.date)}
        </span>
        {p.readTime && (
          <span className="text-xs text-brand-grey flex items-center gap-1">
            <Clock size={10} />
            {p.readTime}
          </span>
        )}
      </div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-white group-hover:text-brand-red transition-colors mb-3">
        {p.title}
      </h2>
      <p className="text-brand-grey leading-relaxed mb-4 max-w-2xl">
        {p.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-brand-grey">
          By {p.author}
          {p.authorRole && (
            <span className="text-brand-grey/60"> — {p.authorRole}</span>
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-brand-red group-hover:text-brand-white transition-colors">
          Read <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
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
          {CATEGORY_LABELS[p.category] || p.category}
        </span>
        {p.readTime && (
          <span className="text-xs text-brand-grey flex items-center gap-1">
            <Clock size={10} />
            {p.readTime}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-brand-white group-hover:text-brand-red transition-colors mb-2">
        {p.title}
      </h3>
      <p className="text-sm text-brand-grey line-clamp-2 mb-4">{p.excerpt}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-grey">
          {formatDate(p.date)}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-brand-red group-hover:text-brand-white transition-colors">
          Read <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Signal from the Scene
          </h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            Thought leadership on Bali&apos;s growing tech ecosystem, AI
            trends, startup culture, and insights from Southeast Asia&apos;s
            most active founder community.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="pb-12 md:pb-16">
          <div className="max-w-site mx-auto px-6">
            <FeaturedPost post={featured} />
          </div>
        </section>
      )}

      {/* Rest of Posts */}
      {rest.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="max-w-site mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <BlogCard key={post.frontmatter.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-brand-grey max-w-md mx-auto mb-6">
            Get the latest on Bali&apos;s tech scene, AI insights, and
            community updates. No spam — just signal.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            Join the Community
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
