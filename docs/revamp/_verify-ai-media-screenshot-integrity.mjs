/**
 * Verify final-production-ai-media screenshot integrity.
 * Usage: node docs/revamp/_verify-ai-media-screenshot-integrity.mjs
 */
import { readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(process.cwd(), "docs/revamp/screenshots/final-production-ai-media");
const MANIFEST = join(ROOT, "manifest.json");
const DOM = join(ROOT, "dom-verification.json");
const OUT = join(process.cwd(), "docs/revamp/AI-MEDIA-SCREENSHOT-INTEGRITY.json");

function pngDimensions(buffer) {
  if (buffer.length < 24) return null;
  const sig = buffer.readUInt32BE(0);
  if (sig !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function parseViewport(v) {
  const [w, h] = v.split("x").map(Number);
  return { width: w, height: h };
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  const domChecks = JSON.parse(await readFile(DOM, "utf8"));
  const results = [];
  let pass = true;

  for (const item of manifest.items) {
    const rel = item.file.replace(/^final-production-ai-media\//, "");
    const filePath = join(ROOT, rel.replace(/\//g, "\\").includes(":") ? rel : rel);
    const abs = join(process.cwd(), "docs/revamp/screenshots", item.file);
    let fileStat;
    let buffer;
    try {
      fileStat = await stat(abs);
      buffer = await readFile(abs);
    } catch {
      pass = false;
      results.push({ file: item.file, ok: false, error: "missing" });
      continue;
    }

    const dims = pngDimensions(buffer);
    const expected = parseViewport(item.viewport);
    const domForPath = domChecks.find((d) => d.path === item.path && d.viewport === item.viewport);

    const row = {
      file: item.file,
      path: item.path,
      viewport: item.viewport,
      bytes: fileStat.size,
      decodablePng: Boolean(dims),
      width: dims?.width ?? null,
      height: dims?.height ?? null,
      nonZeroBytes: fileStat.size > 1024,
      dom: domForPath ?? null,
    };

    if (!row.decodablePng || !row.nonZeroBytes) pass = false;
    if (domForPath) {
      if (domForPath.hasDevelopmentPreviewBanner || domForPath.hasPerImageConceptLabel) pass = false;
      if (!domForPath.hasFooterDisclosure && item.path === "/") pass = false;
    }

    results.push({ ...row, ok: row.decodablePng && row.nonZeroBytes });
  }

  const summary = {
    checkedAt: new Date().toISOString(),
    totalExpected: manifest.items.length,
    totalChecked: results.length,
    allPass: pass && results.every((r) => r.ok),
    decodableCount: results.filter((r) => r.decodablePng).length,
    nonZeroCount: results.filter((r) => r.nonZeroBytes).length,
    results,
  };

  await writeFile(OUT, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ allPass: summary.allPass, total: summary.totalChecked }, null, 2));
  if (!summary.allPass) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
