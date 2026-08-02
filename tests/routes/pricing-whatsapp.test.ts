import { describe, expect, it } from "vitest";
import {
  buildWhatsAppPricingMessage,
  buildWhatsAppPricingUrl,
  pricingBranchPromptNeeded,
  resolvePricingDeliveryMode,
} from "@/lib/conversion/pricing-whatsapp";

describe("service-aware WhatsApp pricing flow", () => {
  it("builds a physical-service fee enquiry with branch", () => {
    const message = buildWhatsAppPricingMessage({
      deliveryMode: "in-studio",
      name: "Riya",
      interestedService: "Yoga",
      preferredBranch: "Ghansoli",
      preferredFormat: "Group batch",
      question: "What is the monthly fee?",
    });
    expect(message).toContain("know the current fee");
    expect(message).toContain("Interested service: Yoga");
    expect(message).toContain("Preferred branch: Ghansoli");
    expect(message).toContain("Preferred format: Group batch");
    expect(message).not.toContain("Locality:");
  });

  it("builds Home Personal Training fee enquiry without a branch", () => {
    const message = buildWhatsAppPricingMessage({
      deliveryMode: "home",
      name: "Amit",
      locality: "Airoli",
    });
    expect(message).toContain("fee for Home Personal Training");
    expect(message).toContain("Locality: Airoli");
    expect(message).not.toContain("Preferred branch:");
  });

  it("builds Online Training fee enquiry without branch or locality", () => {
    const message = buildWhatsAppPricingMessage({
      deliveryMode: "online",
      name: "Sara",
    });
    expect(message).toContain("fee for Online Training");
    expect(message).not.toContain("Preferred branch:");
    expect(message).not.toContain("Locality:");
    expect(message.toLowerCase()).not.toContain("zoom");
  });

  it("builds Wedding Choreography enquiry with optional event details", () => {
    const message = buildWhatsAppPricingMessage({
      deliveryMode: "wedding",
      name: "Neha",
      eventDate: "December 2026",
      participants: "8",
      songs: "3",
    });
    expect(message).toContain("Wedding Choreography pricing");
    expect(message).toContain("Event date: December 2026");
    expect(message).toContain("Number of participants: 8");
    expect(message).toContain("Number of songs: 3");
  });

  it("URL-encodes pricing messages for wa.me", () => {
    const href = buildWhatsAppPricingUrl({
      deliveryMode: "in-studio",
      interestedService: "Functional Training",
      preferredBranch: "Airoli Sector 19",
    });
    expect(href).toMatch(/^https:\/\/wa\.me\/919372402074\?text=/);
    expect(href).toContain(encodeURIComponent("Preferred branch: Airoli Sector 19"));
  });

  it("maps wedding slug to wedding delivery mode", () => {
    expect(resolvePricingDeliveryMode("wedding-choreography", "in-studio")).toBe("wedding");
    expect(resolvePricingDeliveryMode("yoga", "in-studio")).toBe("in-studio");
    expect(resolvePricingDeliveryMode("home-personal-training", "home")).toBe("home");
  });

  it("soft-prompts for branch only on in-studio pricing enquiries", () => {
    expect(pricingBranchPromptNeeded("in-studio", "")).toBe(true);
    expect(pricingBranchPromptNeeded("wedding", "")).toBe(false);
    expect(pricingBranchPromptNeeded("home", undefined)).toBe(false);
  });
});
