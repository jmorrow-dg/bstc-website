// Single source of truth for the /welcome "Welcome to Bali" new-member guide.
//
// Brand promise (same as our blog guides): honest picks, no affiliate links,
// no paid placements. These are the spots BSTC founders actually use.
//
// VERIFY BEFORE PUBLISH: coworking prices below are lifted from our own
// founder-tested coworking guide (verified). Restaurant and gym entries use a
// relative price tier ($ / $$ / $$$), not a quote. Confirm any specific figure
// with Josh before treating it as final.
//
// PHOTOS: drop a file at /images/welcome/<slug>.(jpg|png|webp) where <slug> is
// photoSlug(name) - e.g. "Crate Cafe" -> crate-cafe.jpg. The card picks it up
// automatically once the file exists; until then a branded placeholder block
// renders. Only set `photo` to override the auto-resolved path.
//
// PERKS: the `perk` field drives the member-perk badge.
//   - status "live"    -> red badge with the real perk shown publicly.
//   - status "pending" -> muted "Perk in the works" badge. This is our outreach
//                         target for that venue. `label` is the internal goal.
// Discount CODES are never stored here (this file is public) - they are shared
// in the WhatsApp community. Example once a deal is signed:
//   perk: { label: "Free day pass", status: "live", partnerTier: "community" }
//
// PLACEHOLDER: set `placeholder: true` on a slot we still need to fill with a
// real venue. The card shows a "To confirm" marker so it is obvious in review.

export interface Perk {
  label: string; // the perk, or (when pending) the outreach target
  status?: "live" | "pending";
  partnerTier?: "community" | "featured";
}

export interface Venue {
  name: string;
  area: string; // "Canggu" | "Berawa" | "Pererenan" | "Ubud" | "Sanur" | ...
  blurb: string; // honest one-liner
  bestFor: string;
  price?: string; // "~$220/mo" (verified) or "$" / "$$" / "$$$" tier
  tags?: string[];
  photo?: string; // optional override; normally auto-resolved from photoSlug(name)
  perk?: Perk; // member perk (live) or outreach target (pending)
  placeholder?: boolean; // true = a slot to fill with a real venue once confirmed
}

export interface GuideCategory {
  slug: string;
  name: string;
  description: string;
  venues: Venue[];
}

export interface Essential {
  title: string;
  blurb: string;
  href?: string; // internal guide or external resource
}

