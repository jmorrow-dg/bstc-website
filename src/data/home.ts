// Static homepage content for the Global league design. Wording is carried
// over from the previous homepage (origin/main, 25 Oct 2026) unless a comment
// says otherwise. Claims marked UNVERIFIED are kept as they were on the live
// site and need a decision (keep, soften or source) before launch; see
// REVIEW-NOTES.md.

export const FORMATS = [
  {
    title: "Networking Night",
    // UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)
    // ("40-80" and "Every 3rd Thursday")
    desc: "40-80 founders, engineers, and VCs. Open mic intros. Host-facilitated connections. Every 3rd Thursday.",
    image: "/images/events/networking-night.png",
    alt: "Illustrated poster for a BSTC Networking Night",
    href: "/events/flagship-networking-night-may-2026",
    linkLabel: "About Networking Night",
    badge: "Monthly",
    imagePosition: "50% 50%",
  },
  {
    title: "How I AI",
    desc: "Live AI builds by real practitioners. Intel Drop. Builder Spotlights. The Money Round. Real tools, real revenue.",
    image: "/images/events/how-i-ai-edition-1.png",
    alt: "Illustrated poster for How I AI",
    href: "/how-i-build-with-ai",
    linkLabel: "About How I AI",
    badge: "New series",
    imagePosition: "50% 60%",
  },
  {
    title: "Hackathon",
    desc: "Build something real in one day. Teams compete to ship products, demo in 3 minutes, and win prizes.",
    image: "/images/events/hackathon-edition-1.png",
    alt: "Illustrated poster for the BSTC Hackathon",
    href: "/events/hackathon-edition-1",
    linkLabel: "About the Hackathon",
    badge: "Coming soon",
    imagePosition: "50% 50%",
  },
] as const;

// UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)
// (the whole "Who's in the room" breakdown: 40 / 25 / 10 / 25)
export const ROOM_MIX = [
  { label: "Startup founders", pct: 40, className: "gl-c-founders" },
  { label: "Engineers & devs", pct: 25, className: "gl-c-engineers" },
  { label: "Investors & VCs", pct: 10, className: "gl-c-investors" },
  { label: "Operators", pct: 25, className: "gl-c-operators" },
] as const;

export const VALUES = [
  {
    title: "Signal > noise",
    description:
      "Every interaction should add value. We focus on substance over hype, builders over talkers.",
  },
  {
    title: "No hard selling",
    description:
      "Build relationships, not transactions. Leave the pitch at the door. Connect authentically.",
  },
  {
    title: "Builders first",
    description:
      "We prioritise founders and operators who are actually building things. Doers, not dreamers.",
  },
] as const;

// UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)
// (the "Members building at" band)
export const CREDIBILITY = [
  "Ex-Google",
  "Ex-Meta",
  "Ex-Stripe",
  "Ex-Shopify",
  "Ex-Uber",
  "Ex-Grab",
  "Ex-Sea",
  "Ex-Gojek",
  "YC Alumni",
  "Techstars",
] as const;

// Verbatim from the previous homepage. Mia's quote leads.
export const TESTIMONIALS = [
  {
    quote:
      "Thank you very much Bali Startup and Tech for being one of the best tech communities in Bali. You meet such awesome people who are genuinely building great things, it's a super social and community vibe and it's so needed especially when everyone is scaling with AI. Love these events!",
    name: "Mia",
    role: "Founder / CEO",
    context: "Regular attendee",
  },
  {
    quote:
      "This is the first time I've eaten fish in 15 years. Thanks for hosting the night.",
    name: "Tom",
    role: "LinkedIn Agency, $50K+ MRR",
    context: "At a BSTC private dinner",
  },
  {
    quote:
      "The quality of people in the room is unmatched. I've met more relevant connections at one BSTC event than six months of conferences.",
    name: "BSTC Member",
    role: "SaaS Founder, Series A",
    context: "Networking Night",
  },
  {
    quote:
      "The 'no hard selling' rule changes everything. You can have real conversations without watching your back. This is how tech events should be.",
    name: "BSTC Member",
    role: "Angel Investor",
    context: "Networking Night",
  },
] as const;

// Guides hub topics (from the approved mock-up). Any post not listed here
// still appears, under "More guides", so new posts never drop off the hub.
export const GUIDE_TOPICS: { title: string; slugs: string[] }[] = [
  {
    // Arrival funnel: partners link newcomers to /new-to-bali (the checklist).
    title: "New to Bali",
    slugs: [
      "new-to-bali-first-week-checklist",
      "banking-in-bali-for-foreigners",
      "running-an-agency-from-bali",
      "ecommerce-business-from-bali",
    ],
  },
  {
    title: "Finding your people in Bali",
    slugs: [
      "tech-communities-in-bali",
      "meet-founders-in-bali",
      "digital-nomad-community-bali",
    ],
  },
  {
    title: "Living in Bali",
    slugs: [
      "living-in-bali",
      "cost-of-living-bali-founder-2026",
      "canggu-founders-neighbourhood-guide",
      "best-coworking-spaces-bali-founders-2026",
      "best-bali-villas-founder-retreats-team-offsites-2026",
      "why-bali-for-startups",
      "bali-tech-ecosystem-2026-guide",
    ],
  },
  {
    title: "Company, visa and tax",
    slugs: [
      "indonesia-startup-visa-guide",
      "pt-pma-indonesia-founder-playbook-2026",
      "bali-founder-tax-guide-2026",
    ],
  },
  {
    title: "Hiring and teams",
    slugs: [
      "hiring-developers-indonesia-founders-guide-2026",
      "find-technical-cofounder-bali",
      "remote-team-management-from-bali",
    ],
  },
  {
    title: "AI",
    slugs: [
      "end-of-subsidised-ai-claude-code-pricing-sea-founders-2026",
      "ai-tools-founders-2026",
      "making-money-with-ai-2026",
      "rise-of-ai-agencies-bali",
      "state-of-ai-southeast-asia-2026",
    ],
  },
  {
    title: "Investors",
    slugs: [
      "bali-angel-investors-2026",
      "singapore-vcs-guide-southeast-asia-founders-2026",
      "what-investors-look-for-southeast-asia",
    ],
  },
  {
    title: "Events and community",
    slugs: [
      "what-is-bstc",
      "best-tech-events-bali",
      "how-to-network-at-tech-events",
      "how-to-run-tech-hackathon-bali-operator-playbook",
      "founder-spotlight-building-from-bali",
    ],
  },
  {
    title: "City comparisons",
    slugs: [
      "bali-vs-chiang-mai-vs-lisbon-founders-2026",
      "bali-vs-jakarta-for-founders-2026",
    ],
  },
];

// Perks teaser: six open programmes and three examples, by id in perks.json.
export const TEASER_OPEN_PERKS = ["cloudflare", "vercel", "posthog", "elevenlabs", "notion", "airwallex"];
export const TEASER_EXAMPLE_PERKS = ["lovable", "granola", "wispr-flow"];
