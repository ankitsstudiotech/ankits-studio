# Cursor Visual & Browser Audit — Ankit's Studio

_Date: 2026-08-01_  
_Scope: read-only visual / interaction audit. No application source was modified._  
_Base URL: `http://localhost:3001` (Next.js 16.2.12 Turbopack; port 3000 occupied)_  
_Viewports: 390×844, 768×1024, 1440×900, 1920×1080_

## Executive summary

Layout is generally stable across the four viewports: **no horizontal overflow** was measured on the crawled route set. Timetable GET filters, sticky CTA hide-on-trial, Thane / TBC empty states, mock labelling, and the validation / not-configured form banners behave as designed.

The single **Critical / High** product defect is **mobile navigation visually broken** when open: the drawer collapses to header height because `position: fixed` is trapped by the sticky header’s `backdrop-filter`, and `body { overflow: hidden }` then clips the links. Links remain in the accessibility tree and are focusable, but most users only see “Menu” + close.

Secondary issues: generic form validation (`noValidate` + banner, no per-field errors), footer touch widths under 44px, missing `<h1>` on several marketing pages, hydration noise in dev, and a chrome-less 404.

**No issues were fixed in this pass.**

---

## Method

1. Automated Playwright probe (`docs/audits/_visual-probe.mjs`) crawled **24 routes × 4 viewports**, measured overflow / small targets, and captured interaction screenshots under `docs/audits/screenshots/`.
2. Manual Cursor browser QA on 390 and 1440: mobile nav geometry via CDP, trial/contact forms, timetable filters, keyboard focus, reduced-motion emulation (probe), 404, Thane missing-data, sticky CTA.
3. Severity scale: **Critical** (blocks primary task) · **High** · **Medium** · **Low** · **Info** (observation / intentional mock posture).

### Routes covered

| Route | Notes |
|---|---|
| `/` | Home + sticky CTA |
| `/about`, `/trainers`, `/trainers/illustrative-trainer-1` | Marketing |
| `/programs`, `/programs/strength-training`, `/programs/weight-loss-fitness` | Long programme name |
| `/locations`, `/locations/airoli`, `/locations/thane` | Missing-data / TBC |
| `/transformations`, `/timetable`, `/timetable?branch=…&programme=…` | Filters |
| `/pricing`, `/trial`, `/trial?status=validation-error`, `/trial?status=not-configured` | Forms / errors |
| `/contact`, `/contact?status=not-configured` | Forms / errors |
| `/blog`, `/blog/sample-starting-with-strength` | Content |
| `/privacy-policy`, `/terms` | Legal |
| `/this-route-does-not-exist` | 404 |

Programme index has **no client/server filter UI** (cards only). “Programme filters” in this audit means timetable programme filter + programme listing browsing.

---

## Findings

### VIS-001 — Mobile nav drawer collapses; links clipped / invisible

| Field | Detail |
|---|---|
| **Severity** | **High** (Critical for mobile primary navigation) |
| **Route** | Global (`/` verified; same chrome on all PathAwareShell pages) |
| **Viewport** | 390×844 (also expected ≤ `lg` / 768) |
| **Screenshot** | `screenshots/mobile_nav_open_390.png`, `screenshots/mobile_nav_verified_390.png` |

**Reproduction steps**

1. Open `/` at 390×844.
2. Tap **Open menu**.
3. Observe drawer: “Menu” + × only; page content still visible underneath.
4. (CDP) Measure `[role=dialog]`: height ≈ **68px**, `top` ≈ header bottom; nav links have geometry at `top` 161–401 but are clipped.

**Observed**

- Sticky header uses `backdrop-blur-md` (`SiteHeader.tsx`). In Chromium, `backdrop-filter` creates a containing block for `position: fixed` descendants.
- Drawer / overlay (`fixed inset-y-0` / `inset-0`) size to the **header (~68px)**, not the viewport.
- Opening the menu sets `document.body.style.overflow = "hidden"`, which clips overflowing link paint.
- Accessibility tree still exposes Home / Programmes / Locations / Timetable / Contact / Book a Trial (screen-reader users may succeed; sighted users mostly cannot).

**Expected behaviour**

Full-height overlay + panel covering the viewport; all primary links and CTA visible and tappable (≥44×44).

**Recommended fix**

Portal the dialog + overlay to `document.body` (or render MobileNav outside the blurred sticky header). Alternatively drop `backdrop-filter` on the header while the menu is open. Re-test open/close, Escape, focus trap, and body scroll lock.

---

### VIS-002 — Trial / contact validation is banner-only (`noValidate`)

| Field | Detail |
|---|---|
| **Severity** | **Medium** |
| **Route** | `/trial`, `/contact` |
| **Viewport** | All (verified 390) |
| **Screenshot** | `screenshots/view_390_trial_status_validation-error.png`, `screenshots/trial_native_validation_390.png` |

