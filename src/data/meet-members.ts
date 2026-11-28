// "Members you'll meet" on the home page (28 Nov 2026).
//
// Each person has a public profile on Remote Builders (the global community
// from the BSTC team) and chose to publish it. The card shows what they wrote:
// name, company, city and the one line from their profile, read from the
// profiles feed at https://remotebuilders.io/directory/profiles.json on
// 28 Nov 2026. Each card links to the profile at
// https://remotebuilders.io/directory/<slug>/. The pictures are the 480 px
// WebP crops Remote Builders serves for its own home page, copied to
// public/images/members/<slug>.webp (never hotlinked).
//
// To add or swap someone: pick a member with a real face photo from the feed,
// copy https://remotebuilders.io/assets/directory/faces/<slug>.webp here, and
// add a row. tests/home-credibility.test.mjs checks the picture, the profile
// link and the card count (6 to 9).

export const MEET_CHECKED = "28 Nov 2026";

export type MeetMember = {
  slug: string;
  name: string;
  company: string;
  /** The member's own one-liner from their public profile. */
  line: string;
  /** Omitted when the profile shows no city. */
  city?: string;
};

export const MEET_MEMBERS: MeetMember[] = [
  {
    slug: "ivy-editor",
    name: "Momo",
    company: "Ivy Editor",
    line: "Turns training videos into interactive courses with quizzes, hotspots and branching",
    city: "Southeast Asia",
  },
  {
    slug: "amanda",
    name: "Amanda Leon",
    company: "Unrth",
    line: "Strategic design and innovation lab building brands, websites and client platforms for B2B companies.",
  },
  {
    slug: "semerez-growth-agency",
    name: "Daniil Semerez",
    company: "Semerez Growth Agency",
    line: "Businesses in the EU and the US that want to advertise on ChatGPT.",
    city: "Canggu",
  },
  {
    slug: "pulsemail",
    name: "Yereth Jansen",
    company: "PulseMail",
    line: "One organised inbox with built-in AI help, for founders and professionals tired of managing email",
    city: "Los Angeles",
  },
  {
    slug: "retalent-agency",
    name: "Alina Iurina",
    company: "Retalent Agency",
    line: "Recruitment agency hiring senior remote talent from Latin America and Eastern Europe",
    city: "Canggu",
  },
  {
    slug: "bulkpro-by-behelpme-com",
    name: "Gazi Md Mostakim Rahaman",
    company: "Bulkpro by Behelpme.com",
    line: "Shopify apps for bulk order import, bulk product editing, login pages and AI SEO",
    city: "Kolkata/Bali/Jakarta/Dubai",
  },
  {
    slug: "arete-ventures",
    name: "Lorenzo Ego",
    company: "Arete Ventures",
    line: "B2B tech companies that want AI-powered go-to-market systems and growth automation.",
    city: "Canggu",
  },
  {
    slug: "carla-jimenez",
    name: "Carla Jiménez González",
    company: "Carla Jiménez",
    line: "Business strategy and digital product builds for founders starting or growing a business",
    city: "Pererenan",
  },
  {
    slug: "mapf",
    name: "Hugo",
    company: "mapf",
    line: "The map of right now: where to go this hour, for you and the AI agents choosing for you",
    city: "Tin Shui Wai",
  },
];

export const MEET_SOURCE =
  "Members with a public profile on Remote Builders, the global community from the BSTC team.";
