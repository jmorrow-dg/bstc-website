import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ: Everything You Need to Know About BSTC",
  description:
    "Frequently asked questions about Bali Startup & Tech Community. Events, membership, sponsorship, Bali's tech scene, and how to get involved.",
  keywords: [
    "BSTC FAQ",
    "Bali tech community FAQ",
    "Bali startup events FAQ",
    "how to join BSTC",
    "tech community Bali questions",
  ],
};

interface FAQSection {
  title: string;
  faqs: { question: string; answer: string }[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "About BSTC",
    faqs: [
      {
        question: "What is BSTC?",
        answer:
          "BSTC (Bali Startup & Tech Community) is the largest founder-led tech community in Bali and Southeast Asia. We connect 2,500+ founders, engineers, investors, and operators through high-signal events, a private WhatsApp community, and curated content.",
      },
      {
        question: "Who founded BSTC?",
        answer:
          "BSTC was founded in October 2023 by Lachlan McRitchie, Josh Morrow, and Matthew Carr. It started with a 20-person networking night in Canggu and has grown to 2,500+ members.",
      },
      {
        question: "Is BSTC only for people in Bali?",
        answer:
          "Our events are in Bali (Canggu, Ubud, Sanur, Uluwatu), but our WhatsApp community includes members from across Southeast Asia and globally. If you're visiting Bali, you're welcome at any event.",
      },
      {
        question: "What does 'Signal > Noise' mean?",
        answer:
          "It's our core philosophy. Every interaction should add value. We focus on substance over hype, real builders over talkers, and genuine connections over transactional networking. This principle is actively enforced at events.",
      },
      {
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
          "Three steps: (1) Join our WhatsApp community for updates. (2) RSVP on MeetUp for the next event. (3) Show up. There's no application form and no membership fee for joining the community.",
      },
      {
        question: "Is BSTC free to join?",
        answer:
          "Yes. Joining the community (WhatsApp + MeetUp) is free. Most events are free, including our flagship Networking Night. Some premium events like Founder Roundtables and workshops may have a ticket price.",
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
        question: "What events does BSTC run?",
        answer:
          "We run four core event formats: (1) Networking Night: monthly, 40-80 people, free, open mic + networking. (2) How I Build with AI: live AI demos by real builders. (3) Founder Roundtable: max 20, $20K+ MRR founders only, confidential. (4) Builder Sessions: tactical workshops and talks.",
      },
      {
        question: "When and where are BSTC events?",
        answer:
          "Our flagship Networking Night is every 3rd Thursday at Yema Kitchen in Canggu. 'How I Build with AI' events are at Seoul Seoul Project in Canggu. Other events rotate across Canggu, Ubud, Sanur, and Uluwatu. All events are listed on our MeetUp page.",
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
        question: "Is Bali a real tech hub?",
        answer:
          "Yes. Bali is home to thousands of tech founders, engineers, and operators from 40+ countries. The ecosystem includes co-working spaces with fibre internet, regular tech events, active VC interest from Singapore, and a growing Indonesian tech talent pool. It's not trying to be Silicon Valley: it offers a different value proposition: lower cost, high quality of life, concentrated community, and excellent time zone for global teams.",
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
          "The BSTC podcast is launching soon. It will feature builder interviews, AI Intel Drops (weekly AI news breakdown), and live audio from 'How I Build with AI' sessions. Subscribe to our WhatsApp community to be notified when the first episode drops.",
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
            Answers to the most common questions about BSTC, our events,
            Bali&apos;s tech scene, and how to get involved.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-site mx-auto px-6">
          <div className="max-w-3xl">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.title} className="mb-16">
                <h2 className="text-xl font-display font-bold text-brand-white mb-6 pb-3 border-b border-white/10">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="p-5 rounded-lg border border-white/5 bg-white/[0.02] hover:border-brand-red/10 transition-colors"
                    >
                      <h3 className="font-semibold text-brand-white mb-2 text-sm">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-brand-grey leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-white/5">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-red hover:bg-brand-red-dark text-brand-white font-medium rounded transition-colors"
            >
              Contact Us
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-brand-white font-medium rounded transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
