/**
 * Final homepage refinement verification — screenshots + sticky CTA probes.
 * Usage: node docs/revamp/_capture-homepage-refinement-final.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const OUT = path.resolve("docs/revamp/screenshots/homepage-refinement-final");
fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

/** @type {Record<string, unknown>} */
const findings = {
  base: BASE,
  capturedAt: new Date().toISOString(),
  viewports: /** @type {Array<Record<string, unknown>>} */ ([]),
  sticky: /** @type {Record<string, unknown>} */ ({}),
  services: /** @type {Record<string, unknown>} */ ({}),
  media: /** @type {Record<string, unknown>} */ ({}),
  frozen: /** @type {Record<string, unknown>} */ ({}),
  batchLeaks: /** @type {Record<string, unknown>} */ ({}),
};

const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForSelector("#home-hero-title", { timeout: 30000 });
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const heroBrand = document.querySelector("[class*='heroBrand']");
    const heroCta = document.getElementById("home-hero-primary-cta");
    const sticky = document.querySelector("[data-sticky-cta-reveal]");
    const clusters = [...document.querySelectorAll("[data-cluster]")].map(
      (el) => el.getAttribute("data-cluster"),
    );
    const lanes = [...document.querySelectorAll("[data-tempo]")].map((el) => ({
      tempo: el.getAttribute("data-tempo"),
      emphasis: el.getAttribute("data-emphasis"),
      name: el.querySelector("h4")?.textContent?.trim() ?? "",
    }));
    // Filter to service lanes only (exclude cues)
    const serviceLanes = lanes.filter((l) => l.name);
    const heroBrandDisplay = heroBrand
      ? getComputedStyle(heroBrand).display
      : "missing";
    const overflowX = doc.scrollWidth > doc.clientWidth + 1;
    const banner = document.querySelector('[role="status"]');
    return {
      overflowX,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      heroBrandDisplay,
      heroCtaVisible: heroCta
        ? heroCta.getBoundingClientRect().bottom > 0 &&
          heroCta.getBoundingClientRect().top < window.innerHeight
        : false,
      stickyReveal: sticky?.getAttribute("data-sticky-cta-reveal") ?? null,
      stickyVisibleLg: sticky ? getComputedStyle(sticky).display !== "none" : false,
      clusters,
      serviceCount: serviceLanes.length,
      serviceNames: serviceLanes.map((l) => l.name),
      functionalPrimary: serviceLanes.some(
        (l) => l.tempo === "functional" && l.emphasis === "primary",
      ),
      bannerText: banner?.textContent?.replace(/\s+/g, " ").trim().slice(0, 160) ?? null,
      h1: document.getElementById("home-hero-title")?.textContent?.trim() ?? null,
    };
  });

  await page.screenshot({
    path: path.join(OUT, `${vp.name}_home.png`),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT, `${vp.name}_home_full.png`),
    fullPage: true,
  });

  findings.viewports.push({ ...vp, ...metrics });
  await context.close();
}

// Sticky CTA behaviour at 390×844
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForSelector("#home-hero-primary-cta", { timeout: 30000 });

  const atTop = await page.evaluate(
    () => document.querySelector("[data-sticky-cta-reveal]")?.getAttribute("data-sticky-cta-reveal"),
  );

  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const midPage = await page.evaluate(
    () => document.querySelector("[data-sticky-cta-reveal]")?.getAttribute("data-sticky-cta-reveal"),
  );
  await page.screenshot({
    path: path.join(OUT, "390x844_sticky_mid.png"),
    fullPage: false,
  });

  await page.locator("#trial").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const atTrial = await page.evaluate(
    () => document.querySelector("[data-sticky-cta-reveal]")?.getAttribute("data-sticky-cta-reveal"),
  );
  await page.screenshot({
    path: path.join(OUT, "390x844_sticky_trial.png"),
    fullPage: false,
  });

  // Fast scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);
  const afterFastTop = await page.evaluate(
    () => document.querySelector("[data-sticky-cta-reveal]")?.getAttribute("data-sticky-cta-reveal"),
  );

  // Refresh while scrolled mid
  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("#home-hero-primary-cta", { timeout: 30000 });
  // After reload, scroll position may reset — scroll again then check
  await page.locator("#services").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const afterReloadMid = await page.evaluate(
    () => document.querySelector("[data-sticky-cta-reveal]")?.getAttribute("data-sticky-cta-reveal"),
  );

  // Padding / CLS proxy: body padding-bottom reserved
  const padding = await page.evaluate(() => {
    const body = document.body;
    return getComputedStyle(body).paddingBottom;
  });

  findings.sticky = {
    viewport: "390x844",
    atTop,
    midPage,
    atTrial,
    afterFastTop,
    afterReloadMid,
    bodyPaddingBottom: padding,
    expect: {
      atTop: "false",
      midPage: "true",
      atTrial: "false",
      afterFastTop: "false",
      afterReloadMid: "true",
    },
  };

  await context.close();
}

// Reduced motion + 200% zoom probes
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForSelector("#home-hero-title", { timeout: 30000 });
  await page.evaluate(() => {
    document.body.style.zoom = "2";
  });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(OUT, "390x844_reduced_motion_zoom200.png"),
    fullPage: false,
  });
  const zoomOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  );
  findings.sticky.reducedMotionZoom200OverflowX = zoomOverflow;
  await context.close();
}

// Media fallbacks on homepage
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 90000 });
  findings.media = await page.evaluate(() => {
    const plates = [...document.querySelectorAll("[data-media-status]")].map((el) => ({
      status: el.getAttribute("data-media-status"),
      slot: el.getAttribute("data-media-slot"),
      mock: el.getAttribute("data-mock-media"),
      label: el.getAttribute("aria-label"),
    }));
    const brokenImgs = [...document.images].filter((img) => !img.complete || img.naturalWidth === 0)
      .length;
    return { plates, brokenImgs };
  });
  await context.close();
}

// Batch leak smoke on public routes
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const routes = [
    "/",
    "/timetable",
    "/programs/yoga",
    "/programs/functional-training",
    "/locations/airoli",
  ];
  /** @type {Array<Record<string, unknown>>} */
  const leakChecks = [];
  for (const route of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    const check = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasPlaceholderSchedule: /Placeholder schedule/i.test(text),
        hasIllustrativeClasses: /Illustrative classes/i.test(text),
        hasProvisionalClassListed: /provisional class/i.test(text),
        hasSampleSchedule: /sample schedule/i.test(text),
        hasAskWhatsApp: /WhatsApp/i.test(text),
        hasOperatingWindow: /6:00|06:00|operating/i.test(text),
      };
    });
    leakChecks.push({ route, ...check });
  }
  findings.batchLeaks = { routes: leakChecks };
  await context.close();
}

// Frozen prototypes
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  for (const letter of ["a", "b", "c"]) {
    await page.goto(`${BASE}/design-lab/revamp-${letter}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    const ok = await page.evaluate((l) => {
      const root =
        document.querySelector(`[data-design-lab-prototype='${l}']`) ||
        document.querySelector(`[data-frozen-prototype='true']`);
      const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
      return {
        rootPresent: Boolean(root),
        robots,
      };
    }, letter);
    await page.screenshot({
      path: path.join(OUT, `1440x900_frozen_${letter}.png`),
      fullPage: false,
    });
    findings.frozen[letter] = ok;
  }
  await context.close();
}

await browser.close();

fs.writeFileSync(path.join(OUT, "findings.json"), JSON.stringify(findings, null, 2));
console.log(`Wrote ${OUT}`);
console.log(JSON.stringify(findings.sticky, null, 2));
