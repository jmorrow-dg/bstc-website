import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Utensils,
  Building2,
  Dumbbell,
  Coffee,
  BedDouble,
  Martini,
  MessageCircle,
  Download,
  Tag,
  Clock,
  Wallet,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/schema";
import {
  CATEGORIES,
  ESSENTIALS,
  DEEPER_GUIDES,
  GUIDE_FAQS,
  MAP_EMBED_URL,
  mapsUrl,
  photoSlug,
  type Venue,
  type GuideCategory,
} from "@/data/welcome-guide";
import {
  FadeIn,
  FadeInStagger,
  FadeInItem,
} from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Welcome to Bali: The BSTC New Member Guide",
  description:
    "Just landed in Bali? The honest founder's guide to the best cafes, coworking spaces, and gyms in Canggu, plus visa, SIM, scooter and where-to-stay basics. Curated by 2,500+ builders. No affiliate links.",
  keywords: [
    "moving to Bali founder guide",
    "best cafes Canggu",
    "best coworking Canggu",
    "best gyms Canggu Bali",
    "Bali digital nomad guide",
    "Canggu welcome guide",
  ],
  alternates: { canonical: `${SITE.url}/welcome` },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  cafes: Coffee,
  coworking: Building2,
  eat: Utensils,
  out: Martini,
  train: Dumbbell,
  stay: BedDouble,
};

function PerkBadge({ perk }: { perk: NonNullable<Venue["perk"]> }) {
  // Pending perks render muted (an outreach target, not a live deal). Live
  // perks render the real perk in red.
  if (perk.status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-brand-grey border border-white/10 px-2 py-0.5 rounded">
        <Clock size={10} />
        Perk in the works
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">
      <Tag size={10} />
      {perk.label}
    </span>
  );
}

// Which welcome photos actually exist, mapped slug -> filename. Read once at
// build time (this page is statically generated) so a venue only shows a photo
// when its file is present; otherwise the branded placeholder renders. Drop a
// file named <photoSlug(name)>.(jpg|png|webp) into the folder and rebuild.
const AVAILABLE_PHOTOS: Map<string, string> = (() => {
  const dir = path.join(process.cwd(), "public/images/welcome");
  const found = new Map<string, string>();
  try {
    for (const file of fs.readdirSync(dir)) {
      const match = file.match(/^(.+)\.(jpe?g|png|webp)$/i);
      if (match) found.set(match[1], file);
    }
  } catch {
    // folder missing or empty: every card falls back to the placeholder.
  }
  return found;
})();

// Resolve a venue's photo URL: an explicit `photo` override wins, otherwise the
// auto-resolved file if one exists. Returns undefined to trigger the placeholder.
function venuePhotoSrc(venue: Venue): string | undefined {
  if (venue.photo) return venue.photo;
  const file = AVAILABLE_PHOTOS.get(photoSlug(venue.name));
  return file ? `/images/welcome/${file}` : undefined;
}

