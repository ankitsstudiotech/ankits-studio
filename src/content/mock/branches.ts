import type { Branch, BranchFieldProvenance } from "../schema";
import { OWNER_INTERVIEW_2026_08_03 } from "../schema/owner-source";

const CENTRAL_PHONE = "+91 93724 02074";
const CENTRAL_WHATSAPP = "+91 93724 02074";

/** Owner-confirmed operating window — not a batch timetable. Open every day. */
const OPERATING_WINDOW = [
  { dayOfWeek: 0, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 1, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 2, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 3, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 4, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 5, opensAt: "06:00", closesAt: "22:00" },
  { dayOfWeek: 6, opensAt: "06:00", closesAt: "22:00" },
] as const;

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

/**
 * Amenities answered generally by the owner — not branch-mapped.
 * Keep facilities null on public branch records until per-branch confirmation.
 */
export const STUDIO_GENERAL_AMENITIES_PENDING = {
  parking: "available",
  washroomChanging: "available",
  airConditioning: "available",
  drinkingWater: "available",
  lift: "not_applicable",
  status: "owner_provided_not_branch_mapped" as const,
  ownerSource: OWNER_INTERVIEW_2026_08_03,
};

/**
 * Branch opening years from owner list order — inferred mapping, unpublished.
 * Do not render until Ankit confirms the ordering.
 */
export const BRANCH_OPENING_YEARS_INFERRED = {
  status: "owner_sequence_inferred" as const,
  mapping: {
    "airoli-sector-19": 2019,
    "airoli-sector-8": 2021,
    ghansoli: 2023,
    thane: 2026,
  },
  ownerSource: OWNER_INTERVIEW_2026_08_03,
};

const SHARED_AUDIENCE_PROVENANCE: BranchFieldProvenance = {
  existence: "owner_confirmed",
  publicName: "owner_confirmed",
  locality: "owner_confirmed",
  address: "owner_confirmed",
  pinCode: "owner_confirmed",
  mapsUrl: "owner_confirmed",
  googleBusinessProfileUrl: "pending",
  phone: "owner_confirmed",
  whatsapp: "owner_confirmed",
  operatingHours: "owner_confirmed",
  batchSchedule: "pending",
  physicalServices: "owner_confirmed",
  audienceAvailability: "owner_confirmed",
  landmarks: "owner_confirmed",
  nearestStation: "pending",
  parking: "pending",
  facilities: "pending",
  media: "pending",
};

/** Keep only FAQs that add detail not already on the branch page. */
const SHARED_BRANCH_FAQS = [
  {
    id: "faq-branch-audience",
    question: "Are ladies-only or kids-only batches available?",
    answer:
      "Ladies-only and kids-only batches are available as batch options. Kids Dance age groups include 3–8 years and 8–12 years. Ask on WhatsApp which options fit — availability is confirmed when you enquire.",
  },
] as const;

/**
 * Four owner-confirmed open branches with printable addresses (2026-08-03).
 * Amenities remain unpublished until confirmed per branch.
 * See docs/business/OWNER-DATA-MIGRATION-2026-08-03.md and ADR-018.
 */
