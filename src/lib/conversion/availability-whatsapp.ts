/**
 * Batch-availability WhatsApp enquiry helpers.
 * Opening chat ≠ message delivered. Fields are optional.
 */

import { getCentralWhatsAppDigits } from "./whatsapp";

export type AvailabilityDeliveryMode = "in-studio" | "home" | "online";

export type AvailabilityEnquiryFields = {
  name?: string;
  preferredBranch?: string;
  locality?: string;
  interestedService?: string;
  preferredDayTime?: string;
  batchPreference?: string;
  question?: string;
  deliveryMode?: AvailabilityDeliveryMode;
};

export function buildWhatsAppAvailabilityMessage(
  fields: AvailabilityEnquiryFields = {},
): string {
  const mode = fields.deliveryMode ?? "in-studio";
  const service = fields.interestedService?.trim() ?? "";

  if (mode === "home") {
    return [
      "Hello Ankit’s Studio,",
      "I would like to enquire about Home Personal Training.",
      "",
      `Name: ${fields.name ?? ""}`,
      `Locality: ${fields.locality ?? ""}`,
      `Preferred day/time: ${fields.preferredDayTime ?? ""}`,
      `Question: ${fields.question ?? ""}`,
    ].join("\n");
  }

  if (mode === "online") {
    return [
      "Hello Ankit’s Studio,",
      "I would like to enquire about Online Training.",
      "",
      `Name: ${fields.name ?? ""}`,
      `Preferred day/time: ${fields.preferredDayTime ?? ""}`,
      `Question: ${fields.question ?? ""}`,
    ].join("\n");
  }

  return [
    "Hello Ankit’s Studio,",
    "I would like to check batch availability and book a free trial.",
    "",
    `Name: ${fields.name ?? ""}`,
    `Preferred branch: ${fields.preferredBranch ?? ""}`,
    `Interested service: ${service}`,
    `Preferred day/time: ${fields.preferredDayTime ?? ""}`,
    `Batch preference: ${fields.batchPreference ?? ""}`,
    `Question: ${fields.question ?? ""}`,
  ].join("\n");
}

export function buildWhatsAppAvailabilityUrl(
  fields: AvailabilityEnquiryFields = {},
): string | null {
  const digits = getCentralWhatsAppDigits();
  if (!digits) return null;
  const text = buildWhatsAppAvailabilityMessage(fields);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Soft guidance — never blocks opening WhatsApp. */
export function availabilityBranchPromptNeeded(
  deliveryMode: AvailabilityDeliveryMode,
  preferredBranch: string | undefined,
): boolean {
  return deliveryMode === "in-studio" && !preferredBranch?.trim();
}
