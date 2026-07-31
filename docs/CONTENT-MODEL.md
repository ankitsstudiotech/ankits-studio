# Content Model

Defines the typed data shapes for all business content and the mock-data strategy
that backs [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md). This is a design
spec — no source files are created by this doc (see AGENTS.md ownership rules).

## Core principle: every record knows its own trust level

Every content record — regardless of domain — carries the same two fields:

```ts
interface DataProvenance {
  /** "mock" = invented placeholder. "reference-only" = owner gave a pointer
   *  (e.g. a Maps pin) but it isn't a confirmed, publishable value yet.
   *  "verified" = owner confirmed this exact value for publication.
   *  Mirrors the three statuses in BUSINESS-DATA-STATUS.md. */
  dataStatus: "mock" | "reference-only" | "verified";
  /** Required when dataStatus is "mock" or "reference-only". Short human-readable
   *  label shown in UI banners and used by the launch-readiness check.
   *  e.g. "Placeholder fee — not final" or "Owner-supplied Maps pin — address not yet confirmed". */
  mockDisclaimer?: string;
}
```

Every top-level content type extends this. A record cannot be `"mock"` or
`"reference-only"` without a `mockDisclaimer`, and cannot be `"verified"` without
every field on it having been reviewed against
[BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md) — enforced by the type (a
discriminated union, not a runtime check) once implemented:

```ts
type Provenanced<T> =
  | (T & { dataStatus: "mock"; mockDisclaimer: string })
  | (T & { dataStatus: "reference-only"; mockDisclaimer: string })
  | (T & { dataStatus: "verified" });
```

The launch gate (see [DECISIONS.md ADR-002](./DECISIONS.md#adr-002)) treats
`"mock"` and `"reference-only"` identically — both block production launch for
that record. `"reference-only"` exists to distinguish *why* it isn't verified
(owner gave a starting point but hasn't confirmed the publishable value) from
pure fabrication, which matters for `docs/BUSINESS-DATA-STATUS.md` bookkeeping
but not for gating.

## Content types

### Programme

```ts
type ProgrammeSlug =
  | "strength-training"
  | "personal-training"
  | "yoga"
  | "zumba"
  | "adult-dance"
  | "kids-dance"
  | "weight-loss-fitness";

interface Programme extends DataProvenance {
  slug: ProgrammeSlug;
  name: string;
  shortDescription: string;
  longDescription: string;
  audienceTags: string[]; // e.g. ["beginner-friendly", "kids", "high-intensity"]
  branchSlugs: BranchSlug[]; // which branches offer it
  heroAccent: ProgrammeAccentToken; // see DESIGN-DIRECTION.md
}
```

The programme *names themselves* are `VERIFIED` per BUSINESS-DATA-STATUS.md; fees,
timings, and trainers attached to a programme are separate records and typically
`"mock"`.

### Branch (Location)

```ts
type BranchSlug = "airoli" | "ghansoli" | "thane";

interface Branch extends DataProvenance {
  slug: BranchSlug;
  name: string;
  address: string;
  mapEmbedUrl?: string; // owner-supplied Maps link, reference-only until address verified
  phone: string;
  whatsapp: string;
  openingHours: OpeningHoursEntry[];
  programmeSlugs: ProgrammeSlug[];
}
```

### Trainer

```ts
interface Trainer extends DataProvenance {
  slug: string;
  name: string;
  photoUrl: string; // must be a licensed/placeholder asset, never a scraped photo
  qualifications: string[];
  specialties: ProgrammeSlug[];
  branchSlugs: BranchSlug[];
  bio: string;
}
```

### TimetableSlot

```ts
interface TimetableSlot extends DataProvenance {
  id: string;
  branchSlug: BranchSlug;
  programmeSlug: ProgrammeSlug;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string; // "HH:mm"
  endTime: string;
  trainerSlug?: string;
}
```

### PricingPlan

```ts
interface PricingPlan extends DataProvenance {
  slug: string;
  name: string;
  billingPeriod: "monthly" | "quarterly" | "annual" | "per-session";
  priceInr: number;
  programmeSlugs: ProgrammeSlug[];
  branchSlugs: BranchSlug[];
  inclusions: string[];
}
```

Pricing is the highest-risk domain (see BUSINESS-DATA-STATUS.md) — every
`PricingPlan` in mock state must render its `mockDisclaimer` inline next to the
price, not just in a page-level banner.

### Transformation

```ts
interface Transformation extends DataProvenance {
  slug: string;
  programmeSlug: ProgrammeSlug;
  summary: string; // qualitative description, not a specific unverifiable number
  durationWeeks?: number;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}
```

### Testimonial

```ts
interface Testimonial extends DataProvenance {
  id: string;
  quote: string;
  attributedName: string; // must read as illustrative, e.g. "Illustrative member"
  programmeSlug?: ProgrammeSlug;
  branchSlug?: BranchSlug;
}
```

### BlogPost

```ts
interface BlogPost extends DataProvenance {
  slug: string;
  title: string;
  excerpt: string;
  bodyMdx: string;
  publishedAt: string; // ISO date
  programmeSlugs?: ProgrammeSlug[];
}
```

## Mock data location (planned)

Mock content lives under `src/content/mock/<domain>/*.ts`, one exported const array
per domain, imported only through a single `src/lib/content/` accessor layer. UI
components never import `src/content/mock/*` directly — they go through the
accessor so that swapping mock → verified sources later (e.g. a CMS) touches one
layer, not every component. This directory does not exist yet; created in
Phase 1 of [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md).

## Relationship to the launch gate

See [DECISIONS.md ADR-002](./DECISIONS.md#adr-002) for how `dataStatus` feeds the
mechanism that blocks an accidental production launch with mock data still present.
