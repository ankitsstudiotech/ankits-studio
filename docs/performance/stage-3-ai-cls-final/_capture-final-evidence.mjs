/**
 * Capture overflow, throttled CLS, footer geometry timeline, and screenshots.
 * Usage: $env:BASE_URL="http://localhost:3010"; node docs/performance/stage-3-ai-cls-final/_capture-final-evidence.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium, devices } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3010";
const OUT = join(process.cwd(), "docs/performance/stage-3-ai-cls-final");
const SHOTS = join(process.cwd(), "docs/revamp/screenshots/stage-3-ai-cls-final");
const WIDTHS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];

async function applySlow4g(page) {
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: Math.floor((1.6 * 1024 * 1024) / 8),
    uploadThroughput: Math.floor((750 * 1024) / 8),
    connectionType: "cellular4g",
  });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
}

async function measureOverflow(page, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
  return page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const offenders = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.right > clientWidth + 1 || r.left < -1;
      })
      .slice(0, 8)
      .map((el) => el.className?.toString?.().slice(0, 80) || el.tagName);
    return {
      width: window.innerWidth,
      innerWidth: window.innerWidth,
      clientWidth,
      documentElementScrollWidth: scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      overflowPx: Math.max(0, scrollWidth - clientWidth),
      offenders,
    };
  });
}

async function footerTimeline(page, path) {
  await applySlow4g(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const started = Date.now();
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 180_000 });
  await page.waitForSelector("h1", { state: "visible", timeout: 180_000 });
  const samples = [];
  const capture = async (label) => {
    const geo = await page.evaluate(() => {
      const footer = document.querySelector("footer");
      const h1 = document.querySelector("h1");
      const fr = footer?.getBoundingClientRect();
      const hr = h1?.getBoundingClientRect();
      return {
        viewportHeight: window.innerHeight,
        footerTop: fr ? fr.top + window.scrollY : null,
        footerHeight: fr?.height ?? null,
        h1Visible: Boolean(h1) && getComputedStyle(h1).opacity !== "0",
        h1Opacity: h1 ? getComputedStyle(h1).opacity : null,
        h1Top: hr ? hr.top + window.scrollY : null,
      };
    });
    samples.push({ label, elapsedMs: Date.now() - started, ...geo });
  };
  await capture("first-h1");
  await page.waitForTimeout(500);
  await capture("500ms");
  await page.waitForTimeout(500);
  await capture("1000ms");
  await page.waitForTimeout(4000);
  await capture("final");
  return samples;
}

async function throttledCls(browser, path) {
  const ctx = await browser.newContext({
    ...devices["iPhone 13"],
    viewport: { width: 390, height: 844 },
  });
  const page = await ctx.newPage();
  await applySlow4g(page);
  await page.addInitScript(() => {
    window.__cls = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      });
      po.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* ignore */
    }
  });
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 180_000 });
  await page.waitForTimeout(5000);
  const total = await page.evaluate(() => window.__cls ?? 0);
  await ctx.close();
  return total;
}

async function shot(page, path, file, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.screenshot({ path: join(SHOTS, file), fullPage: true });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const overflow = [];
  for (const width of WIDTHS) overflow.push(await measureOverflow(page, width));
  await writeFile(
    join(OUT, "overflow-regression.json"),
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        baseUrl: BASE,
        pass: overflow.every((row) => row.overflowPx === 0 && row.offenders.length === 0),
        results: overflow,
      },
      null,
      2,
    ),
  );

  const homeTimeline = await footerTimeline(page, "/");
  await writeFile(
    join(OUT, "footer-geometry-timeline.json"),
    JSON.stringify({ capturedAt: new Date().toISOString(), home: homeTimeline }, null, 2),
  );

  const homeCls = await throttledCls(browser, "/");
  const functionalCls = await throttledCls(browser, "/programs/functional-training");
  await writeFile(
    join(OUT, "throttled-playwright-cls.json"),
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        viewport: "390x844",
        network: "Slow 4G approx 1.6Mbps/150ms RTT",
        cpu: "4x",
        home: homeCls,
        functional: functionalCls,
      },
      null,
      2,
    ),
  );

  await shot(page, "/", "home-390.png", { width: 390, height: 844 });
  await shot(page, "/programs/functional-training", "functional-390.png", { width: 390, height: 844 });
  await shot(page, "/trial", "trial-390.png", { width: 390, height: 844 });
  await shot(page, "/contact", "contact-390.png", { width: 390, height: 844 });
  await shot(page, "/", "home-1440.png", { width: 1440, height: 900 });
  await shot(page, "/programs/functional-training", "functional-1440.png", { width: 1440, height: 900 });
  await shot(page, "/trial", "trial-1440.png", { width: 1440, height: 900 });
  await shot(page, "/contact", "contact-1440.png", { width: 1440, height: 900 });
  await shot(page, "/", "home-1920.png", { width: 1920, height: 1080 });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.screenshot({ path: join(SHOTS, "viewport-390x844-home.png"), fullPage: false });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.screenshot({ path: join(SHOTS, "viewport-1440x900-home.png"), fullPage: false });

  await browser.close();
  console.log("evidence captured");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
