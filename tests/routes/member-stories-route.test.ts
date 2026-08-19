import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getMemberStories,
  getPublishableMemberStories,
  getPublishableTransformations,
  getTestimonials,
  getTransformations,
  MEMBER_STORIES_INDEX_STORY_THRESHOLD,
  MEMBER_STORIES_INDEX_TRANSFORMATION_THRESHOLD,
  shouldIndexMemberStoriesRoute,
} from "@/content";
import { isMemberStoryPublishable } from "@/content/schema/member-story";
import { isTransformationPublishable } from "@/content/schema/transformation";
import { ILLUSTRATIVE_EVIDENCE_FIXTURES } from "@/content/fixtures/illustrative-evidence";
import { generateMetadata } from "@/app/(marketing)/transformations/page";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { getPrimaryConversionHref, getPrimaryConversionLabel } from "@/lib/conversion";

const FORBIDDEN_SD =
  /"(@type"\s*:\s*"(Review|AggregateRating|Person|MedicalEntity|ClaimReview|Product|Offer|QuantitativeValue)"|"(aggregateRating|reviewRating)")/i;

const FORBIDDEN_COPY =
  /Illustrative member|illustrative-strength-journey|illustrative-fitness-journey|placeholder quote|HONEST EVIDENCE/i;

describe("member stories evidence gates — ADR-022", () => {
  it("starts with zero publishable stories and transformations", () => {
    expect(getPublishableMemberStories()).toHaveLength(0);
    expect(getPublishableTransformations()).toHaveLength(0);
    expect(getMemberStories()).toHaveLength(0);
    expect(getTransformations()).toHaveLength(0);
    expect(getTestimonials()).toHaveLength(0);
  });

  it("keeps index thresholds configurable", () => {
    expect(MEMBER_STORIES_INDEX_STORY_THRESHOLD).toBe(3);
    expect(MEMBER_STORIES_INDEX_TRANSFORMATION_THRESHOLD).toBe(2);
    expect(shouldIndexMemberStoriesRoute()).toBe(false);
  });

  it("rejects mock-shaped records from publishability helpers", () => {
    const mockStory = {
      dataStatus: "mock" as const,
      mockDisclaimer: "fictional",
      id: "x",
      slug: "x",
      memberDisplayName: "Illustrative member",
      anonymityLevel: "first_name" as const,
      storyText: "fake",
      publicationConsentStatus: "granted" as const,
      quoteConsentStatus: "granted" as const,
      photographPermissionStatus: "pending" as const,
      sourceProvenance: "fixture",
      verificationStatus: "publishable" as const,
      publicationStatus: "published" as const,
      evidenceReferences: [],
      healthClaimRisk: "none" as const,
      programmeSlug: "yoga" as const,
    };
    expect(isMemberStoryPublishable(mockStory)).toBe(false);

    const mockTransform = {
      dataStatus: "mock" as const,
      mockDisclaimer: "fictional",
      id: "y",
      slug: "y",
      memberDisplayName: "Illustrative member",
      anonymityLevel: "first_name" as const,
      programmeSlug: "yoga" as const,
      publicationConsentStatus: "granted" as const,
      quoteConsentStatus: "pending" as const,
      photographPermissionStatus: "pending" as const,
      beforeMediaPermissionStatus: "pending" as const,
      afterMediaPermissionStatus: "pending" as const,
      sourceProvenance: "fixture",
      verificationStatus: "publishable" as const,
      publicationStatus: "published" as const,
      evidenceReferences: [],
      healthClaimRisk: "none" as const,
      statedStartingPoint: "start",
      timeframeLabel: "8 weeks",
      memberDescribedOutcome: "felt better",
      disclaimerRequirements: [],
    };
    expect(isTransformationPublishable(mockTransform)).toBe(false);
  });

  it("keeps illustrative fixtures fictional and outside production accessors", () => {
    expect(ILLUSTRATIVE_EVIDENCE_FIXTURES.status).toBe("fictional_development_only");
    expect(ILLUSTRATIVE_EVIDENCE_FIXTURES.testimonials).toHaveLength(2);
    expect(ILLUSTRATIVE_EVIDENCE_FIXTURES.journeys).toHaveLength(2);
    const page = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "transformations", "page.tsx"),
      "utf8",
    );
    expect(page).not.toMatch(/ILLUSTRATIVE_EVIDENCE_FIXTURES|getTransformations\(/);
    expect(page).toMatch(/getPublishableMemberStories/);
    expect(page).toMatch(/getPublishableTransformations/);
  });
});

describe("member stories route — /transformations", () => {
  it("metadata is honest and force-noindexes while below threshold", () => {
    const metadata = generateMetadata();
    expect(String(metadata.title)).toMatch(/Member Stories/i);
    expect(String(metadata.description)).toMatch(/permission|programmes|studios|trial/i);
    expect(String(metadata.description)).not.toMatch(/available now|latest reviews|guaranteed/i);
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("page source omits fake evidence, media plates, and development notes", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "transformations", "page.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(FORBIDDEN_COPY);
    expect(source).not.toMatch(/TransformationStories|before\/after|carousel|AggregateRating/i);
    expect(source).not.toMatch(/PulseMediaPlate|Development note|siteHasUnverifiedContent/);
    expect(source).toMatch(/readinessBody|getStudioMemberStoriesPage/);
    expect(source).toMatch(/getPrimaryConversionHref/);
    expect(source).toMatch(/buildWebPageJsonLd/);
    expect(source).toMatch(/RouteOpening|SectionReveal/);
  });

  it("emits WebPage + BreadcrumbList only", () => {
    const page = buildWebPageJsonLd({
      name: "Member Stories | Ankit’s Studio",
      description: "Learn how Ankit’s Studio prepares real member stories with permission.",
      path: "/transformations",
    });
    const crumbs = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Member Stories", path: "/transformations" },
    ]);
    expect(page["@type"]).toBe("WebPage");
    expect(serializeJsonLd(page)).not.toMatch(FORBIDDEN_SD);
    expect(serializeJsonLd(crumbs)).not.toMatch(FORBIDDEN_SD);
  });

  it("excludes /transformations from sitemap while below threshold", () => {
    const urls = buildSitemapEntries().map((entry) => entry.url);
    expect(urls.every((url) => !url.includes("/transformations"))).toBe(true);
  });

  it("WhatsApp CTA helpers remain correct", () => {
    expect(getPrimaryConversionLabel()).toMatch(/WhatsApp/i);
    expect(getPrimaryConversionHref()).toMatch(/^https:\/\/wa\.me\//);
  });
});
