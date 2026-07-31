# Handoff — Programme & Location Route Architecture

_Scope: this pass was file-ownership-restricted to `src/app/programs/**`,
`src/app/locations/**`, `src/lib/seo/**`, `src/content/**`,
`tests/routes/**`, `tests/seo/**`, and this doc. It did **not** touch
`src/components/**`, `src/styles/**`, design tokens, global CSS, the
homepage, header, or footer — every page below is built entirely from
already-existing shared components (`@/components/ui`, `@/components/home`)
plus minimal inline semantic markup where no existing component fit._

## The one thing to read before anything else: `/programs` vs `/programmes`

Every planning doc (`INFORMATION-ARCHITECTURE.md`, `SEO-STRATEGY.md`,
`HANDOFF.md`) and the existing homepage use **`/programmes`** (British
spelling). This task's explicit file-ownership grant named
**`src/app/programs/**`** (American spelling) — repeated in both the
ownership list and the task's own route list. That's not incidental
phrasing; it's the literal directory I'm allowed to write to. I built the
real routes at `/programs`, matching the grant, rather than `/programmes`.

Consequences, fixed where I could and flagged where I couldn't:

- **Fixed** (within `src/content/**`, my ownership): `src/content/mock/navigation.ts`'s
  two "Programmes" nav entries (primary + footer) now point at `/programs`
  instead of `/programmes` — the header/footer nav (which reads
  `getNavigationItems()`) links correctly to the real pages. Display
  **label** text stays "Programmes"; only the URL segment changed.
- **Not fixed, flagged** (outside my ownership): `src/app/page.tsx` (the
  homepage) hardcodes `/programmes` in three places (a secondary CTA href
  and two `href={\`/programmes/${slug}\`}` template strings). These will
  404 until whoever owns the homepage updates them to `/programs`. I did
  not touch `src/app/page.tsx` — it's explicitly out of scope.

**Locations has no equivalent conflict** — `/locations` already matched
every doc and existing link; nothing needed fixing there.

## What was built

### Routes

- `src/app/programs/page.tsx` — index, all 7 programmes as cards.
- `src/app/programs/[slug]/page.tsx` — detail page with all 11 requested
  data slots (see below).
- `src/app/programs/[slug]/{not-found,loading}.tsx`.
- `src/app/programs/_lib/lookup.ts` — `getProgrammeOrNotFound(slug)`,
  validates against the slug enum before lookup, calls Next's `notFound()`
  on any miss. Colocated (underscore-prefixed, not routed), shared by
  `generateMetadata` and the page component so a missing programme never
  renders bogus metadata for a page that's about to 404.
- `src/app/locations/page.tsx` — index, publicly-listed branches only
  (Thane excluded, matching `docs/DECISIONS.md` ADR-007 finding I2).
- `src/app/locations/[slug]/page.tsx` — detail page with all 12 requested
  data slots.
- `src/app/locations/[slug]/{not-found,loading}.tsx`, `_lib/lookup.ts`
  (`getBranchOrNotFound`) — same pattern as programmes. Deliberately does
  **not** gate on `publiclyListed`: Thane's own detail page still statically
  generates and renders (direct URL only), consistent with the existing
  "route exists for prototyping, just unlinked" rule.

All four index/detail pages are static (`generateStaticParams` from
`@/content`, no `dynamic = "force-dynamic"` anywhere) and use
`buildPageMetadata`/`buildBreadcrumbJsonLd`/`buildCourseJsonLd`/
`buildLocalBusinessJsonLd`/`buildFaqPageJsonLd`/`serializeJsonLd` from
`src/lib/seo/**` — nothing hand-rolled outside that layer.

### Data slots

