import {
  getBranchMapsUrl,
  getPubliclyListedBranches,
  isConfirmedProgramme,
  type Branch,
  type BlogPost,
  type Guide,
  type BusinessIdentity,
  type Faq,
  type Programme,
} from "@/content";
import { siteConfig } from "@/lib/metadata";
import { buildCanonicalUrl } from "./canonical";
import {
  branchBusinessId,
  cleanProfileUrl,
  organizationId,
  programmeServiceId,
  websiteId,
} from "./site-origin";
import type {
  ArticleJsonLd,
  BreadcrumbListJsonLd,
  CollectionPageJsonLd,
  CourseJsonLd,
  FaqPageJsonLd,
  LocalBusinessJsonLd,
  OrganizationJsonLd,
  ServiceJsonLd,
  WebPageJsonLd,
  WebSiteJsonLd,
} from "./types";

/**
 * Structured-data builders. Rule, applied uniformly (matches the precedent
 * already established for LocalBusiness in docs/DECISIONS.md ADR-011 —
 * "omit, never placeholder"): every builder below returns `null` (or drops
 * the unverified entries) unless the source record's `dataStatus ===
 * "verified"`. No builder ever reads a `mock`/`reference-only` address,
 * phone number, or FAQ answer into its output. None of these builders ever
 * emit a rating, review count, or award — those fields don't exist in any
 * type here, by construction, per this task's mock-data rules.
 *
 * Entity graph:
 * - Organization @id: <origin>/#organization
 * - Branch ExerciseGym @id: <origin>/locations/<slug>/#business
 * - Programme Service @id: <origin>/programs/<slug>/#service
 * - WebSite @id: <origin>/#website
 */

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>): BreadcrumbListJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}

export function buildOrganizationJsonLd(identity: BusinessIdentity): OrganizationJsonLd | null {
  if (identity.dataStatus !== "verified") return null;

  const origin = siteConfig.url.replace(/\/$/, "");
  const sameAs: string[] = [];
  if (identity.socialLinks?.instagram) {
    sameAs.push(cleanProfileUrl(identity.socialLinks.instagram));
  }
  if (identity.socialLinks?.youtube) {
    sameAs.push(cleanProfileUrl(identity.socialLinks.youtube));
  }

  const jsonLd: OrganizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(origin),
    name: identity.displayName,
    url: origin,
    description: identity.description,
    logo: `${origin}/brand/ankits-studio-symbol-transparent.png`,
  };

  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }

  return jsonLd;
}

export function buildWebSiteJsonLd(identity: BusinessIdentity): WebSiteJsonLd | null {
  if (identity.dataStatus !== "verified") return null;
  const origin = siteConfig.url.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(origin),
    name: identity.displayName,
    url: origin,
    publisher: {
      "@type": "Organization",
      "@id": organizationId(origin),
    },
  };
}

/**
 * Matches the same verification gate already implemented for `tel:`/`wa.me`
 * links in `getBranchContactLinks()` (src/content/index.ts) — both read
 * `branch.phone`/`branch.address` directly, but only ever reach that code
 * path when `dataStatus === "verified"`, so there's no duplicated safety
 * gap, just two different consumers of the same verified data.
 *
 * Eligible properties must also be visible on the branch page (ADR-018).
 * Do not emit geo, ratings, reviews, priceRange, amenities, or class schedules.
 */
const SCHEMA_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export function buildLocalBusinessJsonLd(branch: Branch): LocalBusinessJsonLd | null {
  if (branch.dataStatus !== "verified") return null;
  // Require a verified printable address before claiming PostalAddress (ADR-018).
  if (!branch.address || branch.fieldProvenance.address !== "owner_confirmed") return null;

  const origin = siteConfig.url.replace(/\/$/, "");
  const address: LocalBusinessJsonLd["address"] = {
    "@type": "PostalAddress",
    streetAddress: branch.address,
    addressLocality: branch.locality,
  };

  if (branch.pinCode && branch.fieldProvenance.pinCode === "owner_confirmed") {
    address.postalCode = branch.pinCode;
  }

  // Region appears in the owner-confirmed printable address string.
  if (/\bMaharashtra\b/i.test(branch.address)) {
    address.addressRegion = "Maharashtra";
  }

  // All publicly listed branches are in India.
  address.addressCountry = "IN";

  const jsonLd: LocalBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    "@id": branchBusinessId(origin, branch.slug),
    name: branch.name,
    url: buildCanonicalUrl(`/locations/${branch.slug}`),
    address,
    parentOrganization: {
      "@type": "Organization",
      "@id": organizationId(origin),
      name: "Ankit's Studio",
      url: origin,
    },
  };

  // Central enquiry number is shown on the branch page when present.
  if (branch.phone && branch.fieldProvenance.phone === "owner_confirmed") {
    jsonLd.telephone = branch.phone;
  }

  if (
    branch.fieldProvenance.operatingHours === "owner_confirmed" &&
    branch.openingHours.length > 0
  ) {
    jsonLd.openingHoursSpecification = branch.openingHours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: SCHEMA_DAYS[entry.dayOfWeek] ?? "Monday",
      opens: entry.opensAt,
      closes: entry.closesAt,
    }));
  }

  const maps = getBranchMapsUrl(branch);
  if (maps) {
    jsonLd.hasMap = maps;
  }

  return jsonLd;
}

