export const SITE = {
  name: "BSTC",
  fullName: "Bali Startup & Tech Community",
  tagline: "Where Southeast Asia's Builders Connect",
  description:
    "The largest founder-led tech community in Bali and Southeast Asia. Connecting founders, engineers, investors, and builders through high-signal events.",
  url: "https://balistartupandtech.com",
  domain: "balistartupandtech.com",
  altDomain: "bstc.community",
  email: "hello@bstc.community",
  meetup: "https://www.meetup.com/bali-start-ups-tech-community/",
  whatsapp: "#", // TODO: Add WhatsApp group link
  linkedin: "#", // TODO: Add LinkedIn page URL
  instagram: "#", // TODO: Add Instagram handle URL
  founded: "2023",
  location: "Canggu, Bali, Indonesia",
};

export const STATS = {
  members: 2500,
  events: 34,
  rating: 4.6,
  countries: 40,
};

export const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "How I Build with AI", href: "/how-i-build-with-ai" },
  { label: "Community", href: "/community" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "About", href: "/about" },
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
