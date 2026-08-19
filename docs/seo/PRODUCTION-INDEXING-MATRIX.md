# Production indexing matrix

**Updated:** 2026-08-09 (Stage 7)  
**Origin:** `NEXT_PUBLIC_SITE_URL` (production: `https://ankits-studio.vercel.app`)  
**Gate:** Indexable only when `NODE_ENV=production`, launch-critical content verified, and `ALLOW_MOCK_PUBLISH` unset/false.

| Route / pattern | HTTP | index/follow | Canonical | Sitemap | Reason |
|---|---|---|---|---|---|
| `/` | 200 | index | `/` | yes | Home |
| `/about` | 200 | index | `/about` | yes | About |
| `/programs` | 200 | index | `/programs` | yes | Programme index |
| `/programs/{confirmed}` | 200 | index | programme path | yes | Confirmed taxonomy |
| `/programs/{migration-pending}` | 200 | **noindex** | self | **no** | Legacy review routes |
| `/locations` | 200 | index | `/locations` | yes | Locations index |
| `/locations/{4 branches}` | 200 | index | branch path | yes | Verified public branches |
| `/locations/airoli` | **308** → `/locations/airoli-sector-19` | — | destination | — | Legacy alias |
| `/timetable` | 200 | index | `/timetable` | yes | Batch availability |
| `/pricing` | 200 | index | `/pricing` | yes | Commercial |
| `/trial` | 200 | index | `/trial` | yes | Free trial |
| `/book-a-free-trial` | **308** → `/trial` | — | destination | — | Alias |
| `/contact` | 200 | index | `/contact` | yes | Contact |
| `/privacy-policy` | 200 | index | `/privacy-policy` | yes | Legal |
| `/terms` | 200 | index | `/terms` | yes | Legal |
| `/trainers` | 200 | **noindex** | self | **no** | Below profile threshold |
| `/trainers/{slug}` | 404 / noindex | **noindex** | — | **no** | No publishable profiles |
| `/transformations` | 200 | **noindex** | self | **no** | No consented stories |
| `/blog` | 200 | **noindex** | self | **no** | ADR — hub withheld |
| `/blog/{sample}` | **404** | — | — | **no** | Sample fixtures not public |
| `/design-lab/*` | 200 | **noindex** + robots disallow | — | **no** | Internal only |
| Unknown slugs | **404** | noindex | — | **no** | Soft-404 avoided |

Robots when indexable: `Allow: /`, disallow `/design-lab`, Sitemap absolute URL.  
When `shouldNoIndex()`: disallow all, empty sitemap.
