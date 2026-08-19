import type { ProgrammeConversionIntent } from "@/content/schema/programme";
import {
  buildWhatsAppProgrammeEnquiryUrl,
  getCentralWhatsAppDigits,
  getPrimaryConversionLabel,
} from "./whatsapp";

export type ProgrammeConversionFields = {
  name: string;
  conversionIntent?: ProgrammeConversionIntent;
};

export function getProgrammeConversionIntent(
  programme: ProgrammeConversionFields,
): ProgrammeConversionIntent {
  return programme.conversionIntent ?? "free-trial";
}

export function isServiceEnquiryProgramme(programme: ProgrammeConversionFields): boolean {
  return getProgrammeConversionIntent(programme) === "service-enquiry";
}

export function getProgrammeConversionLabel(programme: ProgrammeConversionFields): string {
  if (isServiceEnquiryProgramme(programme)) {
    return programme.name === "Corporate Wellness"
      ? "Enquire about Corporate Wellness"
      : "Discuss a team programme";
  }
  return getPrimaryConversionLabel();
}

export function buildWhatsAppCorporateWellnessMessage(): string {
  return "Hi, I'd like to enquire about Corporate Wellness for our organisation.";
}

export function buildWhatsAppServiceEnquiryUrl(
  programme: ProgrammeConversionFields,
): string | null {
  const digits = getCentralWhatsAppDigits();
  if (!digits) return null;

  const text =
    programme.name === "Corporate Wellness"
      ? buildWhatsAppCorporateWellnessMessage()
      : `Hello Ankit's Studio,\nI would like to enquire about ${programme.name}.\n\nOrganisation:\nTeam size:\nLocation:\nQuestion:`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function getProgrammeConversionHref(
  programme: ProgrammeConversionFields,
): string | null {
  if (isServiceEnquiryProgramme(programme)) {
    return buildWhatsAppServiceEnquiryUrl(programme);
  }
  return buildWhatsAppProgrammeEnquiryUrl(programme.name);
}
