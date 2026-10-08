/**
 * Garba Night 2026 — owner-confirmed seasonal event (operator brief 2026-10-07).
 * Not a programme. Primary booking is hosted on Kaizen Events (ADR-026).
 */

export type EventLifecycle = "upcoming" | "concluded";

/** Primary booking channel. `external` = hosted registration (Kaizen). */
export type EventBookingMode = "whatsapp" | "external" | "payment";

export type EventBookingProvider = "whatsapp" | "kaizen" | null;

export type GarbaMediaAvailability = {
  poster: boolean;
  promoTeaser: boolean;
  previousEdition: boolean;
  /** True only when owner campaign poster + both optimized videos are present. */
  campaignComplete: boolean;
};

/**
 * Homepage seasonal campaign switch (temporary).
 * Set to `null` after Garba Night to restore the coach-led fitness block as H1
 * and remove the Home Garba hero (ribbon still follows `lifecycle`).
 */
export type HomeSeasonalCampaign = "garba-night-2026" | null;

export const HOME_SEASONAL_CAMPAIGN: HomeSeasonalCampaign = "garba-night-2026";

export const GARBA_KAIZEN_BOOKING_URL =
  "https://kaizenevents.live/register/ankits-studio-garba-night-the-5th-edition";

export type GarbaNight2026 = {
  slug: "garba-night-2026";
  path: "/events/garba-night-2026";
  dataStatus: "verified";
  lifecycle: EventLifecycle;
  bookingMode: EventBookingMode;
  /**
   * Hosted registration/payment URL when `bookingMode` is `"external"`.
   * Single source of truth — do not hardcode Kaizen in components.
   */
  bookingUrl: string | null;
  bookingProvider: EventBookingProvider;
  /** Legacy gateway field — unused while bookingMode is external/whatsapp. */
  paymentCheckoutUrl: string | null;
  name: string;
  editionLabel: string;
  presenterLine: string;
  dateLabel: string;
  dayLabel: string;
  timeLabel: string;
  startDateIso: string;
  endDateIso: string;
  venueName: string;
  venueLocality: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  capacityLabel: string;
  audienceLabel: string;
  memberPriceInr: number;
  guestPriceInr: number;
  memberPriceLabel: string;
  guestPriceLabel: string;
  whatsappDigits: string;
  refreshmentsNote: string;
  seoTitle: string;
  seoDescription: string;
  highlights: readonly {
    id: string;
    title: string;
    body: string;
  }[];
  prizeCategories: readonly string[];
  stallKinds: readonly string[];
  faqs: readonly {
    id: string;
    question: string;
    answer: string;
  }[];
  media: {
    poster: string;
    posterAlt: string;
    ogImage: string;
    promoTeaser: {
      src: string;
      poster: string;
      label: string;
    };
    previousEdition: {
      src: string;
      poster: string;
      label: string;
      caption: string;
    };
  };
  mapsDirectionsUrl: string;
};

const WHATSAPP_DIGITS = "919372402074";

const VENUE_QUERY =
  "VIBGYOR High School, Plot No. 114, Gothivali Village, Sector 8A, Airoli, Navi Mumbai, Maharashtra 400701";

