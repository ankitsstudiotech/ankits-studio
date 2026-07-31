# Handoff — Content & SEO Foundation

_Scope: this pass was file-ownership-restricted to `src/content/**`,
`src/lib/seo/**`, `src/app/sitemap.*`/`robots.*`/`manifest.*`/
`opengraph-image.*`, `tests/seo/**`, and three docs
(`SEO-STRATEGY.md`, `BUSINESS-DATA-STATUS.md`, this file). It did **not**
touch `docs/HANDOFF.md`, `docs/TASKS.md`, `docs/DECISIONS.md`,
`docs/CONTENT-MODEL.md`, `src/components/**`, `src/styles/**`,
`package.json`, or any design token — see "Follow-ups for the next
session" below for what that leaves open._

## What was built

### New content domains (`src/content/schema/`, `src/content/mock/`)

- `business-identity.ts` — `BusinessIdentity`, a singular record. The
  business name is owner-confirmed (project brief); everything else
  (tagline, description) is invented placeholder text, so the whole record
  is `dataStatus: "mock"` (record-level provenance — see
  `docs/CONTENT-MODEL.md`).
- `faq.ts` — `Faq[]`. Four generic, safe placeholder FAQs (first-class
  logistics, experience needed, trial booking, cancellation policy). No
  medical or guaranteed-outcome claims.
- `contact-details.ts` — `ContactDetails`, a singular record: general
  email/phone plus the CTA-priority ordering from
  `docs/INFORMATION-ARCHITECTURE.md`'s Conversion model (trial-form >
  whatsapp > phone > email). Deliberately does **not** duplicate per-branch
  `Branch.phone`/`Branch.whatsapp`.
- `navigation.ts` — `NavigationItem[]`, primary + footer, matching
  `docs/INFORMATION-ARCHITECTURE.md`'s phased Phase 1 nav exactly (no Tier 2
  links). `dataStatus: "verified"` here means "this is the site's actual
  current IA" (a fact we control), not "the owner reviewed this copy" —
  different meaning of "verified" than the other domains, called out
  explicitly in code comments and in `BUSINESS-DATA-STATUS.md`.

All four are wired into `src/content/content-mode.ts`'s
`siteHasUnverifiedContent` scan and `src/content/index.ts`'s accessor
(`getBusinessIdentity`, `getContactDetails`, `getFaqs`,
`getNavigationItems`) — the same accessor pattern the existing eight
domains already use, including the singular-record merge case
(`mergeSingular`, alongside the existing `mergeByKey`).

**Existing content fixed to match this task's explicit rules**:
`src/content/mock/branches.ts` — Thane's `address` is now literally
`"To be confirmed"` (was a longer descriptive sentence).

### SEO utility layer (`src/lib/seo/`)

- `canonical.ts` — `buildCanonicalUrl`/`isValidCanonicalUrl`. Throws on a
  missing leading slash, a query string/fragment, or a trailing slash.
- `metadata.ts` — `buildPageMetadata({ title, description, path,
  ogImagePath? })`. Zod-validated input (throws on a missing/empty required
  field); `title` is a plain string so it still resolves through the root
  layout's title template. Always includes `robots` via the existing
  `buildRobotsMeta()` from `src/lib/metadata.ts`.
- `structured-data.ts` — `buildBreadcrumbJsonLd` (always safe — pure IA, no
  business facts), `buildOrganizationJsonLd`, `buildLocalBusinessJsonLd`
  (`ExerciseGym`), `buildArticleJsonLd`, `buildFaqPageJsonLd`. Every one
  except Breadcrumb returns `null` (or, for FAQ, drops non-verified
  entries) unless the source record is `dataStatus === "verified"` — the
  same "omit, never placeholder" rule `docs/DECISIONS.md` ADR-011 already
  established for `LocalBusiness`, now applied uniformly and actually
  implemented for the others too.
- `serialize.ts` — `serializeJsonLd`. Escapes `<`/`>`/`&` and the
  U+2028/U+2029 line/paragraph separators before a JSON-LD payload is
  embedded in a `<script>` tag (prevents `</script>`-breakout and JS-parser
  breakage from those two Unicode separators, which are valid in JSON
  strings but not in raw JS).
- `sitemap.ts` / `robots.ts` — both keyed off
  `shouldNoIndex()`/`content-mode.ts`. Sitemap returns `[]` outright while
  any unverified content exists anywhere (a listed entry is itself an
  "indexable, confirmed" signal); robots disallows everything under the
  same condition.
