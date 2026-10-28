import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE, STATS } from "@/lib/constants";
import { getAllBlogPosts, getUpcomingEvents, getAllEvents } from "@/lib/content";
import { getFAQSchema } from "@/lib/schema";
import {
  fixtureLabel,
  fixtureWhen,
  formatLongDate,
  formatReadTime,
  toFixture,
  type Fixture,
} from "@/lib/fixtures";
import {
  EXAMPLE_PERKS,
  OPEN_PERKS,
  PERKS_CHECKED,
  formatChecked,
  pickPerks,
} from "@/lib/perks";
import { CITY_COMPARISONS } from "@/data/city-comparisons";
import { FOUNDERS, initials } from "@/data/founders";
import {
  CREDIBILITY,
  FORMATS,
  GUIDE_TOPICS,
  ROOM_MIX,
  TEASER_EXAMPLE_PERKS,
  TEASER_OPEN_PERKS,
  TESTIMONIALS,
  VALUES,
} from "@/data/home";
import LiveClock, { TimeDiff, VisitorClock } from "@/components/season/LiveClock";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

// Upcoming events are derived from the current Bali date, so re-render hourly.
export const revalidate = 3600;

// Confirmed true by Lachlan, 28 Oct 2026
// (answers 1, 3, 4 and 5: "Southeast Asia's largest", "2,700+ funded founders",
// "ex-FAANG", "100+ countries", "40 to 80", "active nodes in Ubud, Sanur, and
// Uluwatu", "every third Thursday"). Rendered visibly below and as FAQPage
// schema, both from this one list, so they always match.
const HOMEPAGE_FAQS = [
  {
    question: "What is BSTC?",
    answer:
      "BSTC (Bali Startup & Tech Community) is Southeast Asia's largest founder-led tech community. Founded in October 2023, it connects 2,700+ funded founders, ex-FAANG engineers, VCs, and operators from 100+ countries through high-signal events across Bali and Southeast Asia.",
  },
  {
    question: "Is BSTC free to join?",
    answer:
      "Yes. Joining BSTC is free. Sign up at balistartupandtech.com/join, get the Telegram community link straight after, and RSVP to most networking events at no cost. Some specialised formats like hackathons, founder roundtables, and ticketed editions of How I Build with AI may have a ticket fee to cover venue and operations.",
  },
  {
    question: "Who should join BSTC?",
    answer:
      "Funded founders, engineers, operators, angel investors, and VCs who are actively building or investing. BSTC is curated for signal over noise: no hard selling, no generic networking, no recruiters or service providers using it as a lead list. The average event has 40 to 80 serious builders in the room.",
  },
  {
    question: "Where does BSTC operate?",
    answer:
      "BSTC is headquartered in Canggu, Bali with active nodes in Ubud, Sanur, and Uluwatu. We are the largest founder-led tech community in Southeast Asia and expanding across the region. Members attend from 100+ countries and from across Southeast Asia.",
  },
  {
    question: "What events does BSTC run?",
    answer:
      "Three core formats. (1) Networking Nights: 40 to 80 builders, every third Thursday. (2) How I Build with AI: live AI builds from real practitioners with Intel Drops and Builder Spotlights. (3) Hackathons: one-day builds with team demos and prizes. Cadence is 4 to 6 events per month.",
  },
  {
    question: "How do I join BSTC?",
    answer:
      "Three steps. (1) Sign up at balistartupandtech.com/join and you get the Telegram member chat straight after, where events are announced. (2) RSVP to your first Networking Night on MeetUp. (3) Show up, introduce yourself, and add value. There is no application process and no membership fee.",
  },
];

const MEETUP_CHECKED = "25 Oct 2026";

