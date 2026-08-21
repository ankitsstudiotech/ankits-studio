/**
 * Build public/favicon.ico from the brand 48×48 PNG (RGBA PNG-in-ICO).
 * Placed under public/ so Next/Turbopack does not re-decode it as app metadata.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const srcPng = path.resolve("public/brand/favicon-48.png");
const outIco = path.resolve("public/favicon.ico");

const png = await sharp(srcPng).ensureAlpha().png().toBuffer();
const meta = await sharp(png).metadata();
const w = meta.width ?? 0;
const h = meta.height ?? 0;
if (w !== h || w < 8) {
  throw new Error(`Expected square PNG >=8px, got ${w}x${h}`);
}

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry[0] = w >= 256 ? 0 : w;
entry[1] = h >= 256 ? 0 : h;
entry[2] = 0;
entry[3] = 0;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(6 + 16, 12);

const ico = Buffer.concat([header, entry, png]);
fs.writeFileSync(outIco, ico);
console.log(JSON.stringify({ out: outIco, bytes: ico.length, png: `${w}x${h}` }));
