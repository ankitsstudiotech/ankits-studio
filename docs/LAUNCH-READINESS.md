# Launch readiness — Ankit's Studio

_Date: 2026-08-01_  
_Verifier posture: final technical verification against `AGENTS.md`, `docs/DECISIONS.md` (ADR-002 / 011 / 013), both audit reports, and a fresh lint / type-check / test / build run._  
_No website redesign. Only proven Important documentation drift corrected in this pass (`CLAUDE.md` test-suite claim; ADR-002 “unimplemented” status)._

---

## Ready for mock preview: **yes**

Safe to run and share as an explicitly mock / preview build:

- `ALLOW_MOCK_PUBLISH=true npm run build` succeeds (38 App Router entries generated).
- Preview builds remain `noindex` via `shouldNoIndex()` while any unverified content exists.
- `MockModeIndicator` shows in development and on `ALLOW_MOCK_PUBLISH=true` production builds.
- Contact `tel:` / WhatsApp / map actions stay disabled until branch records are verified.
- Lead forms fail closed without a configured provider; mock success copy does not claim live delivery.

Use: `ALLOW_MOCK_PUBLISH=true npm run build && npm start` (or `npm run dev` locally).

---

## Ready for production launch: **no**

Blocked until owner-verified content replaces mock domains and a real lead delivery path is configured. The technical launch gate is working as designed — that is why production is **not** ready, not because the gate is missing.

Do **not** set `ALLOW_MOCK_PUBLISH=true` on a public production deploy intended to be indexed.

---

## Verification checklist (this pass)

| # | Criterion | Result | Evidence |
|---|---|---|---|
| 1 | Critical audit findings resolved | **Pass** (accepted items) | ADR-013 + audit resolution tables. VIS-001 portal fix in `MobileNav.tsx`; SEO-001 sitemap; MOCK-001 banner; ARCH-001 `PathAwareShell` removed; VIS-002–006 / SEO-003–004 / forms / a11y coverage fixed in `c9cf786`. **SEO-002** programme×location pairs intentionally **rejected** (Phase 2 Track H backlog) — not a silent miss. |
| 2 | Mock cannot appear as verified | **Pass** | `provenanced()` type gate; inline disclaimers; `getBranchContactLinks()` null hrefs unless verified; mock banner on preview builds. |
| 3 | Mock mode is noindex | **Pass** | `shouldNoIndex()` → robots meta + `robots.ts` disallow + empty sitemap while unverified. |
| 4 | Production launch blocked appropriately | **Pass** | `assertMockContentSafeForBuild()` in `next.config.ts`. Fresh run: `npm run build` without `ALLOW_MOCK_PUBLISH` → **exit 1**. |
| 5 | Structured data excludes unverified claims | **Pass** | Omit-unless-verified builders; Course/LocalBusiness/FAQ/Article/Organization gated; safety tests green. |
| 6 | Important content server-rendered | **Pass** | Programme / location / marketing pages are RSC; content from `@/content` at render time. |
| 7 | Primary content not animation-gated | **Pass** | Reveal islands keep text in DOM at near-full opacity; Motion is opt-in, not a page shell. |
| 8 | Location ↔ programme linking | **Pass** | Live hrefs `/programs` and `/locations`; bidirectional cards on detail pages. |
| 9 | Forms never claim success without adapter | **Pass** | Production adapter → `not-configured` / `provider-error`; UI honest; mock mode labels non-delivery. |
| 10 | Build / lint / type-check / tests | **Pass** | See commands below. |
| 11 | No obvious duplicated systems | **Pass** (minor note) | Single content facade + nav source. Near-duplicate `PendingValue` helpers under programmes/locations — not a launch blocker. |
| 12 | Documentation matches implementation | **Pass after fixes** | ADR-002 status + `CLAUDE.md` test note corrected this pass. Audit resolution sections + ADR-013 already documented the audit-fix work. |

### Commands run (2026-08-01)

| Command | Result |
|---|---|
| `npm run lint` | Pass (0 errors; 3 unused-var warnings in ephemeral `docs/audits/_visual-probe.mjs`) |
| `npm run type-check` | Pass |
| `npm test` | Pass — **144 / 144** |
| `npm run build` (ALLOW_MOCK_PUBLISH unset) | **Fail exit 1** — mock gate (expected) |
| `ALLOW_MOCK_PUBLISH=true npm run build` | Pass — **38** routes |

