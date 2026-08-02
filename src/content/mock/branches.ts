import type { Branch } from "../schema";

const CENTRAL_ENQUIRY = "+91 93724 02074";

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
 * See docs/migrations/SERVICE-ROUTE-MIGRATION.md.
 */
const BRANCH_FLOOR_PROGRAMMES = [
  "functional-training",
  "yoga",
  "zumba",
  "adult-dance",
  "wedding-choreography",
] as const;

/**
 * Owner interview 2026-08-01: four branches open. Record-level status stays
 * mock while printable addresses remain unconfirmed (ADR-002).
 * Phone/WhatsApp inherit the central enquiry number — not unique per branch.
 * `mapsShortUrl` associated only after browser resolution; `mapEmbedUrl` omitted.
 */
export const mockBranches: Branch[] = [
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Airoli Sector 19 is owner-confirmed as open. Printable address is pending confirmation. Phone/WhatsApp show the central studio enquiry number, not a unique branch line. Operating hours are the owner-confirmed window (not a class timetable). Maps short URL is reference-associated only.",
    slug: "airoli",
    name: "Ankit's Studio — Airoli Sector 19",
    address:
      "Airoli Sector 19 — exact printable address pending owner confirmation (Maps pin associated for reference).",
    mapsShortUrl: "https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac",
    phone: CENTRAL_ENQUIRY,
    whatsapp: CENTRAL_ENQUIRY,
    inheritsCentralEnquiry: true,
    openingHours: [...OPERATING_WINDOW],
    openingHoursKind: "operating-window",
    programmeSlugs: [...BRANCH_FLOOR_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Airoli Sector 8 is owner-confirmed as open. Exact address and Maps link are missing. Phone/WhatsApp show the central studio enquiry number. Operating hours are the owner-confirmed window (not a class timetable).",
    slug: "airoli-sector-8",
    name: "Ankit's Studio — Airoli Sector 8",
    address: "Airoli Sector 8 — address and Maps link not yet supplied.",
    phone: CENTRAL_ENQUIRY,
    whatsapp: CENTRAL_ENQUIRY,
    inheritsCentralEnquiry: true,
    openingHours: [...OPERATING_WINDOW],
    openingHoursKind: "operating-window",
    programmeSlugs: [...BRANCH_FLOOR_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Ghansoli is owner-confirmed as open. Printable address is pending confirmation. Phone/WhatsApp show the central studio enquiry number. Operating hours are the owner-confirmed window (not a class timetable). Maps short URL is reference-associated only.",
    slug: "ghansoli",
    name: "Ankit's Studio — Ghansoli",
    address:
      "Ghansoli — exact printable address pending owner confirmation (Maps pin associated for reference).",
    mapsShortUrl: "https://maps.app.goo.gl/WzhJUEhAvC67eMgR8?g_st=ac",
    phone: CENTRAL_ENQUIRY,
    whatsapp: CENTRAL_ENQUIRY,
    inheritsCentralEnquiry: true,
    openingHours: [...OPERATING_WINDOW],
    openingHoursKind: "operating-window",
    programmeSlugs: [...BRANCH_FLOOR_PROGRAMMES],
    publiclyListed: true,
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Thane is owner-confirmed as open (2026-08-01). Printable address is pending confirmation. Phone/WhatsApp show the central studio enquiry number. Operating hours are the owner-confirmed window (not a class timetable). Maps short URL is reference-associated only.",
    slug: "thane",
    name: "Ankit's Studio — Thane",
    address:
      "Thane — exact printable address pending owner confirmation (Maps pin associated for reference).",
    mapsShortUrl: "https://maps.app.goo.gl/bvzahC17HkciT6QQ6?g_st=ic",
    phone: CENTRAL_ENQUIRY,
    whatsapp: CENTRAL_ENQUIRY,
    inheritsCentralEnquiry: true,
    openingHours: [...OPERATING_WINDOW],
    openingHoursKind: "operating-window",
    programmeSlugs: [...BRANCH_FLOOR_PROGRAMMES],
    publiclyListed: true,
  },
];
