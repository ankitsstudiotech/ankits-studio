// QA-only. Independent trust-boundary / content-lock sweep for the "final
// editorial art direction" audit. Fetches every live production route's
// rendered HTML, strips it to visible text, and greps for banned reference
// leaks (Variant/Stitch copy per FINAL_ART_DIRECTION_BLUEPRINT.md §2 / the
// brief's §3 trust gate) plus a spot-check of real facts against
// docs/BUSINESS-DATA-STATUS.md. Not application code. Read-only against
// production; writes only under this docs/ directory.
import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "data");
const BASE_URL = "https://ankits-studio.vercel.app";

// Same route set as docs/visual-audit/claude-independent/scan.mjs, plus the
// chrome-only withheld routes, the /book-a-free-trial redirect target, and a
// deliberate 404 probe — full site, not the 17-route sample Cursor's own
// capture script used.
const ROUTES = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/home-personal-training",
  "/programs/online-training",
  "/programs/zumba",
  "/programs/yoga",
  "/programs/adult-dance",
  "/programs/wedding-choreography",
  "/programs/corporate-wellness",
  "/locations",
  "/locations/airoli-sector-19",
  "/locations/airoli-sector-8",
  "/locations/ghansoli",
  "/locations/thane",
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/trainers",
  "/transformations",
  "/blog",
  "/book-a-free-trial",
  "/this-route-does-not-exist-audit-probe",
];

// Blueprint §2 / brief §3 banned Variant/Stitch leaks. Case-insensitive,
// matched against visible text only (not raw HTML/attributes/JSON-LD, which
// would false-positive on unrelated markup).
const BANNED_PHRASES = [
  "Movement Culture",
  "Movement Redefined",
  "Kickboxing",
  "Yoga & Mindfulness",
  "Zumba & Dance", // as a single merged programme name; production's real "Zumba" and "Adult Dance" are distinct
  "Online Coaching",
  "Claim Free Trial",
  "Initiate Protocol",
  "METRO",
];

function slugify(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_") || "root";
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();

  const results = [];

  for (const route of ROUTES) {
    const url = BASE_URL + route;
    let status = null;
    let finalUrl = null;
    let visibleText = "";
    let error = null;
    try {
      const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      status = resp ? resp.status() : null;
      finalUrl = page.url();
      await page.waitForTimeout(300);
      visibleText = await page.evaluate(() => document.body.innerText || "");
    } catch (e) {
      error = String(e);
    }

    const hits = BANNED_PHRASES.filter((phrase) =>
      visibleText.toLowerCase().includes(phrase.toLowerCase())
    );

    results.push({
      route,
      url,
      finalUrl,
      status,
      redirected: finalUrl && finalUrl !== url,
      error,
      textLength: visibleText.length,
      bannedPhraseHits: hits,
      // First 4000 chars retained for manual fact spot-check (branch names,
      // addresses, founder identity) against BUSINESS-DATA-STATUS.md — not
      // the full text, to keep the JSON reviewable.
      textSample: visibleText.slice(0, 4000),
    });

    console.log(
      `${route} -> status=${status} redirected=${finalUrl !== url} hits=${hits.length}`
    );
  }

  await browser.close();

  const totalHits = results.reduce((s, r) => s + r.bannedPhraseHits.length, 0);
  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    routeCount: ROUTES.length,
    totalBannedPhraseHits: totalHits,
    routesWithHits: results.filter((r) => r.bannedPhraseHits.length > 0).map((r) => r.route),
    routesWithErrors: results.filter((r) => r.error).map((r) => r.route),
  };

  await writeFile(
    path.join(OUT, "content-lock-results.json"),
    JSON.stringify({ summary, results }, null, 2),
    "utf8"
  );

  console.log("\n=== CONTENT-LOCK SUMMARY ===");
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