**Reproduction steps**

1. Open `/trial`.
2. Submit empty form (native HTML5 validation is skipped because the form has `noValidate`).
3. Land on `/trial?status=validation-error` with status: “Please check the form fields and try again.”
4. No field is marked `aria-invalid`; no inline error text under Name / Phone / selects / consent.

**Expected behaviour**

Per-field errors (or restored native constraint validation), focus moved to the first invalid control, and association via `aria-describedby` / `aria-invalid`.

**Recommended fix**

Either remove `noValidate` and rely on native constraints for empty submits, or keep server Zod validation but map issues to field-level UI and set focus/ARIA. Same pattern on `/contact`.

---

### VIS-003 — Footer (and some chrome) touch targets narrower than 44px

| Field | Detail |
|---|---|
| **Severity** | **Medium** (mobile / tablet) |
| **Route** | Global footer — measured on `/` and most routes |
| **Viewport** | 390×844, 768×1024 |
| **Screenshot** | `screenshots/view_390_home.png` (footer links) |

**Reproduction steps**

1. Open any marketing page at 390.
2. Measure footer Explore / Branches text links (About, Pricing, Blog, Terms, Airoli, …).
3. Probe report: height often 44, **width 28–43** for short labels.

**Expected behaviour**

WCAG 2.5.5 / common mobile guidance: hit area ≥ 44×44 (padding acceptable even if glyph is smaller).

**Recommended fix**

Add horizontal padding / `min-w-11` on footer and dense text links; keep skip-link `sr-only` until focused (1×1 when collapsed is acceptable).

---

### VIS-004 — Several pages lack a document `<h1>`

| Field | Detail |
|---|---|
| **Severity** | **Medium** (a11y / SEO heading outline) |
| **Route** | e.g. `/about` (probe `h1: null`); `/contact` heading is `h2` “Get in touch”; `/trial` heading is `h2` |
| **Viewport** | All |

**Reproduction steps**

1. Open `/about` or `/contact`.
2. Query `document.querySelector('h1')` — null on about; contact/trial use Section titles as `h2`.

**Expected behaviour**

Exactly one meaningful `<h1>` per page reflecting the primary topic.

**Recommended fix**

Promote page title / Section title to `h1` (or add a visually consistent page `h1`) on marketing forms and about.

---

### VIS-005 — Dev hydration error overlay interferes with CTAs

| Field | Detail |
|---|---|
| **Severity** | **Medium** in development · **Info** for production (overlay absent) |
| **Route** | `/`, `/trial`, others |
| **Viewport** | 390×844 |
| **Screenshot** | `screenshots/mobile_nav_verified_390.png` |

**Reproduction steps**

1. Run `npm run dev` with mock content.
2. Load `/` or `/trial` at mobile width.
3. Next.js “1 Issue” badge / hydration panel sits over the sticky CTA and can intercept clicks (Submit trial was click-intercepted during this audit).
4. Overlay cites hydration mismatch around `SiteChrome` / `Overline` (client vs server branch / non-deterministic input).

**Expected behaviour**

No hydration mismatch; sticky and form CTAs remain clickable without dismissing a framework overlay.

**Recommended fix**

Eliminate the hydration source (avoid `typeof window` branches and non-deterministic values in shared render paths). Treat as a launch blocker for quality even if production build hides the overlay.

---

### VIS-006 — 404 page has no site chrome

| Field | Detail |
|---|---|
| **Severity** | **Low** |
| **Route** | `/this-route-does-not-exist` (HTTP 404) |
| **Viewport** | All |
| **Screenshot** | `screenshots/view_390_this-route-does-not-exist.png` |

**Reproduction steps**

1. Visit an unknown path.
2. See centered “Page not found” + “Return home” only — no header, footer, or primary nav.

**Expected behaviour**

Either intentional minimal 404, or full chrome so users can recover via Programmes / Contact without only “Return home”.

**Recommended fix**

If product wants recovery parity, render `not-found` inside the marketing layout / SiteChrome. Keep copy honest; ensure “Return home” remains ≥44px tall.

---

### VIS-007 — Mock / placeholder density crowds first viewport on mobile

| Field | Detail |
|---|---|
| **Severity** | **Low** (intentional mock posture; visual quality) |
| **Route** | `/` and most pages |
| **Viewport** | 390×844 |
| **Screenshot** | `screenshots/view_390_home.png` |

**Reproduction steps**

1. Open `/` at 390.
2. First screen stacks: development preview banner + sticky header + hero copy + dual CTAs + “MOCK MEDIA” + sticky bottom bar (“Try a class”).

**Expected behaviour**

Hero remains brand-first with one primary CTA group; mock labelling present but not competing with conversion chrome.

