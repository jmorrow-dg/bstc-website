// The three co-founders, shared by /leadership and the homepage Members
// section so the wording can't drift. Name, role, bio and tier are the live
// /leadership copy. Only these three appear on this site: other directory
// members have no recorded consent to be shown here.
//
// City, time zone and profile URL come from each person's Remote Builders
// directory profile (approved by the member, read 25 Oct 2026).

export type Founder = {
  name: string;
  role: string;
  bio: string;
  tier: string;
  city: string;
  timeZone: string;
  /** Static fallback shown before the live clock runs. */
  utcLabel: string;
  homeGround?: boolean;
  profileUrl: string;
};

export const FOUNDERS: Founder[] = [
  {
    name: "Lachlan McRitchie",
    role: "Co-founder & Primary Organiser",
    bio: "Built BSTC from the ground up. Runs community operations, governance, and brand strategy.",
    tier: "Founder",
    city: "Canggu, Bali",
    timeZone: "Asia/Makassar",
    utcLabel: "UTC+8",
    homeGround: true,
    profileUrl: "https://remotebuilders.io/directory/lachlan-mcritchie/",
  },
  {
    name: "Josh Morrow",
    role: "Co-founder & Growth Lead",
    bio: "Leads revenue, sponsorships, and the 'How I Build with AI' flagship series. Also runs David & Goliath, an AI growth agency.",
    tier: "Founder",
    city: "Melbourne, Australia",
    timeZone: "Australia/Melbourne",
    utcLabel: "UTC+10/11",
    profileUrl: "https://remotebuilders.io/directory/josh-morrow/",
  },
  {
    name: "Matthew Carr",
    role: "Co-founder & Community Lead",
    // UNVERIFIED: carried over from the live site, confirm before launch (25 Oct 2026 audit)
    // ("Bali nodes" is the same claim as "active nodes in Ubud, Sanur, Uluwatu".)
    bio: "Manages community engagement and event operations across Bali nodes.",
    tier: "Founder",
    city: "London, United Kingdom",
    timeZone: "Europe/London",
    utcLabel: "UTC+0/1",
    profileUrl: "https://remotebuilders.io/directory/matt-carr/",
  },
];

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}
