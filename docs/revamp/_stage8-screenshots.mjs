/**
 * Stage 8 screenshot packages (production synthetic=false OR portfolio synthetic=true).
 *
 * MODE=production|portfolio PLAYWRIGHT_BASE_URL=… node docs/revamp/_stage8-screenshots.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const MODE = process.env.MODE || "production";
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3808";
const ROOT =
  MODE === "portfolio"
    ? path.resolve("docs/revamp/screenshots/stage-8-portfolio-concept")
    : path.resolve("docs/revamp/screenshots/stage-8-final-production");

const PUBLIC = [
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
  "/locations/airoli-sector-19",
  "/locations/airoli-sector-8",
  "/locations/ghansoli",
  "/locations/thane",
  "/timetable",
  "/pricing",
  "/trial",
  "/contact",
  "/privacy-policy",
  "/terms",
];

const PORTFOLIO = [
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

function slug(p) {
  return p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "__");
}

fs.mkdirSync(ROOT, { recursive: true });
const manifest = {
  mode: MODE,
  base: BASE,
  generatedAt: new Date().toISOString(),
  files: [],
};

const browser = await chromium.launch({ headless: true });

async function shot(page, route, label, fullPage) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(500);
  const file = `${label}__${slug(route)}.png`;
  const dest = path.join(ROOT, file);
  await page.screenshot({ path: dest, fullPage });
  manifest.files.push({ file, route, label, fullPage });
}

if (MODE === "production") {
  const plans = [
    { label: "full-390", w: 390, h: 844, routes: PUBLIC, full: true },
    {
      label: "full-768",
      w: 768,
      h: 1024,
      routes: [
        "/",
        "/about",
        "/programs",
        "/programs/functional-training",
        "/programs/yoga",
        "/locations",
        "/locations/airoli-sector-19",
        "/pricing",
        "/timetable",
        "/trial",
        "/contact",
      ],
      full: true,
    },
    { label: "full-1440", w: 1440, h: 900, routes: PUBLIC, full: true },
    {
      label: "full-1920",
      w: 1920,
      h: 1080,
      routes: [
        "/",
        "/about",
        "/programs",
        "/programs/functional-training",
        "/programs/yoga",
        "/programs/adult-dance",
        "/programs/wedding-choreography",
        "/locations",
        "/pricing",
        "/trial",
      ],
      full: true,
    },
    {
      label: "vp-390x844",
      w: 390,
      h: 844,
      routes: [
        "/",
        "/about",
        "/programs",
        "/programs/functional-training",
        "/programs/yoga",
        "/locations",
        "/locations/airoli-sector-19",
        "/pricing",
        "/trial",
        "/contact",
      ],
      full: false,
    },
    {
      label: "vp-1440x900",
      w: 1440,
      h: 900,
      routes: [
        "/",
        "/about",
        "/programs",
        "/programs/functional-training",
        "/programs/yoga",
        "/locations",
        "/locations/airoli-sector-19",
        "/pricing",
        "/trial",
        "/contact",
      ],
      full: false,
    },
  ];

  for (const plan of plans) {
    const ctx = await browser.newContext({
      viewport: { width: plan.w, height: plan.h },
      colorScheme: "dark",
    });
    const page = await ctx.newPage();
    for (const route of plan.routes) {
      console.log(plan.label, route);
      await shot(page, route, plan.label, plan.full);
    }
    await ctx.close();
  }

  // programme family comparison strip at 1440
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  const family = [
    "/programs/functional-training",
    "/programs/yoga",
    "/programs/zumba",
    "/programs/adult-dance",
    "/programs/wedding-choreography",
    "/programs/home-personal-training",
    "/programs/online-training",
  ];
  for (const route of family) {
    await shot(page, route, "family-1440-vp", false);
  }
  await ctx.close();
} else {
  for (const [w, h, label] of [
    [390, 844, "vp-390"],
    [1440, 900, "vp-1440"],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      colorScheme: "dark",
    });
    const page = await ctx.newPage();
    for (const route of PORTFOLIO) {
      console.log(label, route);
      await shot(page, route, label, true);
    }
    await ctx.close();
  }
}

fs.writeFileSync(path.join(ROOT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("wrote", manifest.files.length, "files to", ROOT);
await browser.close();