**Recommended fix**

When leaving mock mode, remove preview banner. Consider collapsing sticky CTA when hero primary CTA is in view, or shorten banner copy on small screens.

---

### VIS-008 — Programme index has no filter controls

| Field | Detail |
|---|---|
| **Severity** | **Info** |
| **Route** | `/programs` |
| **Viewport** | All |

**Reproduction steps**

1. Open `/programs`.
2. Only a card grid — no audience / energy / branch filters.

**Expected behaviour**

Depends on IA; current ship is browse-all. Timetable owns branch×programme filtering.

**Recommended fix**

If product wants “programme filters”, add GET filters (audience, accent, branch availability) with empty-state copy. Otherwise document that filters live only on `/timetable`.

---

## Test matrix results

| Test | Result |
|---|---|
| **Navigation (desktop 1440 / 1920)** | Pass — Primary nav + Book a Trial visible and linked |
| **Mobile navigation** | **Fail** — VIS-001 |
| **CTAs** | Pass functionally; sticky hidden on `/trial` (pass); hero + sticky duplicate on home (VIS-007) |
| **Forms** | Submit paths work; empty → validation-error; not-configured banner honest |
| **Programme filters** | N/A on `/programs` (VIS-008); programme detail long names wrap (`weight-loss-fitness`) |
| **Timetable filters** | Pass — `?branch=ghansoli&programme=zumba` → “1 provisional class listed…”; empty copy present for no matches |
| **Keyboard navigation** | Pass — Tab reaches controls; Escape closes menu (code path present); focus trap implemented in MobileNav |
| **Focus indicators** | Pass — `outline: solid 2px` observed (`screenshots/keyboard_focus_390.png`) |
| **Reduced motion** | Pass — `prefers-reduced-motion: reduce` matched; home H1 still present (`screenshots/home_reduced_motion_1440.png`) |
| **Text resizing** | Partial — layout uses rem/`text-[length:var(--…)]`; no overflow in default probe; 200% zoom not fully re-measured after navigation race (re-check before launch) |
| **Long content** | Pass — long programme name / Thane placeholders wrap; `break-words` on timetable slots |
| **Missing mock values** | Pass — TBC / disabled Call·WhatsApp·Directions on Thane; map withheld; trainers/hours pending labelled |
| **Slow-loading media** | Info — hero uses mock media placeholder (no real image CLS observed); gallery placeholders keep layout |
| **Layout shift** | No major CLS from images in mock mode; sticky + banner reserve space. Dev overlay can shift perceived bottom CTA |
| **Overflow** | Pass — `overflowX: false` on all probe route×viewport pairs |
| **Animation smoothness** | Qualitatively fine under reduced-motion; mobile drawer animation irrelevant while VIS-001 clips content |
| **Contrast** | Spot-check: ink on cream / accent buttons appear adequate; automated contrast samples empty in probe — recommend axe/APCA pass before launch |
| **Touch target size** | Partial fail — VIS-003; primary CTAs and menu button meet min height |
| **Empty states** | Pass — timetable no-match; Thane timetable/trainers TBC; map unavailable |
| **Error states** | Pass — validation-error + not-configured banners; 404 returns 404 |
| **404** | Pass functionally; chrome gap VIS-006 |
| **Form validation** | Partial — server Zod + banner (VIS-002); consent checkbox exposed as `readonly` in a11y tree (verify interactive check still works with pointer/keyboard) |

---

## Positive observations

- **No horizontal overflow** across 24 routes × 4 viewports in the automated probe.
- Sticky CTA correctly **absent on `/trial`**.
- Timetable filters are progressive-enhancement friendly (GET form, no JS required).
- Missing / unverified data is **labelled**, not fabricated (Thane, maps, contact diallers).
- Focus-visible styles exist on interactive chrome.
- Long programme titles wrap without breaking the card grid at 390.

---

## Screenshot index

| File | Context |
|---|---|
| `screenshots/view_390_home.png` | Home mobile |
| `screenshots/mobile_nav_open_390.png` | Broken open menu (probe) |
| `screenshots/mobile_nav_verified_390.png` | Broken open menu (browser re-check) |
| `screenshots/keyboard_focus_390.png` | Focus ring |
| `screenshots/home_reduced_motion_1440.png` | Reduced motion |
| `screenshots/view_390_timetable.png` | Timetable |
| `screenshots/timetable_filter_390.png` | Filtered timetable |
| `screenshots/view_390_trial.png` | Trial form |
| `screenshots/view_390_trial_status_validation-error.png` | Validation banner |
| `screenshots/view_390_trial_status_not-configured.png` | Provider missing |
| `screenshots/trial_native_validation_390.png` | Empty submit path |
| `screenshots/view_390_locations_thane.png` | Missing-data location |
| `screenshots/view_390_programs_weight-loss-fitness.png` | Long programme name |
| `screenshots/view_390_pricing.png` | Pricing |
| `screenshots/view_390_this-route-does-not-exist.png` | 404 |

