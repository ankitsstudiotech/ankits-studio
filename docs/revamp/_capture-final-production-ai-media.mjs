/**
 * Capture final-production-ai-media screenshot evidence (illustrative-ai ON, production build).
 * Usage: node docs/revamp/_capture-final-production-ai-media.mjs [--zip-only]
 */
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = join(process.cwd(), "docs/revamp/screenshots/final-production-ai-media");

const FULL_390 = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/zumba",
  "/programs/yoga",
  "/programs/adult-dance",
  "/programs/wedding-choreography",
  "/programs/home-personal-training",
  "/programs/online-training",
  "/programs/corporate-wellness",
  "/locations",
  "/locations/airoli-sector-19",
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
];

const FULL_768 = ["/", "/programs", "/about", "/locations", "/programs/functional-training", "/programs/corporate-wellness"];
const FULL_1440 = FULL_390;
const FULL_1920 = ["/", "/programs", "/about", "/locations", "/programs/functional-training", "/programs/yoga", "/programs/corporate-wellness"];

const VIEWPORT_390 = [
  { path: "/", name: "home" },
  { path: "/programs/functional-training", name: "functional" },
  { path: "/programs/yoga", name: "yoga" },
  { path: "/programs/corporate-wellness", name: "corporate-wellness" },
  { path: "/locations", name: "locations" },
];

function slug(path) {
  return path.replace(/^\//, "").replace(/\//g, "-") || "home";
}

async function verifyDom(page) {
  return page.evaluate(() => ({
    hasDevelopmentPreviewBanner: /Development preview|Mock preview/i.test(document.body.innerText),
    hasPerImageConceptLabel: Boolean(
      [...document.querySelectorAll("p")].some((p) => /AI concept preview/i.test(p.textContent ?? "")),
    ),
    hasFooterDisclosure: /illustrative AI-generated imagery/i.test(document.body.innerText),
  }));
}

async function collectPngs(dir) {
  const files = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith(".png")) files.push(full);
    }
  }
  await walk(dir);
  return files;
}

async function capture() {
  await mkdir(OUT, { recursive: true });
  const manifest = [];
  const domChecks = [];
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const jobs = [];

  for (const path of FULL_390) jobs.push({ dir: "full-390", viewport: { width: 390, height: 2400 }, path, fullPage: true });
  for (const path of FULL_768) jobs.push({ dir: "full-768", viewport: { width: 768, height: 2400 }, path, fullPage: true });
  for (const path of FULL_1440) jobs.push({ dir: "full-1440", viewport: { width: 1440, height: 2400 }, path, fullPage: true });
  for (const path of FULL_1920) jobs.push({ dir: "full-1920", viewport: { width: 1920, height: 2400 }, path, fullPage: true });
  for (const item of VIEWPORT_390) {
    jobs.push({ dir: "viewport-390x844", viewport: { width: 390, height: 844 }, path: item.path, fullPage: false, name: item.name });
    jobs.push({ dir: "viewport-1440x900", viewport: { width: 1440, height: 900 }, path: item.path, fullPage: false, name: item.name });
  }

  for (const job of jobs) {
    const fileName = `${slug(job.path)}${job.name ? `-${job.name}` : ""}.png`;
    const dir = join(OUT, job.dir);
    await mkdir(dir, { recursive: true });
    const outPath = join(dir, fileName);
    await page.setViewportSize(job.viewport);
    await page.goto(`${BASE}${job.path}`, { waitUntil: "networkidle", timeout: 120_000 });
    domChecks.push({ path: job.path, viewport: `${job.viewport.width}x${job.viewport.height}`, ...(await verifyDom(page)) });
    await page.screenshot({ path: outPath, fullPage: job.fullPage });
    manifest.push({
      file: `final-production-ai-media/${job.dir}/${fileName}`,
      path: job.path,
      viewport: `${job.viewport.width}x${job.viewport.height}`,
      fullPage: job.fullPage,
      illustrativeAiProduction: true,
    });
  }

  await browser.close();
  await writeFile(join(OUT, "manifest.json"), JSON.stringify({ capturedAt: new Date().toISOString(), items: manifest }, null, 2));
  await writeFile(join(OUT, "dom-verification.json"), JSON.stringify(domChecks, null, 2));
  const count = (await collectPngs(OUT)).length;
  console.log(`Captured ${count} PNGs`);
}

async function zipAll() {
  const zipPath = join(process.cwd(), "docs/revamp/screenshots/final-production-ai-media.zip");
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${OUT.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
    { stdio: "inherit" },
  );
  console.log("ZIP:", zipPath, "PNG count:", (await collectPngs(OUT)).length);
}

if (process.argv.includes("--zip-only")) {
  await zipAll();
} else {
  await capture();
  await zipAll();
}
