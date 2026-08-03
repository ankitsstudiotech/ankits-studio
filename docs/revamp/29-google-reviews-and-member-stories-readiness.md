# 29 — Google reviews and member stories readiness

**Date:** 2026-08-03  
**Checkpoint:** `studio-pulse-before-review-sourcing-audit`  
**Related:**  
- `docs/audits/GOOGLE-REVIEWS-SOURCING-AUDIT.md`  
- `docs/business/GOOGLE-LISTING-IDENTITY.md`  
- ADR-021 (self-serving review structured data)

**This document does not authorise a route rebuild.** No Google review was fetched or published in this task.

---

## 1. Current route / content risks

| Risk | Detail |
|---|---|
| Mock testimonials | Two illustrative quotes in content; unused on homepage but still in launch gate |
| Mock transformations | `/transformations` renders illustrative journeys under `ALLOW_MOCK_PUBLISH=true` |
| No Google reviews live | Correct — do not invent |
| No Place IDs | Maps short URLs only; GBP URLs null |
| Privacy policy | Silent on review display / third-party scripts |
| Structured data | Clean today; must stay free of self-serving Review/AggregateRating |

---

## 2. Listing-resolution result

**0 of 4 Place IDs resolved.** Official credentials required. See `GOOGLE-LISTING-IDENTITY.md`.

---

## 3. Approach comparison

### Option A — Places API (New) Place Details

