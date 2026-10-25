import type { Metadata } from "next";
import Link from "next/link";
import PerkFinder from "@/components/perks/PerkFinder";
import { getBreadcrumbSchema } from "@/lib/schema";
import {
  ALL_PERKS,
  EXAMPLE_PERKS,
  LOCAL_EXAMPLES,
  OPEN_PERKS,
  PERKS_CHECKED,
  PERK_CATEGORIES,
  claimDomain,
  formatChecked,
  formatUsd,
  groupPerks,
  isOpen,
  perkIndex,
  tidy,
  type Perk,
} from "@/lib/perks";

const TOTAL = ALL_PERKS.length;
const OPEN = OPEN_PERKS.length;
const EXAMPLES = EXAMPLE_PERKS.length;
const LOCAL = LOCAL_EXAMPLES.length;
const CHECKED = formatChecked(PERKS_CHECKED);

export const metadata: Metadata = {
  title: "Member perks for founders and remote builders",
  description: `${OPEN} startup programmes open to apply for now, each checked on the vendor's own page on ${CHECKED}, plus ${EXAMPLES} example member deals Bali Startup & Tech is negotiating. Credits and discounts for founders and remote builders in Bali and beyond.`,
  alternates: { canonical: "/perks" },
  openGraph: {
    title: "Member perks for founders and remote builders | BSTC",
    description: `${OPEN} open startup programmes and ${EXAMPLES} example member deals, checked ${CHECKED}.`,
    url: "/perks",
  },
};

function PerkCard({ perk }: { perk: Perk }) {
  const headingId = `perk-${perk.id}-h`;
  const letter = perk.company.trim().charAt(0).toUpperCase();

  if (isOpen(perk)) {
    return (
      <article
        className="gl-pk gl-pk--open"
        id={`perk-${perk.id}`}
        data-perk-id={perk.id}
        aria-labelledby={headingId}
      >
        <div className="gl-pk-top">
          <span className="gl-mark" aria-hidden="true">
            {letter}
          </span>
          <div>
            <h3 className="gl-pk-co" id={headingId}>
              {perk.company}
            </h3>
            {perk.programme && <p className="gl-pk-prog">{perk.programme}</p>}
          </div>
        </div>
        {perk.headline && <p className="gl-pk-headline">{perk.headline}</p>}
        {typeof perk.value_usd === "number" && perk.value_usd > 0 && (
          <p className="gl-pk-worth">Worth up to {formatUsd(perk.value_usd)}</p>
        )}
        {perk.one_line && <p className="gl-pk-one">{perk.one_line}</p>}
        <dl className="gl-pk-facts">
          <div>
            <dt>The offer</dt>
            <dd>{tidy(perk.offer)}</dd>
          </div>
          {perk.eligibility && (
            <div>
              <dt>Who qualifies</dt>
              <dd>{tidy(perk.eligibility)}</dd>
            </div>
          )}
          {perk.notes && (
            <div>
              <dt>Worth knowing</dt>
              <dd>{tidy(perk.notes)}</dd>
            </div>
          )}
        </dl>
        <p className="gl-pk-tags">
          {perk.bootstrapped_ok && <span className="gl-boot">Bootstrapped OK</span>}
          {perk.checked && (
            <span className="gl-checked">
              Checked <time dateTime={perk.checked}>{formatChecked(perk.checked)}</time>
            </span>
          )}
        </p>
        {perk.claim_url && (
          <a
            className="gl-btn gl-btn-sm gl-pk-go"
            href={perk.claim_url}
            target="_blank"
            rel="noopener"
          >
            Apply on {claimDomain(perk.claim_url)}
            <span className="gl-vh">
              {" "}
              for {perk.programme || perk.company} (opens in a new tab)
            </span>
          </a>
        )}
      </article>
    );
  }

  // Examples: no link, no value, a visible stamp on every one.
  return (
    <article
      className={`gl-pk gl-pk--ex${perk.type === "local" ? " gl-pk--local" : ""}`}
      id={`perk-${perk.id}`}
      data-perk-id={perk.id}
      aria-labelledby={headingId}
    >
      <span className="gl-stamp">Example</span>
      <div className="gl-pk-top">
        <span className="gl-mark" aria-hidden="true">
          {letter}
        </span>
        <div>
          <h3 className="gl-pk-co" id={headingId}>
            {perk.company}
          </h3>
          <p className="gl-pk-prog">
            {perk.type === "local"
              ? "Bali member deal we're negotiating"
              : "Member deal we're negotiating"}
          </p>
        </div>
      </div>
      <p className="gl-pk-headline">{perk.offer}</p>
      {perk.one_line && <p className="gl-pk-one">{perk.one_line}</p>}
      {perk.eligibility && (
        <dl className="gl-pk-facts">
          <div>
            <dt>Who it would be for</dt>
            <dd>{perk.eligibility}</dd>
          </div>
        </dl>
      )}
      <p className="gl-pk-not">Not live yet</p>
    </article>
  );
}

