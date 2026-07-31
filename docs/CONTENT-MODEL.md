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

## Hard rules for using this model (ADR-011)

These close the mock-data leak paths identified in the architecture review —
see [DECISIONS.md ADR-011](./DECISIONS.md#adr-011):

- **No hardcoded business facts.** A price, phone number, address, or trainer
  name never appears as a literal in a component. It always comes from
  `src/lib/content/**`.
- **`tel:` / `wa.me` hrefs, and `Branch.mapEmbedUrl`, are never rendered
  unless the record's `dataStatus === "verified"`.** Pre-verification, phone
  and WhatsApp values render as plain non-linked text using an
  obviously-non-dialable example pattern (never a plausible live-looking
  number), and `mapEmbedUrl` is not read by the UI layer at all.
- **No dedicated type for member counts / social-proof numbers.** Hardcoding
  such a number anywhere is banned. Adding this domain requires a new
  `Provenanced` type plus its own `docs/DECISIONS.md` entry first — not
  created speculatively here.

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

/** Semantic family, not a raw design token — see DECISIONS.md ADR-012.
 *  The design layer (Phase 1 design-tokens track) maps each family to
 *  actual CSS tokens; content never names a token value directly. */
type ProgrammeAccentFamily = "strength" | "calm" | "high-energy";
// strength-training / personal-training / weight-loss-fitness -> "strength"
// yoga -> "calm"
// zumba / adult-dance / kids-dance -> "high-energy"

interface Programme extends DataProvenance {
  slug: ProgrammeSlug;
  name: string;
  shortDescription: string;
  longDescription: string;
  audienceTags: string[]; // e.g. ["beginner-friendly", "kids", "high-intensity"]
  branchSlugs: BranchSlug[]; // which branches offer it
  heroAccent: ProgrammeAccentFamily; // see DESIGN-DIRECTION.md
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
  // Owner-supplied Maps link. Present on the record for internal reference,
  // but the UI layer must not read/embed it until dataStatus === "verified"
  // (an embedded pin leaks a real address exactly like printed text would).
  mapEmbedUrl?: string;
  phone: string;
  whatsapp: string;
  openingHours: OpeningHoursEntry[];
  programmeSlugs: ProgrammeSlug[];
  // Whether this branch appears in public nav/footer/sitemap. False for any
  // branch still "reference-only" (e.g. Thane) — see BUSINESS-DATA-STATUS.md
  // and DECISIONS.md ADR-007 (I2). The route can still exist for prototyping.
  publiclyListed: boolean;
}
```

### MediaAsset

Shared shape for every image reference in the content model — kept minimal
deliberately (see [DECISIONS.md ADR-012](./DECISIONS.md#adr-012)): no
`licenceNote` or `lqip` yet, since no real photography exists to attach them
to. Extend when Phase 2/3 sources real images, not speculatively now.

```ts
interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}
```

### Trainer

```ts
interface Trainer extends DataProvenance {
  slug: string;
  name: string;
  photo: MediaAsset; // must be a licensed/placeholder asset, never a scraped photo
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
  beforeImage?: MediaAsset;
  afterImage?: MediaAsset;
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
  // Opaque body format for now (MDX vs. plain vs. block-based is a Phase 3
  // decision, not committed here) — see DECISIONS.md ADR-012.
  body: string;
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