function categoryLabel(category: string): string {
  const text = category.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function FixtureRow({ fixture, isNext }: { fixture: Fixture; isNext: boolean }) {
  const classes = ["gl-fx"];
  if (isNext) classes.push("gl-is-next");
  else if (fixture.isDinner) classes.push("gl-fx--dinner");
  const label = fixtureLabel(fixture).replace(/\.$/, "");
  return (
    <li className={classes.join(" ")}>
      <p className="gl-fx-num">
        <small>{fixture.numberLabel}</small>
        {fixture.number}
      </p>
      <span className="gl-fx-flag">Next up</span>
      <p className="gl-fx-date">
        <time dateTime={fixture.isoStart}>{fixture.shortDate}</time>
      </p>
      <h3 className="gl-fx-title">
        <Link href={`/events/${fixture.slug}`}>{fixture.name}</Link>
      </h3>
      {fixture.description && <p className="gl-fx-desc">{fixture.description}</p>}
      <p className="gl-fx-where">{fixture.venue}</p>
      <p className="gl-fx-time">{fixture.time ? `${fixture.time}, Bali time` : "Time to be confirmed"}</p>
      <div className="gl-fx-cta">
        {fixture.rsvpUrl ? (
          <a
            className="gl-btn gl-btn-line"
            href={fixture.rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`RSVP for ${label}, ${fixture.longDate} (opens in a new tab)`}
          >
            RSVP
          </a>
        ) : (
          <Link
            className="gl-btn gl-btn-line"
            href={`/events/${fixture.slug}`}
            aria-label={`Details for ${label}, ${fixture.longDate}`}
          >
            Details
          </Link>
        )}
      </div>
    </li>
  );
}

export default async function Home() {
  const [allPosts, allEvents] = await Promise.all([
    getAllBlogPosts(),
    getAllEvents(),
  ]);
  const latestPosts = allPosts.slice(0, 3);
  const latestSignal = allPosts.find(
    (p) => p.frontmatter.category === "thought-leadership"
  );
  const fixtures = getUpcomingEvents(allEvents)
    .map(toFixture)
    .filter((f): f is Fixture => f !== null);
  const next = fixtures[0];
  const faqSchema = getFAQSchema(HOMEPAGE_FAQS);

  // Guides hub: every post, grouped by topic; unlisted posts go last.
  const postBySlug = new Map(allPosts.map((p) => [p.frontmatter.slug, p]));
  const listed = new Set(GUIDE_TOPICS.flatMap((t) => t.slugs));
  const guideGroups = GUIDE_TOPICS.map((topic) => ({
    title: topic.title,
    posts: topic.slugs
      .map((slug) => postBySlug.get(slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
  }));
  const otherPosts = allPosts.filter((p) => !listed.has(p.frontmatter.slug));
  if (otherPosts.length) guideGroups.push({ title: "More guides", posts: otherPosts });
  const cityGroup = guideGroups.find((g) => g.title === "City comparisons");

  const teaserOpen = pickPerks(TEASER_OPEN_PERKS);
  const teaserExamples = pickPerks(TEASER_EXAMPLE_PERKS);
  const members = `${STATS.members.toLocaleString("en-US")}+`;

  return (
    <div className="gl-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Hero: the home field */}
      <section className="gl-hero gl-on-red" id="top" aria-labelledby="hero-title">
        <div className="gl-hero-grid">
          <div className="gl-hero-copy">
            <p className="gl-est">Est. October 2023 in Canggu, Bali</p>
            <h1 id="hero-title">Home ground in Bali. Members everywhere.</h1>
            <p className="gl-hero-lede">
              <strong>
                Bali Startup &amp; Tech is the community for founders,
                entrepreneurs and remote builders in Bali, and wherever you build
                from next.
              </strong>{" "}
              Meet at our events in Canggu, join the chat, and keep your place in
              it when you move on. High-signal events. Zero noise.
            </p>
            <div className="gl-hero-ctas">
              <Link className="gl-btn gl-btn-paper" href="/join?src=home-hero">
                Join the community
              </Link>
              <a className="gl-link" href="#fixtures">
                See upcoming events
              </a>
            </div>
          </div>
          <figure className="gl-duo">
            <Image
              src="/images/photos/events/2024-11_bstc_atmospheric-venue.jpg"
              alt="A packed garden venue at night in Canggu, the crowd facing a speaker and screen under trees and hanging lamps."
              fill
              priority
              sizes="(max-width: 760px) 100vw, 43vw"
            />
            <figcaption className="gl-home-clock">
              <span>
                <LiveClock tz="Asia/Makassar" fallback="Bali time" longDay />
              </span>
              <p>WITA in Canggu right now</p>
            </figcaption>
          </figure>
        </div>
        <div className="gl-next-strip gl-on-navy">
          <div className="gl-wrap">
            <span className="gl-tag">Next home fixture</span>
            {next ? (
              <>
                <p>
                  <strong>{fixtureLabel(next)}</strong> {fixtureWhen(next)}
                </p>
                {next.rsvpUrl ? (
                  <a className="gl-link" href={next.rsvpUrl} target="_blank" rel="noopener noreferrer">
                    RSVP<span className="gl-vh"> for {fixtureLabel(next)} (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link className="gl-link" href={`/events/${next.slug}`}>
                    Event details
                  </Link>
                )}
              </>
            ) : (
              <>
                <p>New fixtures are on the way. Join the community to hear first.</p>
                <Link className="gl-link" href="/join?src=home-fixtures-empty">
                  Join to hear first
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. Stats bar, as a scoreboard */}
      <section className="gl-score-sec" aria-labelledby="score-title">
        <div className="gl-wrap">
          <h2 className="gl-vh" id="score-title">
            The community in numbers
          </h2>
          <dl className="gl-score">
            <div>
              <dt>members on Meetup</dt>
              <dd>{members}</dd>
            </div>
            <div>
              <dt>events hosted since October 2023</dt>
              <dd>{STATS.events}+</dd>
            </div>
            <div>
              <dt>average rating on Meetup, from {STATS.ratingCount} ratings</dt>
              <dd className="gl-red">{STATS.rating}</dd>
            </div>
            <div>
              {/* Confirmed true by Lachlan, 28 Oct 2026 */}
              <dt>countries represented</dt>
              <dd>{STATS.countries}+</dd>
            </div>
          </dl>
          <p className="gl-score-note">
            Meetup figures checked {MEETUP_CHECKED}: 2,734 members, rated{" "}
            {STATS.rating} from {STATS.ratingCount} ratings.
          </p>
        </div>
      </section>

      {/* 6. Upcoming events, as the fixture board */}
      <section className="gl-sec" id="fixtures" aria-labelledby="fx-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <div>
              <p className="gl-eyebrow">Home fixtures</p>
              <h2 id="fx-title">Next up in the community</h2>
            </div>
            <p>
              The next events on the calendar, soonest first. Times are Bali time
              (WITA). RSVP so we can plan the room.
            </p>
          </div>
          {fixtures.length > 0 ? (
            <ol className="gl-board">
              {fixtures.map((f, i) => (
                <FixtureRow fixture={f} isNext={i === 0} key={f.slug} />
              ))}
            </ol>
          ) : (
            <p className="gl-board-done">
              No events are listed right now. Join the community to hear about the
              next one first.
            </p>
          )}
          <div className="gl-board-foot">
            <p>Join the community to get every new event in the chat.</p>
            <Link className="gl-link" href="/events">
              All events, past and upcoming
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Three ways to connect, at the home ground */}
      <section className="gl-sec gl-sec-tight" id="home-ground" aria-labelledby="hg-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <div>
              <p className="gl-eyebrow">The home ground</p>
              <h2 id="hg-title">Three ways to connect</h2>
            </div>
            <p>
              Monthly networking. Live AI builds. Full-day hackathons. Every format
              designed for signal over noise.
            </p>
          </div>
          <div className="gl-rooms">
            <figure className="gl-room gl-room-a">
              <Image
                src="/images/photos/events/2024-11_bstc_packed-house.jpg"
                alt="A packed crowd standing under a timber roof in Canggu, facing a presentation screen."
                fill
                sizes="(max-width: 760px) 100vw, 66vw"
              />
              <figcaption className="gl-stat">
                <b>{STATS.events}+</b>
                <span>events since October 2023</span>
              </figcaption>
            </figure>
            <figure className="gl-room gl-room-b">
              <Image
                src="/images/photos/events/2024-10_bstc_speaker-presentation.jpg"
                alt="A speaker with a microphone presenting a slide under string lights."
                fill
                sizes="(max-width: 760px) 100vw, 33vw"
              />
              <figcaption className="gl-stat">
                <b>{STATS.rating}</b>
                <span>on Meetup, from {STATS.ratingCount} ratings</span>
              </figcaption>
            </figure>
          </div>

          <div className="gl-ways">
            <ul className="gl-formats">
              {FORMATS.map((format) => (
                <li className="gl-fmt" key={format.title}>
                  <figure className="gl-fmt-poster">
                    <Image
                      src={format.image}
                      alt={format.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, 33vw"
                      style={{ objectPosition: format.imagePosition }}
                    />
                    <figcaption className="gl-tag">{format.badge}</figcaption>
                  </figure>
                  <h3>{format.title}</h3>
                  {/* Networking Night: Confirmed true by Lachlan, 28 Oct 2026 */}
                  <p>{format.desc}</p>
                  <Link className="gl-link" href={format.href}>
                    {format.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="gl-ways-foot">
              <Link className="gl-btn gl-btn-line" href="/events">
                See all events
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 7 + 8. Who's in the room, and what we stand for */}
      <section className="gl-sec gl-sec-tight" id="the-room" aria-label="Who's in the room and what we stand for">
        <div className="gl-wrap gl-room-grid">
          <div>
            {/* Confirmed true by Lachlan, 28 Oct 2026 */}
            <h2 id="room-title">Who&apos;s in the room</h2>
            <p>
              This isn&apos;t a casual meetup. The people who show up are building
              real things.
            </p>
            <div className="gl-mix">
              <div className="gl-mix-bar" aria-hidden="true">
                {ROOM_MIX.map((role) => (
                  <span
                    key={role.label}
                    className={role.className}
                    style={{ width: `${role.pct}%` }}
                  />
                ))}
              </div>
              <ul className="gl-mix-key">
                {ROOM_MIX.map((role) => (
                  <li key={role.label}>
                    <i className={role.className} />
                    <b>{role.pct}%</b>
                    <span>{role.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h2 id="values-title">What we stand for</h2>
            <p>These aren&apos;t just words. They&apos;re enforced at every event.</p>
            <ul className="gl-values">
              {VALUES.map((value) => (
                <li key={value.title}>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Credibility band */}
      <section className="gl-cred" aria-labelledby="cred-title">
        <div className="gl-wrap">
          {/* Confirmed true by Lachlan, 28 Oct 2026 */}
          <h2 id="cred-title">Members building at</h2>
          <ul className="gl-cred-list">
            {CREDIBILITY.map((org) => (
              <li key={org}>{org}</li>
            ))}
          </ul>
          <p className="gl-cred-cap">
            Representing the career backgrounds of active BSTC members.
          </p>
        </div>
      </section>

      {/* New: Members, as a team sheet */}
      <section className="gl-sec gl-members gl-on-navy" id="members" aria-labelledby="mem-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <h2 id="mem-title">Members</h2>
            <p>
              The co-founders who run Bali Startup &amp; Tech, with the time where
              each one is based right now. Members find each other in the member
              directory after the night ends, wherever they&apos;ve moved since.
            </p>
          </div>

          <ul className="gl-squad">
            {FOUNDERS.map((person) => (
              <li className="gl-player" key={person.name}>
                <span className="gl-initials" aria-hidden="true">
                  {initials(person.name)}
                </span>
                <span className="gl-tier">{person.tier}</span>
                <h3>{person.name}</h3>
                <p className="gl-role">{person.role}</p>
                <div className="gl-p-city">
                  <span>{person.city}</span>
                  <p className="gl-clock">
                    <LiveClock tz={person.timeZone} fallback={person.utcLabel} />
                  </p>
                  {person.homeGround ? (
                    <span className="gl-home-tag">Home ground</span>
                  ) : (
                    <span className="gl-diff">
                      <TimeDiff tz={person.timeZone} fallback="Local time" />
                    </span>
                  )}
                </div>
                <p className="gl-bio">{person.bio}</p>
                <p className="gl-p-links">
                  <a href={person.profileUrl} aria-label={`${person.name}'s full profile`}>
                    Full profile
                  </a>
                  <Link href="/leadership">Leadership</Link>
                </p>
              </li>
            ))}
          </ul>

          <div className="gl-spot">
            <div>
              <h3>Your spot in Members</h3>
              <p>
                Join and you get your own page in the member directory: your photo,
                your company, what you&apos;re building and a link to your site. It
                goes live once you&apos;ve joined, wherever you&apos;re building
                from.
              </p>
              <VisitorClock />
            </div>
            <div className="gl-spot-actions">
              <Link className="gl-btn gl-btn-paper" href="/join?src=home-members">
                Join and get your page
              </Link>
              <Link className="gl-link" href="/members">
                Meet the Bali members
              </Link>
              <a className="gl-link" href="https://remotebuilders.io/directory/">
                See the member directory
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="gl-sec" id="reviews" aria-labelledby="rev-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <h2 id="rev-title">From the community</h2>
            <p className="gl-rating">
              <b>{STATS.rating}</b>
              <span>from {STATS.ratingCount} ratings on Meetup</span>
            </p>
          </div>
          <ul className="gl-quotes">
            {TESTIMONIALS.map((t, i) => (
              <li className={i === 0 ? "gl-q gl-q--lead" : "gl-q"} key={t.quote}>
                <blockquote>
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <p className="gl-q-who">
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                  <span className="gl-ctx">{t.context}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* New: perks teaser */}
      <section className="gl-sec gl-sec-tight" id="perks" aria-labelledby="perks-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <h2 id="perks-title">Perks that travel with you</h2>
            <p>
              Software perks work wherever you build from. {OPEN_PERKS.length}{" "}
              startup programmes are open to apply for now, each checked on the
              vendor&apos;s own page on {formatChecked(PERKS_CHECKED)}. Another{" "}
              {EXAMPLE_PERKS.length} are examples of members-only deals we&apos;re
              negotiating with founder tools and Bali partners. None of those are
              agreed yet, so they&apos;re labelled Example.
            </p>
          </div>
          <div className="gl-perks">
            <div className="gl-perk-col">
              <h3>Open now</h3>
              <p>
                Public startup programmes. You apply direct and the vendor decides
                who&apos;s eligible.
              </p>
              <ul className="gl-perk-list">
                {teaserOpen.map((perk) => (
                  <li className="gl-perk" key={perk.id}>
                    <span className="gl-mark" aria-hidden="true">
                      {perk.company.charAt(0)}
                    </span>
                    <div>
                      <p className="gl-perk-co">{perk.company}</p>
                      <p className="gl-perk-offer">{perk.headline || perk.offer}</p>
                      <p className="gl-perk-cat">{perk.category}</p>
                    </div>
                    {perk.claim_url && (
                      <a className="gl-link" href={perk.claim_url} target="_blank" rel="noopener">
                        Apply
                        <span className="gl-vh">
                          {" "}
                          for {perk.programme || perk.company} (opens in a new tab)
                        </span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="gl-ex-box">
              <h3>Member deals</h3>
              <p>Examples of the members-only deals we&apos;re negotiating. None are live yet.</p>
              <ul className="gl-perk-list">
                {teaserExamples.map((perk) => (
                  <li className="gl-perk gl-perk--ex" key={perk.id}>
                    <span className="gl-mark" aria-hidden="true">
                      {perk.company.charAt(0)}
                    </span>
                    <div>
                      <p className="gl-perk-co">
                        {perk.company} <span className="gl-ex">Example</span>
                      </p>
                      <p className="gl-perk-offer">{perk.offer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="gl-perk-foot">
            <Link className="gl-perk-all" href="/perks">
              See all {OPEN_PERKS.length + EXAMPLE_PERKS.length} perks
            </Link>
            <Link className="gl-btn gl-btn-red" href="/join?src=home-perks">
              Join to get member deals
            </Link>
          </div>
        </div>
      </section>

      {/* 3 + 10. Latest from the blog, led by this week's signal */}
      <section className="gl-sec gl-sec-tight" id="blog" aria-labelledby="blog-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <h2 id="blog-title">Latest from the blog</h2>
            <p>Operator-written guides on building from Bali and Southeast Asia.</p>
          </div>

          {latestSignal && (
            <article className="gl-signal" aria-labelledby="signal-title">
              <div className="gl-signal-meta">
                <span className="gl-tag">This week&apos;s signal</span>
                <p>
                  <time dateTime={latestSignal.frontmatter.date}>
                    {formatLongDate(latestSignal.frontmatter.date)}
                  </time>
                  {latestSignal.frontmatter.readTime
                    ? `, ${formatReadTime(latestSignal.frontmatter.readTime)}`
                    : ""}
                </p>
                <p>By {latestSignal.frontmatter.author}</p>
              </div>
              <div className="gl-signal-body">
                <h2 id="signal-title" className="gl-signal-title">
                  <Link href={`/blog/${latestSignal.frontmatter.slug}`}>
                    {latestSignal.frontmatter.title}
                  </Link>
                </h2>
                <p>{latestSignal.frontmatter.excerpt}</p>
                <Link className="gl-link" href={`/blog/${latestSignal.frontmatter.slug}`}>
                  Read the full signal
                </Link>
              </div>
            </article>
          )}

          <ul className="gl-latest" aria-label="Latest posts">
            {latestPosts.map((post) => (
              <li key={post.frontmatter.slug}>
                <p className="gl-post-cat">{categoryLabel(post.frontmatter.category)}</p>
                <h3>
                  <Link href={`/blog/${post.frontmatter.slug}`}>{post.frontmatter.title}</Link>
                </h3>
                <p>
                  <time dateTime={post.frontmatter.date}>
                    {formatLongDate(post.frontmatter.date)}
                  </time>
                  {post.frontmatter.readTime
                    ? `, ${formatReadTime(post.frontmatter.readTime)}`
                    : ""}
                </p>
              </li>
            ))}
          </ul>
          <p className="gl-blog-foot">
            <Link className="gl-btn gl-btn-line" href="/blog">
              View all posts
            </Link>
          </p>
        </div>
      </section>

      {/* New: guides hub */}
      <section className="gl-sec gl-white" id="guides" aria-labelledby="guides-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <h2 id="guides-title">Guides for building from Bali</h2>
            <p>
              Everything we&apos;ve written for founders and remote builders: moving
              here, setting up a company, hiring, AI, raising money, and how Bali
              compares with the other places you might build from.
            </p>
          </div>
          <div className="gl-guides">
            {guideGroups.map((group) => (
              <div className="gl-guide-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.posts.map((post) => (
                    <li key={post.frontmatter.slug}>
                      <Link href={`/blog/${post.frontmatter.slug}`}>
                        {post.frontmatter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {group === cityGroup && (
                  <div className="gl-cities-vs" aria-label="Bali compared with other cities for founders">
                    {CITY_COMPARISONS.map((c) => (
                      <Link key={c.slug} href={`/bali-vs/${c.slug}`}>
                        Bali vs {c.city}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="gl-more">
            <Link href="/how-i-build-with-ai">
              <b>How I AI archive</b>
              <span>Every edition of the How I AI builder series.</span>
            </Link>
            <Link href="/events">
              <b>Past events</b>
              <span>Earlier events, with recaps where we have them.</span>
            </Link>
            <Link href="/resources">
              <b>Resources</b>
              <span>Tools, platforms and resources members use.</span>
            </Link>
            <Link href="/blog">
              <b>All posts</b>
              <span>The full blog, newest first.</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Homepage FAQ, visible, with the same answers as the schema */}
      <section className="gl-sec" id="faq" aria-labelledby="faq-title">
        <div className="gl-wrap">
          <div className="gl-sec-head">
            <h2 id="faq-title">Questions people ask</h2>
            <p>
              The short answers. There&apos;s more on the{" "}
              <Link className="gl-link" href="/faq">
                FAQ page
              </Link>
              .
            </p>
          </div>
          {/* Confirmed true by Lachlan, 28 Oct 2026 */}
          <dl className="gl-faq">
            {HOMEPAGE_FAQS.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* New: partners band */}
      <section className="gl-partner" id="partners" aria-labelledby="partner-title">
        <div className="gl-wrap">
          <h2 id="partner-title">Partners and sponsors</h2>
          <p>
            Back our events, or offer members a deal on your product, and put your
            company in front of the founders, engineers and operators in the room
            and in the chat.
          </p>
          <Link className="gl-btn gl-btn-line" href="/sponsors">
            Partner with BSTC
          </Link>
        </div>
      </section>

      {/* 12. Join CTA */}
      <section className="gl-final gl-on-red" id="join" aria-labelledby="final-title">
        <div className="gl-wrap">
          <span className="gl-crest" aria-hidden="true" />
          <p className="gl-pre">Join from anywhere</p>
          <h2 id="final-title">Ready to join?</h2>
          <p>
            Join {members} founders, engineers, and operators building the future
            from Southeast Asia.
          </p>
          <div className="gl-final-ctas">
            <Link className="gl-btn gl-btn-paper" href="/join?src=home-final">
              Join the community
            </Link>
            <a className="gl-link" href={SITE.meetup} target="_blank" rel="noopener noreferrer">
              RSVP on Meetup
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
