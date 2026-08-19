/**
 * Owner-provided lead trainer first names (2026-08-03).
 * Unpublished — no branch mapping, photos, consent, or full names yet.
 * Must not render on /trainers until publishability gate is met (ADR-019).
 */
export const PENDING_LEAD_TRAINERS = {
  status: "owner_provided_unpublished" as const,
  firstNames: ["Tanvi", "Deepali", "Khushboo", "Sandhya"] as const,
  note: "Owner did not map each person to a branch in writing. Do not infer mapping from list order.",
  sourceDate: "2026-08-03",
  sourceName: "Ankit Nalawade",
};

/** Founder certification — evidence pending; do not publish Ministry/gov wording. */
export const PENDING_FOUNDER_CERTIFICATION = {
  status: "owner_provided_evidence_pending" as const,
  name: "Yoga certification",
  issuer: "Yog Vidya Niketan",
  year: 2017,
  ownerAssociationNote: "Owner associates it with the Ministry of Ayush — unpublished until certificate reviewed.",
  sourceDate: "2026-08-03",
};
