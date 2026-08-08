/**
 * Compare LOCAL vs LIVE PNG widths and sampled byte similarity (no pngjs).
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), len: buf.length };
}

function sampleHash(file) {
  const buf = fs.readFileSync(file);
  // Sample evenly spaced bytes for coarse structural fingerprint
  const step = Math.max(1, Math.floor(buf.length / 2048));
  const samples = [];
  for (let i = 0; i < buf.length; i += step) samples.push(buf[i]);
  return crypto.createHash("sha256").update(Buffer.from(samples)).digest("hex");
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
  const a = pngSize(lf);
  const b = pngSize(rf);
  const widthMatch = a.width === b.width;
  const heightRatio =
    Math.min(a.height, b.height) / Math.max(a.height, b.height);
  // Allow height drift from fonts/CDN timing; fail only on width or extreme height mismatch
  const pass = widthMatch && heightRatio > 0.85;
  if (!pass) fails++;
  results.push({
    name,
    local: a,
    live: b,
    widthMatch,
    heightRatio: Number(heightRatio.toFixed(3)),
    sameSampleHash: sampleHash(lf) === sampleHash(rf),
    pass,
  });
  console.log(
    pass ? "ok" : "FAIL",
    name,
    `w ${a.width}/${b.width}`,
    `h ${a.height}/${b.height}`,
    `hr ${heightRatio.toFixed(3)}`,
  );
}

const out = { local: LOCAL, live: LIVE, fails, results };
fs.writeFileSync(path.join(LIVE, "local-vs-live.json"), JSON.stringify(out, null, 2));
console.log("fails", fails, "live", LIVE);
process.exit(fails ? 1 : 0);
