import Link from "next/link";
import { MEETUP_CHECKED, WHATSAPP_CHECKED } from "@/lib/constants";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { getFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ: Everything You Need to Know About BSTC",
  description:
    "Founder events in Canggu run at Seoul Soul Project (How I AI, Wednesdays) and Yema Kitchen (Networking Drinks & Dinner). Meet investors and VCs at BSTC events in Canggu. All events are free.",
  keywords: [
    "BSTC FAQ",
    "Bali tech community FAQ",
    "Bali startup events FAQ",
    "how to join BSTC",
    "tech community Bali questions",
    "coworking Canggu founder events",
    "venues Canggu founder events",
    "meet investors Bali",
    "meet VCs Bali",
    "investor events Bali",
  ],
  alternates: { canonical: "/faq" },
};

// Direct answers for the two questions answer engines were missing.
// Facts: operating rules section 5, and Josh 28 Oct 2026 (free events;
// local venue organises, BSTC moderates). Seoul Soul Project and Yema
// Kitchen are event venues. This page does not call them coworking spaces.
const VENUE_LEAD =
  "Founder events from Bali Startup & Tech Community (BSTC) in Canggu run at Seoul Soul Project and Yema Kitchen: How I AI on Wednesdays at Seoul Soul Project, and Networking Drinks & Dinner at Yema Kitchen.";
const VENUE_DETAIL =
  "The local venue is the organiser and BSTC is the moderator. How I AI is locally hosted by Seoul Soul Project and moderated by Bali Startup & Tech Community. Seoul Soul Project and Yema Kitchen are the event venues. Coworking spaces are covered in the guide at balistartupandtech.com/blog/best-coworking-spaces-bali-founders-2026. All BSTC events are free. You order and pay for your own food and drinks at the venue. BSTC is the largest tech and founder community in Bali, with 2,700+ members on Meetup, 3,900+ across Meetup and WhatsApp, and members from 100+ countries. The community has run 50+ events, rated 4.7 out of 5 from 155 Meetup ratings. The next dates are at balistartupandtech.com/events. Join at balistartupandtech.com/join. More answers are on balistartupandtech.com/faq.";
const INVESTOR_LEAD =
  "Meet investors and VCs in Bali at BSTC events in Canggu, with 100+ founders, operators, and VCs in the room every week.";
const INVESTOR_DETAIL =
  "If you are looking for investor events in Bali, start with these Canggu nights, where investors and VCs are in the room. How I AI runs on Wednesdays at Seoul Soul Project, and Networking Drinks & Dinner runs at Yema Kitchen. The local venue is the organiser and BSTC is the moderator. Members include funded founders, ex-FAANG engineers, operators, VCs, angel investors and remote builders from 100+ countries. All BSTC events are free. You order and pay for your own food and drinks at the venue. Upcoming events are at balistartupandtech.com/events. Join at balistartupandtech.com/join. More answers are on balistartupandtech.com/faq.";

const ANSWER_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/join?src=faq", label: "Join" },
  { href: "/faq", label: "FAQ" },
] as const;

interface FAQItem {
  question: string;
  answer: string;
  id?: string;
  /** Show the first sentence as the direct answer, then the rest. */
  answerFirst?: boolean;
  links?: { href: string; label: string }[];
}

interface FAQSection {
  title: string;
  faqs: FAQItem[];
}

