import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";
import { CATEGORIES, ESSENTIALS } from "@/data/welcome-guide";
import PrintButton from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "Welcome to Bali: BSTC Welcome Pack",
  description:
    "The one-page BSTC Welcome Pack: best cafes, coworking and gyms in Bali, plus settle-in basics. Save as PDF and share.",
  // Keep the pack out of search so it never competes with /welcome.
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE.url}/welcome` },
};

// Scoped print stylesheet: when this page is printed/saved as PDF, hide the
// site nav, footer, and all fixed-position floats so the pack stands alone.
const PRINT_CSS = `
@media print {
  nav, footer, .fixed { display: none !important; }
  main { padding-top: 0 !important; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .pack-section { break-inside: avoid; }
}
`;

export default function WelcomePackPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Screen-only toolbar */}
      <div className="fixed top-20 right-6 z-30 flex items-center gap-3 print:hidden">
        <PrintButton />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/welcome"
          className="inline-flex items-center gap-1.5 text-xs text-brand-grey hover:text-brand-white transition-colors mb-8 print:hidden"
        >
          <ArrowLeft size={12} />
          Back to the full guide
        </Link>

        {/* Header */}
        <header className="pack-section border-b border-white/10 pb-6 mb-8">
          <p className="text-brand-red text-xs font-medium uppercase tracking-widest mb-2">
            {SITE.name} New Member Pack
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Welcome to Bali
          </h1>
          <p className="text-sm text-brand-grey">
            Where the community works, eats, and trains. Honest picks, no
            affiliate links. Always-updated version at {SITE.domain}/welcome
          </p>
        </header>

        {/* Categories */}
        {CATEGORIES.map((category) => (
          <section key={category.slug} className="pack-section mb-8">
            <h2 className="text-lg font-display font-bold text-brand-red mb-1">
              {category.name}
            </h2>
            <p className="text-xs text-brand-grey mb-4">
              {category.description}
            </p>
            <ul className="space-y-2.5">
              {category.venues.map((venue) => (
                <li
                  key={venue.name}
                  className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2.5"
                >
                  <div>
                    <span className="text-sm font-semibold text-brand-white">
                      {venue.name}
                    </span>
                    <span className="text-xs text-brand-grey">
                      {" "}
                      &middot; {venue.area}
                    </span>
                    <p className="text-xs text-brand-grey mt-0.5">
                      {venue.bestFor}
                      {venue.perk && venue.perk.status !== "pending"
                        ? ` · ${venue.perk.label}`
                        : ""}
                    </p>
                  </div>
                  {venue.price && (
                    <span className="text-xs text-brand-grey font-mono flex-shrink-0">
                      {venue.price}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Settle in */}
        <section className="pack-section mb-8">
          <h2 className="text-lg font-display font-bold text-brand-red mb-3">
            Settle in (week one)
          </h2>
          <ul className="space-y-2">
            {ESSENTIALS.map((item) => (
              <li key={item.title} className="text-xs leading-relaxed">
                <span className="font-semibold text-brand-white">
                  {item.title}:
                </span>{" "}
                <span className="text-brand-grey">{item.blurb}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer / CTA */}
        <footer className="pack-section border-t border-white/10 pt-6">
          <h2 className="text-base font-display font-bold text-brand-white mb-2">
            Get perks and meet the community
          </h2>
          <p className="text-xs text-brand-grey mb-4 leading-relaxed">
            Member perks roll out on the live guide, and the codes are shared in
            our WhatsApp community. Join, RSVP to an event, and show up.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-xs print:hidden"
          >
            <MessageCircle size={14} />
            Join at {SITE.domain}/join
          </Link>
          <p className="hidden print:block text-xs text-brand-red font-medium">
            Join: {SITE.domain}/join
          </p>
        </footer>
      </div>
    </>
  );
}
