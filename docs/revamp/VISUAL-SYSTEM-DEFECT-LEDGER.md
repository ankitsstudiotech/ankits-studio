# Visual system defect ledger — Prompt 1 + Prompt 2

**Checkpoint Prompt 1:** `01a1a82` / `studio-pulse-deployed-v1-before-visual-repair`  
**Approved shared system tag:** `studio-pulse-shared-system-approved`  
**Evidence (Prompt 2 correction):** `docs/revamp/screenshots/core-routes-final-acceptance/` · `docs/revamp/traces/core-routes-final-acceptance/`  
**Prior (invalid closure):** `docs/revamp/screenshots/core-routes-system-propagation/` — widths / sticky / motion incomplete; do not treat as acceptance.

## Prompt 1 — homepage / shared chrome (closed)

| ID | Route | Viewport | Element | Defect | Severity | Shared or local fix | Status | Evidence |
|----|-------|----------|---------|--------|----------|---------------------|--------|----------|
| VS-01…VS-13 | / + chrome | all | See Prompt 1 table | Shared system defects | P1 | Prompt 1 primitives | **fixed** | `shared-system-homepage-repair/` |

## Prompt 2 — core routes (reopened → corrected)

Earlier Prompt 2 “P1 = 0” closure is **reopened** — screenshots were not native-width validated; About remained left-heavy; programme detail remained dashboard-like; sticky/motion evidence incomplete.

| ID | Route | Viewport | Element | Defect | Severity | Shared or local fix | Status | Evidence |
|----|-------|----------|---------|--------|----------|---------------------|--------|----------|
| CR-01 | /about | 1440 | Layout | Narrow left-stacked editorial; empty right | P1 | Full-width bands + openGrid facts + pairGrid | **fixed** | `1440-about.png` |
| CR-01b | /about | 390 | Pacing | Uniform long stack | P1 | Stronger band separation; compact discovery; hide provenance | **fixed** | `390-about.png` |
| CR-02 | /about | all | Copy | Defensive provenance / neighbourhood phrasing | P1 | Customer wording scrub | **fixed** | after-*-about |
| CR-03 | /programs | all | Meta copy | Internal delivery phrases | P1 | ProgrammeDiscovery deliveryMeta | **fixed** | `*-programs.png` |
| CR-03b | /programs | all | Closing | Orphan corporate + empty footer gap | P1 | Integrated `.closing` + corporateNote | **fixed** | `1440-programs.png` |
| CR-04 | /programs/[slug] | all | Detail copy | Internal/defensive delivery language | P1 | ProgrammeDetailView rewrite | **fixed** | `*-program-*.png` |
| CR-04b | /programs/[slug] | 1440 | Composition | Dashboard cells; empty hero right | P1 | 7/5 hero + summaryPanel; ≤4 glance panels; includeList | **fixed** | all 7 programme 1440 shots |
| CR-05 | /programs/[slug] | all | Motion | Near-static page opening | P1 | HeroReveal + SectionReveal | **fixed** | traces + state shots |
| CR-06 | /locations | all | Rows | Repeated generic branch meta | P1 | BranchRow + unique page lede | **fixed** | `*-locations.png` |
| CR-07 | /locations/[slug] | all | Detail | Repetitive disclaimers | P1 | BranchDetailView cleanup | **fixed** | all 4 branch shots |
| CR-08 | /timetable | all | Enquiry panel | Light utility admin form | P1 | Dark enquiryPanel + RouteOpening | **fixed** | `*-batch-availability.png` |
| CR-09 | /pricing | all | Enquiry panel | Light form island | P1 | Dark enquiryPanel + copy | **fixed** | `*-pricing.png` |
| CR-10 | /trial | all | Form panel | White form block | P1 | pulse-form-panel | **fixed** | `*-trial.png` |
| CR-10b | /trial | 390 | Sticky CTA | Unproven hide/show vs form CTA | P1 | Soft-hide on `#trial-whatsapp-cta` | **fixed** | motion trace + e2e |
| CR-11 | /contact | all | Message form | White full-bleed form | P1 | pulse-form-panel | **fixed** | `*-contact.png` |
| CR-12 | / | practical | Copy | Internal “class-by-class” phrasing | P1 | Homepage micro-fix only | **fixed** | `*-homepage-regression.png` |
| CR-13 | core routes | 390 | Sticky CTA | Risk of form obstruction | P1 | Soft-hide form routes + shell padding | **fixed** | trial sticky evidence |
| CR-14 | programme/location | all | Interaction | Inconsistent row hover/focus | P1 | ProgrammeRow + BranchRow | **fixed** | state-1440-programs-* |
| CR-15 | evidence | all | Screenshots | Non-native widths / contact sheets | P1 | deviceScaleFactor:1 + dimensions.json | **fixed** | `dimensions.json` all pass |

### Counts

| Severity | Invalid prior claim | After correction |
|----------|---------------------|------------------|
| P0 | 0 | **0** |
| P1 (scoped routes) | claimed 0 (invalid) → reopened 15+ | **0** |

### Remaining P2 (honest)

| ID | Note |
|----|------|
| P2-01 | About opening right facts are compact vs tall left copy (acceptable editorial asymmetry) |
| P2-02 | Programme detail still repeats format/delivery between hero summary and later sections (clarity > novelty) |
| P2-03 | Mobile About remains long because verified story + FAQ + discovery are all required |

### Out of scope (Prompt 3)
Trainers, transformations, blog, privacy, terms, 404, legacy programmes, design-lab.
