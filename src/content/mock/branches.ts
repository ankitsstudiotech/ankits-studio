import type { Branch, BranchFieldProvenance } from "../schema";
import { OWNER_FORM_2026_08_12 } from "../schema/owner-source";

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
  "corporate-wellness",
] as const;

const STANDARD_FACILITIES = [
  "Parking",
  "Washroom",
  "Changing area",
  "Air conditioning",
  "Drinking water",
] as const;

/**
 * Per-branch amenities confirmed 2026-08-12. Lift is not available at any branch.
 * @deprecated Use per-branch `facilities` on public branch records.
 */
export const STUDIO_GENERAL_AMENITIES_PENDING = {
  parking: "available",
  washroomChanging: "available",
  airConditioning: "available",
  drinkingWater: "available",
  lift: "not_available",
  status: "superseded_by_per_branch_data" as const,
  ownerSource: OWNER_FORM_2026_08_12,
};

/** Branch opening years — owner-confirmed 2026-08-12. */
export const BRANCH_OPENING_YEARS_INFERRED = {
  status: "owner_confirmed" as const,
  mapping: {
    "airoli-sector-19": 2019,
    "airoli-sector-8": 2021,
    ghansoli: 2023,
    thane: 2026,
  },
  ownerSource: OWNER_FORM_2026_08_12,
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
  nearestStation: "owner_confirmed",
  parking: "owner_confirmed",
  facilities: "owner_confirmed",
  media: "pending",
};

const SHARED_BRANCH_FAQS = [
  {
    id: "faq-branch-audience",
    question: "Are ladies-only or kids-only batches available?",
    answer:
      "Ladies-only and kids-only batches are available as batch options. Kids Dance age groups include 3–8 years and 8–12 years. Ask on WhatsApp which options fit — availability is confirmed when you enquire.",
  },
] as const;

/**
 * Four owner-confirmed branches — logistics and amenities from form 2026-08-12.
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
    mapsUrl: "https://maps.app.goo.gl/75pmKFuezsCSd5JP8",
    mapsShortUrl: "https://maps.app.goo.gl/75pmKFuezsCSd5JP8",
    googlePlaceId: "ChIJ8cbuhKe_5zsRnlffZagyHhQ",
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
    openingYear: 2019,
    landmarks: "Opposite Gaondevi Maidan",
    nearestStation: "Airoli Station",
    parking: "Open parking available",
    nearbyTransport: ["Approx. 10 minutes walking from Airoli Station"],
    facilities: [...STANDARD_FACILITIES],
    mediaSlotKey: "branch.airoli-sector-19",
    fieldProvenance: { ...SHARED_AUDIENCE_PROVENANCE },
    seoTitle: "Airoli Sector 19 — Fitness, Yoga, Zumba & Dance",
    seoDescription:
      "Train at Ankit’s Studio in Airoli Sector 19 — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Open 6:00 AM–10:00 PM daily. Free trial on WhatsApp.",
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
    mapsUrl: "https://maps.app.goo.gl/1J1KpmeYWsoWkckr6",
    mapsShortUrl: "https://maps.app.goo.gl/1J1KpmeYWsoWkckr6",
    googlePlaceId: "ChIJ471ri1e_5zsR7onUOyeK8LU",
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
    openingYear: 2021,
    landmarks: "Beside Tulja Bhavani Mandir",
    nearestStation: "Rabale Station",
    parking: "Open parking available",
    nearbyTransport: ["Approx. 10 minutes walking from Rabale Station"],
    facilities: [...STANDARD_FACILITIES],
    mediaSlotKey: "branch.airoli-sector-8",
    fieldProvenance: { ...SHARED_AUDIENCE_PROVENANCE },
    seoTitle: "Airoli Sector 8 — Fitness, Yoga, Zumba & Dance",
    seoDescription:
      "Train at Ankit’s Studio in Airoli Sector 8 — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Open 6:00 AM–10:00 PM daily. Free trial on WhatsApp.",
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
    mapsUrl: "https://maps.app.goo.gl/PVDTDZKsM9iSHdjD9",
    mapsShortUrl: "https://maps.app.goo.gl/PVDTDZKsM9iSHdjD9",
    googlePlaceId: "ChIJyWp9rKXH5zsRvxE9mt5slNY",
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
    openingYear: 2023,
    landmarks: "Opposite Sai Baba Mandir",
    nearestStation: "Ghansoli Station",
    parking: "Open parking available",
    nearbyTransport: ["Approx. 5-minute auto ride from Ghansoli Station"],
    facilities: [...STANDARD_FACILITIES],
    mediaSlotKey: "branch.ghansoli",
    fieldProvenance: { ...SHARED_AUDIENCE_PROVENANCE },
    seoTitle: "Ghansoli — Fitness, Yoga, Zumba & Dance",
    seoDescription:
      "Train at Ankit’s Studio in Ghansoli — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Open 6:00 AM–10:00 PM daily. Free trial on WhatsApp.",
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
      "Edulji Road, Dhobi Ali, Charai, Opposite Awaaz Radio, Thane, Maharashtra 400601",
    pinCode: "400601",
    mapsUrl: "https://maps.app.goo.gl/6tQTXnrur5iggfJ6A",
    mapsShortUrl: "https://maps.app.goo.gl/6tQTXnrur5iggfJ6A",
    googlePlaceId: "ChIJ6cwFOYS55zsRoAWBQpoEv9M",
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
    openingYear: 2026,
    landmarks: "Opposite Awaaz Radio",
    nearestStation: "Thane Station",
    parking: "Open parking available",
    nearbyTransport: ["Approx. 5-minute auto ride from Thane Station"],
    facilities: [...STANDARD_FACILITIES],
    mediaSlotKey: "branch.thane",
    fieldProvenance: { ...SHARED_AUDIENCE_PROVENANCE },
    seoTitle: "Thane — Fitness, Yoga, Zumba & Dance",
    seoDescription:
      "Train at Ankit’s Studio in Thane — Functional Training, Yoga, Zumba, Dance and Wedding Choreography. Open 6:00 AM–10:00 PM daily. Free trial on WhatsApp.",
    faqEntries: [...SHARED_BRANCH_FAQS],
    relatedProgrammeSlugs: [...RELATED_PROGRAMMES],
    publiclyListed: true,
  },
];
