import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PhotoGallery from "@/components/events/PhotoGallery";
import EventProof from "@/components/events/EventProof";
import HistoryTable from "@/components/events/HistoryTable";
import { getAllEvents, getUpcomingEvents, formatEventDate } from "@/lib/content";
import { getFAQSchema } from "@/lib/schema";
import { getEventPhotos } from "@/lib/event-photos";
import {
  HISTORY_CHECKED,
  findEventPageForNight,
  getHistoryStats,
  getNights,
  shortDate,
} from "@/lib/event-history";
import { VENUES, formatVenueAddress, venueMapsUrl } from "@/lib/venues";

// The next dates come from the event files, judged on the Bali date: re-render hourly.
export const revalidate = 3600;

const STATS = getHistoryStats("drinks-and-dinner");
const YEMA_NIGHTS = getNights("drinks-and-dinner").filter((n) => n.venue === "Yema Kitchen").length;
const YEMA = VENUES.find((v) => v.name === "Yema Kitchen")!;

export const metadata: Metadata = {
  title: "Founder Networking Dinner in Canggu, Bali: Drinks & Dinner",
  description: `Drinks & Dinner is Bali Startup & Tech's free monthly founder night at Yema Kitchen, Canggu: a couple of short founder talks, then open networking. ${STATS.nights} nights since ${shortDate(STATS.firstDate)} (Meetup, ${HISTORY_CHECKED}).`,
  alternates: { canonical: "/drinks-and-dinner" },
  openGraph: {
    title: "Drinks & Dinner: the monthly founder night in Canggu",
    description:
      "A free monthly networking dinner for founders, builders and remote workers at Yema Kitchen in Canggu, Bali.",
    type: "website",
  },
};

const FAQS = [
  {
    question: "Is the Bali Startup & Tech dinner free?",
    answer:
      "Yes. There's no ticket. Everyone orders and pays for their own food and drinks at Yema Kitchen, and there's no set menu.",
  },
  {
    question: "When is Drinks & Dinner?",
    answer:
      "Once a month, usually on a Thursday, from 6:30pm Bali time. Check the next dates on this page and RSVP on each night's page.",
  },
  {
    question: "Where is it?",
    answer: `Yema Kitchen, ${formatVenueAddress(YEMA)}. Yema Kitchen hosts the night and the Bali Startup & Tech team moderates it.`,
  },
  {
    question: "What happens on the night?",
    answer:
      "A quick open mic with a couple of short founder talks, the real story and lessons behind what someone's building. Then the rest of the night is open networking. No hard selling.",
  },
  {
    question: "Who comes?",
    answer:
      "Real founders, builders and operators in Bali. Indie hackers, agency owners, solo devs, digital nomads and a few investors, all shipping something. New faces are welcome.",
  },
  {
    question: "Has it always been at Yema Kitchen?",
    answer: `Nearly always. ${YEMA_NIGHTS} of the ${STATS.nights} nights on Meetup since ${shortDate(STATS.firstDate)} were at Yema Kitchen. Berawa #36 was at Mata Berawa and Melbourne #1 was at Bells Hotel in South Melbourne (Meetup, ${HISTORY_CHECKED}).`,
  },
];

