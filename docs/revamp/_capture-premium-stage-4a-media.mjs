/**
 * Stage 4A Part 1 — media architecture screenshots (flag false + optional geometry).
 * Usage: PLAYWRIGHT_BASE_URL=http://127.0.0.1:PORT node docs/revamp/_capture-premium-stage-4a-media.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const OUT = path.resolve("docs/revamp/screenshots/premium-stage-4a-media-architecture");

fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) {
  fs.unlinkSync(path.join(OUT, f));
}

const routes = [
  { name: "home", path: "/" },
  { name: "functional", path: "/programs/functional-training" },
  { name: "about", path: "/about" },
  { name: "locations", path: "/locations" },
];

const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
];

async function captureSet(labelPrefix, baseUrl) {
  const browser = await chromium.launch({ headless: true });
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(baseUrl + route.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const file = `${labelPrefix}-${vp.name}-${route.name}.png`;
      await page.screenshot({ path: path.join(OUT, file), fullPage: false });
    }
    await context.close();
  }
  await browser.close();
}

await captureSet("flag-false", BASE);

const manifest = {
  base: BASE,
  note: "flag-false = production-default text-led. Geometry flag-true shots require a server with NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=true.",
  generatedAt: new Date().toISOString(),
  files: fs.readdirSync(OUT).sort(),
};
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Wrote", OUT, manifest.files.length, "files");
