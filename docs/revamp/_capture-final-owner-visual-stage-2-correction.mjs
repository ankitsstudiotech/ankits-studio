/**
 * Capture final-owner-visual-stage-2-correction screenshot evidence.
 *
 * Usage:
 *   node docs/revamp/_capture-final-owner-visual-stage-2-correction.mjs
 *   node docs/revamp/_capture-final-owner-visual-stage-2-correction.mjs --synthetic
 *
 * Requires a running server at BASE_URL (default http://localhost:3000).
 * Primary set: production build with synthetic=false and no dev/mock banner.
 */
import { mkdir, writeFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROOT = join(process.cwd(), "docs/revamp/screenshots/final-owner-visual-stage-2-correction");
const synthetic = process.argv.includes("--synthetic");
const OUT = synthetic ? join(ROOT, "synthetic-true") : ROOT;

const FULL_390 = [
  "/",
  "/programs",
  "/programs/corporate-wellness",
  "/programs/functional-training",
  "/locations",
  "/about",
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
];

const FULL_768 = ["/", "/programs", "/programs/corporate-wellness", "/about", "/locations"];
const FULL_1440 = FULL_390;
const FULL_1920 = ["/", "/programs", "/programs/corporate-wellness", "/about", "/locations"];

const VIEWPORT_390 = [
  { path: "/", name: "home" },
  { path: "/programs", name: "programs" },
  { path: "/programs/corporate-wellness", name: "corporate-wellness" },
];

const SYNTHETIC_ONLY = [
  { width: 390, paths: ["/", "/programs", "/programs/functional-training", "/programs/yoga", "/about", "/locations"] },
  { width: 1440, paths: ["/", "/programs", "/programs/functional-training", "/programs/yoga", "/about", "/locations"] },
];

function slug(path) {
  return path.replace(/^\//, "").replace(/\//g, "-") || "home";
}

async function verifyDom(page) {
  return page.evaluate(() => {
    const bodyText = document.body.innerText;
    return {
      hasDevelopmentPreviewBanner: /Development preview|Mock preview/i.test(bodyText),
      hasConceptPreviewMarker: /AI concept preview/i.test(bodyText),
      hasNextDevBadge: Boolean(document.querySelector("nextjs-portal")),
      title: document.title,
    };
  });
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

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = [];
  const domChecks = [];

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const jobs = [];
  if (!synthetic) {
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
  } else {
    for (const group of SYNTHETIC_ONLY) {
      for (const path of group.paths) {
        jobs.push({
          dir: `synthetic-${group.width}`,
          viewport: { width: group.width, height: 2000 },
          path,
          fullPage: true,
        });
      }
    }
  }

  for (const job of jobs) {
    const fileName = `${slug(job.path)}${job.name ? `-${job.name}` : ""}.png`;
    const dir = join(OUT, job.dir);
    await mkdir(dir, { recursive: true });
    const outPath = join(dir, fileName);
    await page.setViewportSize(job.viewport);
    await page.goto(`${BASE}${job.path}`, { waitUntil: "networkidle", timeout: 120_000 });
    const dom = await verifyDom(page);
    domChecks.push({ path: job.path, viewport: `${job.viewport.width}x${job.viewport.height}`, ...dom });
    await page.screenshot({ path: outPath, fullPage: job.fullPage });
    const relBase = synthetic ? "final-owner-visual-stage-2-correction/synthetic-true" : "final-owner-visual-stage-2-correction";
    manifest.push({
      file: `${relBase}/${job.dir}/${fileName}`.replace(/\\/g, "/"),
      path: job.path,
      viewport: `${job.viewport.width}x${job.viewport.height}`,
      fullPage: job.fullPage,
      synthetic,
    });
  }

  await browser.close();

  await writeFile(join(OUT, "manifest.json"), JSON.stringify({ capturedAt: new Date().toISOString(), synthetic, items: manifest }, null, 2));
  await writeFile(join(ROOT, synthetic ? "dom-verification-synthetic.json" : "dom-verification.json"), JSON.stringify(domChecks, null, 2));

  if (!synthetic) {
    const primaryPngs = await collectPngs(ROOT);
    console.log(`Primary PNG count: ${primaryPngs.length}`);
  } else {
    const syntheticPngs = await collectPngs(join(ROOT, "synthetic-true"));
    console.log(`Synthetic PNG count: ${syntheticPngs.length}`);
  }
}

async function zipAll() {
  const zipPath = join(process.cwd(), "docs/revamp/screenshots/final-owner-visual-stage-2-correction.zip");
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${ROOT.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
    { stdio: "inherit" },
  );

  const allPngs = await collectPngs(ROOT);
  const falseCount = (await collectPngs(ROOT)).filter((p) => !p.includes("synthetic-true")).length;
  const trueCount = (await collectPngs(join(ROOT, "synthetic-true"))).length;
  console.log("ZIP:", zipPath);
  console.log("Total PNG in tree:", allPngs.length);
  console.log("synthetic=false:", falseCount);
  console.log("synthetic=true:", trueCount);
}

if (process.argv.includes("--zip-only")) {
  await zipAll();
} else {
  await main();
  if (!synthetic) {
    // noop — zip after both passes via shell
  }
}
