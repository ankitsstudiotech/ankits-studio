/**
 * Minimal, purpose-built schema.org JSON-LD shapes — only what this project
 * actually emits (docs/SEO-STRATEGY.md's structured-data list). Not a
 * general-purpose schema.org binding; no new dependency was added for this
 * (package.json is outside this task's file ownership).
 */

export interface BreadcrumbListJsonLd {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export interface OrganizationJsonLd {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  description?: string;
  logo?: string;
}

export interface PostalAddressJsonLd {
  "@type": "PostalAddress";
  streetAddress: string;
}

/** ExerciseGym is schema.org's LocalBusiness subtype for a fitness studio. */
export interface LocalBusinessJsonLd {
  "@context": "https://schema.org";
  "@type": "ExerciseGym";
  name: string;
  url: string;
  telephone?: string;
  address?: PostalAddressJsonLd;
}

/**
 * Retained for type history / future educational Course approval (ADR-017).
 * Programme builders must not emit this shape until an explicit ADR allows it.
 */
export interface CourseJsonLd {
  "@context": "https://schema.org";
  "@type": "Course";
  name: string;
  description: string;
  url: string;
  provider: {
    "@type": "Organization";
    name: string;
  };
}

/** Minimal page markup — visible title, description, and canonical URL only. */
export interface WebPageJsonLd {
  "@context": "https://schema.org";
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
}

/** Index of programmes — not a Course ItemList carousel (ADR-017). */
export interface CollectionPageJsonLd {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
}

export interface ArticleJsonLd {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  datePublished: string;
  url: string;
}

export interface FaqQuestionJsonLd {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface FaqPageJsonLd {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FaqQuestionJsonLd[];
}
