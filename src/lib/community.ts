export interface CommunityChannel {
  id: string;
  name: string;
  purpose: string;
  description: string;
  action: string;
  url: string | null;
}

// For WhatsApp, configure the public registration gate only after its thank-you
// page routes to General 2. Keep private group invitations out of public source.
export function publicHttpsUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export const COMMUNITY_CHANNELS: CommunityChannel[] = [
  {
    id: "whatsapp",
    name: "WhatsApp General 2",
    purpose: "Everyday conversations",
    description: "A second general discussion group with the same community, events and guidelines. If you are already in General 1, you can stay there.",
    action: "Request to join General 2",
    url: publicHttpsUrl(process.env.NEXT_PUBLIC_BSTC_WHATSAPP_JOIN_URL),
  },
  {
    id: "telegram",
    name: "BSTC on Telegram",
    purpose: "More room to connect",
    description: "Find conversations about AI, building products, growth and opportunities. Choose the topics that interest you and contribute at your own pace.",
    action: "Join Telegram",
    url: publicHttpsUrl(process.env.NEXT_PUBLIC_BSTC_TELEGRAM_URL),
  },
  {
    id: "updates",
    name: "WhatsApp Events & Updates",
    purpose: "Just the highlights",
    description: "Follow confirmed events, community news and selected member highlights. A quieter way to stay connected without joining another discussion group.",
    action: "Follow updates",
    url: publicHttpsUrl(process.env.NEXT_PUBLIC_BSTC_UPDATES_URL),
  },
];
