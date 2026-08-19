/**
 * Pricing enquiry WhatsApp helpers.
 * Opening chat ≠ enquiry submitted. Fields are optional.
 */

import { getCentralWhatsAppDigits } from "./whatsapp";

export type PricingDeliveryMode = "in-studio" | "home" | "online" | "wedding";

export type PricingEnquiryFields = {
  name?: string;
  interestedService?: string;
  preferredBranch?: string;
  locality?: string;
  preferredFormat?: string;
  eventDate?: string;
  participants?: string;
  songs?: string;
  question?: string;
  deliveryMode?: PricingDeliveryMode;
};

export function resolvePricingDeliveryMode(
  serviceSlug: string,
  deliveryMode?: "in-studio" | "home" | "online",
): PricingDeliveryMode {
  if (serviceSlug === "wedding-choreography") return "wedding";
  if (deliveryMode === "home") return "home";
  if (deliveryMode === "online") return "online";
  return "in-studio";
}

export function buildWhatsAppPricingMessage(fields: PricingEnquiryFields = {}): string {
  const mode = fields.deliveryMode ?? "in-studio";
  const service = fields.interestedService?.trim() ?? "";

  if (mode === "home") {
    return [
      "Hello Ankit’s Studio,",
      "I would like to know the fee for Home Personal Training.",
      "",
      `Name: ${fields.name ?? ""}`,
      `Locality: ${fields.locality ?? ""}`,
      `Question: ${fields.question ?? ""}`,
    ].join("\n");
  }

  if (mode === "online") {
    return [
      "Hello Ankit’s Studio,",
      "I would like to know the fee for Online Training.",
      "",
      `Name: ${fields.name ?? ""}`,
      `Question: ${fields.question ?? ""}`,
    ].join("\n");
  }

  if (mode === "wedding") {
    return [
      "Hello Ankit’s Studio,",
      "I would like to enquire about Wedding Choreography pricing.",
      "",
      `Name: ${fields.name ?? ""}`,
      `Event date: ${fields.eventDate ?? ""}`,
      `Number of participants: ${fields.participants ?? ""}`,
      `Number of songs: ${fields.songs ?? ""}`,
      `Question: ${fields.question ?? ""}`,
    ].join("\n");
  }

  return [
    "Hello Ankit’s Studio,",
    "I would like to know the current fee.",
    "",
    `Name: ${fields.name ?? ""}`,
    `Interested service: ${service}`,
    `Preferred branch: ${fields.preferredBranch ?? ""}`,
    ...(fields.preferredFormat?.trim()
      ? [`Preferred format: ${fields.preferredFormat.trim()}`]
      : []),
    `Question: ${fields.question ?? ""}`,
  ].join("\n");
}

export function buildWhatsAppPricingUrl(fields: PricingEnquiryFields = {}): string | null {
  const digits = getCentralWhatsAppDigits();
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(buildWhatsAppPricingMessage(fields))}`;
}

export function pricingBranchPromptNeeded(
  mode: PricingDeliveryMode,
  preferredBranch: string | undefined,
): boolean {
  return mode === "in-studio" && !preferredBranch?.trim();
}
