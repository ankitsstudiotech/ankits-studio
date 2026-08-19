# Google Reviews — V1 strategy

Ankit’s Studio may later surface Google customer feedback. Until Places/GBP integration and consent rules are live, the site uses outbound Maps proof only.

## NOW (Stage 6 / V1)

- Every publicly listed branch exposes an owner-provided Google Maps URL.
- Launch social proof: see [GOOGLE-REVIEWS-LAUNCH-IMPLEMENTATION-2026-08-13.md](./GOOGLE-REVIEWS-LAUNCH-IMPLEMENTATION-2026-08-13.md).
- Until a server-side `GOOGLE_PLACES_API_KEY` and verified Place IDs exist, the homepage uses outbound Maps links only (no quotes, stars, or counts).
- Do **not** scrape Google.
- Do **not** emit `Review` / `AggregateRating` JSON-LD.
- Opening a Maps short link typically shows the listing (and often reviews from there). We do **not** promise a dedicated reviews screen.

## LATER — Option A (preferred for a small sample)

- Google Places API (New) / Place Details for an approved live sample.
- Strict attribution and moderation.
- Manual allowlist of which reviews may appear.

## LATER — Option B

- Google Business Profile API if Ankit supplies ownership/OAuth and broader review management is required.

## First-party member stories

- Consented member stories / transformations remain preferred for deeper case studies.
- `/transformations` stays noindex until publishable evidence exists.

## Hard rules

- No scraping.
- No fake testimonials to fill empty space.
- No “5-star” marketing without verified live data and attribution.
