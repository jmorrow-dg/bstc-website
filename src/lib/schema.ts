import { SITE, STATS } from "./constants";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.fullName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/images/logo.svg`,
    description: SITE.description,
    foundingDate: SITE.founded,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Canggu",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
    sameAs: [SITE.meetup, SITE.linkedin, SITE.instagram].filter(
      (url) => url !== "#"
    ),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: STATS.rating,
      ratingCount: 116,
      bestRating: 5,
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.fullName,
    alternateName: SITE.name,
    url: SITE.url,
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: `${event.date}T${event.time}:00+08:00`,
    eventStatus:
      event.status === "completed"
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventScheduled",
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
    organizer: {
      "@type": "Organization",
      name: SITE.fullName,
      url: SITE.url,
    },
    image: event.image ? `${SITE.url}${event.image}` : undefined,
    url: event.url,
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