export const GARBA_NIGHT_2026: GarbaNight2026 = {
  slug: "garba-night-2026",
  path: "/events/garba-night-2026",
  dataStatus: "verified",
  lifecycle: "upcoming",
  bookingMode: "external",
  bookingUrl: GARBA_KAIZEN_BOOKING_URL,
  bookingProvider: "kaizen",
  paymentCheckoutUrl: null,
  name: "Ankit's Studio Garba Night — 5th Edition",
  editionLabel: "5th Edition",
  presenterLine: "Ankit's Studio presents",
  dateLabel: "17 October 2026",
  dayLabel: "Saturday",
  timeLabel: "7 PM – Midnight",
  startDateIso: "2026-10-17T19:00:00+05:30",
  endDateIso: "2026-10-18T00:00:00+05:30",
  venueName: "VIBGYOR High School, Airoli",
  venueLocality: "Airoli, Navi Mumbai",
  streetAddress: "Plot No. 114, Gothivali Village, Sector 8A",
  addressLocality: "Airoli, Navi Mumbai",
  addressRegion: "Maharashtra",
  postalCode: "400701",
  addressCountry: "IN",
  capacityLabel: "Limited to 500 registrations",
  audienceLabel: "Open to all ages",
  memberPriceInr: 599,
  guestPriceInr: 699,
  memberPriceLabel: "₹599",
  guestPriceLabel: "₹699",
  whatsappDigits: WHATSAPP_DIGITS,
  refreshmentsNote:
    "Refreshments are available separately for purchase at the venue and are not included in the pass price.",
  seoTitle: "Garba Night 2026 in Airoli, Navi Mumbai",
  seoDescription:
    "Join Ankit's Studio Garba Night — 5th Edition on 17 Oct at VIBGYOR High, Airoli. Live DJ, prizes and Garba Street. Passes ₹599/₹699.",
  highlights: [
    {
      id: "live-dj",
      title: "Live DJ",
      body: "Music throughout the Garba Night, powered by a live DJ.",
    },
    {
      id: "prizes",
      title: "Prizes & giveaways",
      body: "Giveaway coupons and prizes during the event.",
    },
    {
      id: "photo-zones",
      title: "Photo zones",
      body: "Dedicated photo zones at the event.",
    },
    {
      id: "garba-street",
      title: "Garba Street",
      body: "Food, fashion, jewellery and more stalls at the event.",
    },
    {
      id: "refreshments",
      title: "Refreshments",
      body: "Available separately for purchase at the venue. Not included in the pass price.",
    },
  ],
  prizeCategories: ["Best Dress", "Best Couple", "Best Group"],
  stallKinds: ["Food", "Fashion", "Jewellery", "More stalls"],
  faqs: [
    {
      id: "when",
      question: "When is Garba Night?",
      answer:
        "Saturday, 17 October 2026. The evening runs from 7:00 PM until midnight.",
    },
    {
      id: "where",
      question: "Where is Garba Night being held?",
      answer:
        "VIBGYOR High School, Airoli — Plot No. 114, Gothivali Village, Sector 8A, Airoli, Navi Mumbai, Maharashtra 400701.",
    },
    {
      id: "time",
      question: "What time does it start?",
      answer: "Gates and festivities begin at 7:00 PM and continue until midnight.",
    },
    {
      id: "prices",
      question: "What are the pass prices?",
      answer:
        "Ankit's Studio members: ₹599 per person. Guests: ₹699 per person.",
    },
    {
      id: "who",
      question: "Who can attend?",
      answer: "Open to all ages. Registrations are limited to 500.",
    },
    {
      id: "reserve",
      question: "How do I book passes?",
      answer:
        "Use Book Passes on this page to register on Kaizen Events, where payment is completed. For other questions about the event, WhatsApp Ankit's Studio.",
    },
    {
      id: "refreshments",
      question: "Are refreshments included?",
      answer:
        "No. Refreshments are available separately for purchase at the venue and are not included in the ₹599 / ₹699 pass price.",
    },
    {
      id: "attractions",
      question: "What attractions are available?",
      answer:
        "Live DJ, giveaway coupons, prizes (Best Dress, Best Couple, Best Group), photo zones, and Garba Street with food, fashion, jewellery and more stalls.",
    },
  ],
  media: {
    /** Optimized from media-source/ via scripts/optimize-garba-media.mjs — never serve raw MOV/source. */
    poster: "/events/garba-night-2026/poster.webp",
    posterAlt:
      "Ankit's Studio Garba Night 5th Edition poster — 17 October 2026 at VIBGYOR High School, Airoli",
    ogImage: "/events/garba-night-2026/opengraph-image",
    promoTeaser: {
      src: "/events/garba-night-2026/teaser.mp4",
      poster: "/events/garba-night-2026/teaser-poster.webp",
      label: "Garba Night 2026 teaser",
    },
    previousEdition: {
      src: "/events/garba-night-2026/previous-edition.mp4",
      poster: "/events/garba-night-2026/previous-edition-poster.webp",
      label: "Garba Night 4.0 Highlights",
      caption: "A glimpse of the energy from our previous Garba Night.",
    },
  },
  mapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE_QUERY)}`,
};

export const GARBA_WHATSAPP_PREFILL = `Hi Ankit's Studio 👋

I'd like to reserve passes for Garba Night — 5th Edition on Saturday,
17 October 2026 at VIBGYOR High School, Airoli.

Name:
Member passes:
Guest passes:

Please share the payment and confirmation details.`;
