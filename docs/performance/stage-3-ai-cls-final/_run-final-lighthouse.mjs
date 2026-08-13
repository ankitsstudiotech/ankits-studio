/**
 * Final CLS stress: Home mobile ×8, Functional mobile ×4.
 * Usage: $env:BASE_URL="http://localhost:3010"; node docs/performance/stage-3-ai-cls-final/_run-final-lighthouse.mjs
 */
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execSync } from "node:child_process";

const BASE = process.env.BASE_URL ?? "http://localhost:3010";
const TMP = join(process.cwd(), "docs/revamp/_lh-tmp");
const OUT = join(process.cwd(), "docs/performance/stage-3-ai-cls-final");

function runLighthouse(url, preset) {
  const out = join(TMP, `final-${preset}-${Date.now()}.json`);
  const cmd = `npx --yes lighthouse "${url}" --quiet --chrome-flags="--headless --no-sandbox" --output=json --output-path="${out}" --preset=${preset} --only-categories=performance`;
  execSync(cmd, { stdio: "pipe", env: process.env });
  const report = JSON.parse(readFileSync(out, "utf8"));
  const a = report.audits;
  const shift = a["layout-shifts"]?.details?.items?.[0];
  return {
    fcpMs: a["first-contentful-paint"]?.numericValue ?? null,
    lcpMs: a["largest-contentful-paint"]?.numericValue ?? null,
    cls: a["cumulative-layout-shift"]?.numericValue ?? null,
    tbtMs: a["total-blocking-time"]?.numericValue ?? null,
    lcpSelector:
      a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.selector ?? null,
    clsCulprit: shift?.node?.selector ?? null,
    clsAfterRect: shift?.node?.boundingRect ?? null,
    reportFile: out,
  };
}

async function main() {
  await mkdir(TMP, { recursive: true });
  await mkdir(OUT, { recursive: true });

  const homeRuns = [];
  for (let i = 0; i < 8; i++) {
    const run = runLighthouse(`${BASE}/`, "perf");
    homeRuns.push(run);
    console.log(`home ${i + 1}/8 CLS=${run.cls} TBT=${run.tbtMs}`);
  }
  const functionalRuns = [];
  for (let i = 0; i < 4; i++) {
    const run = runLighthouse(`${BASE}/programs/functional-training`, "perf");
    functionalRuns.push(run);
    console.log(`functional ${i + 1}/4 CLS=${run.cls} TBT=${run.tbtMs}`);
  }

  const homePass = homeRuns.every((r) => typeof r.cls === "number" && r.cls <= 0.05);
  const functionalPass = functionalRuns.every((r) => typeof r.cls === "number" && r.cls <= 0.05);

  await writeFile(
    join(OUT, "home-lighthouse-8-runs.json"),
    JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl: BASE, pass: homePass, runs: homeRuns }, null, 2),
  );
  await writeFile(
    join(OUT, "functional-lighthouse-4-runs.json"),
    JSON.stringify(
      { capturedAt: new Date().toISOString(), baseUrl: BASE, pass: functionalPass, runs: functionalRuns },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ homePass, functionalPass, homeCls: homeRuns.map((r) => r.cls), functionalCls: functionalRuns.map((r) => r.cls) }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