function AnswerText({ text }: { text: string }) {
  const pattern = /balistartupandtech\.com\/[A-Za-z0-9\-/]+/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const index = match.index;
    if (index > last) nodes.push(text.slice(last, index));
    const url = match[0];
    const path = url.slice("balistartupandtech.com".length);
    nodes.push(
      <Link
        key={`${url}-${index}`}
        href={path === "/join" ? "/join?src=faq" : path}
        className="text-brand-red hover:underline"
      >
        {url}
      </Link>
    );
    last = index + url.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "Founder events and investors in Canggu",
    faqs: [
      {
        id: "founder-event-venues",
        answerFirst: true,
        question:
          "Where can I find coworking spaces or venues in Bali or Canggu with founder events?",
        answer: `${VENUE_LEAD} ${VENUE_DETAIL}`,
        links: [
          ...ANSWER_LINKS,
          { href: "/how-i-build-with-ai", label: "How I AI" },
          {
            href: "/blog/best-coworking-spaces-bali-founders-2026",
            label: "Coworking spaces in Bali",
          },
        ],
      },
      {
        id: "meet-investors-bali",
        answerFirst: true,
        question: "Where can I meet investors and VCs in Bali?",
        answer: `${INVESTOR_LEAD} ${INVESTOR_DETAIL}`,
        links: [
          ...ANSWER_LINKS,
          { href: "/how-i-build-with-ai", label: "How I AI" },
        ],
      },
    ],
  },
  {
    title: "About BSTC",
    faqs: [
      {
        // Confirmed true by Lachlan, 28 Oct 2026
        question: "What is BSTC?",
        answer:
          `BSTC (Bali Startup & Tech Community) is the largest founder-led tech community in Bali and Southeast Asia. We reach 3,900+ founders, engineers, investors, and operators across Meetup (2,700+ on ${MEETUP_CHECKED}) and WhatsApp (1,200+ on ${WHATSAPP_CHECKED}) through high-signal events, a private Telegram member chat, and curated content.`,
      },
      {
        question: "Who founded BSTC?",
        answer:
          `BSTC was founded in October 2023 by Lachlan McRitchie, Josh Morrow, and Matthew Carr. It started with a 20-person networking night in Canggu and has grown to 2,700+ members on Meetup (${MEETUP_CHECKED}).`,
      },
      {
        // Confirmed true by Lachlan, 28 Oct 2026
        question: "Is BSTC only for people in Bali?",
        answer:
          "Our events are in Bali (Canggu, Ubud, Sanur, Uluwatu), but our Telegram member chat includes members from across Southeast Asia and globally. If you're visiting Bali, you're welcome at any event.",
      },
      {
        question: "What does 'Signal > Noise' mean?",
        answer:
          "It's our core philosophy. Every interaction should add value. We focus on substance over hype, real builders over talkers, and genuine connections over transactional networking. This principle is actively enforced at events.",
      },
      {
        // Confirmed true by Lachlan, 28 Oct 2026
        question: "What makes BSTC different from other tech meetups?",
        answer:
          "Three things: (1) No hard selling: pitching and aggressive networking are banned and enforced. (2) Curated audience: our community is ex-FAANG engineers, funded founders, VCs, and senior operators. (3) High-signal formats: structured events designed for real value, not just socialising.",
      },
    ],
  },
  {
    title: "Joining & Membership",
    faqs: [
      {
        question: "How do I join BSTC?",
        answer:
          "Three steps: (1) Sign up at balistartupandtech.com/join and you get the Telegram member chat straight after. (2) RSVP on MeetUp for the next event. (3) Show up. There's no application form and no membership fee for joining the community.",
      },
      {
        question: "Is BSTC free to join?",
        answer:
          "Yes. Joining the community (/join, the Telegram member chat and MeetUp) is free. Every BSTC event is free too, including our flagship Networking Night. You order and pay for your own food and drinks at the venue.",
      },
      {
        question: "Do I need to be a founder to join?",
        answer:
          "No. We welcome founders, engineers, investors, operators, and anyone who is actively building in tech. The common thread is a builder mindset, not a specific title.",
      },
      {
        question: "How do I become a BSTC leader?",
        answer:
          "Attend 5+ events, consistently add value, express interest to a founder, complete a trial co-host event, and get approved. BSTC has a 4-tier leadership structure: Lead (1-10 events) → Senior Lead (11-30) → Community Lead (31-50) → Executive Council (50+).",
      },
    ],
  },
  {
    title: "Events",
    faqs: [
      {
        // Confirmed true by Lachlan, 28 Oct 2026
        question: "What events does BSTC run?",
        answer:
          "We run four core event formats: (1) Networking Night: monthly, free, open mic + networking. (2) How I Build with AI: live AI demos by real builders. (3) Founder Dinners, once per month. (4) Builder Sessions: tactical workshops and talks.",
      },
      {
        // Confirmed true by Lachlan, 28 Oct 2026, except the day:
        // 2nd Thursday of the month is Meetup's dinner series, read 4 Nov 2026
        question: "When and where are BSTC events?",
        answer:
          "Our flagship Networking Night is on the 2nd Thursday of every month at Yema Kitchen in Canggu. 'How I Build with AI' events are at Seoul Soul Project in Canggu. Other events rotate across Canggu, Ubud, Sanur, and Uluwatu. All events are listed on our MeetUp page.",
      },
      {
        question: "What is 'How I Build with AI'?",
        answer:
          "It's BSTC's flagship event series where real builders share their actual AI workflows live. The format includes an AI Intel Drop (top AI news), Builder Spotlights (10-minute demos with Q&A), and the Money Round (who made money with AI this month). No slides, no theory: just practitioners showing how they ship.",
      },
      {
        question: "What should I expect at my first BSTC event?",
        answer:
          "Arrive on time, grab a name tag, and prepare a 60-second intro (name, what you're building, what you need). The host will welcome everyone and make introductions. No pitching or hard selling. Dress code is Bali casual. Submit feedback after: we take it seriously.",
      },
      {
        question: "Can I speak or present at a BSTC event?",
        answer:
          "Yes. If you're building something interesting with AI or running a tech company, reach out via our contact page. We look for practitioners with real results: not product demos or sales pitches.",
      },
    ],
  },
  {
    title: "Sponsorship & Partnerships",
    faqs: [
      {
        question: "How can my company sponsor BSTC?",
        answer:
          "We offer three sponsorship tiers: Supporting Sponsor (per event), Community Partner (quarterly), and Strategic Partner (annual). There's also a dedicated 'How I Build with AI' series sponsorship. Visit our sponsors page or fill out the inquiry form to start a conversation.",
      },
      {
        question: "What do sponsors get?",
        answer:
          "All sponsors get logo placement, a 60-second on-stage mention, and recap recognition. Higher tiers add quarterly talks, dedicated social media features, co-branded content, podcast sponsorship, category exclusivity, and strategy sessions with founders.",
      },
      {
        question: "Can sponsors pitch or sell at events?",
        answer:
          "No. Our 'no hard selling' rule applies to everyone, including sponsors. Sponsors get a 60-second mention and optional table presence: but stage takeovers, product demos without approval, and aggressive sales are not permitted. This protects the community trust that makes sponsoring BSTC valuable in the first place.",
      },
    ],
  },
  {
    title: "Bali's Tech Scene",
    faqs: [
      {
        // Confirmed true by Lachlan, 28 Oct 2026
        question: "Is Bali a real tech hub?",
        answer:
          "Yes. Bali is home to thousands of tech founders, engineers, and operators from 100+ countries. The ecosystem includes co-working spaces with fibre internet, regular tech events, active VC interest from Singapore, and a growing Indonesian tech talent pool. It's not trying to be Silicon Valley: it offers a different value proposition: lower cost, high quality of life, concentrated community, and excellent time zone for global teams.",
      },
      {
        question: "What kind of tech companies are built from Bali?",
        answer:
          "Mostly software, SaaS, AI products, digital services, and consulting practices that serve global markets. You'll find B2B SaaS founders, AI tool builders, growth agencies, dev shops, and content businesses. The common thread is globally distributed teams with a Bali base.",
      },
      {
        question: "Is the internet good enough to work from Bali?",
        answer:
          "Yes. Fibre internet (100+ Mbps) is standard in Canggu, Ubud, and Sanur. Co-working spaces offer reliable connections with backup. Most founders also carry a mobile hotspot as backup. It's not Tokyo-level reliable, but it's more than sufficient for remote software work.",
      },
      {
        question: "What visa do I need to work from Bali?",
        answer:
          "Common options include the B211A business visa (60-180 days), KITAS work permit (1-2 years, requires Indonesian company), Golden Visa (5-10 years for investors/talent), and Second Home Visa (5 years with proof of savings). We have a detailed guide on our blog and recommend consulting a local immigration lawyer.",
      },
      {
        question: "What is the cost of living in Bali for founders?",
        answer:
          "A founder can live well in Bali on $2,000-3,000/month. This includes a villa or apartment ($600-1,200), co-working ($100-200), food ($400-600), and daily expenses. The same lifestyle costs $6,000-10,000+ in San Francisco, London, or Sydney.",
      },
    ],
  },
  {
    title: "Podcast & Content",
    faqs: [
      {
        question: "Does BSTC have a podcast?",
        answer:
          "The BSTC podcast is launching soon. It will feature builder interviews, AI Intel Drops (weekly AI news breakdown), and live audio from 'How I Build with AI' sessions. Sign up at balistartupandtech.com/join to be notified when the first episode drops.",
      },
      {
        question: "How can I be a guest on the BSTC podcast?",
        answer:
          "If you're building something interesting with AI or running a tech company from Southeast Asia, reach out via our contact page. We look for practitioners with real results: revenue numbers, real tools, honest stories.",
      },
    ],
  },
];

