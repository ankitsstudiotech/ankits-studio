import { describe, expect, it } from "vitest";
import { contactInquirySchema, trialLeadSchema } from "./trial-schema";

const validTrialLead = {
  name: "Aditi Rao",
  phone: "+91 90000 00001",
  branchSlug: "airoli-sector-19",
  programmeSlug: "yoga",
  preferredTiming: "morning",
  ageGroup: "adults",
  consent: true,
};

describe("trialLeadSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(trialLeadSchema.safeParse(validTrialLead).success).toBe(true);
  });

  it("accepts a valid submission that includes the optional message", () => {
    expect(trialLeadSchema.safeParse({ ...validTrialLead, message: "Looking forward to it" }).success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects a phone number with invalid characters", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, phone: "call-me-maybe" });
    expect(result.success).toBe(false);
  });

  it("rejects a phone number that is too short", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, phone: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown branchSlug (not in the BranchSlug enum)", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, branchSlug: "not-a-branch" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown programmeSlug (not in the ProgrammeSlug enum)", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, programmeSlug: "not-a-programme" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown preferredTiming value", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, preferredTiming: "midnight" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown ageGroup value", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, ageGroup: "toddlers" });
    expect(result.success).toBe(false);
  });

  it("rejects consent: false", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "consent")).toBe(true);
    }
  });

  it("rejects a message over 500 characters", () => {
    const result = trialLeadSchema.safeParse({ ...validTrialLead, message: "x".repeat(501) });
    expect(result.success).toBe(false);
  });
});

const validContactInquiry = {
  name: "Aditi Rao",
  phone: "+91 90000 00001",
  message: "I'd like to know more about your Zumba classes.",
  consent: true,
};

describe("contactInquirySchema", () => {
  it("accepts a fully valid submission", () => {
    expect(contactInquirySchema.safeParse(validContactInquiry).success).toBe(true);
  });

  it("accepts a valid email when provided", () => {
    const result = contactInquirySchema.safeParse({ ...validContactInquiry, email: "aditi@example.test" });
    expect(result.success).toBe(true);
  });

  it("accepts an empty string email (treated as not provided)", () => {
    const result = contactInquirySchema.safeParse({ ...validContactInquiry, email: "" });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = contactInquirySchema.safeParse({ ...validContactInquiry, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = contactInquirySchema.safeParse({ ...validContactInquiry, message: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects consent: false", () => {
    const result = contactInquirySchema.safeParse({ ...validContactInquiry, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a phone number with invalid characters", () => {
    const result = contactInquirySchema.safeParse({ ...validContactInquiry, phone: "call-me" });
    expect(result.success).toBe(false);
  });
});
