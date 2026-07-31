import { z } from "zod";
import { provenanced } from "./provenance";

/**
 * Site-wide/general contact info — distinct from Branch.phone/whatsapp
 * (per-location contact facts, already on the Branch record). This holds
 * general-inquiry facts and the CTA-hierarchy preference from
 * docs/INFORMATION-ARCHITECTURE.md's Conversion model
 * (trial-form > whatsapp > phone > email), not a duplicate of branch data.
 */
export const contactDetailsSchema = provenanced({
  generalEmail: z.string().email(),
  generalPhone: z.string().min(1),
  preferredContactOrder: z.array(z.enum(["trial-form", "whatsapp", "phone", "email"])).min(1),
  introText: z.string().min(1),
});
export type ContactDetails = z.infer<typeof contactDetailsSchema>;
