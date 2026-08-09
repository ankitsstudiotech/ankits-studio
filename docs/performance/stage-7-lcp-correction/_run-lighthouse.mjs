/**
 * Stage 7 LCP correction — multi-run Lighthouse + LCP element extraction.
 * PLAYWRIGHT_BASE_URL=… HEAD=… node docs/performance/stage-7-lcp-correction/_run-lighthouse.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3717";
const OUT = path.resolve("docs/performance/stage-7-lcp-correction");
const HEAD = process.env.HEAD_SHA || "unknown";
const LH = process.env.LIGHTHOUSE_BIN || "npx";

fs.mkdirSync(OUT, { recursive: true });

function runLh(label, url, formFactor) {
  const outRel = path.join("docs", "performance", "stage-7-lcp-correction", label).replace(/\\/g, "/");
  const finalJson = path.join(OUT, `${label}.json`);
  const htmlPath = path.join(OUT, `${label}.html`);
  const args = [
    "--yes",
    "lighthouse@12.2.1",
    url,
    "--quiet",
    "--chrome-flags=--headless --no-sandbox",
    "--only-categories=performance",
    "--output=json",
    "--output=html",
    `--output-path=${outRel}`,
  ];
  if (formFactor === "desktop") {
    args.push("--preset=desktop");
  } else {
    args.push("--form-factor=mobile");
  }
  const res = spawnSync(LH, args, {
    encoding: "utf8",
    shell: true,
    timeout: 180000,
    cwd: process.cwd(),
  });
  if (res.status !== 0) {
    console.error(label, res.stderr || res.stdout);
    throw new Error(`Lighthouse failed for ${label}`);
  }
  const candidates = [
    `${outRel}.report.json`,
    `${outRel}.json`,
    path.join(OUT, `${label}.report.json`),
    finalJson,
  ];
  let reportPath = candidates.map((p) => path.resolve(p)).find((p) => fs.existsSync(p));
  if (!reportPath) {
    const files = fs.readdirSync(OUT).filter((f) => f.startsWith(label) && f.endsWith(".json"));
    reportPath = files[0] ? path.join(OUT, files[0]) : null;
  }
  if (!reportPath) throw new Error(`No JSON for ${label}`);
  if (path.resolve(reportPath) !== path.resolve(finalJson)) {
    fs.copyFileSync(reportPath, finalJson);
  }
  const htmlCandidates = [
    `${outRel}.report.html`,
    `${outRel}.html`,
    path.join(OUT, `${label}.report.html`),
  ];
  const htmlSrc = htmlCandidates.map((p) => path.resolve(p)).find((p) => fs.existsSync(p));
  if (htmlSrc && path.resolve(htmlSrc) !== path.resolve(htmlPath)) {
    fs.copyFileSync(htmlSrc, htmlPath);
  }
  return JSON.parse(fs.readFileSync(finalJson, "utf8"));
}

function summarize(report) {
  const audits = report.audits || {};
  const lcp = audits["largest-contentful-paint"];
  const lcpEl = audits["largest-contentful-paint-element"];
  let element = null;
  const items = lcpEl?.details?.items;
  if (Array.isArray(items) && items[0]) {
    const node = items[0].node || items[0];
    element = {
      snippet: node?.snippet || node?.nodeLabel || null,
      selector: node?.selector || null,
      nodeLabel: node?.nodeLabel || null,
      type: items[0].type || null,
    };
  } else if (lcpEl?.details?.headings) {
    element = { raw: lcpEl.details };
  }
  return {
    lcpMs: lcp?.numericValue ?? null,
    lcpDisplay: lcp?.displayValue ?? null,
    fcpDisplay: audits["first-contentful-paint"]?.displayValue ?? null,
    clsDisplay: audits["cumulative-layout-shift"]?.displayValue ?? null,
    clsScore: audits["cumulative-layout-shift"]?.numericValue ?? null,
    tbtDisplay: audits["total-blocking-time"]?.displayValue ?? null,
    siDisplay: audits["speed-index"]?.displayValue ?? null,
    element,
  };
}

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const meta = {
  headSha: HEAD,
  base: BASE,
  generatedAt: new Date().toISOString(),
  env: {
    NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA: process.env.NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA ?? "unset",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "unset",
    ALLOW_MOCK_PUBLISH: process.env.ALLOW_MOCK_PUBLISH ?? "unset",
  },
};

const homeRuns = [];
const functionalRuns = [];

for (let i = 1; i <= 3; i++) {
  console.log(`home run ${i}`);
  const r = runLh(`home-run-${i}`, `${BASE}/`, "mobile");
  homeRuns.push(summarize(r));
}
for (let i = 1; i <= 3; i++) {
  console.log(`functional run ${i}`);
  const r = runLh(`functional-run-${i}`, `${BASE}/programs/functional-training`, "mobile");
  functionalRuns.push(summarize(r));
}
console.log("pricing desktop");
const pricing = summarize(runLh("pricing-desktop", `${BASE}/pricing`, "desktop"));

const summary = {
  ...meta,
  home: {
    runs: homeRuns,
    medianLcpMs: median(homeRuns.map((r) => r.lcpMs)),
    medianLcpDisplay: `${(median(homeRuns.map((r) => r.lcpMs)) / 1000).toFixed(1)} s`,
  },
  functional: {
    runs: functionalRuns,
    medianLcpMs: median(functionalRuns.map((r) => r.lcpMs)),
    medianLcpDisplay: `${(median(functionalRuns.map((r) => r.lcpMs)) / 1000).toFixed(1)} s`,
  },
  pricingDesktop: pricing,
};

fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(
  path.join(OUT, "home-lcp-element.json"),
  JSON.stringify(
    {
      headSha: HEAD,
      generatedAt: meta.generatedAt,
      runs: homeRuns.map((r, i) => ({
        run: i + 1,
        lcpDisplay: r.lcpDisplay,
        element: r.element,
      })),
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(summary, null, 2));
