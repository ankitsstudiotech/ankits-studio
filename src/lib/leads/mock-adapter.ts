import type {
  ContactInquiryInput,
  LeadAdapter,
  LeadSubmitResult,
  TrialLeadInput,
} from "./types";

/**
 * Development adapter — accepts leads locally without claiming a real CRM
 * delivery. Safe for `next dev` and mock-publish preview builds only.
 */
export const mockLeadAdapter: LeadAdapter = {
  id: "mock",
  async submitTrialLead(lead: TrialLeadInput): Promise<LeadSubmitResult> {
    const referenceId = `mock-trial-${Date.now().toString(36)}`;
    console.info("[leads:mock] trial lead accepted (not delivered to a provider)", {
      referenceId,
      branchSlug: lead.branchSlug,
      programmeSlug: lead.programmeSlug,
      // Avoid logging full PII in shared environments; keep shape only.
      nameLength: lead.name.length,
      phoneLength: lead.phone.length,
    });
    return { ok: true, referenceId, mode: "mock" };
  },
  async submitContactInquiry(inquiry: ContactInquiryInput): Promise<LeadSubmitResult> {
    const referenceId = `mock-contact-${Date.now().toString(36)}`;
    console.info("[leads:mock] contact inquiry accepted (not delivered to a provider)", {
      referenceId,
      nameLength: inquiry.name.length,
      messageLength: inquiry.message.length,
    });
    return { ok: true, referenceId, mode: "mock" };
  },
};
