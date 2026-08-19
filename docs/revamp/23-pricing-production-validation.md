# 23 — Pricing production validation

**Date:** 2026-08-02  
**Branch:** `revamp/studio-pulse-production`  
**URL:** `/pricing`  
**Frozen prototypes:** untouched

---

## Previous pricing problems

- Pre-Pulse card layout with a latent path to render membership plan `priceInr` rows
- Generic free-trial WhatsApp CTA (not a fee enquiry)
- No confirmed-vs-pending hierarchy or pricing FAQ
- Historical fake ₹999 / ₹2499 plans already emptied from content — page still needed hardening

## Final page sequence

1. Introduction — fees & free trial  
2. Confirmed facts — free trial, ₹300 one-time registration, fees vary by service  
3. What affects pricing (no invented branch/GST claims)  
4. Service-aware pricing enquiry builder  
5. Still being updated (pending list — secondary)  
6. Factual FAQ  
7. Programme + location links  

## Confirmed pricing displayed

- Free trial  
- ₹300 one-time registration (explicitly not monthly / trial / recurring)  
- Programme fees vary by service  

## Intentionally omitted

- Monthly / quarterly / annual amounts  
- PT / wedding / home / online package prices  
- Discounts, refunds, GST, freezes  

## Enquiry variants

| Mode | Fields |
|---|---|
| Physical studio | Service, branch (prompted), optional format, name, question |
| Home PT | Locality, name, question |
| Online | Name, question |
| Wedding | Optional event date / participants / songs, name, question |

## Structured data

`WebPage` + `BreadcrumbList` only. No Offer / Product / PriceSpecification / priceRange.

## Motion

See `docs/revamp/22-pricing-motion-review.md` — instant field swaps only.

## Responsive / accessibility

- Screenshots: `docs/revamp/screenshots/pricing-production/`
- Axe: **0 serious/critical**
- Mode smoke: Home/Online/Wedding/Yoga field behaviour verified

## Tests added

- `tests/routes/pricing-route.test.ts` (6)  
- `tests/routes/pricing-whatsapp.test.ts` (7)  
- `getPricingPlans()` verified-only filter  
- Vitest `testTimeout` raised to 15s for Windows full-suite stability  

## Verification results

| Check | Result |
|---|---|
| Unit tests | **213** passed |
| Production build `ALLOW_MOCK_PUBLISH=true` | Pass |
| Axe on `/pricing` | Pass |

## Remaining owner-data gaps

1. Monthly / longer-term programme fees  
2. PT, wedding, home, online package amounts  
3. Whether fees differ by branch  
4. GST, discounts, refunds, freezes, transfers  

## Commits

1. `docs: audit pricing route and commercial claims`  
2. `feat: rebuild honest pricing enquiry experience`  
3. `feat: add service-aware WhatsApp pricing flow`  
4. `fix: remove unsupported pricing tiers and offer semantics`  
5. `chore: validate pricing production route`
