import type { ContactDetails } from "../schema";
import { OWNER_INTERVIEW_2026_08_03 } from "../schema/owner-source";

/**
 * Central enquiry contact — owner interview 2026-08-03.
 * Admin answers during studio operating hours (not a one-minute guarantee).
 */
export const mockContactDetails: ContactDetails = {
  dataStatus: "verified",
  generalEmail: "ankitsstudio5@gmail.com",
  generalPhone: "+91 93724 02074",
  generalWhatsapp: "+91 93724 02074",
  preferredContactOrder: ["whatsapp", "phone", "trial-form", "email"],
  introText:
    "Message Ankit’s Studio on WhatsApp to book a free trial, or call the central studio enquiry number. Messages are answered during studio operating hours. Prefer a form? Use the trial request page.",
  branchesInheritCentralEnquiry: true,
  ownerSource: OWNER_INTERVIEW_2026_08_03,
};
