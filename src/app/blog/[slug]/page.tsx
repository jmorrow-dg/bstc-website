import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";

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

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const { frontmatter: p, htmlContent } = post;

  return (
    <>
      <div className="max-w-site mx-auto px-6 pt-8">
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
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-6">
              {p.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-brand-grey mb-12">
              <span className="flex items-center gap-2">
                <User size={14} />
                {p.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {new Date(p.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div
              className="prose prose-invert prose-headings:font-display prose-headings:text-brand-white prose-p:text-brand-grey prose-strong:text-brand-white prose-li:text-brand-grey prose-a:text-brand-red prose-h1:text-2xl prose-h2:text-xl"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </article>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">
            Join the Community
          </h2>
          <p className="text-brand-grey mb-6">
            2,500+ builders. Monthly events. Zero noise.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
          >
            Join BSTC
          </Link>
        </div>
      </section>
    </>
  );
}
