import { describe, expect, it } from "vitest";
import {
  buildWhatsAppMessage,
  buildWhatsAppTrialUrl,
  getPrimaryConversionHref,
  WHATSAPP_TRIAL_TEMPLATE,
} from "@/lib/conversion/whatsapp";

describe("WhatsApp conversion", () => {
  it("builds the default enquiry template without requiring fields", () => {
    expect(buildWhatsAppMessage()).toBe(WHATSAPP_TRIAL_TEMPLATE);
  });

  it("builds a wa.me URL with encoded template text", () => {
    const href = buildWhatsAppTrialUrl();
    expect(href).toMatch(/^https:\/\/wa\.me\/919372402074\?text=/);
    expect(href).toContain(encodeURIComponent("I would like to book a free trial."));
  });

  it("allows partial field prefills", () => {
    const message = buildWhatsAppMessage({
      name: "Riya",
      preferredBranch: "Ghansoli",
      age: "10",
      trialDate: "2026-08-10",
    });
    expect(message).toContain("Name: Riya");
    expect(message).toContain("Preferred branch: Ghansoli");
    expect(message).toContain("Age: 10");
    expect(message).toContain("Preferred trial date: 2026-08-10");
    expect(message).toContain("Interested programme:");
  });

  it("includes Preferred trial date in the default template", () => {
    expect(WHATSAPP_TRIAL_TEMPLATE).toContain("Preferred trial date:");
  });

  it("uses WhatsApp as the primary conversion href", () => {
    expect(getPrimaryConversionHref()).toMatch(/^https:\/\/wa\.me\//);
  });

  it("prefills preferred branch and URL-encodes it", () => {
    const href = buildWhatsAppTrialUrl({ preferredBranch: "Airoli Sector 19" });
    expect(href).toContain(encodeURIComponent("Preferred branch: Airoli Sector 19"));
    expect(href).not.toContain("Preferred branch: Airoli Sector 19");
  });
});
