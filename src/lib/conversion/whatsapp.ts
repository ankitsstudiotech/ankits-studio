/**
 * WhatsApp primary conversion helpers.
 *
 * Opening a WhatsApp link does **not** mean a message was delivered.
 * Fields are optional — callers may open with a partial prefill.
 */

import { getContactDetails } from "@/content";

export const WHATSAPP_TRIAL_TEMPLATE = `Hello Ankit’s Studio,
I would like to book a free trial.

Name:
Preferred branch:
Interested service:
Preferred time:
Question:`;

export type WhatsAppTrialFields = {
  name?: string;
  preferredBranch?: string;
  interestedService?: string;
  preferredTime?: string;
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
  if (!fields.name && !fields.preferredBranch && !fields.interestedService && !fields.preferredTime && !fields.question) {
    return WHATSAPP_TRIAL_TEMPLATE;
  }

  const lines = [
    "Hello Ankit’s Studio,",
    "I would like to book a free trial.",
    "",
    `Name: ${fields.name ?? ""}`,
    `Preferred branch: ${fields.preferredBranch ?? ""}`,
    `Interested service: ${fields.interestedService ?? ""}`,
    `Preferred time: ${fields.preferredTime ?? ""}`,
    `Question: ${fields.question ?? ""}`,
  ];
  return lines.join("\n");
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

/** Primary conversion href: WhatsApp when available, else trial form. */
export function getPrimaryConversionHref(): string {
  return buildWhatsAppTrialUrl() ?? "/trial";
}

export function getPrimaryConversionLabel(): string {
  return "Book a Free Trial on WhatsApp";
}

/** Secondary conversion path — always the trial form. */
export const SECONDARY_TRIAL_FORM_HREF = "/trial";
