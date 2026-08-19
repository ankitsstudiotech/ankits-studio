import { z } from "zod";
import { provenanced } from "./provenance";
import { ownerSourceSchema } from "./owner-source";

/**
 * Site-wide/general contact info — distinct from per-branch display fields.
 * Owner intake 2026-08-01: one central phone/WhatsApp inherited by branches
 * (not unique branch numbers). Preferred order may put WhatsApp first.
 */
export const contactDetailsSchema = provenanced({
  generalEmail: z.string().email(),
  generalPhone: z.string().min(1),
  /** When omitted, treat `generalPhone` as the WhatsApp number too. */
  generalWhatsapp: z.string().min(1).optional(),
  preferredContactOrder: z.array(z.enum(["trial-form", "whatsapp", "phone", "email"])).min(1),
  introText: z.string().min(1),
  /**
   * True when branch phone/WhatsApp fields inherit this central enquiry
   * number rather than representing unique branch lines.
   */
  branchesInheritCentralEnquiry: z.boolean().optional(),
  ownerSource: ownerSourceSchema.optional(),
});
export type ContactDetails = z.infer<typeof contactDetailsSchema>;
