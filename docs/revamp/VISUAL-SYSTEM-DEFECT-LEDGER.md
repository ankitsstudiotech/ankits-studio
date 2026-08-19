# Visual system defect ledger — Prompt 1–4

**Prompt 1 approved:** shared system / homepage  
**Prompt 2 approved:** tag `studio-pulse-core-routes-approved` @ `5cbc4bf`  
**Prompt 3 correction:** `be8c705` / `7bc0e9c` — evidence `docs/revamp/screenshots/secondary-routes-correction/`  
**Prompt 4 final candidate:** HEAD `7bc0e9c` — evidence `docs/revamp/screenshots/final-production-candidate-7bc0e9c/`

## Prompt 4 — final whole-site gate

| Severity | Count | Notes |
|----------|-------|-------|
| P0 | **0** | None |
| P1 | **0** | P4-01 fixed before redeploy (see below) |
| P2 | 2 | Documented below |
| P3 | 1 | Documented below |

### Prompt 4 P1 closed before production alias

| ID | Route | Defect | Fix | Status |
|----|-------|--------|-----|--------|
| P4-01 | 404 | Dual robots meta: `noindex` + root `index, follow` | Omit robots from `baseMetadata`; explicit noindex on `not-found` metadata | **fixed** |

### Remaining non-blocking

| ID | Severity | Note |
|----|----------|------|
| P2-01 | P2 | Body SSR defaults `has-sticky-cta`; excluded routes clear after StickyCtaBar hydrate. CLS measured 0 on primary routes. |
| P2-02 | P2 | Playwright `next dev` soft-handles unknown blog static params; production hard-404s sample fixtures (verified). |
| P2-03 | P2 | 404 still emits dual redundant noindex tags (Next auto `noindex` + explicit `noindex, nofollow`). Conflicting `index, follow` removed. |
| P3-01 | P3 | Blog sample `not-found` copy still says “sample article” — customer-harmless; polish later. |

## Prompt 3 correction — remaining P1 (closed)

| ID | Route | Viewport | Element | Defect | Severity | Planned fix | Status | Evidence |
|----|-------|----------|---------|--------|----------|-------------|--------|----------|
| SR-C01 | privacy/terms/trainers/transformations/404/legacy/blog | 390 | StickyCtaBar | Sticky WhatsApp CTA covered content | P1 | Explicit allowlist eligibility + clear shell padding | **fixed** | secondary-routes-correction/* stickyAbsent |
| SR-C02 | /transformations | all | Headings | Duplicate “What you can explore today” | P1 | Quiet readiness note + single explore section | **fixed** | *-transformations |
| SR-C03 | /trainers | all | Team size | 15+ duplicated in opening + section | P1 | Opening facts only; removed Team Size band | **fixed** | *-trainers |
| SR-C04 | /trainers | all | Copy | “verified details” internal wording | P1 | Customer profile wording | **fixed** | content + trainers |
| SR-C05 | /privacy-policy | all | Copy | Counsel-certified disclaimer + defensive forms wording | P1 | Removed disclaimer; direct forms wording | **fixed** | *-privacy-policy |
| SR-C06 | /terms | all | Copy | Membership Policies + counsel disclaimer | P1 | Removed both | **fixed** | *-terms |
| SR-C07 | 404 | 390 | Secondary links | Cramped horizontal actions | P1 | Vertical stack ≤480px | **fixed** | viewport-390-not-found |

### Counts (Prompt 3 correction gate)

| Severity | Before correction | After |
|----------|-------------------|-------|
| P0 | 0 | **0** |
| P1 | 7 | **0** |

## Prior Prompt 3 closures

See `secondary-routes-final-acceptance/` for the initial Prompt 3 rebuild evidence.