Playwright e2e (`npx playwright test --workers=1`) was green in the prior audit-fix handoff (10/10); not re-run in this verification session because no UI source changed here.

---

## Remaining mock-data dependencies

Almost every business domain in `docs/BUSINESS-DATA-STATUS.md` is still **MOCK** or **REFERENCE-ONLY**. Production indexability requires clearing unverified records in `src/content` (and aligning the status table in the same change).

Still mock / reference-only (non-exhaustive; see the status table for the full list):

- Branch addresses, phones, WhatsApp, hours, map embeds (Airoli / Ghansoli)
- Thane (must stay non-public / unlisted until owner confirms the branch exists)
- Business identity copy beyond the confirmed name “Ankit’s Studio”
- Fees / pricing figures
- Timetable slots
- Trainer identities and bios
- Testimonials and transformation claims
- FAQs
- General contact email / phone
- Blog samples (forced noindex posture)

Already treated as verified structural facts: programme **names** list; Airoli / Ghansoli as listed location names; current primary/footer IA structure.

Owner-supplied Maps pins remain unassigned to branches (correct — do not guess).

---

## Remaining legal / content dependencies

- Privacy policy and terms are draft / placeholder until counsel-approved copy replaces them.
- FAQ and policy answers must be owner-reviewed before FAQPage JSON-LD or policy pages are treated as authoritative.
- Testimonials / transformations must not go live with illustrative attribution.
- Any published pricing requires owner sign-off on exact figures and terms.
- Confirm printable addresses and which Maps pin belongs to which branch before enabling diallers or embeds.

---

## Remaining technical risks

| Risk | Severity | Notes |
|---|---|---|
| Shared JS ~197–202kb gzip vs 150kb landing budget | Medium (product decision) | Predates audit-fix; React/Next/Motion floor. Revise budget or narrow Motion usage — do not silently rip Motion out. |
| SEO-002 programme×location pair routes absent | Medium (SEO backlog) | Tracked as Phase 2 Track H / ADR-008; rejected from audit-fix scope. |
| CI must unset `ALLOW_MOCK_PUBLISH` before negative build assert | Process | Documented MOCK-002 — sticky env vars can false-pass the gate. |
| `NEXT_PUBLIC_SITE_URL` must be correct before indexable launch | Low/Medium | Wrong host on a noindex preview is acceptable; wrong host once indexable is not. |
| Dual `PendingValue` modules | Low | programmes vs locations copies — consolidate later if touching those files. |
| Visual-probe lint warnings | Low | Ephemeral audit helper under `docs/audits/`. |

---

## Exact next actions

1. **Owner verification loop** — Walk `docs/BUSINESS-DATA-STATUS.md` domain by domain; flip matching `src/content` records to `"verified"` only with quotable owner confirmation; update the status table in the same commit.
2. **Assign Maps pins** — Owner labels which pin is Airoli vs Ghansoli; then set `mapEmbedUrl` (still gated until branch `dataStatus === "verified"`).
3. **Decide Thane** — Confirm operating or keep `publiclyListed: false` / omit from live nav forever.
4. **Configure lead delivery** — Set production `LEAD_PROVIDER_URL` (and related secrets); confirm trial/contact success only after a real adapter accepts the payload.
5. **Legal copy** — Replace privacy/terms drafts; owner-approve FAQs and pricing.
6. **Pre-index checklist** — Unset `ALLOW_MOCK_PUBLISH` on the production deploy; set production `NEXT_PUBLIC_SITE_URL`; confirm `shouldNoIndex()` is false only when content is fully verified; confirm `/sitemap.xml` lists expected Tier 1/2 URLs.
7. **Optional SEO Track H** — Implement `/locations/[branch]/[programme]` pair landings when unique pair copy exists (ADR-008).
8. **Perf decision** — Accept framework JS floor (update `PERFORMANCE-BUDGET.md`) or explicitly reduce Motion surface area.

---

## Related records

- Audits: `docs/audits/CLAUDE-TECHNICAL-SEO-AUDIT.md`, `docs/audits/CURSOR-VISUAL-BROWSER-AUDIT.md`
- Triage: `docs/DECISIONS.md` ADR-013
- Prior fix commit: `c9cf786` — `fix: resolve production readiness audit findings`
- Live handoff narrative: `docs/HANDOFF.md`