**Programme page**: overview (`longDescription`) · who it's for
(`whoItsFor`) · class structure (`classStructure`) · benefits (`benefits[]`)
· difficulty (`difficulty` badge) · required equipment
(`requiredEquipment[]`, or "No equipment required") · available branches
(publicly-listed branches offering it, linking to `/locations/[slug]`) ·
timings (`getTimetableSlots({ programmeSlug })` via `TimetablePreview`) ·
trainers (filtered by `specialties`) · FAQs (`getFaqs({ programmeSlug })`,
falls back to 3 generic FAQs if none are programme-specific) · trial CTA
(`FreeTrialCta`, reused from `@/components/home`).

**Location page**: address · map (`getBranchContactLinks(branch).mapEmbedUrl`
— an iframe if present, otherwise "pending confirmation" text; never an
embed for a non-verified branch, per ADR-011) · directions · opening hours
(table, or "to be confirmed" if empty — matches Thane) · programmes (branch's
`programmeSlugs` resolved via `getProgrammeBySlug`, linking to
`/programs/[slug]`) · trainers (filtered by `branchSlugs`) · timetable
(`getTimetableSlots({ branchSlug })`) · parking · nearby transport ·
branch photos (gallery if `branch.photos` is populated, otherwise "not
available yet" — no branch has real photos yet, so this always shows the
placeholder state right now, on purpose, rather than a fabricated image) ·
FAQs (`getFaqs({ branchSlug })`, same fallback pattern) · contact actions
(`getBranchContactLinks(branch)` — phone/WhatsApp links only render when
the branch is verified; otherwise plain "pending confirmation" text; a
"Book a trial" link always renders).

### Content-model extensions (all within `src/content/**`)

