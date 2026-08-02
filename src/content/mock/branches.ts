import type { Branch, BranchFieldProvenance } from "../schema";

const CENTRAL_WHATSAPP = "+91 93724 02074";

/** Owner-confirmed operating window — not a batch timetable. */
const OPERATING_WINDOW = [
  { dayOfWeek: 0, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 1, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 2, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 3, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 4, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 5, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 6, opensAt: "06:00", closesAt: "22:00" },
] as const;

/**
 * Confirmed in-studio programmes shown on branch pages.
 * Excludes home/online delivery modes and migration-pending legacy slugs.
 * See docs/migrations/SERVICE-ROUTE-MIGRATION.md and LOCATION-ROUTE-MIGRATION.md.
 */
const PHYSICAL_FLOOR_PROGRAMMES = [
  "functional-training",
  "yoga",
  "zumba",
  "adult-dance",
  "wedding-choreography",
] as const;

const RELATED_PROGRAMMES = [
  "functional-training",
  "yoga",
  "zumba",
  "adult-dance",
  "wedding-choreography",
  "home-personal-training",
  "online-training",
] as const;

const SHARED_AUDIENCE_PROVENANCE: Pick<
  BranchFieldProvenance,
  | "existence"
  | "publicName"
  | "locality"
  | "phone"
  | "whatsapp"
  | "operatingHours"
  | "batchSchedule"
  | "physicalServices"
  | "audienceAvailability"
  | "landmarks"
  | "nearestStation"
  | "parking"
  | "facilities"
  | "media"
  | "googleBusinessProfileUrl"
  | "pinCode"
> = {
  existence: "owner_confirmed",
  publicName: "owner_confirmed",
  locality: "owner_confirmed",
  phone: "owner_confirmed",
  whatsapp: "owner_confirmed",
  operatingHours: "owner_confirmed",
  batchSchedule: "pending",
  physicalServices: "owner_confirmed",
  audienceAvailability: "owner_confirmed",
  landmarks: "pending",
  nearestStation: "pending",
  parking: "pending",
  facilities: "pending",
  media: "pending",
  googleBusinessProfileUrl: "pending",
  pinCode: "pending",
};

const SHARED_BRANCH_FAQS = [
  {
    id: "faq-branch-batches",
    question: "How do I check current batch availability?",
    answer:
      "Message us on WhatsApp with your preferred branch and programme. Exact class schedules are confirmed when you enquire — we do not publish seat counts or invented timetable rows.",
  },
  {
    id: "faq-branch-hours",
    question: "What are the studio operating hours?",
    answer:
      "Studios operate from 6:00 AM to 10:00 PM. That is the studio operating window, not a continuous class timetable. Batch times vary and are confirmed on WhatsApp.",
  },
  {
    id: "faq-branch-trial",
    question: "Is a trial class free?",
    answer:
      "Yes. You can book a free trial on WhatsApp. After you join, there is a one-time registration fee of ₹300. Programme fees are confirmed when you enquire.",
  },
  {
    id: "faq-branch-audience",
    question: "Are ladies-only or kids-only batches available?",
    answer:
      "Ladies-only and kids-only batches are available as batch options at Ankit’s Studio. Ask on WhatsApp which options fit your preferred branch and programme — availability is confirmed when you enquire.",
  },
] as const;

/**
 * Four owner-confirmed open branches.
 * Record-level status stays mock while printable addresses remain unconfirmed (ADR-002).
 * Maps URLs are owner-confirmed links where supplied; Maps-observed street text is not published.
 * See docs/migrations/LOCATION-ROUTE-MIGRATION.md.
 */
