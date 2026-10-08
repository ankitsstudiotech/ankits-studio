import { chromium } from "playwright";
import { mkdirSync } from "fs";

const dir = "docs/bugs/screenshots/garba-composition-polish-02";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const base = process.env.GARBA_QA_BASE || "https://ankitsstudio.com";
const tag = process.env.GARBA_QA_TAG || "before";

async function shot(path, name, w, h, scrollSel, fullPage = false) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${base}${path}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(700);
  // Dismiss cookie banner if present so it does not remount targets mid-scroll
  const accept = page.getByRole("button", { name: /accept/i });
  if (await accept.count()) {
    await accept.first().click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  if (scrollSel) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
    }, scrollSel);
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: `${dir}/${name}`, fullPage });
  await page.close();
}

if (tag === "before") {
  await shot(
    "/",
    "home-billboard-before-390.png",
    390,
    844,
    '[data-campaign="garba-night-2026"]',
  );
  await shot(
    "/",
    "home-billboard-before-1536.png",
    1536,
    960,
    '[data-campaign="garba-night-2026"]',
  );
  await shot(
    "/events/garba-night-2026",
    "event-hero-before-1536.png",
    1536,
    960,
  );
  await shot(
    "/events/garba-night-2026",
    "passes-before-1536.png",
    1536,
    960,
    "#garba-pricing-title",
  );
  await shot(
    "/events/garba-night-2026",
    "venue-before-390.png",
    390,
    844,
    "#garba-venue-title",
  );
  await shot(
    "/events/garba-night-2026",
    "venue-before-1536.png",
    1536,
    960,
    "#garba-venue-title",
  );
} else {
  await shot(
    "/",
    "home-billboard-after-390.png",
    390,
    844,
    '[data-campaign="garba-night-2026"]',
  );
  await shot(
    "/",
    "home-billboard-after-1536.png",
    1536,
    960,
    '[data-campaign="garba-night-2026"]',
  );
  await shot("/", "home-full-after-1536.png", 1536, 2000, null, true);
  await shot(
    "/events/garba-night-2026",
    "event-hero-after-1536.png",
    1536,
    960,
  );
  await shot(
    "/events/garba-night-2026",
    "passes-after-1536.png",
    1536,
    960,
    "#garba-pricing-title",
  );
  await shot(
    "/events/garba-night-2026",
    "previous-edition-after-390.png",
    390,
    844,
    "#garba-previous-title",
  );
  await shot(
    "/events/garba-night-2026",
    "previous-edition-after-1536.png",
    1536,
    960,
    "#garba-previous-title",
  );
  await shot(
    "/events/garba-night-2026",
    "venue-after-390.png",
    390,
    844,
    "#garba-venue-title",
  );
  await shot(
    "/events/garba-night-2026",
    "venue-after-1536.png",
    1536,
    960,
    "#garba-venue-title",
  );
  await shot(
    "/events/garba-night-2026",
    "garba-event-full-after-1536.png",
    1536,
    2000,
    null,
    true,
  );
}

console.log(`captured ${tag} shots from ${base}`);
await browser.close();
