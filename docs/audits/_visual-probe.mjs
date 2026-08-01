/**
 * Ephemeral visual probe — not application source.
 * Writes JSON report + screenshots under docs/audits/.
 */
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3001";
const OUT = path.resolve("docs/audits");
const SHOTS = path.join(OUT, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const viewports = [
  { name: "390x844", width: 390, height: 844, isMobile: true },
  { name: "768x1024", width: 768, height: 1024, isMobile: true },
  { name: "1440x900", width: 1440, height: 900, isMobile: false },
  { name: "1920x1080", width: 1920, height: 1080, isMobile: false },
];

const routes = [
  "/",
  "/about",
  "/programs",
  "/programs/strength-training",
  "/programs/weight-loss-fitness",
  "/locations",
  "/locations/airoli",
  "/locations/thane",
  "/trainers",
  "/trainers/illustrative-trainer-1",
  "/transformations",
  "/timetable",
  "/timetable?branch=airoli&programme=yoga",
  "/pricing",
  "/trial",
  "/trial?status=validation-error",
  "/trial?status=not-configured",
  "/contact",
  "/contact?status=not-configured",
  "/blog",
  "/blog/sample-starting-with-strength",
  "/privacy-policy",
  "/terms",
  "/this-route-does-not-exist",
];

function slug(route) {
  return route
    .replace(/^\//, "")
    .replace(/[/?&=]/g, "_")
    .replace(/^$/, "home");
}

const findings = [];

async function measure(page, route, vp) {
  const metrics = await page.evaluate(() => {
    const d = document.documentElement;
    const b = document.body;
    const overflowX = Math.max(d.scrollWidth, b.scrollWidth) > Math.ceil(innerWidth) + 1;
    const fixedBottom = [...document.querySelectorAll("*")].filter((el) => {
      const s = getComputedStyle(el);
      return s.position === "fixed" && (s.bottom === "0px" || Number.parseFloat(s.bottom) === 0);
    }).length;
    const smallTargets = [...document.querySelectorAll("a, button, summary, input, select, textarea")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return null;
        return { w: Math.round(r.width), h: Math.round(r.height), text: (el.innerText || el.getAttribute("aria-label") || "").slice(0, 40) };
      })
      .filter(Boolean)
      .filter((t) => t.w < 44 || t.h < 44)
      .slice(0, 12);
    const h1 = document.querySelector("h1")?.textContent?.trim() || null;
    const hasMain = Boolean(document.querySelector("main, #main-content"));
    return {
      overflowX,
      scrollW: Math.max(d.scrollWidth, b.scrollWidth),
      innerW: innerWidth,
      fixedBottom,
      smallTargets,
      h1,
      hasMain,
      title: document.title,
    };
  });
  return metrics;
}

const browser = await chromium.launch({ headless: true });
const report = { base: BASE, generatedAt: new Date().toISOString(), viewports: {}, interactions: {} };

for (const vp of viewports) {
  report.viewports[vp.name] = {};
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  for (const route of routes) {
    const url = BASE + route;
    const key = slug(route);
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(400);
      const metrics = await measure(page, route, vp);
      const entry = {
        route,
        status: res?.status() ?? null,
        ...metrics,
      };
      if (metrics.overflowX) {
        findings.push({
          id: `overflow-${vp.name}-${key}`,
          severity: "high",
          route,
          viewport: vp.name,
          issue: "Horizontal overflow",
          evidence: `scrollWidth ${metrics.scrollW} > innerWidth ${metrics.innerW}`,
        });
        const shot = path.join(SHOTS, `overflow_${vp.name}_${key}.png`);
        await page.screenshot({ path: shot, fullPage: false });
        entry.screenshot = path.relative(OUT, shot).replace(/\\/g, "/");
      }
      // Capture representative shots at 390 for key pages
      const baseRoute = route.split("?")[0];
      if (
        vp.name === "390x844" &&
        ["/", "/trial", "/timetable", "/locations/thane", "/pricing", "/this-route-does-not-exist", "/programs/weight-loss-fitness"].includes(baseRoute)
      ) {
        const shot = path.join(SHOTS, `view_390_${key}.png`);
        await page.screenshot({ path: shot, fullPage: false });
        entry.screenshot = path.relative(OUT, shot).replace(/\\/g, "/");
      }
      report.viewports[vp.name][route] = entry;
    } catch (err) {
      report.viewports[vp.name][route] = { route, error: String(err) };
      findings.push({
        id: `navfail-${vp.name}-${key}`,
        severity: "high",
        route,
        viewport: vp.name,
        issue: "Navigation/load failure",
        evidence: String(err),
      });
    }
  }
  await context.close();
}

