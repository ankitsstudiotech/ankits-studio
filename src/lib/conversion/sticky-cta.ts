import { getConfirmedProgrammes } from "@/content";
import {
  getProgrammeConversionHref,
  isServiceEnquiryProgramme,
} from "./programme-conversion";
import { getPrimaryConversionHref } from "./whatsapp";

export type StickyCtaIntent = "free-trial" | "service-enquiry";

export type StickyCtaPresentation = {
  intent: StickyCtaIntent;
  label: string;
  supportingText: string;
  href: string;
};

const FREE_TRIAL_PRESENTATION: Omit<StickyCtaPresentation, "href"> = {
  intent: "free-trial",
  label: "WhatsApp trial",
  supportingText: "Free trial",
};

/**
 * Sticky bar copy follows programme conversionIntent — not a pathname one-off.
 * Site-wide header CTA stays on the consumer trial label.
 */
export function getStickyCtaPresentation(pathname: string): StickyCtaPresentation {
  const trialHref = getPrimaryConversionHref();
  const trial: StickyCtaPresentation = {
    ...FREE_TRIAL_PRESENTATION,
    href: trialHref,
  };

  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  const match = path.match(/^\/programs\/([^/]+)$/);
  if (!match) return trial;

  const programme = getConfirmedProgrammes().find((item) => item.slug === match[1]);
  if (!programme || !isServiceEnquiryProgramme(programme)) return trial;

  return {
    intent: "service-enquiry",
    label: "Enquire on WhatsApp",
    supportingText: "For teams",
    href: getProgrammeConversionHref(programme) ?? trialHref,
  };
}
