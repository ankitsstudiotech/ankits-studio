import { describe, expect, it } from "vitest";
import { submitContactInquiry } from "./actions";

function buildFormData(overrides: Record<string, string> = {}) {
  const data: Record<string, string> = {
    name: "Aditi Rao",
    phone: "+91 90000 00001",
    message: "I'd like to know more about your Zumba classes.",
    consent: "on",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.set(key, value);
  }
  return formData;
}

/** Only the validation-failure path is exercised — see trial/actions.test.ts. */
describe("submitContactInquiry — validation failures", () => {
  it("returns a field error keyed by the offending field, not a generic message", async () => {
    const state = await submitContactInquiry(null, buildFormData({ message: "short" }));
    expect(state).not.toBeNull();
    expect(state?.fieldErrors.message).toBeDefined();
    expect(state?.fieldErrors.name).toBeUndefined();
  });

  it("returns an error for a malformed email", async () => {
    const state = await submitContactInquiry(null, buildFormData({ email: "not-an-email" }));
    expect(state?.fieldErrors.email).toBeDefined();
  });

  it("returns an error for an unchecked consent box", async () => {
    const formData = buildFormData();
    formData.delete("consent");
    const state = await submitContactInquiry(null, formData);
    expect(state?.fieldErrors.consent).toBeDefined();
  });
});
