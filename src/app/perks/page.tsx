import type { Metadata } from "next";
import Link from "next/link";
import PerkFinder from "@/components/perks/PerkFinder";
import { getBreadcrumbSchema } from "@/lib/schema";
import {
  catalogueCount,
  claimDomain,
  formatChecked,
  formatUsd,
  groupPerks,
  isOpen,
  isUnavailable,
  memberCount,
  memberDateLabel,
  memberGroups,
  memberStamp,
  perkFacts,
  perkIndex,
  PERKS_CHECKED,
  PERK_CATEGORIES,
  perksMetaDescription,
  tidy,
  type Perk,
} from "@/lib/perks";

const FACTS = perkFacts();
const CHECKED = formatChecked(PERKS_CHECKED);
const DESCRIPTION = perksMetaDescription(CHECKED);
const GROUPS = memberGroups();

export const metadata: Metadata = {
  title: "Member perks for founders and remote builders",
  description: DESCRIPTION,
  alternates: { canonical: "/perks" },
  openGraph: {
    title: "Member perks for founders and remote builders | BSTC",
    description: DESCRIPTION,
    url: "/perks",
  },
};

function MemberCard({ perk }: { perk: Perk }) {
  const status = perk.member_status;
  if (!status) return null;
  const headingId = `perk-${perk.id}-h`;
  const letter = perk.company.trim().charAt(0).toUpperCase();
  const stamp = memberStamp(status);
  const waiting = status === "activation_pending" || status === "terms_pending";

  return (
    <article
      className={`gl-pk gl-pk--member${waiting ? " gl-pk--wait" : ""}`}
      id={`perk-${perk.id}`}
      data-perk-id={perk.id}
      aria-labelledby={headingId}
    >
      <span className={`gl-stamp${stamp.length > 10 ? " gl-stamp--long" : ""}`}>{stamp}</span>
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
        {perk.claim_status && (
          <div>
            <dt>Status</dt>
            <dd>{perk.claim_status}</dd>
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
        {perk.agreed_on && (
          <span className="gl-checked">
            {memberDateLabel(status)}{" "}
            <time dateTime={perk.agreed_on}>{formatChecked(perk.agreed_on)}</time>
          </span>
        )}
      </p>
    </article>
  );
}

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
          {perk.indonesia && (
            <div>
              <dt>From Bali</dt>
              <dd>{perk.indonesia.note}</dd>
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
            {perk.claim_route === "partner" ? "See how on" : "Apply on"}{" "}
            {claimDomain(perk.claim_url)}
            <span className="gl-vh">
              {" "}
              for {perk.programme || perk.company} (opens in a new tab)
            </span>
          </a>
        )}
      </article>
    );
  }

  if (isUnavailable(perk)) {
    return (
      <article
        className="gl-pk gl-pk--ex gl-pk--off"
        id={`perk-${perk.id}`}
        data-perk-id={perk.id}
        aria-labelledby={headingId}
      >
        <span className="gl-stamp gl-stamp--long">Not available</span>
        <div className="gl-pk-top">
          <span className="gl-mark" aria-hidden="true">
            {letter}
          </span>
          <div>
            <h3 className="gl-pk-co" id={headingId}>
              {perk.company}
            </h3>
            <p className="gl-pk-prog">Not currently available</p>
          </div>
        </div>
        <p className="gl-pk-headline">Not currently available</p>
        {perk.one_line && <p className="gl-pk-one">{perk.one_line}</p>}
        <dl className="gl-pk-facts">
          <div>
            <dt>Listed example</dt>
            <dd>{perk.offer}</dd>
          </div>
          {perk.eligibility && (
            <div>
              <dt>Who the example was for</dt>
              <dd>{perk.eligibility}</dd>
            </div>
          )}
        </dl>
        {perk.status_note && <p className="gl-pk-not">{perk.status_note}</p>}
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
            <p className="gl-est">Open programmes checked by {CHECKED}</p>
            <h1 id="page-title">Member perks for founders and remote builders</h1>
            <p className="gl-lede">
              Bali Startup &amp; Tech is the community for founders, entrepreneurs
              and remote builders in Bali, and wherever you build from next.
              Public startup programmes are listed with a link to each vendor.
              Member offers with agreed terms are listed separately, and they are
              not claimable from this page while a code or partner link is still
              being set up.
            </p>
            <div className="gl-head-ctas">
              <Link className="gl-btn gl-btn-paper" href="/join?src=perks-head">
                Join the community
              </Link>
              <a className="gl-link" href="#member-offers">
                Member offers
              </a>
            </div>
          </div>
          <div className="gl-kinds gl-kinds--split">
            <div className="gl-kind-tile gl-kind-open">
              <b>{FACTS.open}</b>
              <h2>Open now</h2>
              <p className="gl-k-sub">Public startup programmes</p>
              <p>
                Read on each vendor&apos;s own page by {CHECKED}. You apply direct
                for {FACTS.direct} and through a partner referral for {FACTS.partner}.
                The vendor decides who gets in. Each one links to its page.
              </p>
            </div>
            <div className="gl-kind-tile gl-kind-terms">
              <b>{FACTS.withTerms}</b>
              <h2>Agreed terms</h2>
              <p className="gl-k-sub">
                {FACTS.confirmed} confirmed, {FACTS.approved} approved
              </p>
              <p>
                Terms are stated on each card. Claiming is not open on this page.
                Codes stay private, and partner or application links are not
                published here.
              </p>
            </div>
            {FACTS.pending > 0 && (
              <div className="gl-kind-tile gl-kind-wait">
                <b>{FACTS.pending}</b>
                <h2>Not claimable yet</h2>
                <p className="gl-k-sub">
                  {[
                    FACTS.activation ? `${FACTS.activation} activation pending` : "",
                    FACTS.terms ? `${FACTS.terms} terms pending` : "",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>
                  {FACTS.activation > 0 && (
                    <>
                      {FACTS.activation} {FACTS.activation === 1 ? "is" : "are"} agreed
                      and waiting on activation.{" "}
                    </>
                  )}
                  {FACTS.terms > 0 && (
                    <>
                      {FACTS.terms} {FACTS.terms === 1 ? "has" : "have"} an offer in,
                      with terms still being confirmed.
                    </>
                  )}
                </p>
              </div>
            )}
            <div className="gl-kind-tile gl-kind-ex">
              <span className="gl-stamp" aria-hidden="true">
                Example
              </span>
              <b>{FACTS.examples}</b>
              <h2>Example listings</h2>
              <p className="gl-k-sub">
                {FACTS.negotiatingTools} founder tools, {FACTS.negotiatingLocal} Bali
                partners
                {FACTS.unavailable > 0 ? `, ${FACTS.unavailable} not available` : ""}
              </p>
              <p>
                {FACTS.negotiating} are examples of members-only deals we are
                negotiating. Each one is stamped Example and has no link and no
                value.
                {FACTS.unavailable > 0 && (
                  <>
                    {" "}
                    {FACTS.unavailable}{" "}
                    {FACTS.unavailable === 1 ? "listing is" : "listings are"} not
                    currently available.
                  </>
                )}
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
              Member offers sit in their own sections. Public programmes and example
              listings follow, grouped by category. Values on open programmes are in
              US dollars, as each vendor states them. Member offers do not link out
              to a claim page.
            </p>
          </div>

          <PerkFinder index={perkIndex()} categories={PERK_CATEGORIES} />

          <nav className="gl-jump" id="perk-jump" aria-labelledby="jump-title">
            <h3 id="jump-title">Jump to a section</h3>
            <ul>
              {GROUPS.map((g) => (
                <li key={g.id}>
                  <a href={`#cat-${g.id}`}>
                    {g.title} ({g.perks.length})
                  </a>
                </li>
              ))}
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
        <div id="member-offers">
          {GROUPS.map((g) => (
            <section
              className="gl-cat"
              id={`cat-${g.id}`}
              data-perk-cat={g.id}
              aria-labelledby={`cat-${g.id}-h`}
              key={g.id}
            >
              <div className="gl-cat-head">
                <h2 id={`cat-${g.id}-h`}>{g.title}</h2>
                <p className="gl-cat-count" data-perk-count="">
                  {memberCount(g.perks)}
                </p>
              </div>
              <p className="gl-cat-intro">{g.intro}</p>
              <div className="gl-grid">
                {g.perks.map((perk) => (
                  <MemberCard perk={perk} key={perk.id} />
                ))}
              </div>
            </section>
          ))}
        </div>
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
                {catalogueCount(g)}
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
            Clear filters and show everything
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
            Join free. You get the chat and every event. Member offers are listed
            once the terms are agreed, and claiming opens when the code or partner
            link is ready.
          </p>
          <Link className="gl-btn gl-btn-paper" href="/join?src=perks-foot">
            Join the community
          </Link>
        </div>
      </section>
    </div>
  );
}
