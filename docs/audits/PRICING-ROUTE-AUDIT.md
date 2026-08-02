# Pricing route audit

**Date:** 2026-08-02  
**Scope:** `/pricing`, commercial claims, Offer/price JSON-LD, WhatsApp pricing enquiry  
**Rule:** Do not modify production code until this audit is committed

---

## Executive finding

Fake membership plan rows (₹999 / ₹2499, “Most popular”) were **already removed** from content (`mockPricingPlans = []`). The live `/pricing` page currently shows verified free trial + ₹300 registration and a generic WhatsApp trial CTA.

Gaps for this rebuild:

1. No service-aware **pricing** enquiry builder (uses free-trial WhatsApp template)
2. Pre-Pulse marketing `Section` layout — not Studio Pulse utility treatment
3. Page still contains a render path for `getPricingPlans()` plan cards — if mock plans are re-added under `ALLOW_MOCK_PUBLISH=true`, invented fees would appear publicly (noindex, but visible)
4. No pricing-specific FAQ / confirmed-vs-pending hierarchy
5. No Offer JSON-LD today (good) — must stay that way even for ₹300

---

## Audit table

| File/component | Current behaviour | Accuracy risk | Required action |
|---|---|---|---|
| `src/app/(marketing)/pricing/page.tsx` | Free trial + ₹300 + empty-state enquire copy; optional plan cards if plans exist; BreadcrumbList only | Medium — plan card path can revive fake tiers; UI incomplete | Rebuild as honest Pulse utility; remove plan-tier UI; pricing WhatsApp builder; WebPage JSON-LD |
| `src/content/mock/pricing.ts` | `mockPricingPlans = []` | Low today; high if rows re-added | Keep empty; do not reintroduce illustrative fees |
| `src/content/schema/pricing-plan.ts` | Schema for future verified plans | Low | Keep schema; do not render unverified plans |
| `src/content/mock/studio-commercial.ts` | Verified trial free + ₹300 + fees pending | Low | Source of truth for confirmed facts |
| `src/content/index.ts` `getPricingPlans()` | Merges mock+verified (both empty) | Medium if mock plans return | Prefer never listing mock plans on `/pricing` |
| `src/lib/conversion/whatsapp.ts` | Trial template only | Medium — wrong intent for fee questions | Add pricing enquiry builders |
| `src/lib/seo/structured-data.ts` | No Offer/priceRange on pricing | Low | Keep; emit WebPage + BreadcrumbList only |
| Homepage / programme pulse ₹300 notes | Honest registration mentions | Out of scope | Do not redesign those routes |
| Design-lab | May show fixtures | Acceptable noindex | Do not modify frozen revamps |
| Tests | Commercial ₹300 asserted; no pricing-route tests | Gap | Add route + WhatsApp + SD tests |

---

## Mock pricing under `ALLOW_MOCK_PUBLISH=true`

| Claim | Can it appear publicly on a mock-preview deploy? |
|---|---|
| Fake monthly/quarterly/annual plan amounts | **Not currently** (empty plans). **Would** if mock rows were re-added and page still maps `priceInr` |
| ₹300 registration | Yes — but it is **verified**, not mock |
| Free trial | Yes — verified |
| Offer / PriceSpecification JSON-LD | No — not emitted |
| Invented discounts / “Most popular” | No — not in code |

**Requirement:** Mock-preview must not make invented commercial terms look like offers. Remove the plan-card render path from `/pricing` until plans are verified and intentionally published.

---

## Required rebuild outcomes

1. Honest page sequence (intro → trial → ₹300 → why fees vary → enquiry builder → pending note → FAQ → links)
2. Service-aware pricing WhatsApp messages (physical / home / online / wedding)
3. Studio Pulse low-tempo utility visuals — no SaaS tiers
4. WebPage + BreadcrumbList only
5. Tests + validation

**Do not modify production code until this document is committed.**
