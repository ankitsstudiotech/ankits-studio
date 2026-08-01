import type { LeadAdapter, LeadSubmitResult } from "./types";

/**
 * Production adapter placeholder. Until a real lead provider is configured
 * (`LEAD_PROVIDER_URL`), every submission fails closed — never report
 * success that would imply a human received the lead.
 */
export const productionLeadAdapter: LeadAdapter = {
  id: "production-placeholder",
  async submitTrialLead(): Promise<LeadSubmitResult> {
    if (!process.env.LEAD_PROVIDER_URL) {
      return {
        ok: false,
        code: "not-configured",
        message:
          "Trial booking is not connected to a live lead provider yet. Your details were not delivered. Please try again later or use another contact channel once verified.",
      };
    }

    // Provider wiring is intentionally not implemented until a vendor is chosen
    // (ADR-007 I1). Fail closed rather than invent a fake delivery.
    return {
      ok: false,
      code: "provider-error",
      message:
        "A lead provider URL is set, but the production adapter is still a placeholder and did not deliver this lead.",
    };
  },
  async submitContactInquiry(): Promise<LeadSubmitResult> {
    if (!process.env.LEAD_PROVIDER_URL) {
      return {
        ok: false,
        code: "not-configured",
        message:
          "The contact form is not connected to a live lead provider yet. Your message was not delivered.",
      };
    }

    return {
      ok: false,
      code: "provider-error",
      message:
        "A lead provider URL is set, but the production adapter is still a placeholder and did not deliver this message.",
    };
  },
};