export default async function DrinksAndDinnerPage() {
  const allEvents = await getAllEvents();
  const now = new Date();
  const upcoming = getUpcomingEvents(allEvents, now).filter(
    (e) => e.frontmatter.type === "networking"
  );
  const nextDates = upcoming.slice(0, 6);
  const nights = getNights("drinks-and-dinner");
  const frontmatters = allEvents.map((e) => e.frontmatter);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema(FAQS)) }}
      />

      <div className="max-w-site mx-auto px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
            { label: "Drinks & Dinner" },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
              Monthly founder night
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Drinks &amp; Dinner: the monthly founder night in Canggu
            </h1>
            <p className="text-lg text-brand-grey leading-relaxed mb-4">
              Once a month, usually on a Thursday, founders, builders and remote
              workers in Bali meet over dinner and drinks at Yema Kitchen in
              Canggu. It&apos;s free to come. Everyone orders and pays for their
              own food and drinks, and there&apos;s no set menu.
            </p>
            <p className="text-lg text-brand-grey leading-relaxed mb-8">
              It&apos;s been running since {shortDate(STATS.firstDate)}, the
              first dinner on the BSTC Meetup group.
            </p>
            <div className="flex flex-wrap gap-3">
              {nextDates[0] && (
                <Link
                  href={`/events/${nextDates[0].frontmatter.slug}`}
                  className="gl-btn gl-btn-red"
                >
                  Next dinner: {shortDate(nextDates[0].frontmatter.date)}
                </Link>
              )}
              <Link href="/join?src=drinks-and-dinner-hero" className="gl-btn gl-btn-line">
                Join the community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Next dates */}
      <section className="pb-16 md:pb-20" id="next">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">Next dates</h2>
          {nextDates.length > 0 ? (
            <ul className="grid gap-3 md:grid-cols-2 list-none p-0 m-0">
              {nextDates.map(({ frontmatter: e }) => (
                <li key={e.slug} className="min-w-0">
                  <Link
                    href={`/events/${e.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-lg border border-ink/10 bg-white/70 p-4 hover:bg-white hover:border-brand-red/20 transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-brand-white group-hover:text-brand-red">
                        {formatEventDate(e.date)}
                      </span>
                      <span className="block text-sm text-brand-grey">
                        {e.time}
                        {e.endTime ? ` to ${e.endTime}` : ""} WITA, {e.venue}
                      </span>
                    </span>
                    <ArrowRight size={16} className="flex-shrink-0 text-brand-red" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-grey">
              The next date isn&apos;t up yet. <Link href="/events" className="gl-link">See all events</Link>.
            </p>
          )}
          {upcoming.length > nextDates.length && (
            <p className="mt-4 text-sm text-brand-grey">
              More dates are on <Link href="/events" className="gl-link">the events page</Link>.
            </p>
          )}
        </div>
      </section>

      {/* The night */}
      <section className="py-16 md:py-20 border-t border-ink/10">
        <div className="max-w-site mx-auto px-6 grid gap-10 md:grid-cols-2">
          <div className="min-w-0">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">How the night runs</h2>
            <ol className="space-y-5 list-none p-0 m-0">
              {[
                {
                  time: "6:30pm",
                  title: "Arrive and order",
                  text: "Grab a seat, order food and drinks and start talking to whoever's next to you.",
                },
                {
                  time: "Open mic",
                  title: "A couple of short founder talks",
                  text: "A quick open mic: the real story and lessons behind what someone's building.",
                },
                {
                  time: "After the talks",
                  title: "Open networking",
                  text: "The rest of the night is yours. No hard selling, no pressure.",
                },
              ].map((step) => (
                <li key={step.title} className="flex gap-4">
                  <span className="w-28 flex-shrink-0 text-brand-red font-mono text-sm pt-0.5">
                    {step.time}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-brand-white">{step.title}</span>
                    <span className="block text-sm text-brand-grey">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">Who&apos;s in the room</h2>
            <p className="text-brand-grey leading-relaxed mb-6">
              Real founders, builders and operators in Bali. Indie hackers,
              agency owners, solo devs, digital nomads and a few investors, all
              shipping something. No suits, no hard pitches.
            </p>
            <h3 className="text-sm font-medium uppercase tracking-wider text-brand-grey mb-2">Where</h3>
            <p className="flex items-start gap-2 text-brand-grey">
              <MapPin size={16} className="text-brand-red mt-1 flex-shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                Yema Kitchen, {formatVenueAddress(YEMA)}.{" "}
                <a
                  href={venueMapsUrl(YEMA)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gl-link"
                >
                  Open in Google Maps
                </a>
              </span>
            </p>
            <p className="flex items-start gap-2 text-brand-grey mt-2">
              <Clock size={16} className="text-brand-red mt-1 flex-shrink-0" aria-hidden="true" />
              <span>Monthly, usually on a Thursday, from 6:30pm Bali time.</span>
            </p>
            <p className="flex items-start gap-2 text-brand-grey mt-2">
              <Calendar size={16} className="text-brand-red mt-1 flex-shrink-0" aria-hidden="true" />
              <span>Free to attend. You pay for your own food and drinks.</span>
            </p>
            <p className="text-sm text-brand-grey mt-4">
              Yema Kitchen hosts the night. The Bali Startup &amp; Tech team moderates it.
            </p>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-16 md:py-20 border-t border-ink/10">
        <div className="max-w-site mx-auto px-6">
          <EventProof series="drinks-and-dinner" title="Every dinner since 2023" />
        </div>
      </section>

      {/* Photos */}
      <section className="py-16 md:py-20 border-t border-ink/10">
        <div className="max-w-site mx-auto px-6">
          <PhotoGallery photos={getEventPhotos("dinner").slice(0, 12)} />
        </div>
      </section>

      {/* History */}
      <section className="py-16 md:py-20 border-t border-ink/10" id="history">
        <div className="max-w-site mx-auto px-6">
          <HistoryTable
            nights={nights}
            pageFor={(n) => {
              const page = findEventPageForNight(n, frontmatters);
              return page ? `/events/${page.slug}` : undefined;
            }}
            title="Every past Drinks & Dinner"
            caption={`All ${nights.length} nights on Meetup since ${shortDate(STATS.firstDate)}, newest first: ${YEMA_NIGHTS} at Yema Kitchen, plus Berawa and Melbourne. RSVPs on Meetup, checked ${HISTORY_CHECKED}. Many people register on Luma instead, so these are Meetup RSVPs only.`}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 border-t border-ink/10">
        <div className="max-w-site mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
            Frequently asked questions
          </h2>
          <div className="max-w-3xl space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.question} className="p-6 rounded-lg border border-ink/10 bg-white/70">
                <h3 className="font-semibold text-brand-white mb-2">{faq.question}</h3>
                <p className="text-sm text-brand-grey leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join */}
      <section className="py-16 md:py-24 border-t border-ink/10">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Join Bali Startup &amp; Tech
          </h2>
          <p className="text-brand-grey max-w-lg mx-auto mb-8">
            Free to join. You&apos;ll get the community chat and a free member
            profile.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/join?src=drinks-and-dinner" className="gl-btn gl-btn-red">
              Join the community
            </Link>
            <Link href="/how-i-build-with-ai" className="gl-btn gl-btn-line">
              See How I AI
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
