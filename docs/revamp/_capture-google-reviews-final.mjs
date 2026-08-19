/**
 * Prompt 5 evidence — Google reviews chapter + Corporate Wellness sticky CTA.
 * Usage: node docs/revamp/_capture-google-reviews-final.mjs
 * Optional: PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const OUT = path.resolve("docs/revamp/screenshots/google-reviews-final");

fs.mkdirSync(OUT, { recursive: true });

async function waitReady(page) {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.locator("#google-reviews").waitFor({ state: "visible", timeout: 60_000 });
  await page.waitForTimeout(600);
}

const browser = await chromium.launch({ headless: true });

async function fullPage(name, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await waitReady(page);
  await page.screenshot({ path: path.join(OUT, name), fullPage: true });
  await context.close();
}

async function viewportShot(name, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await waitReady(page);
  await page.locator("#google-reviews").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  await context.close();
}

await fullPage("home-390.png", 390, 844);
await fullPage("home-768.png", 768, 1024);
await fullPage("home-1440.png", 1440, 900);
await fullPage("home-1920.png", 1920, 1080);

await viewportShot("viewport-390x844.png", 390, 844);
await viewportShot("viewport-768x1024.png", 768, 1024);
await viewportShot("viewport-1440x900.png", 1440, 900);

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await waitReady(page);
  await page.locator("#google-reviews").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, "state-review-default.png"), fullPage: false });
  const firstLink = page.locator("#google-reviews a").first();
  await firstLink.focus();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, "state-first-review-focus.png"), fullPage: false });
  const googleLink = page.getByRole("link", { name: /view on google/i }).first();
  await googleLink.focus();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(OUT, "state-external-google-link-focus.png"),
    fullPage: false,
  });
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await waitReady(page);
  await page.locator("#google-reviews").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, "state-reduced-motion.png"), fullPage: false });
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto(BASE + "/programs/corporate-wellness", {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await page.locator("[data-sticky-cta-eligible]").waitFor({ state: "attached", timeout: 30_000 });
  await page.waitForSelector('[data-sticky-cta-reveal="true"]', { timeout: 10_000 });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(OUT, "corporate-wellness-sticky-390x844.png"),
    fullPage: false,
  });
  await context.close();
}

await browser.close();

function pngSize(file) {
  const buf = fs.readFileSync(path.join(OUT, file));
  return { file, width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

const files = fs.readdirSync(OUT).filter((f) => f.endsWith(".png")).sort();
const manifest = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  files: files.map(pngSize),
};
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Wrote", OUT);
console.log(JSON.stringify(manifest, null, 2));
