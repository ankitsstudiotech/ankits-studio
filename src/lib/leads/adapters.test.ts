import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLeadAdapter } from "./index";
import { mockLeadAdapter } from "./mock-adapter";
import { productionLeadAdapter } from "./production-adapter";
import type { ContactInquiryInput, TrialLeadInput } from "./types";

const trialInput: TrialLeadInput = {
  name: "Aditi Rao",
  phone: "+91 90000 00001",
  branchSlug: "airoli-sector-19",
  programmeSlug: "yoga",
  preferredTiming: "morning",
  ageGroup: "adults",
  consent: true,
};

const contactInput: ContactInquiryInput = {
  name: "Aditi Rao",
  phone: "+91 90000 00001",
  message: "I'd like to know more about your Zumba classes.",
  consent: true,
};

describe("mockLeadAdapter", () => {
  it("accepts a trial lead locally and reports mode: mock", async () => {
    const result = await mockLeadAdapter.submitTrialLead(trialInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.mode).toBe("mock");
      expect(result.referenceId).toContain("mock-trial-");
    }
  });

  it("accepts a contact inquiry locally and reports mode: mock", async () => {
    const result = await mockLeadAdapter.submitContactInquiry(contactInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.mode).toBe("mock");
      expect(result.referenceId).toContain("mock-contact-");
    }
  });

  it("never logs the full name or phone number, only their lengths", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    await mockLeadAdapter.submitTrialLead(trialInput);
    const loggedPayload = infoSpy.mock.calls.at(0)?.[1] as Record<string, unknown> | undefined;
    expect(JSON.stringify(loggedPayload)).not.toContain(trialInput.name);
    expect(JSON.stringify(loggedPayload)).not.toContain(trialInput.phone);
    infoSpy.mockRestore();
  });
});

describe("productionLeadAdapter", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails closed with code not-configured when LEAD_PROVIDER_URL is unset (trial)", async () => {
    vi.stubEnv("LEAD_PROVIDER_URL", "");
    const result = await productionLeadAdapter.submitTrialLead(trialInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("not-configured");
  });

  it("fails closed with code not-configured when LEAD_PROVIDER_URL is unset (contact)", async () => {
    vi.stubEnv("LEAD_PROVIDER_URL", "");
    const result = await productionLeadAdapter.submitContactInquiry(contactInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("not-configured");
  });

  it("still fails, with code provider-error, once LEAD_PROVIDER_URL is set (placeholder never delivers)", async () => {
    vi.stubEnv("LEAD_PROVIDER_URL", "https://example.test/leads");
    const result = await productionLeadAdapter.submitTrialLead(trialInput);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("provider-error");
  });

  it("never reports ok: true — there is no live delivery path yet", async () => {
    vi.stubEnv("LEAD_PROVIDER_URL", "https://example.test/leads");
    const trialResult = await productionLeadAdapter.submitTrialLead(trialInput);
    const contactResult = await productionLeadAdapter.submitContactInquiry(contactInput);
    expect(trialResult.ok).toBe(false);
    expect(contactResult.ok).toBe(false);
  });
});

describe("getLeadAdapter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("resolves to the mock adapter in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(getLeadAdapter()).toBe(mockLeadAdapter);
  });

  it("resolves to the mock adapter on an ALLOW_MOCK_PUBLISH preview build with no LEAD_PROVIDER_URL", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    vi.stubEnv("LEAD_PROVIDER_URL", "");
    expect(getLeadAdapter()).toBe(mockLeadAdapter);
  });

  it("resolves to the production adapter once a preview build has a LEAD_PROVIDER_URL configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    vi.stubEnv("LEAD_PROVIDER_URL", "https://example.test/leads");
    expect(getLeadAdapter()).toBe(productionLeadAdapter);
  });

  it("resolves to the production adapter on a real (non-mock-publish) production build", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "");
    expect(getLeadAdapter()).toBe(productionLeadAdapter);
  });
});

describe("isLeadDemonstrationMode", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("is true in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { isLeadDemonstrationMode } = await import("./index");
    expect(isLeadDemonstrationMode()).toBe(true);
  });

  it("is true on ALLOW_MOCK_PUBLISH preview without LEAD_PROVIDER_URL", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    vi.stubEnv("LEAD_PROVIDER_URL", "");
    const { isLeadDemonstrationMode } = await import("./index");
    expect(isLeadDemonstrationMode()).toBe(true);
  });

  it("is false once a lead provider URL is configured on preview", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    vi.stubEnv("LEAD_PROVIDER_URL", "https://example.test/leads");
    const { isLeadDemonstrationMode } = await import("./index");
    expect(isLeadDemonstrationMode()).toBe(false);
  });
});
