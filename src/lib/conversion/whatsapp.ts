/**
 * WhatsApp primary conversion helpers.
 *
 * Fields are optional — callers may open with a partial prefill.
 * Prefer WHATSAPP_REVIEW_HELPER once near interactive builders.
 */

import { getContactDetails } from "@/content";

/** Single customer-facing helper for WhatsApp conversion builders. */
export const WHATSAPP_REVIEW_HELPER =
  "You will review the message in WhatsApp before sending.";

export const WHATSAPP_TRIAL_TEMPLATE = `Hello Ankit’s Studio,
I would like to book a free trial.

Name:
Phone:
Preferred branch:
Interested programme:
Preferred time:
Preferred trial date:
Age:
Question:`;

export type WhatsAppTrialFields = {
  name?: string;
  phone?: string;
  preferredBranch?: string;
  interestedService?: string;
  preferredTime?: string;
  /** Optional — useful for kids’ batches or programme suitability. */
  age?: string;
  trialDate?: string;
  question?: string;
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** E.164-ish digits for wa.me (no plus). Falls back only when contact is verified. */
export function getCentralWhatsAppDigits(): string | null {
  const contact = getContactDetails();
  if (contact.dataStatus !== "verified") return null;
  const raw = contact.generalWhatsapp ?? contact.generalPhone;
  const digits = digitsOnly(raw);
  return digits.length >= 10 ? digits : null;
}

export function buildWhatsAppMessage(fields: WhatsAppTrialFields = {}): string {
  const hasAny =
    fields.name ||
    fields.phone ||
    fields.preferredBranch ||
    fields.interestedService ||
    fields.preferredTime ||
    fields.age ||
    fields.trialDate ||
    fields.question;
  if (!hasAny) {
    return WHATSAPP_TRIAL_TEMPLATE;
  }

  const lines = [
    "Hello Ankit’s Studio,",
    "I would like to book a free trial.",
    "",
    `Name: ${fields.name ?? ""}`,
    `Phone: ${fields.phone ?? ""}`,
    `Preferred branch: ${fields.preferredBranch ?? ""}`,
    `Interested programme: ${fields.interestedService ?? ""}`,
    `Preferred time: ${fields.preferredTime ?? ""}`,
    `Preferred trial date: ${fields.trialDate ?? ""}`,
  ];
  if (fields.age) {
    lines.push(`Age: ${fields.age}`);
  }
  lines.push(`Question: ${fields.question ?? ""}`);
  return lines.join("\n");
}

/**
 * Programme detail / enquiry template — service named before branch.
 * Still a free-trial enquiry; opening chat ≠ delivery.
 */
export function buildWhatsAppProgrammeEnquiryMessage(programmeName: string): string {
  return [
    "Hello Ankit’s Studio,",
    "I would like to enquire about a free trial.",
    "",
    "Name:",
    `Interested service: ${programmeName}`,
    "Preferred branch:",
    "Preferred time:",
    "Question:",
  ].join("\n");
}

/**
 * Returns a wa.me URL with optional prefilled text, or null when the
 * central WhatsApp number is not verified yet.
 */
export function buildWhatsAppTrialUrl(fields: WhatsAppTrialFields = {}): string | null {
  const digits = getCentralWhatsAppDigits();
  if (!digits) return null;
  const text = buildWhatsAppMessage(fields);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppProgrammeEnquiryUrl(programmeName: string): string | null {
  const digits = getCentralWhatsAppDigits();
  if (!digits) return null;
  const text = buildWhatsAppProgrammeEnquiryMessage(programmeName);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Guide CTAs that must not use free-trial wording (wedding / Home PT). */
export function buildWhatsAppGuideEnquiryMessage(
  kind: "wedding-enquiry" | "home-pt-enquiry",
): string {
  if (kind === "wedding-enquiry") {
    return [
      "Hello Ankit’s Studio,",
      "I would like to enquire about wedding / sangeet choreography.",
      "",
      "Name:",
      "Event date (if known):",
      "Preferred area:",
      "Who will dance (couple / family / group):",
      "Question:",
    ].join("\n");
  }
  return [
    "Hello Ankit’s Studio,",
    "I would like to enquire about Home Personal Training.",
    "",
    "Name:",
    "Locality:",
    "Preferred time:",
    "Question:",
  ].join("\n");
}

export function buildWhatsAppGuideEnquiryUrl(
  kind: "wedding-enquiry" | "home-pt-enquiry",
): string | null {
  const digits = getCentralWhatsAppDigits();
  if (!digits) return null;
  const text = buildWhatsAppGuideEnquiryMessage(kind);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Primary conversion href: WhatsApp when available, else trial form. */
export function getPrimaryConversionHref(): string {
  return buildWhatsAppTrialUrl() ?? "/trial";
}

export function getPrimaryConversionLabel(): string {
  return "Book a free trial on WhatsApp";
}

/** Secondary conversion path — always the trial form. */
export const SECONDARY_TRIAL_FORM_HREF = "/trial";

/** Shared trial-fact copy — fee applies after joining, never for the trial itself. */
export const FREE_TRIAL_REGISTRATION_NOTE =
  "Free trial class. One-time registration fee is ₹300 after you join.";
