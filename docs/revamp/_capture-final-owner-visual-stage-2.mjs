/**
 * Capture final-owner-visual-stage-2 screenshot evidence.
 * Usage: node docs/revamp/_capture-final-owner-visual-stage-2.mjs [--synthetic]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = join(process.cwd(), "docs/revamp/screenshots/final-owner-visual-stage-2");
const synthetic = process.argv.includes("--synthetic");

const FULL_390 = [
  "/",
  "/about",
  "/programs",
  "/programs/corporate-wellness",
  "/programs/functional-training",
  "/programs/yoga",
  "/locations",
  "/locations/airoli-sector-19",
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
];

const FULL_768 = [
  "/",
  "/programs",
  "/programs/corporate-wellness",
  "/about",
  "/locations",
  "/pricing",
];

const FULL_1440 = FULL_390;
const FULL_1920 = ["/", "/programs", "/programs/corporate-wellness", "/about", "/locations", "/pricing"];

const VIEWPORT_390 = [
  { path: "/", name: "home" },
  { path: "/programs", name: "programs" },
  { path: "/programs/corporate-wellness", name: "corporate-wellness" },
  { path: "/about", name: "about" },
  { path: "/locations/airoli-sector-19", name: "airoli-sector-19" },
];

function slug(path) {
  return path.replace(/^\//, "").replace(/\//g, "-") || "home";
}

async function main() {
  const outRoot = synthetic ? join(OUT, "synthetic-true") : OUT;
  await mkdir(outRoot, { recursive: true });
  const manifest = [];

  const browser = await chromium.launch();
  const context = await browser.newContext();
  if (synthetic) {
    await context.addInitScript(() => {
      window.localStorage.setItem("ankits-synthetic-media", "1");
    });
  }
  const page = await context.newPage();

  const jobs = [];
  for (const path of FULL_390) {
    jobs.push({ dir: "full-390", viewport: { width: 390, height: 2000 }, path, fullPage: true });
  }
  for (const path of FULL_768) {
    jobs.push({ dir: "full-768", viewport: { width: 768, height: 2000 }, path, fullPage: true });
  }
  for (const path of FULL_1440) {
    jobs.push({ dir: "full-1440", viewport: { width: 1440, height: 2000 }, path, fullPage: true });
  }
  for (const path of FULL_1920) {
    jobs.push({ dir: "full-1920", viewport: { width: 1920, height: 2000 }, path, fullPage: true });
  }
  for (const item of VIEWPORT_390) {
    jobs.push({
      dir: "viewport-390x844",
      viewport: { width: 390, height: 844 },
      path: item.path,
      fullPage: false,
      name: item.name,
    });
  }
  for (const item of VIEWPORT_390) {
    jobs.push({
      dir: "viewport-1440x900",
      viewport: { width: 1440, height: 900 },
      path: item.path,
      fullPage: false,
      name: item.name,
    });
  }

  if (synthetic) {
    for (const width of [390, 1440]) {
      for (const path of ["/", "/programs", "/programs/functional-training", "/about", "/locations"]) {
        jobs.push({
          dir: `synthetic-${width}`,
          viewport: { width, height: width === 390 ? 2000 : 2000 },
          path,
          fullPage: true,
        });
      }
    }
  }

  for (const job of jobs) {
    const fileName = `${slug(job.path)}${job.name ? `-${job.name}` : ""}.png`;
    const dir = join(outRoot, job.dir);
    await mkdir(dir, { recursive: true });
    const outPath = join(dir, fileName);
    await page.setViewportSize(job.viewport);
    await page.goto(`${BASE}${job.path}`, { waitUntil: "networkidle", timeout: 120_000 });
    await page.screenshot({ path: outPath, fullPage: job.fullPage });
    const relDir = synthetic ? `final-owner-visual-stage-2/synthetic-true/${job.dir}` : `final-owner-visual-stage-2/${job.dir}`;
    manifest.push({
      file: `${relDir}/${fileName}`.replace(/\\/g, "/"),
      path: job.path,
      viewport: `${job.viewport.width}x${job.viewport.height}`,
      fullPage: job.fullPage,
      synthetic,
    });
  }

  await browser.close();
  const manifestPath = join(outRoot, "manifest.json");
  await writeFile(
    manifestPath,
    JSON.stringify({ capturedAt: new Date().toISOString(), synthetic, items: manifest }, null, 2),
  );

  if (!synthetic) {
    const zipPath = join(process.cwd(), "docs/revamp/screenshots/final-owner-visual-stage-2-screenshots.zip");
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${OUT.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
      { stdio: "inherit" },
    );
    console.log("Wrote", zipPath);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
