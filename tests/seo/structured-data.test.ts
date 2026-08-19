import { describe, expect, it } from "vitest";
import type { Branch, BlogPost, BusinessIdentity, Faq } from "@/content";
import { getBranches, getBusinessIdentity, getFaqs } from "@/content";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
} from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";

const verifiedBranch: Branch = {
  dataStatus: "verified",
  id: "branch-test-airoli",
  slug: "airoli-sector-19",
  name: "Ankit's Studio — Airoli Sector 19",
  locality: "Airoli Sector 19",
  address: "1 Real Street, Airoli",
  pinCode: null,
  mapsUrl: "https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac",
  googleBusinessProfileUrl: null,
  phone: "+91 90000 00001",
  whatsapp: "+91 90000 00001",
  inheritsCentralEnquiry: false,
  openingHours: [],
  openingHoursKind: "operating-window",
  batchScheduleStatus: "pending",
  physicalProgrammeSlugs: ["yoga"],
  programmeSlugs: ["yoga"],
  ladiesOnlyBatchesAvailable: true,
  kidsOnlyBatchesAvailable: true,
  maxGroupBatchSize: 15,
  openingStatus: "open",
  landmarks: null,
  nearestStation: null,
  parking: null,
  facilities: null,
  mediaSlotKey: "branch.airoli-sector-19",
  fieldProvenance: {
    existence: "owner_confirmed",
    publicName: "owner_confirmed",
    locality: "owner_confirmed",
    address: "owner_confirmed",
    pinCode: "pending",
    mapsUrl: "owner_confirmed",
    googleBusinessProfileUrl: "pending",
    phone: "owner_confirmed",
    whatsapp: "owner_confirmed",
    operatingHours: "owner_confirmed",
    batchSchedule: "pending",
    physicalServices: "owner_confirmed",
    audienceAvailability: "owner_confirmed",
    landmarks: "pending",
    nearestStation: "pending",
    parking: "pending",
    facilities: "pending",
    media: "pending",
  },
  seoTitle: "Airoli Sector 19",
  seoDescription: "Test description",
  faqEntries: [],
  relatedProgrammeSlugs: ["yoga"],
  publiclyListed: true,
};

const verifiedIdentity: BusinessIdentity = {
  dataStatus: "verified",
  legalName: "Ankit's Studio",
  displayName: "Ankit's Studio",
  tagline: "Real tagline",
  description: "Real description",
};

const verifiedFaq: Faq = {
  dataStatus: "verified",
  id: "faq-verified",
  question: "Real question?",
  answer: "Real answer.",
};

const verifiedPost: BlogPost = {
  dataStatus: "verified",
  slug: "real-post",
  title: "Real Post",
  excerpt: "Real excerpt",
  body: "Real body",
  publishedAt: "2026-01-01",
};

describe("mock status propagation — structured data omits unverified records", () => {
  it("buildOrganizationJsonLd emits for the owner-verified business identity", () => {
    expect(getBusinessIdentity().dataStatus).toBe("verified");
    expect(buildOrganizationJsonLd(getBusinessIdentity())).not.toBeNull();
  });

  it("buildOrganizationJsonLd returns a real object once the record is verified", () => {
    expect(buildOrganizationJsonLd(verifiedIdentity)).not.toBeNull();
  });

  it("buildLocalBusinessJsonLd emits for owner-confirmed addresses on live branches", () => {
    for (const branch of getBranches()) {
      expect(branch.dataStatus).toBe("verified");
      expect(branch.fieldProvenance.address).toBe("owner_confirmed");
      const jsonLd = buildLocalBusinessJsonLd(branch);
      expect(jsonLd).not.toBeNull();
      expect(jsonLd?.["@type"]).toBe("ExerciseGym");
      expect(jsonLd?.address?.streetAddress).toBe(branch.address);
    }
  });

  it("buildLocalBusinessJsonLd returns a real object, with address/phone, once a branch is verified", () => {
    const result = buildLocalBusinessJsonLd(verifiedBranch);
    expect(result).not.toBeNull();
    expect(result?.address?.streetAddress).toBe(verifiedBranch.address);
    expect(result?.telephone).toBe(verifiedBranch.phone);
  });

  it("buildArticleJsonLd returns null for a mock/non-verified post, real object once verified", () => {
    const mockPost: BlogPost = { ...verifiedPost, dataStatus: "mock", mockDisclaimer: "placeholder" };
    expect(buildArticleJsonLd(mockPost)).toBeNull();
    expect(buildArticleJsonLd(verifiedPost)).not.toBeNull();
  });

  it("buildFaqPageJsonLd returns null while no FAQ is verified (current state)", () => {
    expect(getFaqs().every((faq) => faq.dataStatus !== "verified")).toBe(true);
    expect(buildFaqPageJsonLd(getFaqs())).toBeNull();
  });

  it("buildFaqPageJsonLd includes only the verified entries once one exists", () => {
    const mixed = [...getFaqs(), verifiedFaq];
    const result = buildFaqPageJsonLd(mixed);
    expect(result).not.toBeNull();
    expect(result?.mainEntity).toHaveLength(1);
    expect(result?.mainEntity[0]?.name).toBe(verifiedFaq.question);
  });
});

describe("structured-data safety", () => {
  it("never includes a rating, review, or award field on Organization output", () => {
    const result = buildOrganizationJsonLd(verifiedIdentity);
    const keys = Object.keys(result ?? {}).join(",").toLowerCase();
    expect(keys).not.toMatch(/rating|review|award/);
  });

  it("never includes a rating, review, or award field on LocalBusiness output", () => {
    const result = buildLocalBusinessJsonLd(verifiedBranch);
    const serialized = JSON.stringify(result).toLowerCase();
    expect(serialized).not.toMatch(/rating|review|award/);
  });

  it("breadcrumb structured data builds valid canonical item URLs", () => {
    const result = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Programs", path: "/programs" },
    ]);
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[1]?.item).toContain("/programs");
    expect(result.itemListElement[1]?.position).toBe(2);
  });

  it("serializeJsonLd escapes a script-breakout attempt", () => {
    const malicious = { name: '</script><script>alert(1)</script>' };
    const serialized = serializeJsonLd(malicious);
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script\\u003e");
  });

  it("serializeJsonLd produces valid JSON once escapes are reversed", () => {
    const data = { headline: "A & B <are> great" };
    const serialized = serializeJsonLd(data);
    // The escaped form itself must still be syntactically valid JSON (the
    // \uXXXX sequences are standard JSON escapes, not HTML entities).
    expect(() => JSON.parse(serialized)).not.toThrow();
    expect(JSON.parse(serialized)).toEqual(data);
  });
});
