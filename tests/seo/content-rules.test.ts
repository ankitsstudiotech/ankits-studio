import { describe, expect, it } from "vitest";
import {
  getBranchBySlug,
  getBusinessIdentity,
  getContactDetails,
  getFaqs,
  getNavigationItems,
  getTestimonials,
  getTransformations,
} from "@/content";

/**
 * Sanity checks for this task's explicit mock-data rules, run against the
 * actual content that ships — not just schema shape.
 */

const FORBIDDEN_TERMS = /\b(guarantee[ds]?|cure[sd]?|medical(?:ly)? proven|clinically proven)\b/i;
const RATING_OR_AWARD_TERMS = /\b(rating|star rating|review count|award[- ]?winning|#1|best in)\b/i;

describe("Thane address rule", () => {
  it('Thane branch address is literally "To be confirmed"', () => {
    const thane = getBranchBySlug("thane");
    expect(thane?.address).toBe("To be confirmed");
  });
});

describe("phone placeholder rule", () => {
  it("every branch phone/whatsapp number is the obviously-fake +91 00000 00000 pattern", () => {
    for (const slug of ["airoli", "ghansoli", "thane"] as const) {
      const branch = getBranchBySlug(slug);
      expect(branch?.phone).toBe("+91 00000 00000");
      expect(branch?.whatsapp).toBe("+91 00000 00000");
    }
  });

  it("general contact phone is the same obviously-fake pattern", () => {
    expect(getContactDetails().generalPhone).toBe("+91 00000 00000");
  });
});

describe("no medical or guaranteed-outcome claims", () => {
  it("no FAQ answer contains a medical or guarantee claim", () => {
    for (const faq of getFaqs()) {
      expect(faq.answer).not.toMatch(FORBIDDEN_TERMS);
      expect(faq.question).not.toMatch(FORBIDDEN_TERMS);
    }
  });

  it("no transformation summary contains a medical or guarantee claim, or a specific number", () => {
    for (const transformation of getTransformations()) {
      expect(transformation.summary).not.toMatch(FORBIDDEN_TERMS);
      expect(transformation.summary).not.toMatch(/\d+\s*(kg|lbs?|%|percent)/i);
    }
  });

  it("business identity description/tagline contain no medical or guarantee claim", () => {
    const identity = getBusinessIdentity();
    expect(identity.description).not.toMatch(FORBIDDEN_TERMS);
    expect(identity.tagline).not.toMatch(FORBIDDEN_TERMS);
  });
});

describe("no ratings, review counts, or awards anywhere in mock content", () => {
  it("no FAQ mentions a rating/review/award", () => {
    for (const faq of getFaqs()) {
      expect(`${faq.question} ${faq.answer}`).not.toMatch(RATING_OR_AWARD_TERMS);
    }
  });

  it("no testimonial mentions a rating/review/award", () => {
    for (const testimonial of getTestimonials()) {
      expect(testimonial.quote).not.toMatch(RATING_OR_AWARD_TERMS);
    }
  });

  it("business identity contains no rating/review/award claim", () => {
    const identity = getBusinessIdentity();
    expect(`${identity.tagline} ${identity.description}`).not.toMatch(RATING_OR_AWARD_TERMS);
  });
});

describe("testimonials are never attributed to a real, identifiable person", () => {
  it("every testimonial's attributed name reads as illustrative", () => {
    for (const testimonial of getTestimonials()) {
      expect(testimonial.attributedName.toLowerCase()).toContain("illustrative");
    }
  });
});

describe("every content object carries a verification status", () => {
  it("business identity, contact details, every FAQ, and every nav item have dataStatus", () => {
    expect(getBusinessIdentity().dataStatus).toBeDefined();
    expect(getContactDetails().dataStatus).toBeDefined();
    for (const faq of getFaqs()) expect(faq.dataStatus).toBeDefined();
    for (const item of getNavigationItems()) expect(item.dataStatus).toBeDefined();
  });
});

describe("mapEmbedUrl is never populated on a non-verified branch (structured-data leak guard)", () => {
  it("no branch record exposes a Maps URL before verification", () => {
    for (const slug of ["airoli", "ghansoli", "thane"] as const) {
      const branch = getBranchBySlug(slug);
      expect(branch?.dataStatus).not.toBe("verified");
      expect(branch?.mapEmbedUrl).toBeUndefined();
    }
  });
});
