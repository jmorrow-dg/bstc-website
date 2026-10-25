import { CONTACT_EMAIL, EVENT_ORGANIZER, SITE, STATS } from "./constants";
import { canRsvpToEvent, isValidEventDate } from "./event-status";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}#organization`,
    name: SITE.fullName,
    alternateName: [SITE.name, "Bali Tech Community", "BSTC Community"],
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/images/logo.svg`,
      width: 512,
      height: 512,
    },
    image: `${SITE.url}/og-image.png`,
    description: SITE.description,
    slogan: "Signal over noise. Builders first.",
    foundingDate: SITE.founded,
    founders: [
      { "@type": "Person", name: "Lachlan McRitchie", jobTitle: "Co-founder & Primary Organiser" },
      { "@type": "Person", name: "Josh Morrow", jobTitle: "Co-founder & Growth Lead" },
      { "@type": "Person", name: "Matthew Carr", jobTitle: "Co-founder & Community Lead" },
    ],
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Canggu",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
    areaServed: [
      { "@type": "Country", name: "Indonesia" },
      { "@type": "Country", name: "Singapore" },
      { "@type": "Country", name: "Thailand" },
      { "@type": "Country", name: "Vietnam" },
      { "@type": "Country", name: "Philippines" },
      { "@type": "Country", name: "Malaysia" },
      { "@type": "Place", name: "Southeast Asia" },
    ],
    knowsAbout: [
      "Startup founder community",
      "Southeast Asia tech ecosystem",
      "Bali founder infrastructure",
      "PT PMA Indonesia setup",
      "Indonesia visa and KITAS",
      "Bali founder taxation",
      "Hiring developers in Indonesia",
      "AI-native company building",
      "Founder events and hackathons",
      "Remote team management",
      "Coworking spaces in Bali",
      "Venture capital in Southeast Asia",
    ],
    keywords: [
      "Bali startup community",
      "Southeast Asia tech community",
      "Bali founders",
      "Canggu coworking",
      "Indonesia startup ecosystem",
      "AI founders Bali",
      "tech events Bali",
    ].join(", "),
    sameAs: [SITE.meetup, SITE.linkedin, SITE.instagram].filter(
      (url) => url !== "#"
    ),
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/JoinAction",
        userInteractionCount: STATS.members,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/AttendEvent",
        userInteractionCount: STATS.events,
      },
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}#website`,
    name: SITE.fullName,
    alternateName: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en",
    publisher: { "@id": `${SITE.url}#organization` },
  };
}

export function getEventSchema(event: {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  url: string;
  image?: string;
  status?: string;
  rsvpUrl?: string;
  organizer?: { name: string; url?: string };
}, now: Date = new Date()) {
  if (!isValidEventDate(event.date)) return null;

  const organizer = event.organizer?.name ? event.organizer : EVENT_ORGANIZER;
  const statusMap: Record<string, string> = {
    upcoming: "https://schema.org/EventScheduled",
    completed: "https://schema.org/EventScheduled",
    cancelled: "https://schema.org/EventCancelled",
    postponed: "https://schema.org/EventPostponed",
  };
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: /^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)
      ? `${event.date}T${event.time}:00+08:00`
      : event.date,
    eventStatus: statusMap[event.status || "upcoming"] || statusMap.upcoming,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Canggu",
        addressRegion: "Bali",
        addressCountry: "ID",
      },
    },
    ...(organizer.name && {
      organizer: {
        "@type": "Organization",
        name: organizer.name,
        ...(organizer.url && { url: organizer.url }),
      },
    }),
    image: event.image ? `${SITE.url}${event.image}` : undefined,
    url: event.url,
    // Only open, future events advertise an available (free) ticket.
    ...(canRsvpToEvent(event, now) && {
      offers: {
        "@type": "Offer",
        url: event.rsvpUrl,
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(
  items: { name: string; url?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url.startsWith("http") ? item.url : `${SITE.url}${item.url}` }),
    })),
  };
}

export function getPersonSchema(person: {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    ...(person.bio && { description: person.bio }),
    ...(person.image && { image: `${SITE.url}${person.image}` }),
    ...(person.email && { email: person.email }),
    worksFor: {
      "@type": "Organization",
      name: SITE.fullName,
      url: SITE.url,
    },
    ...((person.linkedin || person.twitter) && {
      sameAs: [person.linkedin, person.twitter].filter(Boolean),
    }),
  };
}

export function getItemListSchema(params: {
  name: string;
  description?: string;
  items: { name: string; url: string; description?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.name,
    ...(params.description && { description: params.description }),
    itemListElement: params.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url.startsWith("http") ? item.url : `${SITE.url}${item.url}`,
      name: item.name,
      ...(item.description && { description: item.description }),
    })),
  };
}
