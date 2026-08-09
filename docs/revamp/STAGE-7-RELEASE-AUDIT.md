# Stage 7 — Release audit

Production path: `NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false/unset`. Judged against a professional marketing release bar — not every improvement idea.

| ID | Sev | Area | Finding | Required fix |
|---|---|---|---|---|
| R-01 | P1 | Brand | Favicon ladder in `public/brand/` unwired; `favicon.ico` is default Next asset; manifest points at weak icon set | Wire brand icons + apple-touch; update manifest theme to Studio Pulse dark |
| R-02 | P1 | Brand | Temporary transparent symbol is correct for chrome; lockups retain white field (must not use on dark Pulse) | Keep transparent symbol; document temporary export status |
| R-03 | P1 | Social | OG image is placeholder text only — unfinished social share | Brand-only 1200×630 OG (symbol + verified facts) |
| R-04 | P1 | Metadata | Root `baseMetadata` omits icons / applicationName; default description stale vs four-branch reality | Align root metadata + customer-facing description |
| R-05 | P1 | Environment | Synthetic media can be built for Vercel Production without a hard gate | Fail real production release when synthetic or ALLOW_MOCK_PUBLISH is true |
| R-06 | P1 | Security | No marketing-site security headers | Add nosniff, Referrer-Policy, frame options, Permissions-Policy (CSP deferred P2) |
| R-07 | P1 | Redirects | `/book-a-free-trial` uses App Router soft redirect (not permanent config) | Permanent redirect in `next.config` |
| R-08 | P2 | Structured data | Organization lacks `logo`; PostalAddress omits `addressCountry` | Add logo URL + `IN` where address verified |
| R-09 | P2 | Metadata | Branch titles functional but not as clear as “Ankit’s Studio {locality}” pattern | Soften titles for clarity without stuffing |
| R-10 | P2 | Legal | Privacy/Terms not rewritten — spot-check only | Flag counsel review; fix only placeholder/leak issues |
| R-11 | P3 | CSP | No Content-Security-Policy | Document as post-V1 (untested CSP risks Next) |
| R-12 | P3 | Sitemap | No lastmod/changefreq | Omit theatre; optional later |

**Fix in Stage 7:** all P0 (none found) and P1 rows. P2 where low-risk and in scope.
