/**
 * Media policy after owner decision 2026-08-12.
 * Form-upload Drive assets are not used in this migration.
 */
export const mockMediaPolicy = {
  ownerDecisionDate: "2026-08-12",
  existingOwnerMediaStatus: "outdated-do-not-use",
  interimProductionArtDirection:
    "Approved AI-generated illustrative media until a new photoshoot is completed.",
  formUploadDriveLinks: "recorded in requirements CSV — not ingested",
  fetchGoogleReviewsInThisMigration: false,
} as const;