export default function PerksPage() {
  const groups = groupPerks();
  const breadcrumb = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Perks", url: "/perks" },
  ]);

  return (
    <div className="gl-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="gl-head gl-on-red" aria-labelledby="page-title">
        <div className="gl-wrap">
          <div className="gl-head-copy">
            <p className="gl-est">Member perks, checked {CHECKED}</p>
            <h1 id="page-title">Member perks for founders and remote builders</h1>
            <p className="gl-lede">
              Bali Startup &amp; Tech is the community for founders, entrepreneurs
              and remote builders in Bali, and wherever you build from next.
              Here&apos;s every perk on our list, in one place: startup programmes
              you can apply for today, and the members-only deals we&apos;re
              working on.
            </p>
            <div className="gl-head-ctas">
              <Link className="gl-btn gl-btn-paper" href="/join">
                Join the community
              </Link>
              <a className="gl-link" href="#finder">
                Find a perk
              </a>
            </div>
          </div>
          <div className="gl-kinds">
            <div className="gl-kind-tile gl-kind-open">
              <b>{OPEN}</b>
              <h2>Open now</h2>
              <p className="gl-k-sub">Public startup programmes</p>
              <p>
                Read on each vendor&apos;s own page on {CHECKED}. You apply direct
                and the vendor decides who gets in. Each one links to its page.
              </p>
            </div>
            <div className="gl-kind-tile gl-kind-ex">
              <span className="gl-stamp" aria-hidden="true">
                Example
              </span>
              <b>{EXAMPLES}</b>
              <h2>Example member deals</h2>
              <p className="gl-k-sub">
                {EXAMPLES - LOCAL} founder tools, {LOCAL} Bali partners
              </p>
              <p>
                Members-only deals we&apos;re negotiating. None are agreed yet, so
                each one is stamped Example and has no link and no value.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="gl-finder" id="finder" aria-labelledby="find-title">
        <div className="gl-wrap">
          <div className="gl-finder-head">
            <h2 id="find-title">Find a perk</h2>
            <p>
              All {TOTAL} perks, grouped by category. Values are in US dollars, as
              each vendor states them, and only open programmes show one.
            </p>
          </div>

          <PerkFinder index={perkIndex()} categories={PERK_CATEGORIES} />

          <nav className="gl-jump" id="perk-jump" aria-labelledby="jump-title">
            <h3 id="jump-title">Jump to a category</h3>
            <ul>
              {groups.map((g) => (
                <li key={g.slug}>
                  <a href={`#cat-${g.slug}`}>
                    {g.category} ({g.perks.length})
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div className="gl-results gl-wrap" id="results">
        {groups.map((g) => (
          <section
            className="gl-cat"
            id={`cat-${g.slug}`}
            data-perk-cat={g.category}
            aria-labelledby={`cat-${g.slug}-h`}
            key={g.slug}
          >
            <div className="gl-cat-head">
              <h2 id={`cat-${g.slug}-h`}>{g.category}</h2>
              <p className="gl-cat-count" data-perk-count="">
                {[
                  g.open ? `${g.open} open now` : "",
                  g.examples
                    ? `${g.examples} ${g.examples === 1 ? "example" : "examples"}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <div className="gl-grid">
              {g.perks.map((perk) => (
                <PerkCard perk={perk} key={perk.id} />
              ))}
            </div>
          </section>
        ))}
        <div className="gl-empty" id="perk-empty" hidden>
          <h2>No perks match that</h2>
          <p>
            Try a shorter word or just a company name, set Show to All, pick All
            categories, or turn off Bootstrapped OK.
          </p>
          <button className="gl-btn gl-btn-line" type="button" id="perk-empty-clear">
            Clear filters and show all {TOTAL}
          </button>
        </div>
      </div>

      <section className="gl-suggest gl-on-navy" id="suggest" aria-labelledby="suggest-title">
        <div className="gl-wrap">
          <h2 id="suggest-title">Got a perk for members?</h2>
          <div className="gl-suggest-cols">
            <div>
              <h3>If you&apos;re a member</h3>
              <p>
                Tell us the tool you&apos;d pay for anyway, or the place in Bali you
                already go. We&apos;ll ask them for a members&apos; deal, and we&apos;ll
                tell the chat when it&apos;s signed.
              </p>
              <a className="gl-btn gl-btn-line" href="https://remotebuilders.io/perks/">
                Suggest a perk
              </a>
            </div>
            <div>
              <h3>If you run the company</h3>
              <p>
                Offer members a deal on your product, or on your space, gym or
                service in Bali, and put it in front of founders, engineers and
                operators who are choosing their tools right now.
              </p>
              <Link className="gl-link" href="/sponsors">
                Partner with BSTC
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="gl-final gl-on-red" aria-labelledby="perks-final-title">
        <div className="gl-wrap">
          <span className="gl-crest" aria-hidden="true" />
          <h2 id="perks-final-title">Perks come with membership</h2>
          <p>
            Join free. You get the chat, every event, and each member deal as soon
            as it&apos;s signed.
          </p>
          <Link className="gl-btn gl-btn-paper" href="/join">
            Join the community
          </Link>
        </div>
      </section>
    </div>
  );
}
