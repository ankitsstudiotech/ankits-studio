import type { BusinessIdentity } from "../schema";

/**
 * The business name itself is confirmed by the owner (see
 * docs/PROJECT-BRIEF.md); tagline, description, and founding year are
 * illustrative placeholders pending owner review — so the whole record
 * stays `dataStatus: "mock"` (record-level provenance requires every field
 * to be reviewed before "verified" — see docs/CONTENT-MODEL.md).
 */
export const mockBusinessIdentity: BusinessIdentity = {
  dataStatus: "mock",
  mockDisclaimer:
    "Business name is confirmed by the owner; tagline, description, and founding year are illustrative placeholders pending review.",
  legalName: "Ankit's Studio",
  displayName: "Ankit's Studio",
  tagline: "Placeholder tagline — strength, movement, and dance for the whole community.",
  description:
    "Placeholder business description. Ankit's Studio offers strength training, personal training, yoga, Zumba, and dance programmes across multiple locations.",
};
