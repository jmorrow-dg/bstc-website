import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { CITY_COMPARISONS, type CityComparison } from "@/data/city-comparisons";
import { SITE } from "@/lib/constants";
import { getBreadcrumbSchema } from "@/lib/schema";

const BALI = {
  monthlyCost: 3500,
  founderDensity: "Very high",
  infrastructure: "Improving",
  timezoneUtc: "UTC+8",
  visaFriction: "Moderate",
  englishFluency: "High",
};

export async function generateStaticParams() {
  return CITY_COMPARISONS.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const c = CITY_COMPARISONS.find((x) => x.slug === params.city);
  if (!c) return { title: "Comparison Not Found" };

  const title = `Bali vs ${c.city} for Founders (2026): Honest Comparison`;
  return {
    title,
    description: c.metaDescription,
    keywords: [
      `bali vs ${c.city.toLowerCase()}`,
      `${c.city.toLowerCase()} vs bali`,
      `bali or ${c.city.toLowerCase()} for founders`,
      `${c.city.toLowerCase()} founder hub`,
      `bali founder community`,
      `where to base startup ${c.city.toLowerCase()}`,
    ],
    alternates: { canonical: `${SITE.url}/bali-vs/${c.slug}` },
    openGraph: {
      title,
      description: c.metaDescription,
      type: "article",
      url: `${SITE.url}/bali-vs/${c.slug}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(`Bali vs ${c.city}`)}&subtitle=${encodeURIComponent("For founders. Honest 2026 comparison.")}&type=blog`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

function getFaqSchema(c: CityComparison) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is Bali or ${c.city} better for founders in 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Neither is universally better. Bali wins on founder community density, lifestyle leverage, and cost-to-quality ratio. ${c.city} wins on ${c.whyChooseCity[0].toLowerCase()}. The right choice depends on what you're optimising for.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does it cost to live in Bali vs ${c.city} as a founder?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A comfortable founder lifestyle in Bali in 2026 costs around $3,500/month. In ${c.city} it's around $${c.monthlyCost.toLocaleString()}/month. These figures include accommodation, coworking, food, transport, and a buffer for social and travel.`,
        },
      },
      {
        "@type": "Question",
        name: `Who should choose Bali over ${c.city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: c.whoShouldChooseBali,
        },
      },
      {
        "@type": "Question",
        name: `Who should choose ${c.city} over Bali?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: c.whoShouldChooseCity,
        },
      },
    ],
  };
}

function Row({
  label,
  bali,
  city,
}: {
  label: string;
  bali: string;
  city: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-white/5 text-sm">
      <div className="text-brand-grey">{label}</div>
      <div className="text-brand-white font-medium">{bali}</div>
      <div className="text-brand-white font-medium">{city}</div>
    </div>
  );
}

export default async function BaliVsCityPage({
  params,
}: {
  params: { city: string };
}) {
  const c = CITY_COMPARISONS.find((x) => x.slug === params.city);
  if (!c) notFound();

  const faqSchema = getFaqSchema(c);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bali vs", url: "/blog" },
    { name: c.city, url: `/bali-vs/${c.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, breadcrumbSchema]),
        }}
      />

      <div className="max-w-site mx-auto px-6 pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Bali vs", href: "/blog" },
            { label: c.city },
          ]}
        />
      </div>

      <article className="py-12 md:py-20">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-wider text-brand-red">
              Founder Hub Comparison
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-6">
              Bali vs {c.city} for Founders (2026)
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed mb-10 border-l-2 border-brand-red pl-4">
              {c.metaDescription}
            </p>

            {/* Quick verdict */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="p-6 rounded-lg border border-brand-red/20 bg-brand-red/5">
                <div className="text-xs uppercase tracking-wider text-brand-red mb-2">
                  Choose Bali if
                </div>
                <p className="text-brand-white">{c.whoShouldChooseBali}</p>
              </div>
              <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="text-xs uppercase tracking-wider text-brand-grey mb-2">
                  Choose {c.city} if
                </div>
                <p className="text-brand-white">{c.whoShouldChooseCity}</p>
              </div>
            </div>

            {/* Comparison table */}
            <h2 className="text-2xl font-display font-bold mb-4">
              Side-by-side comparison
            </h2>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 mb-12">
              <div className="grid grid-cols-3 gap-4 pb-3 border-b border-white/10 text-xs uppercase tracking-wider text-brand-grey">
                <div></div>
                <div>Bali (Canggu)</div>
                <div>{c.city}</div>
              </div>
              <Row
                label="Monthly cost (comfortable)"
                bali={`$${BALI.monthlyCost.toLocaleString()}`}
                city={`$${c.monthlyCost.toLocaleString()}`}
              />
              <Row
                label="Founder density"
                bali={BALI.founderDensity}
                city={c.founderDensity}
              />
              <Row
                label="Infrastructure"
                bali={BALI.infrastructure}
                city={c.infrastructure}
              />
              <Row label="Time zone" bali={BALI.timezoneUtc} city={c.timezoneUtc} />
              <Row
                label="Visa friction"
                bali={BALI.visaFriction}
                city={c.visaFriction}
              />
              <Row
                label="English fluency"
                bali={BALI.englishFluency}
                city={c.englishFluency}
              />
            </div>

            {/* Why Bali */}
            <h2 className="text-2xl font-display font-bold mb-4">
              Why founders choose Bali over {c.city}
            </h2>
            <ul className="space-y-3 mb-12">
              {c.whyChooseBali.map((reason) => (
                <li key={reason} className="flex gap-3 text-brand-grey">
                  <Check
                    size={20}
                    className="text-brand-red flex-shrink-0 mt-0.5"
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            {/* Why City */}
            <h2 className="text-2xl font-display font-bold mb-4">
              Why founders choose {c.city} over Bali
            </h2>
            <ul className="space-y-3 mb-12">
              {c.whyChooseCity.map((reason) => (
                <li key={reason} className="flex gap-3 text-brand-grey">
                  <Check
                    size={20}
                    className="text-brand-grey flex-shrink-0 mt-0.5"
                  />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            {/* Tax note */}
            <h2 className="text-2xl font-display font-bold mb-4">
              Tax and legal note
            </h2>
            <p className="text-brand-grey mb-4">{c.taxNote}</p>
            <p className="text-brand-grey mb-12">
              For the full picture on Bali tax structures, read our{" "}
              <Link
                href="/blog/bali-founder-tax-guide-2026"
                className="text-brand-red hover:text-brand-white"
              >
                Bali Founder Tax Guide (2026)
              </Link>
              .
            </p>

            {/* The honest answer */}
            <h2 className="text-2xl font-display font-bold mb-4">
              The honest answer
            </h2>
            <p className="text-brand-grey mb-4">
              Most founders don&apos;t pick one city for life. They cycle. A common
              pattern in the BSTC community is 6 to 9 months in Bali for
              community and shipping, with 2 to 3 months in {c.city} or another
              hub when they need what that city offers.
            </p>
            <p className="text-brand-grey mb-12">
              If your customers are global and you value being around other
              serious operators in person, Bali wins. If you need what {c.city}{" "}
              offers (cost, time zones, tax, infrastructure), then commit to it
              fully.
            </p>

            {/* Related */}
            <h2 className="text-2xl font-display font-bold mb-4">
              Related reading
            </h2>
            <ul className="space-y-2 mb-12">
              <li>
                <Link
                  href="/blog/cost-of-living-bali-founder-2026"
                  className="text-brand-red hover:text-brand-white"
                >
                  How much does it cost to live in Bali as a founder in 2026?
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/bali-vs-chiang-mai-vs-lisbon-founders-2026"
                  className="text-brand-red hover:text-brand-white"
                >
                  Bali vs Chiang Mai vs Lisbon for founders: an honest comparison
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/best-coworking-spaces-bali-founders-2026"
                  className="text-brand-red hover:text-brand-white"
                >
                  Best coworking spaces in Bali for founders (2026)
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/why-bali-for-startups"
                  className="text-brand-red hover:text-brand-white"
                >
                  Why Bali for startups
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </article>

      {/* Other comparisons */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl font-display font-bold mb-8">
            Compare Bali to other founder hubs
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {CITY_COMPARISONS.filter((x) => x.slug !== c.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/bali-vs/${other.slug}`}
                className="group block p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-red/20 transition-all"
              >
                <h3 className="font-semibold text-brand-white group-hover:text-brand-red transition-colors">
                  Bali vs {other.city}
                </h3>
                <p className="text-sm text-brand-grey mt-1">
                  ${other.monthlyCost.toLocaleString()}/mo · {other.timezoneUtc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">
            Talk to founders who have chosen Bali
          </h2>
          <p className="text-brand-grey mb-6">
            2,500+ builders in the BSTC community can tell you what it&apos;s
            actually like.
          </p>
          <Link
            href="/community"
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
