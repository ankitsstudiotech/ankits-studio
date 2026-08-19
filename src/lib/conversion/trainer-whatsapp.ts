/**
 * WhatsApp enquiry for trainer / programme availability.
 * Opening chat ≠ enquiry submitted. Do not promise a named trainer.
 */

import { getCentralWhatsAppDigits } from "./whatsapp";

export const WHATSAPP_TRAINER_AVAILABILITY_TEMPLATE = `Hello Ankit’s Studio,
I would like to enquire about training availability.

Name:
Preferred branch:
Interested service:
Preferred time:
Question:`;

export type TrainerAvailabilityEnquiryFields = {
  name?: string;
  preferredBranch?: string;
  interestedService?: string;
  preferredTime?: string;
  question?: string;
};

export function buildWhatsAppTrainerAvailabilityMessage(
  fields: TrainerAvailabilityEnquiryFields = {},
): string {
  if (
    !fields.name &&
    !fields.preferredBranch &&
    !fields.interestedService &&
    !fields.preferredTime &&
    !fields.question
  ) {
    return WHATSAPP_TRAINER_AVAILABILITY_TEMPLATE;
  }

  return [
    "Hello Ankit’s Studio,",
    "I would like to enquire about training availability.",
    "",
    `Name: ${fields.name ?? ""}`,
    `Preferred branch: ${fields.preferredBranch ?? ""}`,
    `Interested service: ${fields.interestedService ?? ""}`,
    `Preferred time: ${fields.preferredTime ?? ""}`,
    `Question: ${fields.question ?? ""}`,
  ].join("\n");
}

export function buildWhatsAppTrainerAvailabilityUrl(
  fields: TrainerAvailabilityEnquiryFields = {},
): string | null {
  const digits = getCentralWhatsAppDigits();
  if (!digits) return null;
  const text = buildWhatsAppTrainerAvailabilityMessage(fields);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