---

## Out of scope / not changed

- No application source fixes.
- No production build visual pass (audit used `npm run dev`).
- Design-lab routes not treated as public marketing surfaces.
- Full APCA / axe automated contrast suite not run (recommend follow-up).

---

## Suggested fix order

1. **VIS-001** — Portal / re-parent mobile nav (blocks mobile IA).
2. **VIS-005** — Clear hydration mismatch.
3. **VIS-002** — Field-level form errors.
4. **VIS-003** / **VIS-004** — Touch targets + heading outline.
5. **VIS-006** / **VIS-007** — 404 chrome + mock-banner density when exiting preview.

---

## Resolution status (2026-08-01/02 — production-readiness audit-fix pass)

Full reasoning and rejection rationale for every row below:
[DECISIONS.md ADR-013](../DECISIONS.md#adr-013). Commit:
`fix: resolve production readiness audit findings`.

| ID | Status | Resolution |
|---|---|---|
| VIS-001 | **Fixed** | Root cause confirmed exactly as diagnosed here (`backdrop-filter` containing block traps `position: fixed`). Fixed by portalling the drawer/overlay to `document.body` via `createPortal` in `MobileNav.tsx`, rather than rendering inline inside the blurred `<header>`. Re-verified via the same visual probe: drawer now covers the full 844px mobile viewport (previously collapsed to header height); see the regenerated `screenshots/mobile_nav_open_390.png`. |
| VIS-002 | **Fixed** | Converted both `trial/actions.ts` and `contact/actions.ts` to the `useActionState` pattern: validation failures now return field-level errors (wired through `Field`'s existing `error`/`aria-describedby` props and `TextInput`'s `invalid`/`aria-invalid` props) instead of a redirect-only banner. `noValidate` removed from the trial form so native HTML5 validation runs first. Success/not-configured/provider-error still redirect. Verified in a real browser: an empty submit is blocked natively; a server-side-only validation failure (e.g. a too-short phone number) shows an inline field error and stays on the page; a fully valid submission still redirects with the success banner. |
| VIS-003 | **Fixed** | Added horizontal padding (`px-2` offset by `-mx-2` to preserve visual alignment) plus `min-w-11` to `SiteFooter` links, alongside the pre-existing `min-h-11`. Re-verified via the visual probe: no footer link appears in the small-touch-target report at 390px across any route (previously several short labels like "Blog"/"FAQ" were under 44px wide). |
| VIS-004 | **Fixed** | Added an optional `titleAs` prop to `Section` (defaults to `"h2"`, every existing call site unaffected) and applied `titleAs="h1"` to the primary section on `/about`, `/contact`, `/trial`, `/timetable`, and `/pricing`. Confirmed no page ends up with two `<h1>`s (other routes already had one via `HeroHeading as="h1"`, untouched). |
| VIS-005 | **Fixed** | Root cause found: `ScrollReveal.tsx` conditionally rendered a plain `<div>` vs. `<motion.div>` based on `useReducedMotion()` — the exact anti-pattern `TextReveal.tsx`'s own comment warns against, and which `TextReveal`/`FadeIn` already avoided correctly. Fixed by always rendering the same `<motion.div>` and varying only prop values. Verified via the visual probe: 0 hydration-related console errors on `/`. |
| VIS-006 | **Fixed** | Root `not-found.tsx` now renders inside `SiteChrome` (matching every real route's `<main>`-inside-chrome structure), instead of a bare centered div. Verified via a live request: `<header>` and `<footer>` now present in the 404 response body, HTTP status still correctly 404. |
| VIS-007 | **Rejected** | Cosmetic, and the audit's own text frames it as "intentional mock posture" — the preview banner disappears the moment mock mode ends, by design (ADR-002). Restructuring hero/sticky-CTA interaction to "fix" a temporary, self-resolving state would be an unsolicited visual redesign. |
| VIS-008 | **Rejected** | Intentional per `docs/INFORMATION-ARCHITECTURE.md` — filtering lives on `/timetable` only; the audit's own text agrees ("current ship is browse-all"). Not a defect. |

**Re-verification note:** the visual probe (`docs/audits/_visual-probe.mjs`) was re-run against the fixed build after every relevant category — 0 overflow findings across 24 routes × 4 viewports (unchanged from the original audit), mobile nav drawer confirmed full-height and functional, sticky CTA behaviour unchanged, no remaining small footer touch targets. `docs/audits/visual-probe-report.json` and `docs/audits/screenshots/**` reflect the current (fixed) state.
