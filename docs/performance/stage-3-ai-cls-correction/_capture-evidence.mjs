/**
 * Capture CLS-correction evidence screenshots from a production server.
 * Usage: BASE_URL=http://localhost:3007 node docs/performance/stage-3-ai-cls-correction/_capture-evidence.mjs
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3007";
const OUT = join(process.cwd(), "docs/revamp/screenshots/stage-3-ai-cls-correction");
const LEGACY_HOME = join(process.cwd(), "docs/revamp/screenshots/final-production-ai-media");

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const full = [
    { path: "/", width: 390, file: "home-390.png", legacy: "full-390/home.png" },
    { path: "/programs/functional-training", width: 390, file: "functional-390.png" },
    { path: "/", width: 768, file: "home-768.png", legacy: "full-768/home.png" },
    { path: "/", width: 1440, file: "home-1440.png", legacy: "full-1440/home.png" },
    { path: "/programs/functional-training", width: 1440, file: "functional-1440.png" },
    { path: "/", width: 1920, file: "home-1920.png", legacy: "full-1920/home.png" },
  ];

  for (const job of full) {
    await page.setViewportSize({ width: job.width, height: 900 });
    await page.goto(`${BASE}${job.path}`, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForTimeout(400);
    const target = join(OUT, job.file);
    await page.screenshot({ path: target, fullPage: true });
    if (job.legacy) {
      await page.screenshot({ path: join(LEGACY_HOME, job.legacy), fullPage: true });
    }
  }

  const viewports = [
    { path: "/", width: 390, height: 844, file: "viewport-390x844-home.png" },
    { path: "/programs/functional-training", width: 390, height: 844, file: "viewport-390x844-functional.png" },
    { path: "/", width: 1440, height: 900, file: "viewport-1440x900-home.png" },
  ];
  for (const job of viewports) {
    await page.setViewportSize({ width: job.width, height: job.height });
    await page.goto(`${BASE}${job.path}`, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(OUT, job.file), fullPage: false });
  }

  await browser.close();
  console.log("Captured CLS correction screenshots");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
