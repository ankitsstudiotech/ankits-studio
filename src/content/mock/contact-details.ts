import type { ContactDetails } from "../schema";

export const mockContactDetails: ContactDetails = {
  dataStatus: "mock",
  mockDisclaimer:
    "Placeholder general contact details — not confirmed by the owner. Branch-specific phone/WhatsApp numbers live on each Branch record, not here.",
  generalEmail: "hello@example-placeholder.test",
  generalPhone: "+91 00000 00000",
  preferredContactOrder: ["trial-form", "whatsapp", "phone", "email"],
  introText: "Reach out with any questions about programmes, timings, or booking a trial class.",
};