export const mockBranches: Branch[] = [
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Airoli Sector 19 is owner-confirmed as open. Printable address is pending confirmation. Maps link is owner-supplied. Phone/WhatsApp use the central studio enquiry number. Operating hours are the owner-confirmed window (not a class timetable).",
    id: "branch-airoli-sector-19",
    slug: "airoli-sector-19",
    name: "Ankit's Studio — Airoli Sector 19",
    locality: "Airoli Sector 19",
    address: null,
    pinCode: null,
    mapsUrl: "https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac",
    mapsShortUrl: "https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac",
    googleBusinessProfileUrl: null,
    phone: null,
    whatsapp: CENTRAL_WHATSAPP,
    inheritsCentralEnquiry: true,
    openingHours: [...OPERATING_WINDOW],
    openingHoursKind: "operating-window",
    batchScheduleStatus: "pending",
    physicalProgrammeSlugs: [...PHYSICAL_FLOOR_PROGRAMMES],
    programmeSlugs: [...PHYSICAL_FLOOR_PROGRAMMES],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    maxGroupBatchSize: 15,
    openingStatus: "open",
    landmarks: null,
    nearestStation: null,
    parking: null,
    facilities: null,
    mediaSlotKey: "branch.airoli-sector-19",
    fieldProvenance: {
      ...SHARED_AUDIENCE_PROVENANCE,
      address: "pending",
      mapsUrl: "owner_confirmed",
    },
    seoTitle: "Airoli Sector 19",
    seoDescription:
      "Ankit’s Studio in Airoli Sector 19 — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Enquire on WhatsApp for a free trial and current batch times.",
    faqEntries: [...SHARED_BRANCH_FAQS],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Airoli Sector 8 is owner-confirmed as open. Exact address and Maps link are still being updated. Phone/WhatsApp use the central studio enquiry number. Operating hours are the owner-confirmed window (not a class timetable).",
    id: "branch-airoli-sector-8",
    slug: "airoli-sector-8",
    name: "Ankit's Studio — Airoli Sector 8",
    locality: "Airoli Sector 8",
    address: null,
    pinCode: null,
    mapsUrl: null,
    googleBusinessProfileUrl: null,
    phone: null,
    whatsapp: CENTRAL_WHATSAPP,
    inheritsCentralEnquiry: true,
    openingHours: [...OPERATING_WINDOW],
    openingHoursKind: "operating-window",
    batchScheduleStatus: "pending",
    physicalProgrammeSlugs: [...PHYSICAL_FLOOR_PROGRAMMES],
    programmeSlugs: [...PHYSICAL_FLOOR_PROGRAMMES],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    maxGroupBatchSize: 15,
    openingStatus: "open",
    landmarks: null,
    nearestStation: null,
    parking: null,
    facilities: null,
    mediaSlotKey: "branch.airoli-sector-8",
    fieldProvenance: {
      ...SHARED_AUDIENCE_PROVENANCE,
      address: "pending",
      mapsUrl: "pending",
    },
    seoTitle: "Airoli Sector 8",
    seoDescription:
      "Ankit’s Studio in Airoli Sector 8 — open neighbourhood branch. Detailed address and map are being updated. Enquire on WhatsApp for a free trial and current batch times.",
    faqEntries: [
      ...SHARED_BRANCH_FAQS,
      {
        id: "faq-sector-8-address",
        question: "Where exactly is the Airoli Sector 8 studio?",
        answer:
          "Detailed address is being updated. Message us on WhatsApp and we will share directions for Airoli Sector 8 while the page listing is finished.",
      },
    ],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Ghansoli is owner-confirmed as open. Printable address is pending confirmation. Maps link is owner-supplied. Phone/WhatsApp use the central studio enquiry number. Operating hours are the owner-confirmed window (not a class timetable).",
    id: "branch-ghansoli",
    slug: "ghansoli",
    name: "Ankit's Studio — Ghansoli",
    locality: "Ghansoli",
    address: null,
    pinCode: null,
    mapsUrl: "https://maps.app.goo.gl/WzhJUEhAvC67eMgR8?g_st=ac",
    mapsShortUrl: "https://maps.app.goo.gl/WzhJUEhAvC67eMgR8?g_st=ac",
    googleBusinessProfileUrl: null,
    phone: null,
    whatsapp: CENTRAL_WHATSAPP,
    inheritsCentralEnquiry: true,
    openingHours: [...OPERATING_WINDOW],
    openingHoursKind: "operating-window",
    batchScheduleStatus: "pending",
    physicalProgrammeSlugs: [...PHYSICAL_FLOOR_PROGRAMMES],
    programmeSlugs: [...PHYSICAL_FLOOR_PROGRAMMES],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    maxGroupBatchSize: 15,
    openingStatus: "open",
    landmarks: null,
    nearestStation: null,
    parking: null,
    facilities: null,
    mediaSlotKey: "branch.ghansoli",
    fieldProvenance: {
      ...SHARED_AUDIENCE_PROVENANCE,
      address: "pending",
      mapsUrl: "owner_confirmed",
    },
    seoTitle: "Ghansoli",
    seoDescription:
      "Ankit’s Studio in Ghansoli — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Enquire on WhatsApp for a free trial and current batch times.",
    faqEntries: [...SHARED_BRANCH_FAQS],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Thane is owner-confirmed as open. Printable address is pending confirmation. Maps link is owner-supplied. Phone/WhatsApp use the central studio enquiry number. Operating hours are the owner-confirmed window (not a class timetable).",
    id: "branch-thane",
    slug: "thane",
    name: "Ankit's Studio — Thane",
    locality: "Thane",
    address: null,
    pinCode: null,
    mapsUrl: "https://maps.app.goo.gl/bvzahC17HkciT6QQ6?g_st=ic",
    mapsShortUrl: "https://maps.app.goo.gl/bvzahC17HkciT6QQ6?g_st=ic",
    googleBusinessProfileUrl: null,
    phone: null,
    whatsapp: CENTRAL_WHATSAPP,
    inheritsCentralEnquiry: true,
    openingHours: [...OPERATING_WINDOW],
    openingHoursKind: "operating-window",
    batchScheduleStatus: "pending",
    physicalProgrammeSlugs: [...PHYSICAL_FLOOR_PROGRAMMES],
    programmeSlugs: [...PHYSICAL_FLOOR_PROGRAMMES],
    ladiesOnlyBatchesAvailable: true,
    kidsOnlyBatchesAvailable: true,
    maxGroupBatchSize: 15,
    openingStatus: "open",
    landmarks: null,
    nearestStation: null,
    parking: null,
    facilities: null,
    mediaSlotKey: "branch.thane",
    fieldProvenance: {
      ...SHARED_AUDIENCE_PROVENANCE,
      address: "pending",
      mapsUrl: "owner_confirmed",
    },
    seoTitle: "Thane",
    seoDescription:
      "Ankit’s Studio in Thane — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Enquire on WhatsApp for a free trial and current batch times.",
    faqEntries: [...SHARED_BRANCH_FAQS],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
];