/**
 * Always returns `null`. Confirmed programmes are enquiry-based fitness /
 * movement / choreography services, not educational Courses under Google
 * Search Course guidelines. Do not re-enable without ADR approval and a
 * verified curriculum content model — see docs/DECISIONS.md ADR-017 and
 * docs/audits/PROGRAMME-STRUCTURED-DATA-AUDIT.md.
 */
export function buildCourseJsonLd(_programme: Programme): CourseJsonLd | null {
  return null;
}

/**
 * Service JSON-LD for confirmed programmes only.
 * No Offer, ratings, reviews, prices, or fake availability.
 * areaServed is delivery-aware — not "all programmes at every branch".
 */
export function buildServiceJsonLd(programme: Programme): ServiceJsonLd | null {
  if (!isConfirmedProgramme(programme)) return null;

  const origin = siteConfig.url.replace(/\/$/, "");
  const jsonLd: ServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": programmeServiceId(origin, programme.slug),
    name: programme.name,
    description: programme.shortDescription,
    url: buildCanonicalUrl(`/programs/${programme.slug}`),
    provider: {
      "@type": "Organization",
      "@id": organizationId(origin),
    },
    serviceType: programme.name,
  };

  const mode = programme.deliveryMode;

  if (mode === "in-studio") {
    const listed = getPubliclyListedBranches().filter((branch) =>
      programme.branchSlugs.includes(branch.slug),
    );
    if (listed.length > 0) {
      jsonLd.areaServed = listed.map((branch) => ({
        "@type": "Place" as const,
        name: branch.locality,
      }));
    }
  } else if (mode === "home") {
    // Home PT is Navi Mumbai / Thane — not a claim of every studio room.
    jsonLd.areaServed = [
      { "@type": "Place", name: "Navi Mumbai" },
      { "@type": "Place", name: "Thane" },
    ];
  }
  // online + corporate (no deliveryMode): omit areaServed —
  // remote / B2B enquiry-scoped, not a per-studio room claim.

  return jsonLd;
}

/**
 * Visible page title + description + canonical URL only. No Offer, Event,
 * instructor, schedule, rating, or location invention (ADR-017).
 */
export function buildWebPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): WebPageJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: buildCanonicalUrl(input.path),
  };
}

/** Programme index — CollectionPage without a Course ItemList (ADR-017). */
export function buildCollectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  itemList?: Array<{ name: string; path: string }>;
}): CollectionPageJsonLd {
  const jsonLd: CollectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: buildCanonicalUrl(input.path),
  };

  if (input.itemList && input.itemList.length > 0) {
    jsonLd.mainEntity = {
      "@type": "ItemList",
      numberOfItems: input.itemList.length,
      itemListElement: input.itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: buildCanonicalUrl(item.path),
      })),
    };
  }

  return jsonLd;
}

export function buildArticleJsonLd(post: BlogPost): ArticleJsonLd | null {
  if (post.dataStatus !== "verified") return null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    url: buildCanonicalUrl(`/blog/${post.slug}`),
  };
}

/** Indexable SEO guides — Article + truthful studio authorship (ADR-024). */
export function buildGuideArticleJsonLd(guide: Guide): ArticleJsonLd | null {
  if (guide.dataStatus !== "verified") return null;
  const origin = siteConfig.url.replace(/\/$/, "");
  const url = buildCanonicalUrl(`/guides/${guide.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.modifiedAt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: "Ankit's Studio Team",
      url: buildCanonicalUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      "@id": organizationId(origin),
      name: siteConfig.name,
    },
  };
}

/**
 * Only verified FAQ entries are included; returns `null` if none are.
 * Publishing an unreviewed placeholder answer as a rich-result FAQ carries
 * the same class of risk as publishing an unverified address or phone
 * number — see this task's mock-mode structured-data rules.
 */
export function buildFaqPageJsonLd(faqs: Faq[]): FaqPageJsonLd | null {
  const verifiedFaqs = faqs.filter((faq) => faq.dataStatus === "verified");
  if (verifiedFaqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: verifiedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
