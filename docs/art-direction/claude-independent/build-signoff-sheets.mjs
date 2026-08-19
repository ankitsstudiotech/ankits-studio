// QA-only. Final Phase D sign-off evidence for the art-direction audit.
// Composes fresh POST-DEPLOY live-production screenshots (captured by
// docs/visual-audit/claude-independent/scan.mjs) into contact-sheet PNGs via
// an HTML grid + Playwright screenshot — same technique as the prior
// batches' build-batchNN-sheets.mjs scripts, no new dependency. Not
// application code. Sheets kept narrow (2-4 images) per the Batch 05
// legibility lesson.
import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(__dirname, "..", "..", "visual-audit", "claude-independent", "screenshots");
const OUT = path.join(__dirname, "..", "screenshots", "final-claude-signoff");

function toFileUrl(p) {
  return "file:///" + p.replace(/\\/g, "/");
}

function page(title, columns, items, colWidth = 460) {
  const cells = items
    .map(
      (it) => `
    <figure>
      <figcaption>${it.label}</figcaption>
      <img src="${toFileUrl(it.src)}" />
    </figure>`
    )
    .join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    body { margin:0; background:#0a0a0a; font-family: -apple-system, Arial, sans-serif; }
    h1 { color:#fff; font-size:19px; padding:16px 20px; margin:0; }
    .grid { display:grid; grid-template-columns: repeat(${columns}, ${colWidth}px); gap: 16px; padding: 0 20px 24px; align-items: start; }
    figure { margin:0; background:#151515; border:1px solid #333; }
    figcaption { color:#8ef5c8; font: 11px/1.4 monospace; padding:6px 8px; background:#000; }
    img { display:block; width:100%; height:auto; }
  </style>
  </head><body>
  <h1>${title}</h1>
  <div class="grid">${cells}</div>
  </body></html>`;
}

async function render(html, outFile, viewportWidth) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: viewportWidth, height: 1200 } });
  const p = await ctx.newPage();
  const tmpHtml = outFile.replace(/\.png$/, ".html");
  await writeFile(tmpHtml, html, "utf8");
  await p.goto(toFileUrl(tmpHtml));
  await p.waitForTimeout(400);
  await p.screenshot({ path: outFile, fullPage: true });
  await browser.close();
  console.log("saved", outFile);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  await render(
    page("01 — Home final — LIVE post-fix", 3, [
      { label: "Home @ 390x844", src: path.join(SHOTS, "home__390x844.png") },
      { label: "Home @ 1536x730", src: path.join(SHOTS, "home__1536x730.png") },
      { label: "Home @ 1920x1080", src: path.join(SHOTS, "home__1920x1080.png") },
    ]),
    path.join(OUT, "01-home-final.png"),
    1460
  );

  await render(
    page("02 — Programmes index final — LIVE post-fix", 3, [
      { label: "/programs @ 390x844", src: path.join(SHOTS, "programs__390x844.png") },
      { label: "/programs @ 1536x730", src: path.join(SHOTS, "programs__1536x730.png") },
      { label: "/programs @ 1920x1080", src: path.join(SHOTS, "programs__1920x1080.png") },
    ]),
    path.join(OUT, "02-programmes-final.png"),
    1460
  );

  await render(
    page("03 — Programme families final — LIVE post-fix @ 1536x730", 4, [
      { label: "Functional — STRUCTURED", src: path.join(SHOTS, "programs_functional-training__1536x730.png") },
      { label: "Zumba — FLUID", src: path.join(SHOTS, "programs_zumba__1536x730.png") },
      { label: "Yoga — CALM", src: path.join(SHOTS, "programs_yoga__1536x730.png") },
      { label: "Corporate Wellness — SERVICE", src: path.join(SHOTS, "programs_corporate-wellness__1536x730.png") },
    ], 380),
    path.join(OUT, "03-programme-families-final.png"),
    1620
  );

  await render(
    page("04 — About final — LIVE post-fix", 2, [
      { label: "/about @ 1536x730", src: path.join(SHOTS, "about__1536x730.png") },
      { label: "/about @ 390x844", src: path.join(SHOTS, "about__390x844.png") },
    ]),
    path.join(OUT, "04-about-final.png"),
    1020
  );

  await render(
    page("05 — Locations index final — LIVE post-fix", 2, [
      { label: "/locations @ 1536x730", src: path.join(SHOTS, "locations__1536x730.png") },
      { label: "/locations @ 390x844", src: path.join(SHOTS, "locations__390x844.png") },
    ]),
    path.join(OUT, "05-locations-final.png"),
    1020
  );

  await render(
    page("06 — Branches final — LIVE post-fix @ 1536x730", 2, [
      { label: "Airoli Sector 19", src: path.join(SHOTS, "locations_airoli-sector-19__1536x730.png") },
      { label: "Airoli Sector 8", src: path.join(SHOTS, "locations_airoli-sector-8__1536x730.png") },
      { label: "Ghansoli", src: path.join(SHOTS, "locations_ghansoli__1536x730.png") },
      { label: "Thane", src: path.join(SHOTS, "locations_thane__1536x730.png") },
    ], 620),
    path.join(OUT, "06-branches-final.png"),
    1300
  );

  await render(
    page("07 — Google Reviews final — LIVE post-fix", 2, [
      { label: "Home reviews @ 1536x730 (full page)", src: path.join(SHOTS, "home__1536x730.png") },
      { label: "Home reviews @ 390x844 (full page)", src: path.join(SHOTS, "home__390x844.png") },
    ]),
    path.join(OUT, "07-reviews-final.png"),
    1020
  );

  await render(
    page("08 — Header + footer final — LIVE post-fix @ 1536x730", 3, [
      { label: "Home (header+footer visible in full page)", src: path.join(SHOTS, "home__1536x730.png") },
      { label: "About (header+footer)", src: path.join(SHOTS, "about__1536x730.png") },
      { label: "Locations (header+footer)", src: path.join(SHOTS, "locations__1536x730.png") },
    ]),
    path.join(OUT, "08-header-footer-final.png"),
    1460
  );

  await render(
    page("09 — Utility routes final — LIVE post-fix @ 1536x730", 2, [
      { label: "/pricing", src: path.join(SHOTS, "pricing__1536x730.png") },
      { label: "/timetable", src: path.join(SHOTS, "timetable__1536x730.png") },
      { label: "/trial", src: path.join(SHOTS, "trial__1536x730.png") },
      { label: "/contact", src: path.join(SHOTS, "contact__1536x730.png") },
    ], 620),
    path.join(OUT, "09-utility-final.png"),
    1300
  );

  await render(
    page("10 — Mobile final (390x844) — LIVE post-fix", 4, [
      { label: "Home", src: path.join(SHOTS, "home__390x844.png") },
      { label: "Programmes", src: path.join(SHOTS, "programs__390x844.png") },
      { label: "About", src: path.join(SHOTS, "about__390x844.png") },
      { label: "Locations", src: path.join(SHOTS, "locations__390x844.png") },
    ], 380),
    path.join(OUT, "10-mobile-final.png"),
    1620
  );

  await render(
    page("11 — 1536x730 final — LIVE post-fix", 3, [
      { label: "Home", src: path.join(SHOTS, "home__1536x730.png") },
      { label: "Functional Training", src: path.join(SHOTS, "programs_functional-training__1536x730.png") },
      { label: "Airoli Sector 19", src: path.join(SHOTS, "locations_airoli-sector-19__1536x730.png") },
    ]),
    path.join(OUT, "11-1536-final.png"),
    1460
  );

  await render(
    page("12 — 1920x1080 final — LIVE post-fix", 3, [
      { label: "Home", src: path.join(SHOTS, "home__1920x1080.png") },
      { label: "Functional Training", src: path.join(SHOTS, "programs_functional-training__1920x1080.png") },
      { label: "Airoli Sector 19", src: path.join(SHOTS, "locations_airoli-sector-19__1920x1080.png") },
    ]),
    path.join(OUT, "12-1920-final.png"),
    1460
  );

  console.log("ALL SIGNOFF SHEETS BUILT");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
