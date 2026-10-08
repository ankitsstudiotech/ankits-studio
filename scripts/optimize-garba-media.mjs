/**
 * Optimize Garba Night 2026 owner media into web derivatives.
 *
 * Sources (do not serve raw):
 *   media-source/garba-night-2026/garba-night-2026-poster.jpg
 *   media-source/garba-night-2026/garba-night-2026-teaser.mov
 *   media-source/garba-night-2026/garba-night-4-highlights.mp4
 *
 * Outputs:
 *   public/events/garba-night-2026/{poster,teaser,teaser-poster,previous-edition,previous-edition-poster}
 *
 * Usage: node scripts/optimize-garba-media.mjs
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sourceDir = join(root, "media-source/garba-night-2026");
const outDir = join(root, "public/events/garba-night-2026");
mkdirSync(outDir, { recursive: true });

const SOURCES = {
  poster: join(sourceDir, "garba-night-2026-poster.jpg"),
  teaser: join(sourceDir, "garba-night-2026-teaser.mov"),
  previous: join(sourceDir, "garba-night-4-highlights.mp4"),
};

function findFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    "ffmpeg",
    join(
      process.env.LOCALAPPDATA ?? "",
      "Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe",
    ),
  ].filter(Boolean);
  for (const bin of candidates) {
    try {
      execFileSync(bin, ["-version"], { stdio: "ignore" });
      return bin;
    } catch {
      /* try next */
    }
  }
  throw new Error("ffmpeg not found — install ffmpeg or set FFMPEG_PATH");
}

function run(ffmpeg, args) {
  console.log("ffmpeg", args.join(" "));
  execFileSync(ffmpeg, args, { stdio: "inherit" });
}

function requireSource(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label}: ${path}`);
  }
}

const ffmpeg = findFfmpeg();
requireSource(SOURCES.poster, "poster");
requireSource(SOURCES.teaser, "2026 teaser");
requireSource(SOURCES.previous, "previous-edition footage");

const report = {
  generatedAt: new Date().toISOString(),
  sources: Object.fromEntries(
    Object.entries(SOURCES).map(([role, path]) => [
      role,
      { path: path.replace(root + "\\", "").replace(root + "/", ""), bytes: statSync(path).size },
    ]),
  ),
  outputs: [],
};

const posterOut = join(outDir, "poster.webp");
run(ffmpeg, [
  "-y",
  "-i",
  SOURCES.poster,
  "-vf",
  "scale='min(1200,iw)':-2",
  "-c:v",
  "libwebp",
  "-quality",
  "82",
  posterOut,
]);
report.outputs.push({
  role: "poster",
  to: "poster.webp",
  bytes: statSync(posterOut).size,
});

const teaserOut = join(outDir, "teaser.mp4");
const teaserPosterOut = join(outDir, "teaser-poster.webp");
run(ffmpeg, [
  "-y",
  "-i",
  SOURCES.teaser,
  "-vf",
  "scale='min(720,iw)':-2,fps=30",
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-profile:v",
  "main",
  "-crf",
  "26",
  "-movflags",
  "+faststart",
  "-an",
  teaserOut,
]);
run(ffmpeg, [
  "-y",
  "-ss",
  "00:00:01",
  "-i",
  teaserOut,
  "-update",
  "1",
  "-frames:v",
  "1",
  "-c:v",
  "libwebp",
  "-quality",
  "80",
  teaserPosterOut,
]);
report.outputs.push({
  role: "promo-teaser",
  from: "garba-night-2026-teaser.mov",
  to: "teaser.mp4",
  bytes: statSync(teaserOut).size,
  originalBytes: statSync(SOURCES.teaser).size,
  codec: "h264/mp4",
  fps: 30,
  audio: "none",
  note: "Current 2026 promotional animation — not documentary footage",
});

const previousOut = join(outDir, "previous-edition.mp4");
const previousPosterOut = join(outDir, "previous-edition-poster.webp");
// Source is portrait-encoded (464×832) but content is sideways landscape.
// transpose=2 = 90° counter-clockwise → upright landscape ~832×464.
run(ffmpeg, [
  "-y",
  "-i",
  SOURCES.previous,
  "-vf",
  "transpose=2,fps=30",
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-profile:v",
  "main",
  "-crf",
  "28",
  "-movflags",
  "+faststart",
  "-an",
  previousOut,
]);
run(ffmpeg, [
  "-y",
  "-ss",
  "00:00:02",
  "-i",
  previousOut,
  "-update",
  "1",
  "-frames:v",
  "1",
  "-c:v",
  "libwebp",
  "-quality",
  "80",
  previousPosterOut,
]);
report.outputs.push({
  role: "previous-edition",
  from: "garba-night-4-highlights.mp4",
  to: "previous-edition.mp4",
  bytes: statSync(previousOut).size,
  originalBytes: statSync(SOURCES.previous).size,
  codec: "h264/mp4",
  fps: 30,
  audio: "none",
  transform: "transpose=2 (90° counter-clockwise)",
  outputGeometry: "832x464 landscape",
  note: "Garba Night 4.0 — previous edition; never label as 2026 footage. Content was sideways in portrait container; normalized to upright landscape.",
});

const reportPath = join(outDir, "MEDIA-REPORT.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log("Wrote", reportPath);
console.log(JSON.stringify(report, null, 2));
