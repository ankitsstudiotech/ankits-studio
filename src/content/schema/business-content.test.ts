import { describe, expect, it } from "vitest";
import { businessIdentitySchema } from "./business-identity";
import { contactDetailsSchema } from "./contact-details";
import { faqSchema } from "./faq";
import { navigationItemSchema } from "./navigation";

describe("businessIdentitySchema", () => {
  it("rejects a record missing required fields", () => {
    expect(businessIdentitySchema.safeParse({ dataStatus: "verified" }).success).toBe(false);
  });

  it("rejects a mock record without mockDisclaimer", () => {
    const result = businessIdentitySchema.safeParse({
      dataStatus: "mock",
      legalName: "x",
      displayName: "x",
      tagline: "x",
      description: "x",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a well-formed verified record", () => {
    const result = businessIdentitySchema.safeParse({
      dataStatus: "verified",
      legalName: "x",
      displayName: "x",
      tagline: "x",
      description: "x",
    });
    expect(result.success).toBe(true);
  });
});

describe("faqSchema", () => {
  it("rejects a record missing question/answer", () => {
    expect(faqSchema.safeParse({ dataStatus: "verified", id: "faq-1" }).success).toBe(false);
  });

  it("accepts a well-formed mock FAQ", () => {
    const result = faqSchema.safeParse({
      dataStatus: "mock",
      mockDisclaimer: "placeholder",
      id: "faq-1",
      question: "Q?",
      answer: "A.",
    });
    expect(result.success).toBe(true);
  });
});

describe("contactDetailsSchema", () => {
  it("rejects an invalid email", () => {
    const result = contactDetailsSchema.safeParse({
      dataStatus: "mock",
      mockDisclaimer: "placeholder",
      generalEmail: "not-an-email",
      generalPhone: "+91 00000 00000",
      preferredContactOrder: ["trial-form"],
      introText: "x",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty preferredContactOrder", () => {
    const result = contactDetailsSchema.safeParse({
      dataStatus: "mock",
      mockDisclaimer: "placeholder",
      generalEmail: "hello@example.test",
      generalPhone: "+91 00000 00000",
      preferredContactOrder: [],
      introText: "x",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a well-formed mock record", () => {
    const result = contactDetailsSchema.safeParse({
      dataStatus: "mock",
      mockDisclaimer: "placeholder",
      generalEmail: "hello@example.test",
      generalPhone: "+91 00000 00000",
      preferredContactOrder: ["trial-form", "whatsapp"],
      introText: "x",
    });
    expect(result.success).toBe(true);
  });
});

describe("navigationItemSchema", () => {
  it("rejects a path without a leading slash", () => {
    const result = navigationItemSchema.safeParse({
      dataStatus: "verified",
      id: "nav-1",
      label: "Home",
      path: "programmes",
      placement: "primary",
      order: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid placement value", () => {
    const result = navigationItemSchema.safeParse({
      dataStatus: "verified",
      id: "nav-1",
      label: "Home",
      path: "/",
      placement: "sidebar",
      order: 1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts a well-formed verified item", () => {
    const result = navigationItemSchema.safeParse({
      dataStatus: "verified",
      id: "nav-1",
      label: "Home",
      path: "/",
      placement: "primary",
      order: 1,
    });
    expect(result.success).toBe(true);
  });
});
