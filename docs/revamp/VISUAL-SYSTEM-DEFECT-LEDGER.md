# Visual system defect ledger — Prompt 1–3

**Prompt 1 approved:** shared system / homepage  
**Prompt 2 approved:** tag `studio-pulse-core-routes-approved` @ `5cbc4bf`  
**Prompt 3 checkpoint HEAD (start):** `5cbc4bf`  
**Before evidence:** `docs/revamp/screenshots/secondary-routes-final-acceptance/before/`  
**After evidence:** `docs/revamp/screenshots/secondary-routes-final-acceptance/` · `docs/revamp/traces/secondary-routes-final-acceptance/`

## Prompt 3 — secondary routes

| ID | Route | Viewport | Element | Defect | Severity | Planned fix | Status | Evidence |
|----|-------|----------|---------|--------|----------|-------------|--------|----------|
| SR-01 | /trainers | all | Media plates | Fake photography placeholders | P1 | Removed plates | **fixed** | after-*-trainers |
| SR-02 | /trainers | all | Copy | Owner-provided / Development notes | P1 | Customer copy only | **fixed** | after-*-trainers |
| SR-03 | /trainers | 1440 | Layout | Narrow left column | P1 | openGrid full editorial | **fixed** | 1440-trainers |
| SR-04 | /transformations | all | Media | Community placeholder | P1 | Removed | **fixed** | after-*-transformations |
| SR-05 | /transformations | all | Copy | Development note | P1 | Consent-first customer copy | **fixed** | after-*-transformations |
| SR-06 | /blog | all | Index | Sample article cards (light UI) | P0 | Studio Notes hub, no cards | **fixed** | after-*-blog |
| SR-07 | /blog/[slug] | all | Sample posts | Fictional articles renderable | P0 | `dynamicParams=false` + notFound; production HTTP 404 | **fixed** | sample-blog-status.json · 1440-blog-sample-404 |
| SR-08 | /privacy-policy | all | Typography | Uneven legal measure | P1 | Shared LegalPage | **fixed** | after-*-privacy |
| SR-09 | /terms | all | Layout | Needed shared legal system | P1 | Shared LegalPage | **fixed** | after-*-terms |
| SR-10 | 404 | all | Composition | Missing discovery links | P1 | Pulse 404 + links | **fixed** | after-*-not-found |
| SR-11 | error.tsx | all | Theme | Light ink / developer tone | P1 | Dark Pulse status UI | **fixed** | status.module.css |
| SR-12 | loading | all | Theme | Light skeleton / dual main | P2 | Pulse skeleton as `role=status` | **fixed** | PulseLoadingSkeleton |
| SR-13 | legacy programmes | all | Surface | Light surfaceBand | P1 | Dark legacy notice | **fixed** | after-*-legacy-* |
| SR-14 | withheld routes | nav | Exposure | Must stay out of primary/footer | P1 | FOOTER_EXCLUDE confirmed | **fixed** | nav-exclusions.test |
| SR-15 | blog samples | SEO | Indexing | Fiction crawlable as article | P0 | Hard 404 in production | **fixed** | sample-blog-status.json |

### Counts

| Severity | Before | After |
|----------|--------|-------|
| P0 | 3 | **0** |
| P1 | 11 | **0** |
| P2 | 1 | **0** (SR-12 closed) |

### Remaining P2 (honest)

| ID | Note |
|----|------|
| P2-01 | Playwright `nextdev` webServer may soft-handle unknown static blog params; production evidence proves HTTP 404 |
| P2-02 | Trainer detail `[slug]` remains empty SSG (no publishable profiles) — acceptable |

## Prompt 1–2 (closed)

See tags `studio-pulse-shared-system-approved` and `studio-pulse-core-routes-approved`.
