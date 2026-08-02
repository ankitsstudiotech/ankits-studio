import { describe, expect, it } from "vitest";
import {
  availabilityBranchPromptNeeded,
  buildWhatsAppAvailabilityMessage,
  buildWhatsAppAvailabilityUrl,
} from "@/lib/conversion/availability-whatsapp";

describe("service-aware WhatsApp availability flow", () => {
  it("builds a physical-branch availability message with batch preference", () => {
    const message = buildWhatsAppAvailabilityMessage({
      deliveryMode: "in-studio",
      name: "Riya",
      preferredBranch: "Airoli Sector 19",
      interestedService: "Yoga",
      preferredDayTime: "Weekday mornings",
      batchPreference: "Ladies-only",
      question: "Is there a beginner batch?",
    });
    expect(message).toContain("check batch availability and book a free trial");
    expect(message).toContain("Preferred branch: Airoli Sector 19");
    expect(message).toContain("Interested service: Yoga");
    expect(message).toContain("Preferred day/time: Weekday mornings");
    expect(message).toContain("Batch preference: Ladies-only");
    expect(message).not.toContain("Locality:");
  });

  it("builds a Home Personal Training message without a branch field", () => {
    const message = buildWhatsAppAvailabilityMessage({
      deliveryMode: "home",
      name: "Amit",
      locality: "Ghansoli",
      preferredDayTime: "Evenings",
      question: "Do you cover my society?",
    });
    expect(message).toContain("enquire about Home Personal Training");
    expect(message).toContain("Locality: Ghansoli");
    expect(message).toContain("Preferred day/time: Evenings");
    expect(message).not.toContain("Preferred branch:");
    expect(message).not.toContain("Batch preference:");
  });

  it("builds an Online Training message without branch or locality", () => {
    const message = buildWhatsAppAvailabilityMessage({
      deliveryMode: "online",
      name: "Sara",
      preferredDayTime: "Weekends",
    });
    expect(message).toContain("enquire about Online Training");
    expect(message).toContain("Preferred day/time: Weekends");
    expect(message).not.toContain("Preferred branch:");
    expect(message).not.toContain("Locality:");
    expect(message).not.toContain("platform");
  });

  it("URL-encodes the availability message for wa.me", () => {
    const href = buildWhatsAppAvailabilityUrl({
      deliveryMode: "in-studio",
      preferredBranch: "Airoli Sector 8",
      interestedService: "Functional Training",
    });
    expect(href).toMatch(/^https:\/\/wa\.me\/919372402074\?text=/);
    expect(href).toContain(encodeURIComponent("Preferred branch: Airoli Sector 8"));
    expect(href).not.toContain("Preferred branch: Airoli Sector 8");
  });

  it("allows opening WhatsApp with empty optional fields", () => {
    const message = buildWhatsAppAvailabilityMessage({ deliveryMode: "in-studio" });
    expect(message).toContain("Name:");
    expect(message).toContain("Preferred branch:");
    expect(buildWhatsAppAvailabilityUrl({ deliveryMode: "online" })).toMatch(/^https:\/\/wa\.me\//);
  });

  it("soft-prompts for branch only on in-studio services", () => {
    expect(availabilityBranchPromptNeeded("in-studio", "")).toBe(true);
    expect(availabilityBranchPromptNeeded("in-studio", "Thane")).toBe(false);
    expect(availabilityBranchPromptNeeded("home", "")).toBe(false);
    expect(availabilityBranchPromptNeeded("online", undefined)).toBe(false);
  });
});
