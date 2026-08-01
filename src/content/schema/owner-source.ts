import { z } from "zod";

/**
 * Provenance metadata for owner-interview facts (2026-08-01 intake).
 * Complements record-level `dataStatus` — does not replace ADR-002 gates.
 */
export const ownerSourceSchema = z.object({
  sourceType: z.literal("owner_interview"),
  sourceDate: z.string().min(1),
  sourceName: z.string().min(1),
  verificationLevel: z.enum(["owner_confirmed", "partially_confirmed", "pending"]),
});
export type OwnerSource = z.infer<typeof ownerSourceSchema>;

/** Canonical provenance for the 2026-08-01 Ankit interview. */
export const OWNER_INTERVIEW_2026_08_01 = {
  sourceType: "owner_interview",
  sourceDate: "2026-08-01",
  sourceName: "Ankit",
  verificationLevel: "owner_confirmed",
} as const satisfies OwnerSource;
