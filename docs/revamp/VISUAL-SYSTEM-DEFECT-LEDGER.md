# Visual system defect ledger — Prompt 1 + Prompt 2

**Checkpoint Prompt 1:** `01a1a82` / `studio-pulse-deployed-v1-before-visual-repair`  
**Approved shared system tag:** `studio-pulse-shared-system-approved`  
**Evidence:** `docs/revamp/screenshots/shared-system-homepage-repair/` · `docs/revamp/screenshots/core-routes-system-propagation/`

## Prompt 1 — homepage / shared chrome (closed)

| ID | Route | Viewport | Element | Defect | Severity | Shared or local fix | Status | Evidence |
|----|-------|----------|---------|--------|----------|---------------------|--------|----------|
| VS-01…VS-13 | / + chrome | all | See Prompt 1 table | Shared system defects | P1 | Prompt 1 primitives | **fixed** | `shared-system-homepage-repair/` |

## Prompt 2 — core routes (before → after)

| ID | Route | Viewport | Element | Defect | Severity | Shared or local fix | Status | Evidence |
|----|-------|----------|---------|--------|----------|---------------------|--------|----------|
| CR-01 | /about | 1440 | Layout | Narrow left-stacked editorial; weak motion | P1 | RouteOpening + balanced bands | **fixed** | before/after-*-about |
| CR-02 | /about | all | Copy | Defensive provenance / neighbourhood phrasing | P1 | Customer wording scrub | **fixed** | after-*-about |
| CR-03 | /programs | all | Meta copy | Internal delivery phrases (“branch-floor”, etc.) | P1 | ProgrammeDiscovery deliveryMeta | **fixed** | before/after-*-programs |
| CR-04 | /programs/[slug] | all | Detail copy | Internal/defensive delivery language | P1 | ProgrammeDetailView rewrite | **fixed** | before/after-*-program-* |
| CR-05 | /programs/[slug] | all | Motion | Near-static page opening | P1 | HeroReveal + SectionReveal | **fixed** | state evidence |
| CR-06 | /locations | all | Rows | Repeated generic branch meta | P1 | BranchRow + unique page lede | **fixed** | before/after-*-locations |
| CR-07 | /locations/[slug] | all | Detail | Repetitive disclaimers; mechanical facts | P1 | BranchDetailView cleanup | **fixed** | before/after-*-location-* |
| CR-08 | /timetable | all | Enquiry panel | Light utility admin form on dark shell | P1 | Dark enquiryPanel + RouteOpening | **fixed** | before/after-*-timetable |
| CR-09 | /pricing | all | Enquiry panel | Light form island / defensive fee copy | P1 | Dark enquiryPanel + copy | **fixed** | before/after-*-pricing |
| CR-10 | /trial | all | Form panel | White form block in dark page | P1 | pulse-form-panel | **fixed** | before/after-*-trial |
| CR-11 | /contact | all | Message form | White full-bleed form section | P1 | pulse-form-panel | **fixed** | before/after-*-contact |
| CR-12 | / | practical | Copy | Internal “do not publish class-by-class” | P1 | Homepage micro-fix only | **fixed** | homepage after |
| CR-13 | core routes | 390 | Sticky CTA | Risk of form obstruction | P1 | Existing soft-hide + /trial hide | **fixed** | mobile after shots |
| CR-14 | programme/location | all | Interaction | Inconsistent row hover/focus | P1 | ProgrammeRow + BranchRow | **fixed** | state-*-* |

### Counts

| Severity | Prompt 2 before | After |
|----------|-----------------|-------|
| P0 | 0 | **0** |
| P1 (scoped routes) | 14 | **0** |

### Out of scope (Prompt 3)
Trainers, transformations, blog, privacy, terms, 404, legacy programmes, design-lab.
