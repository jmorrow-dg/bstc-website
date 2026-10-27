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
  // UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)
  tagline: "Southeast Asia's Largest Tech Community",
  description:
    // UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)
    "Southeast Asia's largest founder-led tech community. Built in Bali with 2,700+ members from 40+ countries. Funded founders, ex-FAANG engineers, and investors. Signal over noise.",
  // The host Vercel serves: the bare domain redirects to www, so canonicals,
  // the sitemap and schema use www. If the bare domain is ever made primary in
  // Vercel, change this back in the same release.
  url: "https://www.balistartupandtech.com",
  domain: "balistartupandtech.com",
  altDomain: "bstc.community",
  meetup: "https://www.meetup.com/bali-start-ups-tech-community/",
  // Public join gate: the native /join form (rewritten to bstc-join), which
  // saves each member before showing the chat link, so the invite never
  // appears in public code. Call sites add ?src=<placement> for attribution.
  // Replaced the Tally form (https://tally.so/r/KY5AMM) on 26 Oct 2026.
  joinForm: "/join",
  // Public member directory (Remote Builders); joining via /join adds a profile.
  memberDirectory: "https://remotebuilders.io/directory/",
  linkedin: "https://www.linkedin.com/groups/14424020/",
  instagram: "https://www.instagram.com/bali_tech_community/",
  founded: "2023",
  location: "Canggu, Bali, Indonesia",
};

// One source for community stats. Hardcoded copy (incl. public/llms.txt) must
// match these values.
// Source: the BSTC Meetup group page
// (https://www.meetup.com/bali-start-ups-tech-community/), fetched 25 Oct 2026
// (evening WITA): 2,734 members, rating 4.7 from 155 ratings, 54 past events.
// Shown rounded down: members "2,700+", events "50+".
export const STATS = {
  members: 2700,
  events: 50,
  rating: 4.7,
  ratingCount: 155,
  // UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)
  countries: 40,
};

export const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "How I AI", href: "/how-i-build-with-ai" },
  { label: "Members", href: "/#members" },
  { label: "Perks", href: "/perks" },
  { label: "Podcast", href: "/podcast" },
  { label: "Community", href: "/community" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Blog", href: "/blog" },
] as const;

// Global league "Season" kit (25 Oct 2026). Mirrors tailwind.config.ts.
export const BRAND = {
  colors: {
    paper: "#F4F4F1",
    red: "#B5241F",
    redDeep: "#7E1714",
    navy: "#13213C",
    chalk: "#DCDAD3",
    crest: "#1A1A1A",
    white: "#FFFFFF",
    slate: "#4A5468",
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