export const mockBranches: Branch[] = [
  {
    dataStatus: "verified",
    id: "branch-airoli-sector-19",
    slug: "airoli-sector-19",
    name: "Ankit's Studio — Airoli Sector 19",
    locality: "Airoli Sector 19",
    address:
      "Shop No. 05, Beside Bank of Maharashtra, Sector 19, Airoli, Navi Mumbai, Maharashtra 400708",
    pinCode: "400708",
    mapsUrl: "https://maps.app.goo.gl/JowoDwXZUVqiFfWC6?g_st=ic",
    mapsShortUrl: "https://maps.app.goo.gl/JowoDwXZUVqiFfWC6?g_st=ic",
    googleBusinessProfileUrl: null,
    phone: CENTRAL_PHONE,
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
    landmarks: "Beside Bank of Maharashtra",
    nearestStation: null,
    parking: null,
    facilities: null,
    mediaSlotKey: "branch.airoli-sector-19",
    fieldProvenance: { ...SHARED_AUDIENCE_PROVENANCE },
    seoTitle: "Airoli Sector 19 Fitness Studio",
    seoDescription:
      "Ankit’s Studio at Shop No. 05, Sector 19, Airoli — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Open 6:00 AM–10:00 PM daily. Free trial on WhatsApp.",
    faqEntries: [...SHARED_BRANCH_FAQS],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "verified",
    id: "branch-airoli-sector-8",
    slug: "airoli-sector-8",
    name: "Ankit's Studio — Airoli Sector 8",
    locality: "Airoli Sector 8",
    address:
      "Swaraj Daffodils, Beside Airoli Sports Association, Sector 8A, Airoli, Navi Mumbai, Maharashtra 400701",
    pinCode: "400701",
    mapsUrl: "https://maps.app.goo.gl/7zLudwn1c6RUZZWUA?g_st=ic",
    mapsShortUrl: "https://maps.app.goo.gl/7zLudwn1c6RUZZWUA?g_st=ic",
    googleBusinessProfileUrl: null,
    phone: CENTRAL_PHONE,
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
    landmarks: "Beside Airoli Sports Association",
    nearestStation: null,
    parking: null,
    facilities: null,
    mediaSlotKey: "branch.airoli-sector-8",
    fieldProvenance: { ...SHARED_AUDIENCE_PROVENANCE },
    seoTitle: "Airoli Sector 8 Fitness Studio",
    seoDescription:
      "Ankit’s Studio at Swaraj Daffodils, Sector 8A, Airoli — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Open 6:00 AM–10:00 PM daily. Free trial on WhatsApp.",
    faqEntries: [...SHARED_BRANCH_FAQS],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "verified",
    id: "branch-ghansoli",
    slug: "ghansoli",
    name: "Ankit's Studio — Ghansoli",
    locality: "Ghansoli",
    address:
      "Satyam Imperial, Opposite Sai Baba Mandir, Sector 11, Ghansoli, Navi Mumbai, Maharashtra 400701",
    pinCode: "400701",
    mapsUrl: "https://maps.app.goo.gl/fvGjyZ51AtHBBQAT7?g_st=ic",
    mapsShortUrl: "https://maps.app.goo.gl/fvGjyZ51AtHBBQAT7?g_st=ic",
    googleBusinessProfileUrl: null,
    phone: CENTRAL_PHONE,
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
    landmarks: "Opposite Sai Baba Mandir",
    nearestStation: null,
    parking: null,
    facilities: null,
    mediaSlotKey: "branch.ghansoli",
    fieldProvenance: { ...SHARED_AUDIENCE_PROVENANCE },
    seoTitle: "Ghansoli Fitness Studio",
    seoDescription:
      "Ankit’s Studio at Satyam Imperial, Sector 11, Ghansoli — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Open 6:00 AM–10:00 PM daily. Free trial on WhatsApp.",
    faqEntries: [...SHARED_BRANCH_FAQS],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "verified",
    id: "branch-thane",
    slug: "thane",
    name: "Ankit's Studio — Thane",
    locality: "Thane",
    address:
      "Edulji Road, Dhobi Ali, Charai, Opposite Awaaj Radio, Thane, Maharashtra 400601",
    pinCode: "400601",
    mapsUrl: "https://maps.app.goo.gl/bzzHhBbu5qg5J1pHA?g_st=ic",
    mapsShortUrl: "https://maps.app.goo.gl/bzzHhBbu5qg5J1pHA?g_st=ic",
    googleBusinessProfileUrl: null,
    phone: CENTRAL_PHONE,
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
    landmarks: "Opposite Awaaj Radio, Charai",
    nearestStation: null,
    parking: null,
    facilities: null,
    mediaSlotKey: "branch.thane",
    fieldProvenance: { ...SHARED_AUDIENCE_PROVENANCE },
    seoTitle: "Thane Fitness Studio",
    seoDescription:
      "Ankit’s Studio on Edulji Road, Dhobi Ali, Charai, Thane — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Open 6:00 AM–10:00 PM daily. Free trial on WhatsApp.",
    faqEntries: [...SHARED_BRANCH_FAQS],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
];
