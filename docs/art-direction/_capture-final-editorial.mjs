/**
 * Capture before (production) and after (local) frames for the final editorial pass.
 * BEFORE: PLAYWRIGHT_BASE_URL=https://ankits-studio.vercel.app
 * AFTER:  PLAYWRIGHT_BASE_URL=http://localhost:3000
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const origin = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const phase = process.env.CAPTURE_PHASE || "after";
const out = join(
  process.cwd(),
  "docs/art-direction/screenshots/final-editorial-pass",
  phase,
);
mkdirSync(out, { recursive: true });

const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1536", width: 1536, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const shots = [
  { key: "home-hero", path: "/", sel: "section[aria-labelledby='home-hero-title']" },
  { key: "home-programmes", path: "/", sel: "#services" },
  { key: "home-locations", path: "/", sel: "#locations" },
  { key: "home-reviews", path: "/", sel: "#google-reviews" },
  { key: "home-founder", path: "/", sel: "#founder" },
  { key: "home-close", path: "/", sel: "#trial" },
  { key: "home-footer", path: "/", sel: "footer" },
  { key: "programs", path: "/programs", sel: "[data-discovery='programme-index']" },
  { key: "functional", path: "/programs/functional-training", sel: "[data-compose], main" },
  { key: "yoga", path: "/programs/yoga", sel: "main" },
  { key: "corporate", path: "/programs/corporate-wellness", sel: "main" },
  { key: "about", path: "/about", sel: "main" },
  { key: "locations", path: "/locations", sel: "main" },
  { key: "airoli-19", path: "/locations/airoli-sector-19", sel: "main" },
  { key: "pricing", path: "/pricing", sel: "main" },
  { key: "trial", path: "/trial", sel: "main" },
  { key: "contact", path: "/contact", sel: "main" },
  { key: "privacy", path: "/privacy-policy", sel: "main" },
];

const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const page = await browser.newPage({ reducedMotion: "reduce" });
page.setDefaultTimeout(60_000);

const overflows = [];

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  const cache = new Map();
  for (const shot of shots) {
    if (!cache.has(shot.path)) {
      await page.goto(`${origin}${shot.path}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(350);
      cache.set(shot.path, true);
    } else if (page.url() !== `${origin}${shot.path}` && !page.url().endsWith(shot.path)) {
      await page.goto(`${origin}${shot.path}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(250);
    }
    const loc = page.locator(shot.sel).first();
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      await loc.screenshot({
        path: join(out, `${shot.key}-${vp.name}.png`),
        animations: "disabled",
      });
    }
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  overflows.push({ vp: vp.name, path: page.url(), overflow });
}

console.log(JSON.stringify({ origin, phase, out, overflows }, null, 2));
await browser.close();
