/**
 * Capture Corporate Wellness AI-final screenshots, CLS/LCP, and family comparison inputs.
 * Usage: $env:BASE_URL="http://localhost:3011"; node docs/revamp/_capture-corporate-wellness-ai-final.mjs
 */
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3011";
const PATH = "/programs/corporate-wellness";
const OUT = join(process.cwd(), "docs/revamp/screenshots/corporate-wellness-ai-final");
const FAMILY = join(process.cwd(), "docs/revamp/screenshots/final-production-ai-media");

function slugFile(width, extra = "") {
  return extra ? `${extra}.png` : `full-${width}.png`;
}

async function gotoReady(page) {
  await page.goto(`${BASE}${PATH}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForFunction(() => {
    const img = document.querySelector('[data-media-slot="programme.corporate-wellness.hero"] img');
    return Boolean(img && img.complete && img.naturalWidth > 0);
  }, null, { timeout: 20_000 });
  await page.waitForTimeout(300);
}

async function measure(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const h1Rect = h1?.getBoundingClientRect();
    const img = document.querySelector('[data-media-slot="programme.corporate-wellness.hero"] img');
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const resources = performance.getEntriesByType("resource");
    const imageResources = resources
      .filter((r) => r.initiatorType === "img" || /\.(webp|png|jpe?g|avif)(\?|$)/i.test(r.name) || r.name.includes("/_next/image"))
      .map((r) => ({ name: r.name, transferSize: r.transferSize, encodedBodySize: r.encodedBodySize }));
    const heroSrc = img instanceof HTMLImageElement ? img.currentSrc || img.src : null;
    const heroRes = imageResources.find((r) => heroSrc && r.name === heroSrc) ?? imageResources.find((r) => r.name.includes("corporate-wellness")) ?? imageResources[0];
    const lcp = window.__lcp || null;
    return {
      cls: window.__cls ?? 0,
      overflow,
      h1Visible: Boolean(h1 && h1Rect && h1Rect.width > 0 && h1Rect.height > 0 && getComputedStyle(h1).opacity !== "0"),
      lcp,
      heroSrc,
      servedImageBytes: heroRes?.transferSize || heroRes?.encodedBodySize || null,
      imageResources,
    };
  });
}

async function capture() {
  await mkdir(OUT, { recursive: true });
  await mkdir(join(OUT, "states"), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const failed = [];
  page.on("response", (res) => {
    if (res.request().resourceType() === "image" && res.status() >= 400) {
      failed.push(`${res.status()} ${res.url()}`);
    }
  });
  page.on("requestfailed", (req) => {
    if (req.resourceType() === "image") failed.push(`failed ${req.url()}`);
  });

  const full = [390, 768, 1024, 1440, 1920];
  const viewports = [
    { width: 390, height: 844, name: "viewport-390x844" },
    { width: 768, height: 1024, name: "viewport-768x1024" },
    { width: 1440, height: 900, name: "viewport-1440x900" },
  ];

  const manifest = [];

  for (const width of full) {
    await page.setViewportSize({ width, height: 2400 });
    await gotoReady(page);
    const file = join(OUT, slugFile(width));
    await page.screenshot({ path: file, fullPage: true });
    manifest.push({ file: `corporate-wellness-ai-final/${slugFile(width)}`, viewport: `${width}x2400`, fullPage: true });
    if (width === 390 || width === 768 || width === 1440 || width === 1920) {
      const destDir = join(FAMILY, `full-${width}`);
      await mkdir(destDir, { recursive: true });
      await copyFile(file, join(destDir, "programs-corporate-wellness.png"));
    }
  }

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await gotoReady(page);
    const file = join(OUT, `${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    manifest.push({ file: `corporate-wellness-ai-final/${vp.name}.png`, viewport: `${vp.width}x${vp.height}`, fullPage: false });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoReady(page);
  await page.screenshot({ path: join(OUT, "states/hero-default.png"), fullPage: false });

  const cta = page.getByRole("link", { name: /Enquire about Corporate Wellness/i }).first();
  await cta.focus();
  await page.screenshot({ path: join(OUT, "states/cta-focus.png"), fullPage: false });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const img = document.querySelector('[data-media-slot="programme.corporate-wellness.hero"] img');
    return Boolean(img && img.complete && img.naturalWidth > 0);
  }, null, { timeout: 20_000 });
  await page.screenshot({ path: join(OUT, "states/reduced-motion.png"), fullPage: false });
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.addInitScript(() => {
    window.__cls = 0;
    window.__lcp = null;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          window.__lcp = {
            startTime: last.startTime,
            size: last.size,
            url: last.url || null,
            tag: last.element?.tagName || null,
            className: typeof last.element?.className === "string" ? last.element.className : null,
          };
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* ignore */
    }
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}${PATH}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForFunction(() => {
    const img = document.querySelector('[data-media-slot="programme.corporate-wellness.hero"] img');
    return Boolean(img && img.complete && img.naturalWidth > 0);
  }, null, { timeout: 20_000 });
  await page.waitForTimeout(4000);
  const metrics = await measure(page);

  await writeFile(join(OUT, "manifest.json"), JSON.stringify({ capturedAt: new Date().toISOString(), items: manifest, failedImages: failed }, null, 2));
  await writeFile(join(OUT, "perf-390x844.json"), JSON.stringify({ capturedAt: new Date().toISOString(), ...metrics, failedImages: failed }, null, 2));
  await browser.close();
  if (failed.length) {
    console.error("Failed image requests", failed);
    process.exit(1);
  }
  console.log(JSON.stringify({ captured: manifest.length, cls: metrics.cls, lcp: metrics.lcp, servedImageBytes: metrics.servedImageBytes }, null, 2));
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
