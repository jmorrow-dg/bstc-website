// Single source for the public contact address (site copy, schema, forms).
// TODO(josh): hello@bstc.community is UNDELIVERABLE as of 25 Oct 2026:
// bstc.community returns no MX/A/NS records. Replace with a working,
// BSTC-owned inbox, then update public/llms.txt to match.
export const CONTACT_EMAIL = "hello@bstc.community";

// Organiser of record for events, used in Event schema `organizer`.
// Events now run with a local Indonesian host partner as the organiser of
// record, so BSTC must not be named as organiser.
// TODO(josh): fill in the host partner's name (and URL). While `name` is
// empty, Event schema omits `organizer` rather than naming BSTC. An event can
// override this with an `organizer:` block in its frontmatter.
export const EVENT_ORGANIZER: { name: string; url?: string } = {
  name: "",
  url: "",
};

export const SITE = {
  name: "BSTC",
  fullName: "Bali Startup & Tech Community",
  tagline: "Southeast Asia's Largest Tech Community",
  description:
    "Southeast Asia's largest founder-led tech community. Built in Bali with 2,500+ members from 40+ countries. Funded founders, ex-FAANG engineers, and investors. Signal over noise.",
  url: "https://balistartupandtech.com",
  domain: "balistartupandtech.com",
  altDomain: "bstc.community",
  meetup: "https://www.meetup.com/bali-start-ups-tech-community/",
  // Public join gate (Tally). The chat invite lives only on the form's
  // thank-you page, so it never appears in public code and can't be used to
  // bypass registration.
  joinForm: "https://tally.so/r/KY5AMM",
  memberDirectory: "https://tally.so/r/KY5AMM",
  linkedin: "https://www.linkedin.com/groups/14424020/",
  instagram: "https://www.instagram.com/bali_tech_community/",
  founded: "2023",
  location: "Canggu, Bali, Indonesia",
};

// One source for community stats. Hardcoded copy (incl. public/llms.txt) must
// match these values.
export const STATS = {
  members: 2500,
  events: 50,
  rating: 4.6,
  countries: 40,
};

export const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "How I AI", href: "/how-i-build-with-ai" },
  { label: "Podcast", href: "/podcast" },
  { label: "Community", href: "/community" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Blog", href: "/blog" },
] as const;

export const BRAND = {
  colors: {
    charcoal: "#111111",
    red: "#C81E1E",
    redDark: "#8B1A1A",
    redGlow: "#FF2E2E",
    white: "#F5F5F5",
    grey: "#888888",
    greyDark: "#333333",
  },
} as const;

// TODO(josh): fill these in as links/keys become available.
// All values are safe placeholders — the page renders gracefully when empty.
export const SPONSOR_CONFIG = {
  // Cal.com booking URL for sponsor intro calls. Leave "" to fall back to /sponsors/apply.
  // Example: "https://cal.com/josh-morrow/sponsor-intro"
  calUrl: "",

  // "As featured in" press hit. Leave title="" to hide the row.
  press: {
    title: "", // e.g. "Korea IT Times"
    url: "", // full article URL
    quote: "", // optional pull-quote (1 sentence)
  },

  // Logo wall. Add objects to render. Empty until partners are confirmed.
  // Anthropic pending global-partnership-program approval — do not add until approved.
  partners: [] as { name: string; url?: string; logoSrc?: string }[],

  // 20%-off pricing. Update here, not in the page component.
  tiers: {
    event: { price: 2000, period: "per event" },
    quarterly: { price: 9600, period: "per quarter" },
    annual: { price: 36000, period: "per year" },
  },
} as const;
