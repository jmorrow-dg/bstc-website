import { CONTACT_EMAIL, EVENT_ORGANIZER, SITE, STATS } from "./constants";
import { EVENT_TIME_ZONE, canRsvpToEvent, isValidEventDate } from "./event-status";
import { getVenue } from "./venues";

export const personId = (name: string) =>
  `${SITE.url}/leadership#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const HOW_I_AI_SERIES_ID = `${SITE.url}/how-i-build-with-ai#how-i-ai`;

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}#organization`,
    name: SITE.fullName,
    alternateName: [SITE.name, "Bali Tech Community", "BSTC Community", "Bali Startup & Tech"],
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE.url}#logo`,
      url: `${SITE.url}/images/logo.svg`,
      width: 512,
      height: 512,
    },
    image: `${SITE.url}/og-image.png`,
    description: SITE.description,
    slogan: "Signal over noise. Builders first.",
    foundingDate: "2023-10",
    founders: [
      { "@type": "Person", "@id": personId("Lachlan McRitchie"), name: "Lachlan McRitchie", jobTitle: "Co-founder & Primary Organiser" },
      { "@type": "Person", "@id": personId("Josh Morrow"), name: "Josh Morrow", jobTitle: "Co-founder & Growth Lead" },
      { "@type": "Person", "@id": personId("Matthew Carr"), name: "Matthew Carr", jobTitle: "Co-founder & Community Lead" },
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
      "Founder events (hackathons coming soon)",
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
    sameAs: [
      SITE.meetup,
      SITE.linkedin,
      SITE.instagram,
      "https://luma.com/balistartuptech",
      "https://t.me/balistartuptech",
    ].filter((url) => url !== "#"),
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/JoinAction",
        userInteractionCount: STATS.members,
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

// ISO 8601 date-time with an explicit offset, as schema.org validFrom expects.
export function isIsoDateTimeWithZone(value?: string): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d+)?)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

// Josh, 10 Nov 2026: the venue is the organiser of every event. Take the event's
// own `organizer` frontmatter (string or { name, url }) when present, otherwise
// the venue name (the text before the first comma of `venue`, e.g.
// "Yema Kitchen, Canggu" gives "Yema Kitchen"). A venue still marked TBA, or an
// empty one, gives undefined: no organiser is invented and BSTC is never named.
export function getEventOrganizer(event: {
  organizer?: string | { name: string; url?: string };
  venue?: string;
}): { name: string; url?: string } | undefined {
  const own = typeof event.organizer === "string" ? { name: event.organizer } : event.organizer;
  if (own?.name?.trim()) {
    return { name: own.name.trim(), ...(own.url && { url: own.url }) };
  }
  const name = event.venue?.split(",")[0].trim();
  if (!name || /^(tba|tbc|tbd)$/i.test(name)) return undefined;
  return { name };
}

