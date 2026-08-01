# Mock preview deployment

How to share a **private / stakeholder-facing** build of Ankit's Studio that
uses mock content safely: visually labelled, `noindex`/`nofollow`, no production
domain, no fake analytics, and no fake lead delivery.

Related: [LAUNCH-READINESS.md](./LAUNCH-READINESS.md), [BUSINESS-DATA-STATUS.md](./BUSINESS-DATA-STATUS.md), [DECISIONS.md](./DECISIONS.md) ADR-002 / ADR-011.

---

## Goals

| Requirement | How it is enforced |
|---|---|
| Mock mode visually labelled | Non-dismissable `MockModeIndicator` banner site-wide when unverified content exists and `ALLOW_MOCK_PUBLISH=true` (or local `development`) |
| Every page `noindex, nofollow` | `shouldNoIndex()` → `buildRobotsMeta()` on `baseMetadata` (and per-page metadata built from it) |
| `robots.txt` discourages crawling | `Disallow: /` for `User-agent: *`; **no sitemap URL** while blocked |
| Sample blog `noindex` | `/blog` and `/blog/[slug]` pass `forceNoIndex: true` even after other domains verify |
| No production custom domain | Do not attach a custom domain to the preview project / preview env |
| No fake analytics | Do not set analytics env vars; none are wired in this codebase for preview |
| No fake lead delivery | Leave `LEAD_PROVIDER_URL` unset → demonstration-mode mock adapter |
| Trial form states demonstration mode | `/trial` badge + form callout + consent copy when `isLeadDemonstrationMode()` |
| Banner only removable via verified content | No dismiss UI; banner renders iff `siteHasUnverifiedContent` |

---

## Required environment variables

### Must set (Vercel Preview / Production *preview* target)

| Variable | Value | Purpose |
|---|---|---|
| `ALLOW_MOCK_PUBLISH` | `true` | Lets `next build` succeed while mock content exists. **Does not** enable indexing. |

### Optional

| Variable | Guidance |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Prefer the automatic `*.vercel.app` URL Vercel assigns. Used for canonical/OG `metadataBase`. **Do not** set a production custom domain for mock preview. Safe to leave unset (falls back to `http://localhost:3000`). |

### Must remain unset for demonstration mode

| Variable | Why |
|---|---|
| `LEAD_PROVIDER_URL` | If unset (with `ALLOW_MOCK_PUBLISH=true`), trial/contact use the mock adapter and show **Demonstration mode**. Do not invent a fake provider URL. |

### Do not add

- Analytics / GTM / GA / Meta Pixel / similar IDs  
- Production custom-domain DNS for this preview  
- Secrets that imply live CRM delivery  

Copy template: [`.env.example`](../.env.example).

---

## Exact Vercel preview deployment process

### One-time project setup

