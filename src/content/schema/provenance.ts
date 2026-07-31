import { z } from "zod";

/**
 * Mirrors the three statuses in docs/BUSINESS-DATA-STATUS.md and the
 * discriminated union in docs/CONTENT-MODEL.md. "reference-only" is this
 * project's name for "owner gave a pointer (e.g. a Maps pin) but it isn't a
 * confirmed, publishable value yet" — see DECISIONS.md ADR-002/ADR-012.
 */
export const dataStatusSchema = z.enum(["mock", "reference-only", "verified"]);
export type DataStatus = z.infer<typeof dataStatusSchema>;

/**
 * Wraps a domain shape in the mock/reference-only/verified discriminated
 * union. A record cannot be "mock" or "reference-only" without a
 * `mockDisclaimer` (required at the type level, not just by convention) —
 * see docs/CONTENT-MODEL.md and docs/DECISIONS.md ADR-002.
 */
export function provenanced<Shape extends z.ZodRawShape>(shape: Shape) {
  const base = z.object(shape);
  return z.discriminatedUnion("dataStatus", [
    base.extend({
      dataStatus: z.literal("mock"),
      mockDisclaimer: z.string().min(1),
    }),
    base.extend({
      dataStatus: z.literal("reference-only"),
      mockDisclaimer: z.string().min(1),
    }),
    base.extend({
      dataStatus: z.literal("verified"),
    }),
  ]);
}
