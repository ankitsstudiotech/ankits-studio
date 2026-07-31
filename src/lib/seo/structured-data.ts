import type { Branch, BlogPost, BusinessIdentity, Faq, Programme } from "@/content";
import { siteConfig } from "@/lib/metadata";
import { buildCanonicalUrl } from "./canonical";
import type {
  ArticleJsonLd,
  BreadcrumbListJsonLd,
  CourseJsonLd,
  FaqPageJsonLd,
  LocalBusinessJsonLd,
  OrganizationJsonLd,
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
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: identity.displayName,
    url: siteConfig.url,
    description: identity.description,
  };
}

/**
 * Matches the same verification gate already implemented for `tel:`/`wa.me`
 * links in `getBranchContactLinks()` (src/content/index.ts) — both read
 * `branch.phone`/`branch.address` directly, but only ever reach that code
 * path when `dataStatus === "verified"`, so there's no duplicated safety
 * gap, just two different consumers of the same verified data.
 */
export function buildLocalBusinessJsonLd(branch: Branch): LocalBusinessJsonLd | null {
  if (branch.dataStatus !== "verified") return null;
  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: branch.name,
    url: buildCanonicalUrl(`/locations/${branch.slug}`),
    telephone: branch.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
    },
  };
}

/**
 * Programme records are `dataStatus: "verified"` (see
 * docs/BUSINESS-DATA-STATUS.md — the programme list itself is owner-
 * confirmed), so this actually emits, unlike the branch/article/FAQ
 * builders while the site has no verified data of those kinds yet.
 * `provider.name` uses `siteConfig.name` — already treated as a safe
 * constant sitewide (title template, OG siteName, manifest name), not
 * gated on `BusinessIdentity`'s record-level mock status, which reflects
 * *other* invented fields (tagline/description), not the business name
 * itself. See docs/HANDOFF-ROUTES.md.
 */
export function buildCourseJsonLd(programme: Programme): CourseJsonLd | null {
  if (programme.dataStatus !== "verified") return null;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: programme.name,
    description: programme.shortDescription,
    url: buildCanonicalUrl(`/programs/${programme.slug}`),
    provider: { "@type": "Organization", name: siteConfig.name },
  };
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
