export interface CommunityChannel {
  id: string;
  name: string;
  purpose: string;
  description: string;
}

// Joining URLs are server-only and returned after a successful registration.
export const COMMUNITY_CHANNELS: CommunityChannel[] = [
  {
    id: "whatsapp",
    name: "WhatsApp General 2",
    purpose: "Everyday conversations",
    description: "A second general discussion group with the same community, events and guidelines. If you are already in General 1, you can stay there.",
  },
  {
    id: "telegram",
    name: "BSTC on Telegram",
    purpose: "More room to connect",
    description: "Find conversations about AI, building products, growth and opportunities. Choose the topics that interest you and contribute at your own pace.",
  },
  {
    id: "updates",
    name: "WhatsApp Events & Updates",
    purpose: "Just the highlights",
    description: "Follow confirmed events, community news and selected member highlights. A quieter way to stay connected without joining another discussion group.",
  },
];