// Build a Google Maps search link from the venue name + area. Always resolves
// (opens Maps to the place) so listings never 404, and we don't fabricate
// official URLs that may be wrong.
export function mapsUrl(name: string, area: string): string {
  const query = encodeURIComponent(`${name} ${area} Bali`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

// Canonical photo filename (without extension) for a venue. Drop a matching
// file at /images/welcome/<slug>.(jpg|png|webp) and the card shows it. Pure
// (no fs) so both data and rendering layers share one naming convention.
export function photoSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Google My Maps embed for the /welcome map section. To enable:
//   1. mymaps.google.com > Create new map > Import scripts/welcome-map.csv
//   2. Position pins by "Location", title by "Name", group/colour by "Category"
//   3. Share > set to "Anyone with the link", then the "..." menu > Embed on my
//      site > copy the URL inside the iframe src.
//   4. Paste that src URL here. The map section on /welcome appears automatically.
export const MAP_EMBED_URL = "";

export const CATEGORIES: GuideCategory[] = [
  {
    slug: "cafes",
    name: "Work Cafes",
    description:
      "Great wifi, reliable power, and enough founders around that a coffee meeting just happens. Picked for getting work done, not for the aesthetic.",
    venues: [
      {
        name: "Crate Cafe",
        area: "Canggu",
        blurb:
          "The default morning spot. Solid wifi, good coffee, founders everywhere. Gets busy after 10am, so arrive early.",
        bestFor: "Morning work + founder density",
        price: "$",
        tags: ["Cafe", "Wifi"],
        perk: { label: "10% off food or free espresso", status: "live", partnerTier: "community" },
      },
      {
        name: "Sensorium",
        area: "Canggu",
        blurb:
          "Excellent coffee and fast wifi, less crowded than Crate. A good focus alternative when you need to actually ship.",
        bestFor: "Focused cafe work",
        price: "$$",
        tags: ["Cafe", "Wifi"],
        perk: { label: "Member discount", status: "pending" },
      },
      {
        name: "Machinery Cafe",
        area: "Canggu",
        blurb:
          "Strong wifi and a power outlet at every table. Built for longer laptop sessions when you can't get to a desk.",
        bestFor: "All-day laptop sessions",
        price: "$$",
        tags: ["Cafe", "Power outlets"],
        perk: { label: "Member discount", status: "pending" },
      },
      {
        name: "Milu",
        area: "Berawa",
        blurb:
          "Bright brunch spot founders cycle through between calls. Good food and wifi, easy for a casual catch-up.",
        bestFor: "Brunch + casual meetings",
        price: "$$",
        tags: ["Brunch", "Wifi"],
        perk: { label: "Member discount", status: "pending" },
      },
      // From Josh's Google Maps favourites (Jun 2026). Personal picks, no perk.
      {
        name: "Copenhagen Bakery Seseh",
        area: "Seseh",
        blurb: "Bakery and brunch cafe in Seseh.",
        bestFor: "Bakery + brunch",
        tags: ["Bakery", "Brunch"],
      },
      {
        name: "openhouse cafe Seseh",
        area: "Seseh",
        blurb: "Easygoing cafe in Seseh for coffee and laptop time.",
        bestFor: "Cafe work + coffee",
        tags: ["Cafe", "Wifi"],
      },
      {
        name: "openhouse cafe Pererenan",
        area: "Pererenan",
        blurb: "Easygoing cafe in Pererenan for coffee and laptop time.",
        bestFor: "Cafe work + coffee",
        tags: ["Cafe", "Wifi"],
      },
      {
        name: "Two Face Coffee & Brunch",
        area: "Canggu",
        blurb: "Coffee and brunch spot in Canggu.",
        bestFor: "Coffee + brunch",
        tags: ["Cafe", "Brunch"],
      },
      {
        name: "Milk & Madu Beach Road",
        area: "Canggu",
        blurb:
          "Family-friendly cafe and restaurant on the Batu Bolong beach road.",
        bestFor: "Brunch + casual",
        tags: ["Cafe", "Brunch"],
      },
      {
        name: "Milk & Madu Berawa",
        area: "Berawa",
        blurb: "The Berawa branch of the family-friendly cafe and restaurant.",
        bestFor: "Brunch + casual",
        tags: ["Cafe", "Brunch"],
      },
      {
        name: "Pressed Cafe and Mylk",
        area: "Canggu",
        blurb:
          "Health-focused cafe in Canggu for juices, smoothies and light eats.",
        bestFor: "Healthy cafe + juices",
        tags: ["Cafe", "Healthy"],
      },
      {
        name: "Alive Wholefoods Store",
        area: "Canggu",
        blurb: "Wholefoods store and health cafe in Canggu.",
        bestFor: "Healthy + wholefoods",
        tags: ["Cafe", "Healthy"],
      },
      {
        name: "Zin Cafe",
        area: "Canggu",
        blurb: "Cafe in Canggu, a community favourite.",
        bestFor: "Coffee + work",
        tags: ["Cafe", "Wifi"],
      },
      {
        name: "Avocado Factory",
        area: "Canggu",
        blurb: "Health-focused cafe in Canggu, big on avocado and brunch.",
        bestFor: "Healthy brunch",
        tags: ["Cafe", "Healthy"],
      },
      {
        name: "Secret Spot Canggu",
        area: "Canggu",
        blurb: "Plant-based cafe in Canggu, a long-running favourite.",
        bestFor: "Vegan + brunch",
        tags: ["Cafe", "Vegan"],
      },
      {
        name: "Revolver Canggu",
        area: "Canggu",
        blurb: "Specialty coffee from the well-known Revolver roastery.",
        bestFor: "Specialty coffee",
        tags: ["Cafe", "Coffee"],
      },
      {
        name: "Revolver Umalas",
        area: "Umalas",
        blurb: "The Umalas branch of Revolver specialty coffee.",
        bestFor: "Specialty coffee",
        tags: ["Cafe", "Coffee"],
      },
      {
        name: "Baru Cafe",
        area: "Canggu",
        blurb: "Cafe in the Canggu area, a community favourite.",
        bestFor: "Coffee + work",
        tags: ["Cafe", "Wifi"],
      },
      {
        name: "Your wifi-cafe pick",
        area: "Canggu",
        blurb:
          "Placeholder slot. Send us the cafe, a photo, and any perk and we'll add it here.",
        bestFor: "To confirm",
        placeholder: true,
        perk: { label: "Member perk", status: "pending" },
      },
    ],
  },
  {
    slug: "coworking",
    name: "Coworking Hubs",
    description:
      "From our founder-tested coworking guide. Ranked on the four things that actually matter: redundant wifi, founder density, quiet call booths, and a fair monthly rate.",
    venues: [
      {
        name: "Tropical Nomad",
        area: "Canggu",
        blurb:
          "The most serious workspace in Canggu. Quiet by design, fast redundant wifi, lots of phone booths, and a permanent crowd of founders and engineers. Our #1 pick.",
        bestFor: "Founder density + deep work",
        price: "~$220/mo",
        tags: ["Canggu", "Deep work"],
        perk: { label: "Free day pass", status: "pending" },
      },
      {
        name: "B Work",
        area: "Canggu",
        blurb:
          "The all-rounder. Polished, fast wifi, plenty of open desk space, and a balanced mix of founders, designers, and freelance engineers.",
        bestFor: "All-rounder, fast wifi",
        price: "~$190/mo",
        tags: ["Canggu", "Wifi"],
        perk: { label: "Free day pass", status: "pending" },
      },
      {
        name: "Outpost Canggu",
        area: "Canggu",
        blurb:
          "Hybrid work and lifestyle. Meeting rooms, podcast studios, fast wifi, and a tech-focused membership.",
        bestFor: "Hybrid work + lifestyle",
        price: "~$210/mo",
        tags: ["Canggu", "Studios"],
        perk: { label: "Discounted month pass", status: "pending" },
      },
      {
        name: "Dojo Bali",
        area: "Canggu",
        blurb:
          "The original. Built the Bali coworking scene and still runs the best community programming: events, intros, talks. Social over deep focus.",
        bestFor: "Community + events",
        price: "~$180/mo",
        tags: ["Canggu", "Events"],
        perk: { label: "Discounted month pass", status: "pending" },
      },
      {
        name: "Genesis",
        area: "Canggu",
        blurb:
          "The casual, budget option. A desk and decent wifi without premium rates. Younger, relaxed crowd.",
        bestFor: "Budget hot desks",
        price: "~$140/mo",
        tags: ["Canggu", "Budget"],
        perk: { label: "Member rate", status: "pending" },
      },
      {
        name: "Outpost Ubud",
        area: "Ubud",
        blurb:
          "The best deep-work space on the island, set in the rice fields. Quiet rooms and long-stay founders building serious things. 45 minutes from Canggu, so pick one.",
        bestFor: "Quiet focus, long stays",
        price: "~$200/mo",
        tags: ["Ubud", "Deep work"],
        perk: { label: "Discounted month pass", status: "pending" },
      },
      {
        name: "Biliq Sanur",
        area: "Sanur",
        blurb:
          "Small, friendly, family-oriented. Not a scene, which is the point. The underrated quiet zone for founders who want focus.",
        bestFor: "Quiet, family-friendly",
        price: "~$160/mo",
        tags: ["Sanur", "Quiet"],
        perk: { label: "Member rate", status: "pending" },
      },
      // Added Jun 2026. Confirm neighbourhood + monthly rate before treating final.
      {
        name: "Setter",
        area: "Pererenan", // confirm neighbourhood
        blurb:
          "Quiet, design-led coworking for focus over socialising. Fast wifi and proper call booths make it an easy pick when you need to put your head down and ship.",
        bestFor: "Quiet focus",
        tags: ["Pererenan", "Quiet"],
        perk: { label: "Free day pass", status: "pending" },
      },
      {
        name: "Awan Connection",
        area: "Canggu", // confirm neighbourhood
        blurb:
          "Coworking hub in the Canggu area with desks, reliable wifi, and a community of founders and remote workers to plug into.",
        bestFor: "Coworking + community",
        tags: ["Canggu", "Community"],
        perk: { label: "Free day pass", status: "pending" },
      },
      {
        name: "Your coworking pick",
        area: "Canggu",
        blurb:
          "Placeholder slot. Send us the space, a photo, and any perk and we'll add it here.",
        bestFor: "To confirm",
        placeholder: true,
        perk: { label: "Member perk", status: "pending" },
      },
    ],
  },
  {
    slug: "eat",
    name: "Restaurants",
    description:
      "Where the community eats when it is not working. From cheap local warungs to the dinner you take a visiting investor to.",
    venues: [
      {
        name: "Penny Lane",
        area: "Berawa",
        blurb:
          "Long-running gastropub and a reliable expat and founder favourite for dinner and a drink after a build day.",
        bestFor: "Casual dinners + drinks",
        price: "$$",
        tags: ["Dinner", "Drinks"],
        perk: { label: "Member discount", status: "pending" },
      },
      {
        name: "Mason",
        area: "Pererenan",
        blurb:
          "Modern dining destination. Where founders take a celebration dinner or host a visiting investor.",
        bestFor: "Special-occasion dinner",
        price: "$$$",
        tags: ["Dinner", "Hosting"],
        perk: { label: "Welcome drink", status: "pending" },
      },
      {
        name: "La Brisa",
        area: "Echo Beach",
        blurb:
          "Beachfront restaurant and sunset spot. The easy pick for a relaxed team or community dinner by the water.",
        bestFor: "Sunset team dinners",
        price: "$$$",
        tags: ["Beachfront", "Dinner"],
        perk: { label: "Member discount", status: "pending" },
      },
      {
        name: "Warung Bu Mi",
        area: "Berawa",
        blurb:
          "Authentic, cheap, excellent local Indonesian. The antidote to nomad-priced brunch and where locals actually eat.",
        bestFor: "Authentic local food",
        price: "$",
        tags: ["Local", "Budget"],
      },
      // Source: gym partner discount list. Discount known (15% F&B), but BSTC
      // still needs to verify and confirm the deal before flipping to "live".
      {
        name: "Meimei",
        area: "Canggu",
        blurb:
          "Southeast Asian barbecue, a design-led restaurant and bar. Listed as a partner offering BSTC members 15% off food and beverage, pending our verification visit.",
        bestFor: "Dinner + drinks",
        tags: ["Dinner", "Drinks"],
        perk: { label: "15% off food & beverage", status: "pending" }, // excl. alcoholic drinks
      },
      {
        name: "Yuki",
        area: "Canggu", // confirm neighbourhood
        blurb:
          "Japanese restaurant and bar. Listed as a partner offering BSTC members 15% off food and beverage, pending our verification visit.",
        bestFor: "Japanese dinner",
        tags: ["Japanese", "Dinner"],
        perk: { label: "15% off food & beverage", status: "pending" },
      },
      // From Josh's Google Maps favourites (Jun 2026). Personal picks, no perk.
      // Seseh / Munggu / Pererenan, a little north of Canggu proper.
      {
        name: "Omni",
        area: "Munggu",
        blurb: "A community favourite in the Munggu area, near Tanah Lot.",
        bestFor: "Local favourite",
        tags: ["Dinner"],
      },
      {
        name: "Mirai Sushi",
        area: "Seseh",
        blurb: "Sushi spot in the Seseh area, a community favourite.",
        bestFor: "Sushi",
        tags: ["Japanese", "Dinner"],
      },
      {
        name: "Mostly Restaurant and Bar",
        area: "Pererenan",
        blurb: "Restaurant and bar in Pererenan.",
        bestFor: "Dinner + drinks",
        tags: ["Dinner", "Bar"],
      },
      {
        name: "Te no Aji",
        area: "Pererenan",
        blurb: "Japanese restaurant in Pererenan.",
        bestFor: "Japanese dining",
        tags: ["Japanese"],
      },
      {
        name: "Riviera Trattoria",
        area: "Pererenan",
        blurb: "Italian trattoria in Pererenan.",
        bestFor: "Italian dining",
        tags: ["Italian", "Dinner"],
      },
      {
        name: "ZALI Lebanese Restaurant",
        area: "Pererenan",
        blurb: "Lebanese restaurant in Pererenan.",
        bestFor: "Lebanese dining",
        tags: ["Lebanese"],
      },
      {
        name: "ORIGEN Mexican Restaurant",
        area: "Pererenan",
        blurb: "Mexican restaurant in Pererenan.",
        bestFor: "Mexican dining",
        tags: ["Mexican"],
      },
      // More from Josh's Google Maps favourites (Jun 2026).
      {
        name: "Smoke Bali",
        area: "Canggu",
        blurb: "BBQ restaurant in Canggu.",
        bestFor: "BBQ + grill",
        tags: ["BBQ", "Dinner"],
      },
      {
        name: "Bella Canggu",
        area: "Canggu",
        blurb: "Italian restaurant in Canggu.",
        bestFor: "Italian dining",
        tags: ["Italian", "Dinner"],
      },
      {
        name: "Mowie's Berawa",
        area: "Berawa",
        blurb: "Beachfront cafe and bar in Berawa, good for food and sunset.",
        bestFor: "Beachfront + sunset",
        tags: ["Beachfront", "Drinks"],
      },
      {
        name: "Mata Berawa",
        area: "Berawa",
        blurb: "Restaurant and bar in Berawa.",
        bestFor: "Dinner + drinks",
        tags: ["Dinner", "Bar"],
      },
      {
        name: "Ayam Tulang Lunak Bu Rahayu",
        area: "Canggu",
        blurb:
          "Local Indonesian, soft-bone chicken done well. Cheap and authentic.",
        bestFor: "Authentic local food",
        tags: ["Local", "Budget"],
      },
      {
        name: "ESKQBar Steak House & BBQ Grill",
        area: "Canggu",
        blurb: "Steak house and BBQ grill in Canggu.",
        bestFor: "Steak + grill",
        tags: ["Steak", "Dinner"],
      },
      {
        name: "Seoul Soul Project",
        area: "Canggu",
        blurb: "Korean restaurant in Canggu.",
        bestFor: "Korean dining",
        tags: ["Korean", "Dinner"],
      },
      {
        name: "Younghee Bali",
        area: "Canggu",
        blurb: "Korean restaurant in Canggu.",
        bestFor: "Korean dining",
        tags: ["Korean", "Dinner"],
      },
      {
        name: "Shelter Restaurant",
        area: "Canggu",
        blurb: "Garden restaurant and cafe in Canggu.",
        bestFor: "Casual dining",
        tags: ["Dinner", "Cafe"],
      },
      {
        name: "The Living Room",
        area: "Canggu",
        blurb: "Restaurant in the Canggu area, a community favourite.",
        bestFor: "Dinner",
        tags: ["Dinner"],
      },
      {
        name: "Your restaurant pick",
        area: "Canggu",
        blurb:
          "Placeholder slot. Send us the restaurant, a photo, and any perk and we'll add it here.",
        bestFor: "To confirm",
        placeholder: true,
        perk: { label: "Member perk", status: "pending" },
      },
    ],
  },
  {
    slug: "out",
    name: "Going Out",
    description:
      "Bars, breweries, and beach clubs. Where the community goes to switch off after a build week.",
    venues: [
      // Source: gym partner discount list. Perks known, BSTC to verify before live.
      {
        name: "Black Sand Brewery",
        area: "Berawa",
        blurb:
          "Canggu's craft brewery and beer garden. Listed as a partner offering BSTC members 15% off food and beverage, pending our verification visit.",
        bestFor: "Craft beer + casual nights",
        tags: ["Brewery", "Drinks"],
        perk: { label: "15% off food & beverage", status: "pending" },
      },
      {
        name: "Savaya Bali",
        area: "Uluwatu", // ~1.5hr south, kept as a popular weekend-trip spot
        blurb:
          "Cliffside club in Uluwatu and a popular weekend-trip spot for big nights and international DJs. Listed as a partner with complimentary entry for BSTC members, pending our verification visit.",
        bestFor: "Weekend big nights out",
        tags: ["Club", "Beach club"],
        // void special events; birthday table & bottle on request
        perk: { label: "Complimentary entry", status: "pending" },
      },
      {
        name: "Desa Kitsuné Bali",
        area: "Canggu",
        blurb:
          "Beach club and restaurant by Maison Kitsuné. Listed as a partner with complimentary entry for BSTC members, pending our verification visit.",
        bestFor: "Day-to-night beach club",
        tags: ["Beach club", "Drinks"],
        // void special events; birthday table & bottle on request
        perk: { label: "Complimentary entry", status: "pending" },
      },
      // From Josh's Google Maps favourites (Jun 2026). Personal picks, no perk.
      {
        name: "WhyHot Lounge Bar & Cafe",
        area: "Seseh",
        blurb: "Lounge bar and cafe, a relaxed spot for drinks.",
        bestFor: "Drinks + lounge",
        tags: ["Bar", "Drinks"],
      },
      {
        name: "Manhattan Kitchen & Cocktail Bar",
        area: "Canggu",
        blurb: "Kitchen and cocktail bar in Canggu.",
        bestFor: "Cocktails + dinner",
        tags: ["Cocktails", "Bar"],
      },
      {
        name: "The Back Room Cocktail Bar",
        area: "Canggu",
        blurb: "Cocktail bar in the Canggu area.",
        bestFor: "Cocktails",
        tags: ["Cocktails", "Bar"],
      },
      {
        name: "Ibu Kota Bar & Grill",
        area: "Canggu",
        blurb: "Bar and grill in the Canggu area.",
        bestFor: "Drinks + grill",
        tags: ["Bar", "Grill"],
      },
      {
        name: "Your going-out pick",
        area: "Canggu",
        blurb:
          "Placeholder slot. Send us the bar, brewery, or beach club, a photo, and any perk and we'll add it here.",
        bestFor: "To confirm",
        placeholder: true,
        perk: { label: "Member perk", status: "pending" },
      },
    ],
  },
  {
    slug: "train",
    name: "Gyms & Wellness",
    description:
      "Train, recover, reset. The spots the community uses to stay sharp between builds, from heavy weights to yoga and recovery.",
    venues: [
      {
        name: "Body Factory Bali",
        area: "Berawa",
        blurb:
          "Strong, no-nonsense gym for weights and calisthenics. Popular with the fitness-serious crowd who just want to train.",
        bestFor: "Weights + calisthenics",
        price: "$$",
        tags: ["Gym", "Weights"],
        perk: { label: "Member rate", status: "pending" },
      },
      {
        name: "CrossFit Wanderlust",
        area: "Canggu",
        blurb:
          "Established CrossFit box with daily classes and a tight, welcoming community. Easy to drop into for a session.",
        bestFor: "CrossFit + community",
        price: "$$",
        tags: ["CrossFit", "Classes"],
        perk: { label: "First class free", status: "pending" },
      },
      {
        name: "Samadi Bali",
        area: "Canggu",
        blurb:
          "Yoga studio and wellness centre in Batu Bolong with daily classes and a Sunday market. The reset-and-recover spot.",
        bestFor: "Yoga + wellness",
        price: "$$",
        tags: ["Yoga", "Wellness"],
        perk: { label: "First class free", status: "pending" },
      },
      // From Josh's Google Maps favourites (Jun 2026). Personal picks, no perk.
      {
        name: "Obsidian II",
        area: "Canggu",
        blurb: "Gym in the Canggu area, a community favourite.",
        bestFor: "Training",
        tags: ["Gym"],
      },
      {
        name: "Reload Sanctuary Gym",
        area: "Canggu",
        blurb: "Gym in the Canggu area, a community favourite.",
        bestFor: "Training",
        tags: ["Gym"],
      },
      {
        name: "Nirvana Life & Fitness",
        area: "Canggu",
        blurb: "Gym and fitness centre in Canggu.",
        bestFor: "Training + classes",
        tags: ["Gym", "Classes"],
      },
      {
        name: "Right Gym",
        area: "Canggu",
        blurb: "Gym in Canggu.",
        bestFor: "Training",
        tags: ["Gym"],
      },
      {
        name: "Your gym pick",
        area: "Canggu",
        blurb:
          "Placeholder slot. Send us the gym or studio, a photo, and any perk and we'll add it here.",
        bestFor: "To confirm",
        placeholder: true,
        perk: { label: "Member perk", status: "pending" },
      },
    ],
  },
  {
    slug: "stay",
    name: "Stays",
    description:
      "Where digital nomads actually live in Canggu, from co-livings with built-in community to quiet monthly villas. All placeholders for now, send us your picks.",
    venues: [
      // Real picks from Josh for the Stays category.
      {
        name: "Tribal Bali",
        area: "Canggu",
        blurb:
          "Budget co-living and social hostel in Canggu. The cheap, social soft landing for a first stay.",
        bestFor: "Budget co-living",
        tags: ["Co-living", "Budget"],
      },
      {
        // arranged via Oliver (internal BSTC contact)
        name: "Founder House",
        area: "Canggu",
        blurb:
          "BSTC can help organise short-term founder stays. Ask in the community to get set up.",
        bestFor: "Short-term, done-for-you",
        tags: ["Short-term", "BSTC"],
        perk: { label: "BSTC-arranged", status: "live", partnerTier: "featured" },
      },
      {
        name: "BLive Coliving",
        area: "Canggu",
        blurb:
          "Top-rated co-living in the Canggu area, comfortable and community-led.",
        bestFor: "Co-living comfort",
        tags: ["Co-living"],
        perk: { label: "Member rate", status: "pending" },
      },
      {
        name: "Co-living space",
        area: "Berawa",
        blurb:
          "Built-in community, desks, and events from day one. The fastest soft landing for a first-time arrival. Placeholder, send us the BSTC pick.",
        bestFor: "Instant community",
        tags: ["Co-living"],
        placeholder: true,
        perk: { label: "Member rate", status: "pending" },
      },
      {
        name: "Long-stay villa",
        area: "Pererenan",
        blurb:
          "A quiet monthly villa for heads-down building, pool and a scooter park. Placeholder, send us the BSTC pick.",
        bestFor: "Monthly villa, quiet",
        tags: ["Villa", "Monthly"],
        placeholder: true,
        perk: { label: "Member rate", status: "pending" },
      },
      {
        name: "Aparthotel",
        area: "Canggu",
        blurb:
          "Hotel comfort with a kitchen and a monthly rate. Easy and flexible for a few weeks. Placeholder, send us the BSTC pick.",
        bestFor: "Comfort + flexibility",
        tags: ["Aparthotel"],
        placeholder: true,
        perk: { label: "Member rate", status: "pending" },
      },
      {
        name: "Surf co-live",
        area: "Echo Beach",
        blurb:
          "Surf-focused co-living near the break, for founders who paddle out before the first call. Placeholder, send us the BSTC pick.",
        bestFor: "Surf + community",
        tags: ["Surf", "Co-living"],
        placeholder: true,
        perk: { label: "Member rate", status: "pending" },
      },
      {
        name: "Budget guesthouse",
        area: "Canggu",
        blurb:
          "Cheap, central, and easy for a first landing while you find your feet. Placeholder, send us the BSTC pick.",
        bestFor: "Budget first landing",
        tags: ["Budget"],
        placeholder: true,
        perk: { label: "Member rate", status: "pending" },
      },
    ],
  },
];

// Brief "settle in" essentials. Mostly pointers to our deeper guides so this
// strip stays light and the blog does the heavy lifting.
export const ESSENTIALS: Essential[] = [
  {
    title: "Visa & immigration",
    blurb:
      "Sort your visa before you build. Most founders run on a B211A or a KITAS. Our guide breaks down the options and timelines.",
    href: "/blog/indonesia-startup-visa-guide",
  },
  {
    title: "Company setup (PT PMA)",
    blurb:
      "Setting up an Indonesian entity? The PT PMA playbook covers structure, real costs, and how long it actually takes.",
    href: "/blog/pt-pma-indonesia-founder-playbook-2026",
  },
  {
    title: "SIM & connectivity",
    blurb:
      "Grab a Telkomsel or XL prepaid SIM on arrival (~$10-15/mo) and carry a hotspot as wifi backup. Telkomsel has the best coverage.",
  },
  {
    title: "Banking",
    blurb:
      "Staying long-term? Open a local BCA or Mandiri account for daily expenses. Most cafes and warungs are cash or QRIS.",
  },
  {
    title: "Getting around",
    blurb:
      "A scooter is the default in Canggu, roughly $50-70/mo. Bring an international licence. Grab and Gojek cover longer trips.",
  },
  {
    title: "Where to stay & costs",
    blurb:
      "Batu Bolong and Echo Beach for convenience, Berawa and Pererenan for quiet. Villas run ~$400-1,200/mo.",
    href: "/blog/canggu-founders-neighbourhood-guide",
  },
];

// Deeper guides to cross-link (all existing blog posts).
export const DEEPER_GUIDES: Essential[] = [
  {
    title: "Best Coworking Spaces in Bali",
    blurb: "Our full founder-tested ranking, with real wifi notes and monthly costs.",
    href: "/blog/best-coworking-spaces-bali-founders-2026",
  },
  {
    title: "Canggu for Founders",
    blurb: "The neighbourhood guide: cafes, event venues, and where to live.",
    href: "/blog/canggu-founders-neighbourhood-guide",
  },
  {
    title: "Cost of Living in Bali",
    blurb: "What it actually costs to live and build here, broken down.",
    href: "/blog/cost-of-living-bali-founder-2026",
  },
  {
    title: "The Bali Tech Ecosystem",
    blurb: "Who's building here, the events, and how the scene fits together.",
    href: "/blog/bali-tech-ecosystem-2026-guide",
  },
];

export const GUIDE_FAQS = [
  {
    question: "Are these places BSTC-verified?",
    answer:
      "Yes. These are the spots BSTC founders actually use, chosen the same way as our coworking guide: honest, no affiliate links, no paid placements. Coworking prices come from our own founder-tested ranking.",
  },
  {
    question: "Do BSTC members get discounts?",
    answer:
      "We're rolling out member perks with selected venues. When a perk is live it shows on the listing, and the code is shared inside the WhatsApp community. Join to get them as they land.",
  },
  {
    question: "I run a venue. Can we partner with BSTC?",
    answer:
      "If you'd like to offer BSTC members a genuine perk, get in touch. We only feature partners that add real value for the community, not paid placements.",
  },
  {
    question: "Where is most of the BSTC community based?",
    answer:
      "Canggu, with Berawa and Pererenan close by. Ubud and Sanur have smaller, quieter founder scenes if you want focus over the social side.",
  },
];