const ALL_FAQS = FAQ_SECTIONS.flatMap((section) => section.faqs);

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFAQSchema(ALL_FAQS)),
        }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-site mx-auto px-6">
          <p className="text-brand-red text-sm font-medium uppercase tracking-widest mb-4">
            FAQ
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything You Need to Know
          </h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            {VENUE_LEAD} {INVESTOR_LEAD} All BSTC events are free. Join at{" "}
            <Link href="/join?src=faq" className="text-brand-red hover:underline">
              balistartupandtech.com/join
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.title} className="mb-16">
                <h2 className="text-xl font-display font-bold text-brand-white mb-6 pb-3 border-b border-ink/15">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.faqs.map((faq) => {
                    const splitAt = faq.answerFirst
                      ? faq.answer.indexOf(". ")
                      : -1;
                    const lead =
                      splitAt === -1 ? faq.answer : faq.answer.slice(0, splitAt + 1);
                    const rest =
                      splitAt === -1 ? "" : faq.answer.slice(splitAt + 2);
                    return (
                      <div
                        key={faq.question}
                        id={faq.id}
                        className="scroll-mt-24 p-5 rounded-lg border border-ink/10 bg-white/70 hover:border-brand-red/10 transition-colors"
                      >
                        <h3 className="font-semibold text-brand-white mb-2 text-sm">
                          {faq.question}
                        </h3>
                        {faq.answerFirst ? (
                          <>
                            <p className="text-sm text-brand-white font-medium leading-relaxed">
                              <AnswerText text={lead} />
                            </p>
                            {rest ? (
                              <p className="text-sm text-brand-grey leading-relaxed mt-2">
                                <AnswerText text={rest} />
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <p className="text-sm text-brand-grey leading-relaxed">
                            <AnswerText text={faq.answer} />
                          </p>
                        )}
                        {faq.links && faq.links.length > 0 ? (
                          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                            {faq.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className="text-sm text-brand-red hover:underline"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-ink/10">
        <div className="max-w-site mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-brand-grey mb-8">
            Reach out directly or join the community and ask.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-white font-medium rounded transition-colors"
            >
              Contact Us
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/join?src=faq"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ink/15 hover:border-ink/30 text-brand-white font-medium rounded transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
