/**
 * Stage 5 baseline visual audit — captures key routes for defect inventory.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3505";
const OUT = path.resolve("docs/revamp/screenshots/_stage5-audit");
fs.mkdirSync(OUT, { recursive: true });

const routes = [
  { n: "home", p: "/" },
  { n: "about", p: "/about" },
  { n: "programs", p: "/programs" },
  { n: "functional", p: "/programs/functional-training" },
  { n: "zumba", p: "/programs/zumba" },
  { n: "yoga", p: "/programs/yoga" },
  { n: "dance", p: "/programs/adult-dance" },
  { n: "wedding", p: "/programs/wedding-choreography" },
  { n: "home-pt", p: "/programs/home-personal-training" },
  { n: "online", p: "/programs/online-training" },
  { n: "locations", p: "/locations" },
  { n: "airoli-19", p: "/locations/airoli-sector-19" },
  { n: "pricing", p: "/pricing" },
  { n: "timetable", p: "/timetable" },
  { n: "trial", p: "/trial" },
  { n: "contact", p: "/contact" },
];

const browser = await chromium.launch({ headless: true });
for (const vp of [
  { n: "1440", w: 1440, h: 900 },
  { n: "390", w: 390, h: 844 },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(BASE + r.p, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(OUT, `${vp.n}-${r.n}.png`),
      fullPage: false,
    });
  }
  await ctx.close();
}
await browser.close();
console.log("audit shots →", OUT);
