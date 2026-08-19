# Production handoff — Owner-final public V1

**2026-08-13.** This is the operator record for Ankit’s Studio **public V1**.
There is no Stage 9 and no further redesign cycle.

Visual audit: `docs/revamp/FINAL-PRODUCTION-VISUAL-AUDIT-2026-08-13.md`  
Prior premium-public snapshot: `docs/PRODUCTION-HANDOFF-PREMIUM-V1.md`

---

## Release identity

| Item | Value |
|------|--------|
| Production URL | https://ankits-studio.vercel.app |
| Sitemap | https://ankits-studio.vercel.app/sitemap.xml |
| Robots | https://ankits-studio.vercel.app/robots.txt |
| Branch | `revamp/studio-pulse-production` |
| Pre-release checkpoint | `studio-pulse-before-final-production-release-2026-08-13` @ `68c54d4e965f6143ffb0310c22cabd40974a7482` |
| Release SHA | `1ec03dbf2d322bcc4e6ea03b9d925e22f4c585ca` |
| Release tag | `studio-pulse-v1.2.0-owner-final` |
| Vercel project | `ankits-studio` (`prj_EKgqdkrNyE7xg3xuXjH1L6z6wzNW`) |
| Deployment ID | `dpl_43vfWXFAxxGAAjZK9ghVedmnLXQW` |
| Deploy URL | https://ankits-studio-1y3s98kd5-anikets-projects-c8b8ce46.vercel.app |
| Aliased | https://ankits-studio.vercel.app |
| Deployed | 2026-08-13T16:24:00Z (READY) |
| Live screenshots | `docs/revamp/screenshots/live-owner-final-2026-08-13/` |
| Google Reviews mode | `external-links` (no Places key; 0/4 Place IDs) |
| Live CLS (390×844, 5s) | Home 0 · Functional 0 · Corporate 0 |

---

## Vercel Production environment contract

| Variable | Production |
|----------|------------|
| `NEXT_PUBLIC_SITE_URL` | `https://ankits-studio.vercel.app` (until a custom domain exists) |
| `ALLOW_MOCK_PUBLISH` | **Unset** |
| `ANKITS_CONCEPT_PREVIEW` | **Unset** |
| `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA` | **Unset / not true** |
| `GOOGLE_PLACES_API_KEY` | **Absent** — correct for V1 |
| `LEAD_PROVIDER_URL` | Unset (WhatsApp-first) |
| Analytics | None until owner-approved |

`VERCEL_ENV=production` already trips `assertProductionReleaseSafe()`. Do not add mock-publish or synthetic flags “to see images” — owner-approved `illustrative-ai` renders without them.

Local release simulation:

```
ALLOW_MOCK_PUBLISH unset
ANKITS_CONCEPT_PREVIEW unset
NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA unset
NEXT_PUBLIC_SITE_URL=https://ankits-studio.vercel.app
ANKITS_PRODUCTION_RELEASE=true
```

The yellow “Development preview…” banner is **development / mock-publish chrome only**. It must never be hidden with CSS.

---

## Programme taxonomy (8)

| Cluster | Programme | Conversion |
|---------|-----------|------------|
| Train | Functional Training | Free trial WhatsApp |
| Train | Home Personal Training | Free trial WhatsApp |
| Train | Online Training | Free trial WhatsApp |
| Move | Zumba | Free trial WhatsApp |
| Move | Yoga | Free trial WhatsApp |
| Celebrate | Dance | Free trial WhatsApp |
| Celebrate | Wedding Choreography | Free trial WhatsApp |
| For Teams | Corporate Wellness | Service enquiry WhatsApp |

---

## Branches

Airoli Sector 19 · Airoli Sector 8 · Ghansoli · Thane

Hours: 6:00 AM–10:00 PM daily. Maps via owner-confirmed `maps.app.goo.gl` URLs.

---

## Conversion

| Channel | Value |
|---------|-------|
| WhatsApp | `919372402074` (`https://wa.me/919372402074`) |
| Phone | `+919372402074` |
| Email | `ankitsstudio5@gmail.com` |
| Instagram | https://www.instagram.com/ankitsstudio |
| YouTube | https://youtube.com/@ankitsstudio |

Header CTA remains **Book a free trial on WhatsApp**. Corporate sticky CTA is **For teams / Enquire on WhatsApp**.

---

## AI-media policy

Owner-approved **illustrative-ai** catalogue is public production media.
One global footer disclosure. No per-image “AI concept preview”.

Trust boundary — never AI:

- founder portrait
- named trainer portraits
- named branch interiors portrayed as factual
- reviewer portraits / testimonials
- transformations
- certifications

Replacement map: `docs/media/FUTURE-PHOTOSHOOT-REPLACEMENT-MAP.md`

---

## Google Reviews

Launch mode **`external-links`**. Heading **Reviews on Google**. No quotes, stars, counts, or avatars. Four **View on Google** actions.

Future **`live-google-reviews`** (Places key + verified Place IDs) may use **What members say** because review text then exists. Do not merge the two titles.

Steps when credentials exist: `docs/business/GOOGLE-REVIEWS-LAUNCH-IMPLEMENTATION-2026-08-13.md`

---

## Indexable public routes (22)

`/` · `/about` · `/programs` · 8 programme details · `/locations` · 4 branches · `/pricing` · `/timetable` · `/trial` · `/contact` · `/privacy-policy` · `/terms`

Redirects (direct 308): `/book-a-free-trial` → `/trial` · `/locations/airoli` → `/locations/airoli-sector-19`

---

## Noindex / withheld

`/trainers` · `/transformations` · `/blog` (and sample articles 404)  
Legacy programmes: `/programs/strength-training`, `/personal-training`, `/kids-dance`, `/weight-loss-fitness` — noindex + updated-programme notice  
Frozen design-lab: `/design-lab/revamp-a|b|c` — noindex/nofollow, out of sitemap and public nav, **do not delete**

---

## Deployment process

1. Working tree clean on `revamp/studio-pulse-production`.
2. Confirm Production env matches the contract above.
3. `npx vercel --prod` against project `ankits-studio` (this repo’s `.vercel/project.json`).
4. Wait READY. Verify live origin, not the CLI preview hostname.
5. Smoke: home, 8 programmes, 4 branches, pricing, timetable, trial, contact, legal, robots, sitemap, WhatsApp/tel/email/Maps, no mock banner, AI images present, Google fallback honest.

Rollback: Vercel → previous successful Production deployment, or tag `studio-pulse-before-final-production-release-2026-08-13`.

---

## Post-V1 backlog (does not block this launch)

See `docs/OWNER-INPUT-BACKLOG.md`. Headline items:

- Google Places key + Place IDs → live quotes
- Real photoshoot / video (replace illustrative-ai)
- Trainer profiles when names/photos/consent exist
- Member stories with consent
- Exact batch timetable rows
- Custom domain
- Field CWV monitoring
- Official CDR→SVG logo if still pending
- Legal counsel pass on Privacy / Terms
- Lab TBT (known P2 — do not reopen an optimization cycle for it)
- TTEA (strategic only — no public route)
