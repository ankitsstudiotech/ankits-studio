# Visual system defect ledger — Prompt 1–3

**Prompt 1 approved:** shared system / homepage  
**Prompt 2 approved:** tag `studio-pulse-core-routes-approved` @ `5cbc4bf`  
**Prompt 3 correction evidence:** `docs/revamp/screenshots/secondary-routes-correction/`

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

### Counts (correction gate)

| Severity | Before correction | After |
|----------|-------------------|-------|
| P0 | 0 | **0** |
| P1 | 7 | **0** |

### Remaining P2

| ID | Note |
|----|------|
| P2-01 | Body starts with `has-sticky-cta` for SSR padding on primary routes; excluded routes clear it after StickyCtaBar hydrate |
| P2-02 | Playwright `nextdev` soft-handles unknown blog static params; production still hard-404s samples |

## Prior Prompt 3 closures

See `secondary-routes-final-acceptance/` for the initial Prompt 3 rebuild evidence.
