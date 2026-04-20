import { SITE, STATS } from "./constants";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
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
    email: SITE.email,
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: STATS.rating,
      ratingCount: 116,
      bestRating: 5,
      worstRating: 1,
    },
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
    startDate: `${event.date}T${event.time}:00+08:00`,
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
    organizer: {
      "@type": "Organization",
      name: SITE.fullName,
      url: SITE.url,
    },
    image: event.image ? `${SITE.url}${event.image}` : undefined,
    url: event.url,
    offers: {
      "@type": "Offer",
      url: event.url,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: event.date,
    },
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