// The BSTC team moderates every event. schema.org has no `moderator` property,
// so it is a plain `contributor` Organization. (A Role with roleName
// "Moderator" was not used: it could not be checked in the Rich Results Test or
// the schema.org validator from here, and the visible credit line already says
// "Moderated by".)
// Typed as optional so it can be spread into the Event node even where another
// branch (#42) sets a bare `contributor` reference; the full Organization wins.
export function getEventModeratorContributor(): {
  contributor?: { "@type": "Organization"; "@id": string; name: string; url: string };
} {
  return { contributor: {
    "@type": "Organization",
    "@id": `${SITE.url}#organization`,
    name: SITE.fullName,
    url: SITE.url,
  } };
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
  announced?: string;
  rsvpUrl?: string;
  organizer?: { name: string; url?: string };
  // Finish time (HH:MM, Bali time) from the night's own RSVP listing. Left out
  // when the listing has none: endDate is then omitted, never guessed.
  endTime?: string;
  // A real photo from a BSTC night, listed in `image` before the cover graphic.
  photo?: string;
  // "how-i-ai" links the edition to the How I AI EventSeries.
  series?: string;
}, now: Date = new Date()) {
  if (!isValidEventDate(event.date)) return null;

  const organizer = event.organizer?.name ? event.organizer : EVENT_ORGANIZER;
  const statusMap: Record<string, string> = {
    upcoming: "https://schema.org/EventScheduled",
    completed: "https://schema.org/EventScheduled",
    cancelled: "https://schema.org/EventCancelled",
    postponed: "https://schema.org/EventPostponed",
  };
  const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;
  const hasStart = hhmm.test(event.time);
  // Same Bali day, finishing after the start. Anything else is left out.
  const hasEnd = hasStart && hhmm.test(event.endTime ?? "") && event.endTime! > event.time;
  const venue = getVenue(event.venue);
  const images = [event.photo, event.image]
    .filter((src): src is string => Boolean(src))
    .map((src) => (src.startsWith("http") ? src : `${SITE.url}${src}`));
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${event.url}#event`,
    name: event.title,
    description: event.description,
    startDate: hasStart ? `${event.date}T${event.time}:00+08:00` : event.date,
    ...(hasEnd && { endDate: `${event.date}T${event.endTime}:00+08:00` }),
    eventStatus: statusMap[event.status || "upcoming"] || statusMap.upcoming,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    location: venue
      ? {
          "@type": "Place",
          name: venue.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: venue.streetAddress,
            addressLocality: venue.addressLocality,
            addressRegion: venue.addressRegion,
            postalCode: venue.postalCode,
            addressCountry: venue.addressCountry,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: venue.latitude,
            longitude: venue.longitude,
          },
        }
      : {
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
    ...getEventModeratorContributor(),
    ...(event.series === "how-i-ai" && {
      superEvent: { "@id": HOW_I_AI_SERIES_ID },
    }),
    image: images.length ? images : undefined,
    url: event.url,
    // Only open, future events advertise an available (free) ticket.
    ...(canRsvpToEvent(event, now) && {
      offers: {
        "@type": "Offer",
        ...(isIsoDateTimeWithZone(event.announced) && { validFrom: event.announced }),
        url: event.rsvpUrl,
        price: "0",
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

// Weekly schedule and venue as stated on the edition pages. No end date: the
// series has none on main.
export function getHowIAISeriesSchema(editionUrls: string[]) {
  const venue = getVenue("Seoul Soul Project");
  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "@id": HOW_I_AI_SERIES_ID,
    name: "How I AI",
    alternateName: "How I Build with AI",
    description:
      "BSTC's weekly builder night: builders share the AI tools, workflows and revenue behind what they ship.",
    url: `${SITE.url}/how-i-build-with-ai`,
    isAccessibleForFree: true,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventSchedule: {
      "@type": "Schedule",
      byDay: "https://schema.org/Wednesday",
      repeatFrequency: "P1W",
      startTime: "18:00",
      endTime: "21:00",
      scheduleTimezone: EVENT_TIME_ZONE,
    },
    location: {
      "@type": "Place",
      name: "Seoul Soul Project",
      address: {
        "@type": "PostalAddress",
        ...(venue && { streetAddress: venue.streetAddress, postalCode: venue.postalCode }),
        addressLocality: "Canggu",
        addressRegion: "Bali",
        addressCountry: "ID",
      },
    },
    organizer: { "@type": "Organization", name: "Seoul Soul Project" },
    ...getEventModeratorContributor(),
    subEvent: editionUrls.map((url) => ({ "@id": `${url}#event` })),
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
    "@id": personId(person.name),
    name: person.name,
    jobTitle: person.role,
    ...(person.bio && { description: person.bio }),
    ...(person.image && { image: `${SITE.url}${person.image}` }),
    ...(person.email && { email: person.email }),
    worksFor: {
      "@type": "Organization",
      "@id": `${SITE.url}#organization`,
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
