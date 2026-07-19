// The WhatsApp Community room registry. The main chat is capped at 1,024
// members, so growth happens through segmented sub-groups ("rooms") under one
// WhatsApp Community. Each signup is matched to rooms from their form answers;
// matched room ids are stored in the ROOMS cookie and rendered on /members.
//
// A room only appears once its invite-link env var is set (see .env.example),
// so rooms can be rolled out one at a time as they're created in WhatsApp.

export type CommunityGroup = {
  id: string; // stable slug — stored in the rooms cookie, don't rename
  name: string;
  emoji: string;
  desc: string;
  envKey: string;
};

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: "intros",
    name: "Intros & Asks",
    emoji: "👋",
    desc: "Start here. Say hi, introduce yourself, ask the community anything.",
    envKey: "WA_INVITE_INTROS",
  },
  {
    id: "founders",
    name: "Founders",
    emoji: "🏗️",
    desc: "For people actively building. Wins, blockers, and honest feedback.",
    envKey: "WA_INVITE_FOUNDERS",
  },
  {
    id: "ai",
    name: "AI Builders",
    emoji: "🤖",
    desc: "Models, agents, and what you're actually shipping with them.",
    envKey: "WA_INVITE_AI",
  },
  {
    id: "investors",
    name: "Investors & Angels",
    emoji: "💰",
    desc: "Angels, VCs, and founders raising. Deal flow and warm intros.",
    envKey: "WA_INVITE_INVESTORS",
  },
  {
    id: "jobs",
    name: "Jobs & Gigs",
    emoji: "💼",
    desc: "Hiring or looking. Roles, gigs, and contract work.",
    envKey: "WA_INVITE_JOBS",
  },
  {
    id: "canggu",
    name: "Canggu & Pererenan",
    emoji: "📍",
    desc: "West-side meetups, coworking, and spontaneous coffees.",
    envKey: "WA_INVITE_CANGGU",
  },
  {
    id: "ubud",
    name: "Ubud",
    emoji: "📍",
    desc: "The Ubud crew. Meetups and coworking in the jungle.",
    envKey: "WA_INVITE_UBUD",
  },
];

// Shared form options — imported by the signup form and the matcher so the
// strings written to Airtable/Sheets and matched on stay in sync.
export const LOCATIONS = [
  "Canggu / Pererenan / Berawa",
  "Ubud",
  "Uluwatu / Bukit",
  "Sanur / Denpasar",
  "Elsewhere in Bali",
  "Not in Bali (yet)",
];

export const INTERESTS = [
  "AI / ML",
  "SaaS",
  "E-commerce",
  "Web3 / Crypto",
  "Engineering",
  "Design",
  "Growth & Marketing",
];

export type MemberProfile = {
  location?: string;
  companyStage?: string;
  openTo?: string[];
  interests?: string[];
  building?: string;
};

export function matchGroupIds(p: MemberProfile): string[] {
  const ids = ["intros"];
  if (p.companyStage || p.building?.trim()) ids.push("founders");
  if (p.interests?.includes("AI / ML")) ids.push("ai");
  if (p.openTo?.includes("Investing")) ids.push("investors");
  if (p.openTo?.includes("Hiring") || p.openTo?.includes("Being hired")) ids.push("jobs");
  if (p.location === "Canggu / Pererenan / Berawa") ids.push("canggu");
  if (p.location === "Ubud") ids.push("ubud");
  return ids;
}

// Server-only: env vars aren't inlined for dynamic access, so this returns ""
// in client bundles. Call it from server components and route handlers.
export function inviteFor(group: CommunityGroup): string {
  return process.env[group.envKey] || "";
}

export function openGroups(): (CommunityGroup & { invite: string })[] {
  return COMMUNITY_GROUPS.map((g) => ({ ...g, invite: inviteFor(g) })).filter(
    (g) => g.invite
  );
}
