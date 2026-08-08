/**
 * Compare representative LOCAL vs LIVE screenshots (width + approximate pixel delta).
 */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const LOCAL = "docs/revamp/screenshots/final-production-candidate-7bc0e9c";
const LIVE_DIRS = fs
  .readdirSync("docs/revamp/screenshots")
  .filter((d) => d.startsWith("live-v1-visual-verification-"))
  .map((d) => path.join("docs/revamp/screenshots", d));
const LIVE = LIVE_DIRS.sort().slice(-1)[0];

const PAIRS = [
  "full-390-home.png",
  "full-1440-home.png",
  "full-390-about.png",
  "full-1440-about.png",
  "full-390-programs.png",
  "full-1440-programs.png",
  "full-390-programs-functional-training.png",
  "full-1440-programs-functional-training.png",
  "full-390-locations.png",
  "full-1440-locations.png",
  "full-390-locations-airoli-sector-19.png",
  "full-1440-locations-airoli-sector-19.png",
  "full-390-timetable.png",
  "full-1440-timetable.png",
  "full-390-pricing.png",
  "full-1440-pricing.png",
  "full-390-trial.png",
  "full-1440-trial.png",
  "full-390-contact.png",
  "full-1440-contact.png",
  "full-390-privacy-policy.png",
  "full-1440-privacy-policy.png",
  "full-390-trainers.png",
  "full-1440-trainers.png",
  "full-390-transformations.png",
  "full-1440-transformations.png",
  "full-390-not-found.png",
  "full-1440-not-found.png",
];

function readPng(file) {
  const buf = fs.readFileSync(file);
  return PNG.sync.read(buf);
}

function sampleDiff(a, b) {
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  let diff = 0;
  let samples = 0;
  const step = 8;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (a.width * y + x) << 2;
      const j = (b.width * y + x) << 2;
      const d =
        Math.abs(a.data[i] - b.data[j]) +
        Math.abs(a.data[i + 1] - b.data[j + 1]) +
        Math.abs(a.data[i + 2] - b.data[j + 2]);
      if (d > 30) diff++;
      samples++;
    }
  }
  return { diffRatio: diff / samples, widthMatch: a.width === b.width, heightDelta: Math.abs(a.height - b.height) };
}

const results = [];
let fails = 0;
for (const name of PAIRS) {
  const lf = path.join(LOCAL, name);
  const rf = path.join(LIVE, name);
  if (!fs.existsSync(lf) || !fs.existsSync(rf)) {
    results.push({ name, pass: false, reason: "missing" });
    fails++;
    continue;
  }
  const a = readPng(lf);
  const b = readPng(rf);
  const d = sampleDiff(a, b);
  // Fail on width mismatch or extreme structural mismatch (>35% sampled pixels differ)
  const pass = d.widthMatch && d.diffRatio < 0.35;
  if (!pass) fails++;
  results.push({ name, ...d, pass });
  console.log(pass ? "ok" : "FAIL", name, "diffRatio", d.diffRatio.toFixed(3), "hΔ", d.heightDelta);
}

const out = { local: LOCAL, live: LIVE, fails, results };
fs.writeFileSync(path.join(LIVE, "local-vs-live.json"), JSON.stringify(out, null, 2));
console.log("fails", fails);
process.exit(fails ? 1 : 0);
