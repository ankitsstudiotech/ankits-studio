import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getPricingPlans, getStudioCommercial } from "@/content";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { metadata } from "@/app/(marketing)/pricing/page";

const FORBIDDEN_SD =
  /"(@type"\s*:\s*"(Offer|Product|AggregateOffer|PriceSpecification)"|"priceRange")/i;

describe("pricing route — honest commercial claims", () => {
  it("exposes verified free trial and ₹300 registration only", () => {
    const commercial = getStudioCommercial();
    expect(commercial.trialIsFree).toBe(true);
    expect(commercial.registrationFeeInr).toBe(300);
    expect(commercial.programmeFeesStatus).toBe("pending");
  });

  it("does not publish membership plan tiers publicly", () => {
    expect(getPricingPlans()).toEqual([]);
  });

  it("pricing page does not render plan cards, discounts, or Offer markup builders", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "pricing", "page.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/getPricingPlans|formatInr|Most popular|strikethrough|countdown/i);
    expect(source).not.toMatch(/Basic|Premium|per month|₹9|₹2/);
    expect(source).toMatch(/PricingEnquiryBuilder/);
    expect(source).toMatch(/FaqBlock/);
    expect(source).toMatch(/registration fee of ₹300|₹\{registrationFee\}|₹300/);
    expect(source).toMatch(/buildWebPageJsonLd/);
    expect(source).toMatch(/one-time/i);
  });

  it("does not present ₹300 as a programme monthly price in page copy", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "pricing", "page.tsx"),
      "utf8",
    );
    expect(source).toMatch(/Not a monthly fee/i);
    expect(source).not.toMatch(/₹300 per month|monthly fee of ₹300/i);
  });

  it("metadata uses Pricing & Free Trial and WhatsApp enquiry wording", () => {
    expect(metadata.title).toMatch(/Pricing/i);
    expect(String(metadata.description)).toMatch(/WhatsApp/i);
    expect(String(metadata.description).toLowerCase()).not.toMatch(/₹999|discount|most popular/);
  });

  it("emits only WebPage + BreadcrumbList shapes (no Offer/Product)", () => {
    const page = buildWebPageJsonLd({
      name: "Pricing & Free Trial",
      description: "Free trial and registration fee",
      path: "/pricing",
    });
    const crumbs = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]);
    expect(serializeJsonLd(page)).not.toMatch(FORBIDDEN_SD);
    expect(serializeJsonLd(crumbs)).not.toMatch(FORBIDDEN_SD);
    expect(page["@type"]).toBe("WebPage");
  });
});
