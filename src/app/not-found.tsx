import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="py-32 md:py-48">
      <div className="max-w-site mx-auto px-6 text-center">
        <p className="text-brand-red font-mono text-sm uppercase tracking-widest mb-4">
          404
        </p>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
          Signal <span className="text-brand-red">Lost</span>
        </h1>
        <p className="text-brand-grey max-w-md mx-auto mb-10 text-lg">
          This page doesn&apos;t exist. Maybe it moved, maybe it never did. Either way, the signal is elsewhere.
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white font-medium rounded transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ink/15 hover:border-ink/30 text-brand-white font-medium rounded transition-colors"
          >
            See Events
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ink/15 hover:border-ink/30 text-brand-white font-medium rounded transition-colors"
          >
            Read the Blog
          </Link>
          <Link
            href="/join?src=404"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ink/15 hover:border-ink/30 text-brand-white font-medium rounded transition-colors"
          >
            Join the community
          </Link>
        </div>
      </div>
    </section>
  );
}
