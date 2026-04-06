import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EventNotFound() {
  return (
    <section className="py-32">
      <div className="max-w-site mx-auto px-6 text-center">
        <p className="text-brand-red font-mono text-sm uppercase tracking-widest mb-4">
          Event Not Found
        </p>
        <h1 className="text-4xl font-display font-bold mb-4">
          This event doesn&apos;t exist
        </h1>
        <p className="text-brand-grey mb-8">
          It may have been removed or the URL might be wrong.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
        >
          <ArrowLeft size={16} />
          See All Events
        </Link>
      </div>
    </section>
  );
}