- `types.ts` — minimal hand-written schema.org JSON-LD interfaces (no new
  dependency — `package.json` is outside this task's ownership).

### App Router special files (`src/app/`)

`sitemap.ts`, `robots.ts` — thin wrappers around the `src/lib/seo/`
builders. `manifest.ts` — minimal PWA manifest; `theme_color`/
`background_color` are neutral placeholders (final values are a
design-tokens/Track A decision, out of this task's ownership); icons
reference the only real asset that exists, `/favicon.ico` (proper 192/512px
icons are a follow-up once brand assets exist). `opengraph-image.tsx` — a
minimal dynamic OG image (site name on a plain background) via `next/og`'s
`ImageResponse`; explicitly a placeholder, not final branding.

**Not built**: page presentation components (explicitly out of this task's
scope) and `Course`/`Service` structured data per programme (not in this
task's explicit structured-data list — tracked for Phase 2 once
programme/location pages exist).

## Contradictions/gaps flagged transparently (not silently resolved)

1. **CONTENT-MODEL.md / DECISIONS.md are now out of sync with the code.**
   `docs/CLAUDE.md`/`AGENTS.md` Hard Rule 9 requires a `docs/DECISIONS.md`
   entry in the same change as any `CONTENT-MODEL.md` type change — but
   this task's file ownership excludes both files. Four new content types
   (`BusinessIdentity`, `Faq`, `ContactDetails`, `NavigationItem`) now exist
   in `src/content/schema/` with no corresponding `CONTENT-MODEL.md`
   section or ADR. This is a real gap, not a rule violation (Hard Rule 9
   triggers on *changing* `CONTENT-MODEL.md`; this pass never touched it) —
   **whoever owns those two files next should add a `CONTENT-MODEL.md`
   section for each new type and a `DECISIONS.md` ADR recording the
   decision**, mirroring what's already in `src/content/schema/`.

2. **`src/lib/metadata.ts`'s `siteConfig.description` now duplicates
   `BusinessIdentity.description`.** `src/lib/metadata.ts` is outside this
   task's ownership, so it couldn't be refactored to source from
   `getBusinessIdentity()` instead of its own hardcoded string. Both exist
   right now, worded differently. A follow-up: whoever owns
   `src/lib/metadata.ts` should have it read from `getBusinessIdentity()`
   so there's one source of truth, not two independently-edited strings.

3. **`tests/seo/**` isn't picked up by `npm run test`.** The root
   `vitest.config.mts`'s `include` is `["src/**/*.test.{ts,tsx}"]`, and
   that file is outside this task's ownership. Rather than skip the
   explicitly-instructed `tests/seo/**` location, or silently violate the
   ownership boundary by editing the root config, this pass added a scoped
   `tests/seo/vitest.config.ts` (itself inside `tests/seo/**`, so within
   ownership). **Run these tests explicitly**:
   ```bash
   npx vitest run --config tests/seo/vitest.config.ts
   ```
   Follow-up: whoever owns `package.json`/`vitest.config.mts` next could
   add a `test:seo` script and/or fold `tests/seo/**` into the root
   config's `include` so `npm run test` covers everything in one command.

4. **The two owner-supplied Maps links are not assigned to a specific
   branch.** They were given as two pins with no label distinguishing
   Airoli from Ghansoli. Guessing an assignment would fabricate a mapping
   the owner never confirmed, which is worse than leaving it unassigned —
   so `Branch.mapEmbedUrl` stays unset on both mock records, and the two
   URLs are preserved as unassigned reference text in
   `docs/BUSINESS-DATA-STATUS.md` instead. Follow-up: once the owner
   clarifies which pin is which, populate `mapEmbedUrl` on the matching
   `Branch` record in the same change that updates that doc's note.

None of these four are silently swept under the rug — each is a direct
consequence of an explicit file-ownership boundary this task was given, not
a mistake, and each names exactly who should close it and how.

## Verification run (this pass, all green)

```bash
npm run lint                                          # clean
npm run type-check                                    # clean (tsc --noEmit --strict)
npm run test                                           # existing 16 + new colocated content tests, all pass
npx vitest run --config tests/seo/vitest.config.ts     # new tests/seo/** suite, all pass
npm run build                                          # still exits 1 without ALLOW_MOCK_PUBLISH (unchanged, correct)
ALLOW_MOCK_PUBLISH=true npm run build                  # still exits 0, still ships noindex (unchanged, correct)
```

Test coverage added, matching this task's explicit list: unique
titles/descriptions (generated across every current Programme + Branch),
valid canonical URLs (and rejection of malformed ones), missing required
fields (Zod-schema and `buildPageMetadata`/`buildCanonicalUrl` throw
behavior), mock status propagation (every structured-data builder's
null-vs-object behavior flips correctly with `dataStatus`), structured-data
safety (no rating/review/award key ever appears; `serializeJsonLd` escapes
a script-breakout attempt and still round-trips through `JSON.parse`), and
production mock-data protections (sitemap/robots stay locked down even in
an `ALLOW_MOCK_PUBLISH=true` production build).

## How to resume

Read `docs/PROJECT-BRIEF.md`, then `docs/HANDOFF.md` (the main foundation
handoff from the previous pass), then this file for the content/SEO layer
specifically. The four numbered gaps above are the concrete next actions
for whoever owns `CONTENT-MODEL.md`/`DECISIONS.md`/`src/lib/metadata.ts`/
`package.json` next — this task's ownership boundary didn't allow closing
them directly.
