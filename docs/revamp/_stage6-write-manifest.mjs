import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("docs/revamp/screenshots/premium-stage-6-trust");
const shots = fs.readdirSync(OUT).filter((f) => f.endsWith(".png")).sort();
const flagFalse = shots.filter((f) => !f.startsWith("synth-"));
const flagTrue = shots.filter((f) => f.startsWith("synth-"));

const manifest = {
  stage: "premium-stage-6-trust",
  primaryEvidence: "flag-false",
  generatedAt: new Date().toISOString(),
  counts: {
    total: shots.length,
    flagFalse: flagFalse.length,
    flagTrue: flagTrue.length,
  },
  screenshots: shots,
  notes: [
    "Primary customer trust evidence uses NEXT_PUBLIC_ENABLE_SYNTHETIC_MEDIA=false.",
    "synth-* shots are local art-direction regression only.",
  ],
};

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(manifest.counts);
