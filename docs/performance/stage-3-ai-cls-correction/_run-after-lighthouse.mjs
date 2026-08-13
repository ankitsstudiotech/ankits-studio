/**
 * After-fix Lighthouse: Home mobile ×5, Functional mobile ×3, Home desktop ×1.
 * Usage: BASE_URL=http://localhost:3007 node docs/performance/stage-3-ai-cls-correction/_run-after-lighthouse.mjs
 */
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { chromium, devices } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3007";
const TMP = join(process.cwd(), "docs/revamp/_lh-tmp");
const OUT = join(process.cwd(), "docs/performance/stage-3-ai-cls-correction/after-metrics.json");

function median(nums) {
  const s = nums.filter((n) => typeof n === "number" && !Number.isNaN(n)).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function runLighthouse(url, preset) {
  const out = join(TMP, `after-${preset}-${Date.now()}.json`);
  const cmd = `npx --yes lighthouse "${url}" --quiet --chrome-flags="--headless --no-sandbox" --output=json --output-path="${out}" --preset=${preset} --only-categories=performance`;
  execSync(cmd, { stdio: "pipe", env: process.env });
  const report = JSON.parse(readFileSync(out, "utf8"));
  const a = report.audits;
  const shift = a["layout-shifts"]?.details?.items?.[0];
  return {
    fcpMs: a["first-contentful-paint"]?.numericValue ?? null,
    lcpMs: a["largest-contentful-paint"]?.numericValue ?? null,
    cls: a["cumulative-layout-shift"]?.numericValue ?? null,
    tbtMs: a["total-blocking-time"]?.numericValue ?? null,
    lcpSelector: a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.selector
      ?? a["largest-contentful-paint-element"]?.displayValue
      ?? null,
    clsCulprit: shift?.node?.selector ?? null,
    reportFile: out,
  };
}

async function playwrightCls(path) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices["iPhone 13"],
    viewport: { width: 390, height: 844 },
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__cls = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      });
      po.observe({ type: "layout-shift", buffered: true });
    } catch { /* ignore */ }
  });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(5000);
  const total = await page.evaluate(() => window.__cls ?? 0);
  const h1 = await page.evaluate(() => {
    const el = document.querySelector("h1");
    if (!el) return null;
    const s = getComputedStyle(el);
    return { text: el.textContent?.trim(), opacity: s.opacity, visibility: s.visibility };
  });
  await browser.close();
  return { total, h1 };
}

async function main() {
  await mkdir(TMP, { recursive: true });
  const homeRuns = [];
  for (let i = 0; i < 5; i++) homeRuns.push(runLighthouse(`${BASE}/`, "perf"));
  const functionalRuns = [];
  for (let i = 0; i < 3; i++) functionalRuns.push(runLighthouse(`${BASE}/programs/functional-training`, "perf"));
  const homeDesktop = runLighthouse(`${BASE}/`, "desktop");
  const homePw = await playwrightCls("/");
  const functionalPw = await playwrightCls("/programs/functional-training");

  const report = {
    capturedAt: new Date().toISOString(),
    baseUrl: BASE,
    homeMobileRuns: homeRuns,
    homeMobileMedian: {
      fcpMs: median(homeRuns.map((r) => r.fcpMs)),
      lcpMs: median(homeRuns.map((r) => r.lcpMs)),
      cls: median(homeRuns.map((r) => r.cls)),
      tbtMs: median(homeRuns.map((r) => r.tbtMs)),
    },
    functionalMobileRuns: functionalRuns,
    functionalMobileMedian: {
      fcpMs: median(functionalRuns.map((r) => r.fcpMs)),
      lcpMs: median(functionalRuns.map((r) => r.lcpMs)),
      cls: median(functionalRuns.map((r) => r.cls)),
      tbtMs: median(functionalRuns.map((r) => r.tbtMs)),
    },
    homeDesktop1440: homeDesktop,
    homePlaywrightCls: homePw,
    functionalPlaywrightCls: functionalPw,
  };
  await writeFile(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    homeMedian: report.homeMobileMedian,
    functionalMedian: report.functionalMobileMedian,
    homePw: homePw.total,
    functionalPw: functionalPw.total,
    h1: homePw.h1,
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