// Photo header: real image when one is available, otherwise a branded
// placeholder block carrying the category icon.
function VenuePhoto({
  venue,
  Icon,
}: {
  venue: Venue;
  Icon: React.ElementType;
}) {
  const photoSrc = venuePhotoSrc(venue);
  return (
    <div
      className="relative h-32 border-b border-white/5 overflow-hidden"
      style={
        photoSrc
          ? {
              backgroundImage: `url(${photoSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {!photoSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white/[0.05] to-transparent">
          <Icon className="w-6 h-6 text-brand-grey/40" />
          <span className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-brand-grey/40 font-mono">
            Photo
          </span>
        </div>
      )}
      {venue.placeholder && (
        <span className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-wider text-brand-red bg-brand-charcoal/80 border border-brand-red/30 px-2 py-0.5 rounded">
          To confirm
        </span>
      )}
      {venue.price && (
        <span className="absolute bottom-2 right-2 text-[10px] text-brand-white/90 font-mono bg-brand-charcoal/70 px-2 py-0.5 rounded">
          {venue.price}
        </span>
      )}
    </div>
  );
}

function VenueCard({ venue, Icon }: { venue: Venue; Icon: React.ElementType }) {
  return (
    <a
      href={mapsUrl(venue.name, venue.area)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all h-full overflow-hidden"
    >
      <VenuePhoto venue={venue} Icon={Icon} />
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-brand-white group-hover:text-brand-red transition-colors text-sm mb-1.5">
          {venue.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-brand-grey mb-3">
          <MapPin size={11} className="text-brand-red" />
          {venue.area}
        </div>
        <p className="text-xs text-brand-grey leading-relaxed mb-3">
          {venue.blurb}
        </p>
        <p className="text-[11px] text-brand-white/70 mb-3">
          <span className="text-brand-red">Best for:</span> {venue.bestFor}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-auto">
          {venue.perk && <PerkBadge perk={venue.perk} />}
          {venue.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-brand-grey border border-white/10 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          <ExternalLink
            size={11}
            className="text-brand-grey group-hover:text-brand-red transition-colors ml-auto flex-shrink-0"
          />
        </div>
      </div>
    </a>
  );
}

function CategoryBlock({ category }: { category: GuideCategory }) {
  const Icon = CATEGORY_ICONS[category.slug] ?? MapPin;
  return (
    <div id={category.slug} className="mb-16 scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-brand-red" />
        <h2 className="text-xl font-display font-bold text-brand-white">
          {category.name}
        </h2>
      </div>
      <p className="text-sm text-brand-grey mb-6 max-w-2xl">
        {category.description}
      </p>
      <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.venues.map((venue) => (
          <FadeInItem key={venue.name}>
            <VenueCard venue={venue} Icon={Icon} />
          </FadeInItem>
        ))}
      </FadeInStagger>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFAQSchema(GUIDE_FAQS)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Welcome to Bali", url: "/welcome" },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              New Member Guide
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-[1.05]">
              Welcome to Bali.
              <br />
              <span className="text-brand-red">Here&apos;s how to land.</span>
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed mb-8">
              Just arrived? Skip the trial and error. This is where{" "}
              {SITE.name} founders actually work, eat, and train, plus the
              practical basics for settling in. Honest picks from 2,500+
              builders. No affiliate links, no paid placements.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm glow-red"
              >
                <MessageCircle size={16} />
                Join the community
              </Link>
              <Link
                href="/welcome/pack"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
              >
                <Download size={14} />
                Get the welcome pack
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-8">
              {CATEGORIES.map((c) => (
                <a
                  key={c.slug}
                  href={`#${c.slug}`}
                  className="text-xs text-brand-grey hover:text-brand-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Map (renders once MAP_EMBED_URL is set in welcome-guide.ts) */}
      {MAP_EMBED_URL && (
        <section className="pb-4 border-t border-white/5 pt-16">
          <div className="max-w-site mx-auto px-6">
            <FadeIn className="mb-8 max-w-2xl">
              <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-3">
                The Map
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Every spot, on one map
              </h2>
              <p className="text-brand-grey">
                The whole guide as a Google map. Open it on your phone and save
                the spots near you.
              </p>
            </FadeIn>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <iframe
                src={MAP_EMBED_URL}
                title="BSTC Bali guide map"
                className="w-full h-[480px]"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* Category blocks */}
      <section className="pb-8 md:pb-12 border-t border-white/5 pt-16">
        <div className="max-w-site mx-auto px-6">
          {CATEGORIES.map((category) => (
            <CategoryBlock key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Member perks explainer */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-3">
              Member Perks
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Perks, rolling out now
            </h2>
            <p className="text-brand-grey leading-relaxed mb-8">
              We&apos;re partnering with venues across Canggu to give BSTC
              members real perks: day passes, discounts, and member rates. When
              a perk goes live it shows on the listing above, and the code is
              shared inside our WhatsApp community. Join to get them as they
              land.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors text-sm glow-red"
              >
                Join to unlock perks
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors text-sm"
              >
                Run a venue? Partner with us
              </Link>
            </div>
            <Link
              href="/card"
              className="inline-flex items-center gap-1.5 text-xs text-brand-grey hover:text-brand-white transition-colors mt-6"
            >
              <Wallet size={13} className="text-brand-red" />
              Members get a digital card to claim perks at venues
              <ArrowRight size={12} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Settle in essentials */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Settle in
            </h2>
            <p className="text-brand-grey max-w-2xl">
              The practical basics every new arrival sorts in week one. Short
              version here, full detail in the guides.
            </p>
          </FadeIn>
          <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ESSENTIALS.map((item) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-brand-white text-sm">
                      {item.title}
                    </h3>
                    {item.href && (
                      <ArrowRight
                        size={14}
                        className="text-brand-grey group-hover:text-brand-red transition-colors flex-shrink-0 mt-0.5"
                      />
                    )}
                  </div>
                  <p className="text-xs text-brand-grey leading-relaxed">
                    {item.blurb}
                  </p>
                </>
              );
              return (
                <FadeInItem key={item.title}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="group block p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all h-full"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="p-5 rounded-lg border border-white/5 bg-white/[0.02] h-full">
                      {inner}
                    </div>
                  )}
                </FadeInItem>
              );
            })}
          </FadeInStagger>
        </div>
      </section>

      {/* Deeper guides */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Go deeper
            </h2>
            <p className="text-brand-grey max-w-xl mx-auto">
              Long-form guides written by the community, for the community.
            </p>
          </FadeIn>
          <FadeInStagger className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {DEEPER_GUIDES.map((guide) => (
              <FadeInItem key={guide.title}>
                <Link
                  href={guide.href ?? "/blog"}
                  className="group block p-6 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all h-full"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-brand-white group-hover:text-brand-red transition-colors">
                      {guide.title}
                    </h3>
                    <ArrowRight
                      size={16}
                      className="text-brand-grey group-hover:text-brand-red transition-colors flex-shrink-0 mt-1"
                    />
                  </div>
                  <p className="text-sm text-brand-grey leading-relaxed">
                    {guide.blurb}
                  </p>
                </Link>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Frequently asked
            </h2>
          </FadeIn>
          <div className="max-w-3xl mx-auto space-y-3">
            {GUIDE_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-sm font-medium text-brand-white">
                    {faq.question}
                  </span>
                  <span className="text-brand-red text-lg group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-sm text-brand-grey mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <FadeIn className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Plug into Canggu
              <br />
              <span className="text-brand-red">from day one.</span>
            </h2>
            <p className="text-brand-grey mb-8 max-w-lg mx-auto leading-relaxed">
              The fastest way to settle in is to meet the people already
              building here. Join the community, RSVP to an event, and show up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors glow-red"
              >
                <MessageCircle size={18} />
                Join the community
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors"
              >
                See upcoming events
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
