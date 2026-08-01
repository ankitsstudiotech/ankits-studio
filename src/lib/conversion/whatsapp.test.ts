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
    const message = buildWhatsAppMessage({ name: "Riya", preferredBranch: "Ghansoli" });
    expect(message).toContain("Name: Riya");
    expect(message).toContain("Preferred branch: Ghansoli");
    expect(message).toContain("Interested service:");
  });

  it("uses WhatsApp as the primary conversion href", () => {
    expect(getPrimaryConversionHref()).toMatch(/^https:\/\/wa\.me\//);
  });
});
