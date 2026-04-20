import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getAllBlogPosts, getBlogPostBySlug, ContentItem, BlogFrontmatter } from "@/lib/content";
import { SITE } from "@/lib/constants";
import { getBreadcrumbSchema } from "@/lib/schema";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  const { frontmatter: p } = post;
  return {
    title: p.seo?.title || p.title,
    description: p.seo?.description || p.excerpt,
    keywords: p.seo?.keywords,
    openGraph: {
      title: p.seo?.title || p.title,
      description: p.seo?.description || p.excerpt,
      type: "article",
      publishedTime: p.date,
      authors: [p.author],
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(p.title)}&subtitle=${encodeURIComponent(p.excerpt.slice(0, 100))}&type=blog`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

function getArticleSchema(post: BlogFrontmatter) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      ...(post.authorRole && { jobTitle: post.authorRole }),
    },
    publisher: {
      "@type": "Organization",
      name: SITE.fullName,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    image: `${SITE.url}/api/og?title=${encodeURIComponent(post.title)}&type=blog`,
    ...(post.tags && { keywords: post.tags.join(", ") }),
  };
}

function RelatedPosts({
  posts,
  currentSlug,
  currentTags,
  currentCategory,
}: {
  posts: ContentItem<BlogFrontmatter>[];
  currentSlug: string;
  currentTags?: string[];
  currentCategory?: string;
}) {
  // Score every post by tag overlap + category match, then take top 3.
  // Falls back to most-recent if no overlap exists.
  const tagSet = new Set((currentTags || []).map((t) => t.toLowerCase()));
  const scored = posts
    .filter((p) => p.frontmatter.slug !== currentSlug)
    .map((p) => {
      const tags = (p.frontmatter.tags || []).map((t) => t.toLowerCase());
      const tagScore = tags.reduce((n, t) => (tagSet.has(t) ? n + 2 : n), 0);
      const catScore = p.frontmatter.category === currentCategory ? 1 : 0;
      return { post: p, score: tagScore + catScore };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.frontmatter.date).getTime() - new Date(a.post.frontmatter.date).getTime();
    });

  const related = scored.slice(0, 3).map((s) => s.post);

  if (related.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-white/5">
      <div className="max-w-site mx-auto px-6">
        <h2 className="text-2xl font-display font-bold mb-8">
          More from BSTC
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((post) => (
            <Link
              key={post.frontmatter.slug}
              href={`/blog/${post.frontmatter.slug}`}
              className="group block p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
                {post.frontmatter.category.replace(/-/g, " ")}
              </span>
              <h3 className="text-base font-semibold text-brand-white group-hover:text-brand-red transition-colors mt-2 mb-2">
                {post.frontmatter.title}
              </h3>
              <p className="text-sm text-brand-grey line-clamp-2">
                {post.frontmatter.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = await getAllBlogPosts();
  const { frontmatter: p, htmlContent } = post;
  const articleSchema = getArticleSchema(p);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: p.title, url: `/blog/${p.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, breadcrumbSchema]),
        }}
      />

      <div className="max-w-site mx-auto px-6 pt-8 space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: p.title },
          ]}
        />
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-brand-grey hover:text-brand-white transition-colors"
        >
          <ArrowLeft size={14} />
          All Posts
        </Link>
      </div>

      <article className="py-12 md:py-20">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            {/* Category */}
            <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
              {p.category.replace(/-/g, " ")}
            </span>

            <h1 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-6">
              {p.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-brand-grey mb-4">
              <span className="flex items-center gap-2">
                <User size={14} />
                {p.author}
                {p.authorRole && (
                  <span className="text-brand-grey/60">: {p.authorRole}</span>
                )}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {new Date(p.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {p.readTime && (
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {p.readTime}
                </span>
              )}
            </div>

            {/* Tags */}
            {p.tags && p.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs rounded-full border border-white/10 text-brand-grey bg-white/[0.03]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Excerpt */}
            <p className="text-lg text-brand-grey leading-relaxed mb-10 border-l-2 border-brand-red pl-4">
              {p.excerpt}
            </p>

            {/* Content */}
            <div
              className="prose prose-invert prose-headings:font-display prose-headings:text-brand-white prose-p:text-brand-grey prose-p:leading-relaxed prose-strong:text-brand-white prose-li:text-brand-grey prose-a:text-brand-red prose-a:no-underline hover:prose-a:text-brand-white prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-blockquote:border-brand-red prose-blockquote:text-brand-grey"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Author Card */}
            <div className="mt-16 p-6 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold">
                  {p.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-brand-white">{p.author}</p>
                  {p.authorRole && (
                    <p className="text-sm text-brand-grey">{p.authorRole}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <RelatedPosts
        posts={allPosts}
        currentSlug={p.slug}
        currentTags={p.tags}
        currentCategory={p.category}
      />

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">
            Join the Conversation
          </h2>
          <p className="text-brand-grey mb-6">
            2,500+ builders discussing AI, startups, and technology in
            Southeast Asia.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            Join BSTC
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
