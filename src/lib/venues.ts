// Street addresses and map pins for the venues that host BSTC nights (11 Nov 2026).
// Used on event pages (address line and Google Maps link) and in Event schema
// `location`. A venue missing here keeps the plain "<venue>, <area>" line and the
// Canggu, Bali fallback address in schema: never guess a street for it.

export interface Venue {
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: "ID";
  latitude: number;
  longitude: number;
}

export const VENUES: Venue[] = [
  {
    name: "Yema Kitchen",
    streetAddress: "Jl. Tanah Barak No.31",
    addressLocality: "Canggu",
    addressRegion: "Bali",
    postalCode: "80351",
    addressCountry: "ID",
    latitude: -8.650064,
    longitude: 115.13376,
  },
  {
    name: "Seoul Soul Project",
    streetAddress: "Jl. Canggu Padang Linjong No.61",
    addressLocality: "Canggu",
    addressRegion: "Bali",
    postalCode: "80361",
    addressCountry: "ID",
    latitude: -8.645777,
    longitude: 115.134895,
  },
  {
    name: "Mata Berawa",
    streetAddress: "Jl. Subak Sari 13, Tibubeneng",
    addressLocality: "Berawa",
    addressRegion: "Bali",
    postalCode: "80361",
    addressCountry: "ID",
    latitude: -8.66646,
    longitude: 115.144295,
  },
];

/** The venue name from an event's `venue` line: "Yema Kitchen, Canggu" gives "Yema Kitchen". */
export function venueName(venue?: string): string {
  return String(venue ?? "").split(",")[0].trim();
}

/** The known venue for an event's `venue` line, or undefined. */
export function getVenue(venue?: string): Venue | undefined {
  const name = venueName(venue).toLowerCase();
  return VENUES.find((v) => v.name.toLowerCase() === name);
}

/** "Jl. Tanah Barak No.31, Canggu, Bali 80351" */
export function formatVenueAddress(v: Venue): string {
  return `${v.streetAddress}, ${v.addressLocality}, ${v.addressRegion} ${v.postalCode}`;
}

/** A Google Maps search link for the venue at its street address. */
export function venueMapsUrl(v: Venue): string {
  const query = `${v.name}, ${formatVenueAddress(v)}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
