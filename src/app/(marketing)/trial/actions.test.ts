import { describe, expect, it } from "vitest";
import { submitTrialLead } from "./actions";

function buildFormData(overrides: Record<string, string> = {}) {
  const data: Record<string, string> = {
    name: "Aditi Rao",
    phone: "+91 90000 00001",
    branchSlug: "airoli-sector-19",
    programmeSlug: "yoga",
    preferredTiming: "morning",
    ageGroup: "adults",
    consent: "on",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.set(key, value);
  }
  return formData;
}

/**
 * Only the validation-failure path is exercised here — it's the only branch
 * that returns instead of calling `redirect()` (which throws internally and
 * would require mocking `next/navigation` to observe). See
 * docs/DECISIONS.md ADR-013 (VIS-002/FORM-002).
 */
describe("submitTrialLead — validation failures", () => {
  it("returns a field error keyed by the offending field, not a generic message", async () => {
    const state = await submitTrialLead(null, buildFormData({ name: "A" }));
    expect(state).not.toBeNull();
    expect(state?.fieldErrors.name).toBeDefined();
    expect(state?.fieldErrors.phone).toBeUndefined();
  });

  it("returns an error for an unchecked consent box", async () => {
    const formData = buildFormData();
    formData.delete("consent");
    const state = await submitTrialLead(null, formData);
    expect(state?.fieldErrors.consent).toBeDefined();
  });

  it("returns an error for an unlisted branch slug", async () => {
    const state = await submitTrialLead(null, buildFormData({ branchSlug: "mumbai-central" }));
    expect(state?.fieldErrors.branchSlug).toBeDefined();
  });

  it("returns multiple field errors at once when several fields are invalid", async () => {
    const state = await submitTrialLead(
      null,
      buildFormData({ name: "A", phone: "bad-phone" })
    );
    expect(state?.fieldErrors.name).toBeDefined();
    expect(state?.fieldErrors.phone).toBeDefined();
  });
});