- **`Programme`** gained `whoItsFor`, `classStructure`, `benefits: string[]`,
  `difficulty`, `requiredEquipment: string[]`. These stay on the existing
  `dataStatus: "verified"` record rather than forcing it to `mock` — same
  reasoning already established for the pre-existing `shortDescription`/
  `longDescription` fields (`docs/BUSINESS-DATA-STATUS.md`: "Names/
  descriptions of *what programmes exist* are real"): this is category-level
  description of what a programme generally involves, not an owner-specific
  verifiable fact like a price or a real trainer's name. See the code
  comment in `src/content/schema/programme.ts` for the full reasoning —
  flagging it here explicitly rather than assuming it's obviously fine.
- **`Branch`** gained `directions`, `parking`, `nearbyTransport: string[]`,
  `photos: MediaAsset[]` — all optional, all covered by the record's
  existing `mockDisclaimer` (no new provenance question here; every branch
  is already `mock`/`reference-only`).
- **`Faq`** gained `branchSlug` (alongside the existing `programmeSlug`) so
  location-specific FAQs are possible; `getFaqs()` now filters by either.
- **Bug fix**: `src/content/mock/trainers.ts`'s two trainer photos pointed
  at `/mock/trainers/placeholder-{1,2}.svg`, which never existed as a real
  file in `public/` (would 404 under `next/image`) — a leftover from the
  original content-foundation pass. Repointed to the real, existing
  `/mock-media/programme-placeholder.svg` asset while wiring trainer photos
  into these pages for the first time.

### SEO layer extensions (`src/lib/seo/**`)

- **`buildCourseJsonLd(programme)`** (new) — closes the gap
  `docs/SEO-STRATEGY.md` flagged as "not yet built... tracked for Phase 2
  once programme/location pages exist." They now exist. Same
  omit-unless-verified rule as every other builder; since Programme records
  are already `verified`, this one actually emits — confirmed in the real
  build output (`grep '"@type":"Course"' .next/server/app/programs/yoga.html`
  matches).
- `siteConfig.name` (already used sitewide for title template/OG/manifest)
  is used for `Course.provider.name` rather than reading
  `BusinessIdentity.displayName`, which is gated behind that record's
  overall `mock` status (invented tagline/description) even though the
  business name itself is independently owner-confirmed. See the code
  comment in `structured-data.ts`.

### Known gaps, flagged rather than silently left implicit

1. **`/programs` vs `/programmes`** — see the top of this doc. The
   homepage's three hardcoded `/programmes` links will 404 until fixed by
   whoever owns `src/app/page.tsx`.
2. **`CONTENT-MODEL.md`/`DECISIONS.md` sync** — same structural gap as the
   previous SEO pass (see `docs/HANDOFF-SEO.md`): the `Programme`/`Branch`/
   `Faq` schema extensions above have no corresponding `CONTENT-MODEL.md`
   section or `DECISIONS.md` ADR yet, because both files are outside this
   task's ownership. Whoever owns them next should add entries covering:
   the five new `Programme` fields, the four new `Branch` fields, and
   `Faq.branchSlug`.
3. **Shared-component heading reuse**: `FreeTrialCta` and the pattern I
   used for FAQ sections both carry some fixed/shared chrome text (e.g.
   `FreeTrialCta`'s outer section is always titled "Come move with us" —
   not parameterized). Every programme/location page's actual CTA message
   (H3 + body) is unique; only that one outer section heading repeats
   across pages. Judged acceptable — not the kind of duplicate
   *descriptive* copy the task's rule is aimed at — but noted since I
   don't own that component to change it.
4. **`tests/routes/**` isn't picked up by `npm run test`** — same reasoning
   and same fix as `tests/seo/**` (see `docs/HANDOFF-SEO.md`): the root
   `vitest.config.mts` is outside this task's ownership, so
   `tests/routes/vitest.config.ts` is its own scoped config. Run explicitly:
   ```bash
   npx vitest run --config tests/routes/vitest.config.ts
   ```

## Verification run (this pass, all green)

```bash
npm run lint                                            # clean
npm run type-check                                      # clean (tsc --noEmit --strict)
npm run test                                             # 27/27 (unaffected by this pass's schema changes)
npx vitest run --config tests/seo/vitest.config.ts       # 47/47 (unaffected)
npx vitest run --config tests/routes/vitest.config.ts    # 31/31 (new)
npm run build                                            # exits 1 — still correctly blocked
ALLOW_MOCK_PUBLISH=true npm run build                    # exits 0 — all 21 routes generate,
                                                          #   including all 7 programme and all 3
                                                          #   location detail pages
```

Checked directly in the generated build output (not just log inspection):
`noindex, nofollow` present on programme/location pages; `Course` JSON-LD
present on programme pages (Programme is verified); `BreadcrumbList` JSON-LD
present; `ExerciseGym`/`LocalBusiness` JSON-LD **absent** (0 matches) on
every location page (no branch is verified yet); Thane absent from
`/locations`' index links but its own `/locations/thane` page still
statically generates; unknown slugs under both `/programs/*` and
`/locations/*` render the `not-found.tsx` UI with `noindex` present.

Ad hoc accessibility spot-check (Playwright + axe-core, not committed as a
new file since `e2e/**` is outside this task's ownership): `/programs`,
`/programs/yoga`, `/locations`, `/locations/airoli` all report zero
serious/critical violations.

Test coverage added, matching this task's explicit list: static-param
generation (all programme/branch slugs, including Thane), metadata
uniqueness (titles/descriptions/canonicals across every real page), 404
handling (valid slug, unknown slug, empty slug — for both route trees),
no-duplicate-copy (pairwise uniqueness across all 7 programmes'
description/benefits fields and all 3 branches' addresses/names),
programme/location-specific FAQ association, internal-link correctness
(Thane never in the publicly-listed set), and structured-data safety
(Course emits for every current programme; LocalBusiness is null for
every current branch, never partial).

## How to resume

Read `docs/PROJECT-BRIEF.md`, then `docs/HANDOFF.md`, then
`docs/HANDOFF-SEO.md`, then this file. Before adding a fifth data domain or
another route family, check the four numbered gaps above — most of them
recur (the `tests/*/vitest.config.ts` pattern, the `CONTENT-MODEL.md` sync
gap) and the fix is the same each time.
