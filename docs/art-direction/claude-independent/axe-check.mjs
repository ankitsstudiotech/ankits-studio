// QA-only. Independent axe-core accessibility sweep against LIVE production
// (not a local build) — the actual audit target per the brief. Reports
// serious/critical violations per route, plus a full contrast-violation dump
// (used to independently verify/refute the self-reported --color-accent-label
// contrast fix). Not application code.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "data");
const BASE_URL = "https://ankits-studio.vercel.app";

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
];

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (const route of ROUTES) {
    await page.goto(BASE_URL + route, { waitUntil: "networkidle", timeout: 45000 }).catch(() =>
      page.goto(BASE_URL + route, { waitUntil: "load", timeout: 45000 })
    );
    await page.waitForTimeout(300);
    const axeResults = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = axeResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );
    const contrastViolations = axeResults.violations.filter((v) => v.id === "color-contrast");

    results.push({
      route,
      violationCount: axeResults.violations.length,
      seriousOrCriticalCount: seriousOrCritical.length,
      seriousOrCritical: seriousOrCritical.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => ({ target: n.target, failureSummary: n.failureSummary })),
      })),
      contrastViolations: contrastViolations.map((v) => ({
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, failureSummary: n.failureSummary })),
      })),
    });

    console.log(
      `${route} -> serious/critical=${seriousOrCritical.length} contrast=${contrastViolations.length}`
    );
  }

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalSeriousOrCritical: results.reduce((s, r) => s + r.seriousOrCriticalCount, 0),
    routesWithSeriousOrCritical: results.filter((r) => r.seriousOrCriticalCount > 0).map((r) => r.route),
    routesWithContrastViolations: results.filter((r) => r.contrastViolations.length > 0).map((r) => r.route),
  };

  await writeFile(
    path.join(OUT, "axe-results.json"),
    JSON.stringify({ summary, results }, null, 2),
    "utf8"
  );

  console.log("\n=== AXE SUMMARY ===");
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
