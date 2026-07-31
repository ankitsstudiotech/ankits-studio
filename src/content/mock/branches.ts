import type { Branch } from "../schema";

/**
 * Airoli and Ghansoli are confirmed to operate (VERIFIED as a *location*
 * per docs/BUSINESS-DATA-STATUS.md), but every field on these records —
 * address, phone, WhatsApp, hours — is still MOCK, so the record as a
 * whole stays `dataStatus: "mock"` (record-level provenance requires every
 * field to be reviewed before a record can be "verified" — see
 * docs/CONTENT-MODEL.md). Thane is REFERENCE-ONLY end to end and excluded
 * from public nav via `publiclyListed: false` — see DECISIONS.md ADR-007
 * (finding I2). No `mapEmbedUrl` is populated on any record here — see
 * DECISIONS.md ADR-011.
 */
export const mockBranches: Branch[] = [
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Placeholder branch details — address, phone, WhatsApp, and hours are illustrative only and not confirmed by the owner.",
    slug: "airoli",
    name: "Ankit's Studio — Airoli",
    address: "123 Placeholder Road, Sector 15, Airoli, Navi Mumbai (exact address not yet confirmed)",
    phone: "+91 00000 00000",
    whatsapp: "+91 00000 00000",
    openingHours: [
      { dayOfWeek: 0, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 1, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 2, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 3, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 4, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 5, opensAt: "07:00", closesAt: "19:00" },
      { dayOfWeek: 6, opensAt: "07:00", closesAt: "13:00" },
    ],
    programmeSlugs: [
      "strength-training",
      "personal-training",
      "yoga",
      "zumba",
      "adult-dance",
      "kids-dance",
      "weight-loss-fitness",
    ],
    publiclyListed: true,
  },
  {
    dataStatus: "mock",
    mockDisclaimer:
      "Placeholder branch details — address, phone, WhatsApp, and hours are illustrative only and not confirmed by the owner.",
    slug: "ghansoli",
    name: "Ankit's Studio — Ghansoli",
    address: "45 Placeholder Lane, Sector 9, Ghansoli, Navi Mumbai (exact address not yet confirmed)",
    phone: "+91 00000 00000",
    whatsapp: "+91 00000 00000",
    openingHours: [
      { dayOfWeek: 0, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 1, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 2, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 3, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 4, opensAt: "06:00", closesAt: "21:00" },
      { dayOfWeek: 5, opensAt: "07:00", closesAt: "19:00" },
      { dayOfWeek: 6, opensAt: "07:00", closesAt: "13:00" },
    ],
    programmeSlugs: [
      "strength-training",
      "personal-training",
      "yoga",
      "zumba",
      "adult-dance",
      "kids-dance",
      "weight-loss-fitness",
    ],
    publiclyListed: true,
  },
  {
    dataStatus: "reference-only",
    mockDisclaimer:
      "Owner flagged Thane as a known/expected branch but has not confirmed it operates. All fields are placeholder, and this branch is excluded from public navigation until confirmed.",
    slug: "thane",
    name: "Ankit's Studio — Thane",
    address: "To be confirmed",
    phone: "+91 00000 00000",
    whatsapp: "+91 00000 00000",
    openingHours: [],
    programmeSlugs: ["strength-training", "personal-training", "adult-dance", "weight-loss-fitness"],
    publiclyListed: false,
  },
];
