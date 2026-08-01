import type { ContactDetails } from "../schema";
import { OWNER_INTERVIEW_2026_08_01 } from "../schema/owner-source";

/**
 * Central enquiry contact — owner interview 2026-08-01.
 * Email remains a non-public placeholder until supplied.
 */
export const mockContactDetails: ContactDetails = {
  dataStatus: "verified",
  generalEmail: "hello@example-placeholder.test",
  generalPhone: "+91 93724 02074",
  generalWhatsapp: "+91 93724 02074",
  preferredContactOrder: ["whatsapp", "phone", "trial-form", "email"],
  introText:
    "Message Ankit’s Studio on WhatsApp to book a free trial, or call the central studio enquiry number. Prefer a form? Use the trial request page — opening WhatsApp does not mean a message was delivered.",
  branchesInheritCentralEnquiry: true,
  ownerSource: OWNER_INTERVIEW_2026_08_01,
};
