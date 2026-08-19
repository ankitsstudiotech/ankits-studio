import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.env.CONCEPT_BASE || "http://127.0.0.1:3820";
const out = "docs/revamp/screenshots/concept-preview-hosted";
mkdirSync(out, { recursive: true });

const routes = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/home-personal-training",
  "/programs/online-training",
  "/programs/zumba",
  "/programs/yoga",
  "/programs/adult-dance",
  "/programs/wedding-choreography",
  "/locations",
];

const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle", timeout: 60_000 });
    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "__");
    const file = join(out, `vp-${vp.name}__${slug}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log("wrote", file);
  }
  await page.close();
}
await browser.close();
console.log("done");
