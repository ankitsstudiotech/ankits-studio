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
  "@id": string;
  name: string;
  url: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
}

export interface PostalAddressJsonLd {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface OpeningHoursSpecificationJsonLd {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

/** ExerciseGym is schema.org's LocalBusiness subtype for a fitness studio. */
export interface LocalBusinessJsonLd {
  "@context": "https://schema.org";
  "@type": "ExerciseGym";
  "@id": string;
  name: string;
  url: string;
  telephone?: string;
  address?: PostalAddressJsonLd;
  openingHoursSpecification?: OpeningHoursSpecificationJsonLd[];
  hasMap?: string;
  parentOrganization?: {
    "@type": "Organization";
    "@id": string;
    name: string;
    url?: string;
  };
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

export interface ItemListJsonLd {
  "@type": "ItemList";
  numberOfItems?: number;
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    url: string;
  }>;
}

/** Index of programmes or locations — optional ItemList for real entities. */
export interface CollectionPageJsonLd {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
  mainEntity?: ItemListJsonLd;
}

/** Confirmed programme as a Service (not Course — ADR-017). */
export interface ServiceJsonLd {
  "@context": "https://schema.org";
  "@type": "Service";
  "@id": string;
  name: string;
  description: string;
  url: string;
  provider: {
    "@type": "Organization";
    "@id": string;
  };
  serviceType?: string;
  areaServed?: Array<{ "@type": "Place"; name: string }> | { "@type": "Place"; name: string };
}

export interface WebSiteJsonLd {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  publisher?: {
    "@type": "Organization";
    "@id": string;
  };
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
