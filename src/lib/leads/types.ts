import type { BranchSlug, ProgrammeSlug } from "@/content";

export const ageGroupValues = ["adults", "teens", "kids", "mixed"] as const;
export type AgeGroup = (typeof ageGroupValues)[number];

export const preferredTimingValues = [
  "morning",
  "afternoon",
  "evening",
  "weekend",
  "flexible",
] as const;
export type PreferredTiming = (typeof preferredTimingValues)[number];

export type TrialLeadInput = {
  name: string;
  phone: string;
  branchSlug: BranchSlug;
  programmeSlug: ProgrammeSlug;
  preferredTiming: PreferredTiming;
  ageGroup?: AgeGroup;
  trialDate?: string;
  message?: string;
  consent: boolean;
};

export type ContactInquiryInput = {
  name: string;
  phone: string;
  email?: string;
  message: string;
  consent: boolean;
};

export type LeadSubmitSuccess = {
  ok: true;
  referenceId: string;
  mode: "mock" | "production";
};

export type LeadSubmitFailure = {
  ok: false;
  code: "validation-error" | "not-configured" | "provider-error";
  message: string;
};

export type LeadSubmitResult = LeadSubmitSuccess | LeadSubmitFailure;

export interface LeadAdapter {
  readonly id: string;
  submitTrialLead(lead: TrialLeadInput): Promise<LeadSubmitResult>;
  submitContactInquiry(inquiry: ContactInquiryInput): Promise<LeadSubmitResult>;
}