| Topic | Finding |
|---|---|
| Product | Places API (New) Place Details with field mask including `reviews`, `rating`, `userRatingCount`, `displayName`, `formattedAddress`, `googleMapsUri`, `id` |
| SKU | `reviews` is an **Enterprise + Atmosphere** field (billing required) — see Place Details field tables |
| Billing | Must be enabled on the Google Cloud project |
| Quantity | **Maximum 5 reviews per place**, sorted by relevance by default ([REST `reviews[]`](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places)) |
| Attribution | Author name, avatar, profile link when available; min avatar if space-limited; Google Maps logo/text attribution; per-review `googleMapsUri` to source ([policies](https://developers.google.com/maps/documentation/places/web-service/policies)) |
| Ordering disclosure | Must describe how reviews are ordered/filtered |
| Storage | **Must not pre-fetch, cache, or store** Places content beyond allowed exceptions; **Place ID may be stored indefinitely** |
| Translation | Disclose when translated; prefer `originalText` access |
| Privacy policy | Site must link Terms/Privacy incorporating Google Maps Platform terms |
| Complexity | Medium — server route + Place IDs + attribution UI |
| Runtime / cost | Per Place Details request (Atmosphere SKU); 4 branches × refresh cadence |

### Option B — Google Business Profile API

| Topic | Finding |
|---|---|
| Auth | Ankit or manager OAuth (`business.manage` / `plus.business.manage`) |
| Coverage | Paginated full review list for **verified** locations (pageSize ≤ 50) |
| Ops | Suitable for reply management and internal audit |
| Public website | Heavier (token storage, refresh, account/location IDs); attribution and Google Search self-serving rules still apply to on-site display |
| Burden | High operational (OAuth lifecycle, multi-location account mapping) |

Do **not** initiate OAuth in this phase.

### Option C — Owner-approved first-party testimonials

Distinct from republishing Google reviews:

- Customer supplies **their own** wording (or approves a written statement)  
- Explicit publication permission, preferred public name, branch/programme, optional photo + photo permission, consent date  
- Stored as first-party CMS content with provenance — **not** Places content, so Places caching rules do not apply  
- Still must not emit self-serving Review/AggregateRating JSON-LD about the studio on the studio site  
- Correct source for **member stories / transformations**, not a substitute for “Google reviews”

### Option D — Third-party review widget (category only)

| Concern | Risk |
|---|---|
| Privacy / cookies | Third-party scripts, trackers, consent banners |
| Performance | Extra JS, layout shift, third-party latency |
| Accessibility | Often poor focus/contrast/aria |
| Branding | Vendor chrome vs Studio Pulse |
| Attribution | Must still satisfy Google policies if content is Google-sourced |
| Lock-in / cost | Subscription + migration cost |
| Search | Embedded widgets on the business’s own site remain **self-serving** for Review rich results ([review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)) |

**No vendor recommended in this task.** Prefer first-party Places integration or first-party testimonials over widgets unless product later accepts the trade-offs.

### Comparison table

| Approach | Review coverage | Compliance effort | Runtime cost | Performance | Control | Recommendation |
|---|---|---|---|---|---|---|
| A — Places API | Up to **5** relevance-sorted reviews **per listing** | High (attribution, no illegal cache, disclosure) | Pay-per-Details | Good if server-fetched + cached only Place IDs / short TTL allowed by counsel | High UI control | **Primary path for “Google reviews” UI** |
| B — GBP API | Full corpus (paginated) | Very high (OAuth + ownership) | OAuth ops + quotas | Depends on caching design | High for ops | **Ops / reply tooling**; optional later feed if counsel OK |
| C — First-party | Only consented members | Consent/legal copy | Low | Best | Highest | **Primary for member stories / transformations** |
| D — Widget | Vendor-dependent | Mixed; privacy/a11y often weak | Subscription | Usually worse | Low | **Avoid as default** |

---

## 4. Recommended implementation (when unblocked)

1. Resolve and store **Place IDs only** for four branches.  
2. Implement a **server-side** Place Details fetch for `reviews` (runtime or short-lived cache **only if** counsel confirms an exception; default assumption: **do not persist review text**).  
3. Render a curated selection with required attribution + disclosure.  
4. Separately collect first-party member stories for a future honest evidence route.  
5. Never emit Review/AggregateRating JSON-LD for the studio (ADR-021).

### Proposed Google-review display contract (runtime model)

| Field | Required for display |
|---|---|
| Source branch / Place ID | Yes |
| Author display name | Yes (when API supplies) |
| Author avatar URI | Yes when available; avatar is minimum if space-limited |
| Author profile URI | Yes when available |
| Rating | Yes when present |
| Exact review text | Yes — faithful; no rewrite |
| Original language / translation status | Yes when translated |
| Relative or publish date | Recommended (`relativePublishTimeDescription`) |
| Direct review `googleMapsUri` | Yes |
| Google Maps attribution | Yes |
| Retrieval timestamp | Yes (ops / refresh) |
| Ordering/filtering explanation | Yes (visible) |
| Moderation / health-claim risk flag | Internal |
| Publication status | Internal curation flag |

**Do not** create persistent production CMS rows of API review text until counsel confirms storage is allowed under current Maps Platform terms.

### Review-text rules

- Preserve wording; no grammar “fixes,” merging, invented headlines, or stripping negative context.  
- Do not present reviews as medical/weight-loss evidence.  
- Do not infer programme/branch beyond the Place listing.  
- Do not treat reviewer photos as studio media.  
- Excerpts only with clear truncation + link to full Google review.

### Selection and disclosure

Suggested visible wording:

> Selected reviews from Google Maps. Reviews are shown with their original rating and wording.

Disclose ordering, e.g.:

> Showing a selection of Google Maps reviews (API default order: relevance). Not all reviews are listed here.

Do **not** claim “all / latest / most helpful / verified customers / independently verified” unless the integration truly supports that claim.

Refresh / removal:

- Re-fetch periodically; drop reviews missing from the latest response.  
- If a reviewer edits or deletes on Google, next fetch must reflect that.  
- If Place ID / listing changes, pause display until re-verified.

---

## 5. Structured-data decision

**ADR-021:** Visible Google reviews with attribution are allowed later; **Review**, **AggregateRating**, and rating properties on Organization / ExerciseGym / LocalBusiness **must not** be added. Self-serving reviews on the business’s own site are ineligible for star rich results per Google Search Central review snippet guidelines.

Regression: existing SEO tests already forbid rating/review fields — keep and extend when a reviews UI lands.

---

## 6. Transformation-claim readiness

A Google review ≠ a transformation case study.

Member-story threshold:

- Identifiable consenting member  
- Written publication permission  
- Programme/service used  
- Time period  
- Outcome in the member’s own words  
- Before/after media permission when applicable  
- No guaranteed-result or unsafe medical language  
- No misleading image treatment  

### Route recommendation (do not change now)

| Option | Verdict |
|---|---|
| Immediate rebuild of `/transformations` | **No** |
| `/reviews` alone | Only after Place IDs + Places integration |
| `/member-stories` | Preferred eventual name for first-party evidence |
| Combined Reviews + Member Stories | Acceptable later with clear section separation and source labels |
| **Default now** | **No new standalone public reviews route**; keep `/transformations` preview-gated / honesty-labelled until ≥ **3** publishable first-party stories **or** Places-backed Google review UI is ready |

---

## 7. Google Cloud / credentials (placeholders — do not commit secrets)

| Variable (proposed) | Purpose |
|---|---|
| `GOOGLE_MAPS_API_KEY` or `GOOGLE_PLACES_API_KEY` | Server-side Place Details (restricted key) |
| `GOOGLE_PLACES_ENABLED` | Feature flag |
| `GOOGLE_GBP_CLIENT_ID` / `GOOGLE_GBP_CLIENT_SECRET` / refresh token | **Only if** GBP ops path is approved later |
| Branch content `placeId` | Stored per branch (not a secret) |

Privacy-policy impact before launch: disclose Google Maps Platform data use, attribution, and that reviews are Google user content.

---

## 8. Tasks that can proceed now

- Keep Maps outbound links; do not scrape.  
- Collect Place IDs via official tools once Ankit enables a Cloud project / billing.  
- Draft first-party consent form for member stories.  
- Plan privacy-policy updates.  
- Keep mock testimonials unmounted; plan verified-only filter for `/transformations` before indexable launch.  
- Maintain ADR-021 / SD regression tests.

## 9. Blocked on Ankit or credentials

1. Google Cloud project + billing + Places API (New) enablement.  
2. Place IDs for all four listings + confirmation listings match addresses.  
3. Direct GBP links and ownership confirmation (duplicates?).  
4. Decision: public Google reviews UI vs wait for member stories only.  
5. Consenting members for transformation/member-story content.  
6. Counsel sign-off on any review-text caching beyond Place IDs.  
7. CorelDRAW logo export remains unrelated but still pending from round 2.

---

## Validation (this task)

| Check | Result |
|---|---|
| No Maps scraping dependency added | Pass |
| No review text copied into repo | Pass |
| No reviewer identity persisted | Pass |
| No production review published | Pass |
| No Review/AggregateRating SD added | Pass (ADR-021 documents prohibition) |
| Frozen design-lab prototypes unchanged | Pass |
| Application code unchanged | Pass (docs + ADR only) |