// Interaction probes at 390
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // Mobile nav
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const openMenu = page.getByRole("button", { name: /open menu/i });
  const mobileNav = { openVisible: await openMenu.isVisible().catch(() => false) };
  if (mobileNav.openVisible) {
    await openMenu.click();
    await page.waitForTimeout(300);
    mobileNav.afterOpen = await page.evaluate(() => ({
      dialogOrNav: Boolean(document.querySelector("[role='dialog'], nav[aria-label='Primary']")),
      focusTag: document.activeElement?.tagName,
      overflowX: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > innerWidth + 1,
    }));
    await page.screenshot({ path: path.join(SHOTS, "mobile_nav_open_390.png") });
    mobileNav.screenshot = "screenshots/mobile_nav_open_390.png";
  }
  report.interactions.mobileNav = mobileNav;

  // Trial form validation (empty submit)
  await page.goto(BASE + "/trial", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /submit trial request/i }).click();
  await page.waitForTimeout(500);
  const trialValidation = await page.evaluate(() => {
    const invalid = [...document.querySelectorAll(":invalid")].map((el) => el.getAttribute("name") || el.id);
    return { url: location.href, invalidCount: invalid.length, invalid };
  });
  await page.screenshot({ path: path.join(SHOTS, "trial_native_validation_390.png") });
  trialValidation.screenshot = "screenshots/trial_native_validation_390.png";
  report.interactions.trialNativeValidation = trialValidation;

  // Timetable filter submit
  await page.goto(BASE + "/timetable", { waitUntil: "domcontentloaded" });
  await page.locator("#branch").selectOption("ghansoli");
  await page.locator("#programme").selectOption("zumba");
  await page.getByRole("button", { name: /apply filters/i }).click();
  await page.waitForTimeout(800);
  report.interactions.timetableFilter = {
    url: page.url(),
    bodyTextSnippet: (await page.locator("[aria-live='polite']").textContent().catch(() => ""))?.trim(),
  };
  await page.screenshot({ path: path.join(SHOTS, "timetable_filter_390.png") });
  report.interactions.timetableFilter.screenshot = "screenshots/timetable_filter_390.png";

  // Keyboard tab focus ring on trial
  await page.goto(BASE + "/trial", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const el = document.activeElement;
    const s = el ? getComputedStyle(el) : null;
    return {
      tag: el?.tagName,
      text: (el?.textContent || "").trim().slice(0, 60),
      outline: s?.outlineStyle,
      outlineWidth: s?.outlineWidth,
      boxShadow: s?.boxShadow,
    };
  });
  report.interactions.keyboardFocus = focus;
  await page.screenshot({ path: path.join(SHOTS, "keyboard_focus_390.png") });
  report.interactions.keyboardFocus.screenshot = "screenshots/keyboard_focus_390.png";

  // Reduced motion
  await context.close();
}
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  const rm = await page.evaluate(() => ({
    matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
    motionNodes: document.querySelectorAll("[style*='transform'], [style*='opacity']").length,
    h1: document.querySelector("h1")?.textContent?.trim(),
  }));
  await page.screenshot({ path: path.join(SHOTS, "home_reduced_motion_1440.png") });
  report.interactions.reducedMotion = { ...rm, screenshot: "screenshots/home_reduced_motion_1440.png" };
  await context.close();
}

// Desktop sticky CTA should hide; mobile sticky visible
{
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dp = await desktop.newPage();
  await dp.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  report.interactions.stickyCtaDesktop = await dp.evaluate(() => {
    const texts = [...document.querySelectorAll("a")].filter((a) => /book a trial/i.test(a.textContent || ""));
    const fixed = texts.filter((a) => getComputedStyle(a.closest("div") || a).position === "fixed");
    return { trialLinks: texts.length, fixedTrialContainers: fixed.length };
  });
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp = await mobile.newPage();
  await mp.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  report.interactions.stickyCtaMobile = await mp.evaluate(() => {
    const bar = [...document.querySelectorAll("div")].find((d) => /try a class/i.test(d.textContent || "") && getComputedStyle(d).position === "fixed");
    if (!bar) return { visible: false };
    const r = bar.getBoundingClientRect();
    return { visible: r.height > 0, height: Math.round(r.height), bottom: Math.round(r.bottom) };
  });
  await mp.goto(BASE + "/trial", { waitUntil: "domcontentloaded" });
  report.interactions.stickyCtaHiddenOnTrial = await mp.evaluate(() => {
    const bar = [...document.querySelectorAll("div")].find((d) => /try a class/i.test(d.textContent || "") && getComputedStyle(d).position === "fixed");
    return { stickyPresent: Boolean(bar && bar.getBoundingClientRect().height > 0) };
  });
  await mobile.close();
}

// Contrast sampling (simple luminance on key pairs) at home 1440
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  report.interactions.contrastSamples = await page.evaluate(() => {
    function parseColor(c) {
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return null;
      return [Number(m[1]), Number(m[2]), Number(m[3])];
    }
    function lum([r, g, b]) {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }
    function ratio(fg, bg) {
      const L1 = lum(fg);
      const L2 = lum(bg);
      const lighter = Math.max(L1, L2);
      const darker = Math.min(L1, L2);
      return (lighter + 0.05) / (darker + 0.05);
    }
    const samples = [];
    for (const sel of ["h1", "p", "a", ".text-ink-muted", "[class*='text-ink-subtle']"]) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const cs = getComputedStyle(el);
      let bgEl = el;
      let bg = parseColor(cs.backgroundColor);
      while (bgEl && (!bg || bg.join() === "0,0,0") && getComputedStyle(bgEl).backgroundColor === "rgba(0, 0, 0, 0)") {
        bgEl = bgEl.parentElement;
        if (!bgEl) break;
        bg = parseColor(getComputedStyle(bgEl).backgroundColor);
      }
      const fg = parseColor(cs.color);
      if (fg && bg) samples.push({ sel, ratio: Number(ratio(fg, bg).toFixed(2)), color: cs.color, bg: getComputedStyle(bgEl || el).backgroundColor });
    }
    return samples;
  });
  await context.close();
}

report.findings = findings;
fs.writeFileSync(path.join(OUT, "visual-probe-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ findingCount: findings.length, overflowFindings: findings.filter((f) => f.issue.includes("overflow")).length, routes: routes.length, viewports: viewports.length }, null, 2));
await browser.close();
