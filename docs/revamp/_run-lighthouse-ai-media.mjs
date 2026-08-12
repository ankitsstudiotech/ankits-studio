/**
 * Lighthouse performance audit for illustrative-ai production build.
 * Usage: BASE_URL=http://localhost:3004 node docs/revamp/_run-lighthouse-ai-media.mjs
 */
import { readFileSync } from "node:fs";
import { writeFile, stat, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { chromium, devices } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = join(process.cwd(), "docs/revamp/AI-MEDIA-PERFORMANCE-RESULTS.json");
const TMP = join(process.cwd(), "docs/revamp/_lh-tmp");

function median(nums) {
  const s = nums.filter((n) => typeof n === "number" && !Number.isNaN(n)).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function runLighthouse(url, preset) {
  const out = join(TMP, `${preset}-${Date.now()}.json`);
  const cmd = `npx --yes lighthouse "${url}" --quiet --chrome-flags="--headless --no-sandbox" --output=json --output-path="${out}" --preset=${preset} --only-categories=performance`;
  execSync(cmd, { stdio: "pipe", env: process.env });
  const report = JSON.parse(readFileSync(out, "utf8"));
  const a = report.audits;
  return {
    fcpMs: a["first-contentful-paint"]?.numericValue ?? null,
    lcpMs: a["largest-contentful-paint"]?.numericValue ?? null,
    cls: a["cumulative-layout-shift"]?.numericValue ?? null,
    tbtMs: a["total-blocking-time"]?.numericValue ?? null,
    lcpElement: a["largest-contentful-paint-element"]?.displayValue ?? null,
  };
}

async function identifyLcpElement() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(2000);
  const lcpInfo = await page.evaluate(() => {
    return new Promise((resolve) => {
      let last = null;
      try {
        const po = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          last = entries[entries.length - 1] ?? last;
        });
        po.observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => {
          po.disconnect();
          if (!last) return resolve({ element: null, size: null, url: null });
          const el = last.element;
          resolve({
            tag: el?.tagName ?? null,
            id: el?.id ?? null,
            className: el?.className ? String(el.className).slice(0, 120) : null,
            text: el?.textContent?.trim().slice(0, 120) ?? null,
            size: last.size,
            url: last.url ?? null,
          });
        }, 1500);
      } catch (e) {
        resolve({ error: String(e) });
      }
    });
  });
  const h1 = await page.evaluate(() => {
    const el = document.querySelector("h1");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return { text: el.textContent?.trim(), opacity: s.opacity, visibility: s.visibility, width: r.width, height: r.height };
  });
  await browser.close();
  return { lcpInfo, h1FirstPaint: h1 };
}

async function networkConsoleAudit() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const routes = ["/", "/programs/functional-training", "/programs/yoga", "/about", "/locations"];
  const results = [];
  for (const path of routes) {
    const failedImages = [];
    const consoleErrors = [];
    page.removeAllListeners("response");
    page.removeAllListeners("requestfailed");
    page.removeAllListeners("console");
    page.on("response", (res) => {
      if (res.request().resourceType() === "image" && res.status() >= 400) {
        failedImages.push({ url: res.url(), status: res.status() });
      }
    });
    page.on("requestfailed", (req) => {
      if (req.resourceType() === "image") failedImages.push({ url: req.url(), error: req.failure()?.errorText });
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
    const brokenDom = await page.evaluate(
      () => [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
    );
    results.push({ path, failedImages, brokenDom, consoleErrors: consoleErrors.slice(0, 10) });
  }
  await browser.close();
  return results;
}

async function heroDeliveryAudit() {
  const cataloguePath = join(process.cwd(), "public/media/synthetic-preview/home-hero-ai-concept.webp");
  const sourceAssetBytes = (await stat(cataloguePath)).size;
  const browser = await chromium.launch();
  const auditRoute = async (path, viewport) => {
    const page = await browser.newPage();
    await page.setViewportSize(viewport);
    const images = [];
    page.on("response", (res) => {
      if (res.request().resourceType() === "image") {
        images.push({
          url: res.url(),
          status: res.status(),
          contentType: res.headers()["content-type"],
          bytes: Number(res.headers()["content-length"] || 0),
        });
      }
    });
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
    return images.filter((i) => i.status === 200);
  };
  const homeMobile = await auditRoute("/", { width: 390, height: 844 });
  const homeDesktop = await auditRoute("/", { width: 1440, height: 900 });
  const functionalMobile = await auditRoute("/programs/functional-training", { width: 390, height: 844 });
  const yogaMobile = await auditRoute("/programs/yoga", { width: 390, height: 844 });
  await browser.close();
  return { sourceAssetBytes, homeMobile, homeDesktop, functionalMobile, yogaMobile };
}

async function main() {
  await mkdir(TMP, { recursive: true });
  const homeMobileRuns = [];
  for (let i = 0; i < 3; i++) homeMobileRuns.push(runLighthouse(`${BASE}/`, "perf"));
  const homeDesktop = runLighthouse(`${BASE}/`, "desktop");
  const functionalMobile = runLighthouse(`${BASE}/programs/functional-training`, "perf");
  const lcpDetail = await identifyLcpElement();
  const network = await networkConsoleAudit();
  const heroDelivery = await heroDeliveryAudit();

  const homeMedian = {
    fcpMs: median(homeMobileRuns.map((r) => r.fcpMs)),
    lcpMs: median(homeMobileRuns.map((r) => r.lcpMs)),
    cls: median(homeMobileRuns.map((r) => r.cls)),
    tbtMs: median(homeMobileRuns.map((r) => r.tbtMs)),
    runs: homeMobileRuns,
  };

  const report = {
    capturedAt: new Date().toISOString(),
    baseUrl: BASE,
    method: "lighthouse-cli npx --yes lighthouse preset perf/desktop",
    homeMobileMedian: homeMedian,
    homeDesktop1440: homeDesktop,
    functionalMobile,
    lcpDetail,
    heroDelivery,
    network,
    acceptance: {
      clsPass: homeMedian.cls != null && homeMedian.cls <= 0.05,
      h1Readable: Boolean(lcpDetail.h1FirstPaint?.text && lcpDetail.h1FirstPaint.opacity !== "0"),
      zeroFailedImages: network.every((n) => n.failedImages.length === 0 && n.brokenDom.length === 0),
    },
  };

  await writeFile(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ homeMedian, functionalMobile, acceptance: report.acceptance }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