1. Push the repo to GitHub (or GitLab / Bitbucket) if it is not already connected.
2. In [Vercel](https://vercel.com): **Add New… → Project** → import the repository.
3. Framework preset: **Next.js** (auto-detected).
4. **Root Directory**: repository root (default).
5. **Do not** add a production custom domain to this project while it is mock-only. Use the default `*.vercel.app` hostnames.
6. Under **Settings → Environment Variables**, for the **Preview** environment (and only if you intentionally use a Production deployment for mock sharing — still without a custom domain):

   | Name | Value | Environments |
   |---|---|---|
   | `ALLOW_MOCK_PUBLISH` | `true` | Preview (required). Optionally Production **only** if that deployment is explicitly a mock share — still no custom domain, still noindex. |
   | `NEXT_PUBLIC_SITE_URL` | leave empty **or** set after first deploy to the concrete `https://….vercel.app` URL | Preview |
   | `LEAD_PROVIDER_URL` | **do not create** | — |

7. Confirm there are **no** analytics-related environment variables.
8. Deploy.

### Every subsequent preview

1. Open a pull request **or** push to a branch tracked by Vercel Preview.
2. Wait for the Vercel deployment to finish (build must see `ALLOW_MOCK_PUBLISH=true` or the production build will fail on unverified content).
3. Open the deployment URL (`https://<project>-<branch>-<team>.vercel.app`).
4. Run the [Preview verification checklist](#preview-verification-checklist) below before sharing the link with stakeholders.
5. Share the **Preview** URL only (password-protect the deployment in Vercel if the stakeholder audience must stay private — **Deployment Protection** / Vercel Authentication).

### Local preview equivalent

```bash
# PowerShell: ensure a sticky ALLOW_MOCK_PUBLISH from an earlier session is intentional
$env:ALLOW_MOCK_PUBLISH = "true"
# Do not set LEAD_PROVIDER_URL
npm run build
npm start
```

Or use `npm run dev` for day-to-day work (banner + noindex still apply via `shouldNoIndex()`).

### Negative check (CI / before calling a build “production-ready”)

```bash
# PowerShell — must fail while mock content remains
Remove-Item Env:ALLOW_MOCK_PUBLISH -ErrorAction SilentlyContinue
npm run build   # expect exit 1
```

---

## What stakeholders should see

1. Top **Mock preview** (or **Development preview**) banner — not dismissible.  
2. Mock / placeholder disclaimers on high-risk fields (addresses, phones, prices, trainers, etc.).  
3. Disabled call / WhatsApp / map actions until branches are verified.  
4. `/trial` clearly labelled **Demonstration mode**.  
5. Sample blog posts labelled **Sample · noindex**.

---

## Preview verification checklist

Complete before sending a Vercel Preview URL to stakeholders.

### Build & environment

- [ ] Vercel Preview env has `ALLOW_MOCK_PUBLISH=true`
- [ ] `LEAD_PROVIDER_URL` is **not** set on Preview
- [ ] No analytics / pixel env vars are set
- [ ] No production custom domain is attached to this mock share
- [ ] Deployment build succeeded on Vercel

### Visual / content labelling

- [ ] Site-wide mock banner is visible on `/`
- [ ] Banner has **no** close / dismiss control
- [ ] Banner copy mentions mock/unverified content and noindex
- [ ] Branch / programme mock disclaimers still appear where expected
- [ ] Thane (if opened) remains clearly unconfirmed / non-public in nav

### Indexing / crawl discouragement

- [ ] View page source or DevTools → `<meta name="robots" content>` includes **noindex** and **nofollow** on `/`, `/programs`, `/locations`, `/trial`, `/contact`
- [ ] `/blog` and a sample `/blog/[slug]` are **noindex** (and labelled Sample)
- [ ] `https://<preview>/robots.txt` contains `Disallow: /` for `User-agent: *`
- [ ] `robots.txt` does **not** advertise a sitemap URL while in mock mode
- [ ] `https://<preview>/sitemap.xml` is empty (no URL entries) while unverified content exists

### Forms / leads

- [ ] `/trial` shows **Demonstration mode** badge and in-form callout
- [ ] Consent text explains details are not sent to a live inbox
- [ ] Submitting a valid trial in preview yields a **mock / local** success message (not “sent to the studio”)
- [ ] `/contact` does not claim live delivery without a provider

### Smoke routes

- [ ] `/` loads
- [ ] `/programs` and one programme detail load
- [ ] `/locations/airoli` loads; contact actions disabled if unverified
- [ ] `/timetable` filters still work (GET)
- [ ] Mobile menu opens full-height with visible links
- [ ] 404 page still returns HTTP 404 with site chrome

### Sharing

- [ ] Link shared is the Vercel Preview URL (or Deployment Protection URL), not a custom production domain
- [ ] Stakeholders are told the site is a **mock preview**, not the live studio site

---

## After owner verification (leaving mock preview)

1. Flip verified domains in `src/content` + `docs/BUSINESS-DATA-STATUS.md` together.  
2. When `siteHasUnverifiedContent` is false, the mock banner disappears automatically.  
3. Remove `ALLOW_MOCK_PUBLISH` from the real production environment (or set it unset).  
4. Set production `NEXT_PUBLIC_SITE_URL` to the real domain.  
5. Configure a **real** `LEAD_PROVIDER_URL` only when a real adapter exists.  
6. Re-run [LAUNCH-READINESS.md](./LAUNCH-READINESS.md) before indexing.

---

## Command reference

```bash
npm run lint
npm run type-check
npm test
# Preview-capable build:
#   ALLOW_MOCK_PUBLISH=true npm run build
# Gate still blocks accidental production:
#   (unset ALLOW_MOCK_PUBLISH) npm run build   → exit 1
```
