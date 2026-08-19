# Stage 8 — Final defect ledger

Checkpoint: `studio-pulse-before-final-stage-8` @ `3267969`  
Audit base: production `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false` · `next start`

Only objectively observed defects. No manufactured findings.

| ID | severity | route | viewport | visual defect | fix | evidence |
|---|---|---|---|---|---|---|
| S8-01 | P1 | `/programs/[slug]`, `/locations/[slug]`, `/trainers/[slug]` | all | Unknown slugs returned HTTP **200** soft shells (`x-nextjs-prerender`) instead of hard 404; blog already correct via `dynamicParams=false` | Set `dynamicParams = false` on programmes, locations, trainers; trainer metadata calls `notFound()` | `STAGE-8-RELEASE-CRAWL.json` pre-fix; fetch status 200→404 after rebuild |
| S8-02 | P1 | `/` | 390×844 | H1 second line (“DANCE”) baseline clipped by `.motion-mask-line { overflow:hidden }` + tight `line-height: 0.92` | Increase mask padding-bottom; hero title `line-height: 0.98` | `vp-390x844__home.png` |
| S8-03 | P2 | `/programs/*`, `/locations/*` | desktop/mobile | Primary nav did not mark Programmes/Locations active on child routes | Prefix-aware `aria-current` in DesktopNav + MobileNav | Functional Training snapshot (Programmes not current) |
| S8-04 | P3 | programme closing copy | a11y tree | Apparent space before period in “Functional Training .” (React text node + a11y serialization); source template is correct | No code change | a11y snapshot on Functional |
| S8-05 | P3 | text-led desktop heroes | 1440+ | Large right-side empty field when synthetic media off | Accepted — intentional Stage 4/7 text-led production state until real media | `vp-1440x900__programs__yoga.png` |
| S8-06 | P3 | home / programmes | all | Header CTA + in-page WhatsApp CTA both visible above fold | Accepted — primary conversion redundancy is intentional | Home/Functional screenshots |
| S8-07 | P2 | test infra | n/a | Vitest jsdom broke named `node:fs`/`node:path` imports in route/SEO source-read suites | `environmentMatchGlobs` → node for `tests/routes/**/*.test.ts` and `tests/seo/**/*.test.ts` | `npx vitest run` 303 pass |

## Not defects

- No synthetic “AI concept preview” in production crawl (0)
- No horizontal overflow in crawl (0)
- No mock banner
- Blog sample posts already hard-404
- Trailing empty canvas on desktop without photography is production-truth, not a layout bug

## Post-fix acceptance

P0 = 0 · P1 = 0 after S8-01 and S8-02 land.
