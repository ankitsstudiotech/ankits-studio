import { readFileSync } from "node:fs";

const csv = readFileSync("docs/business/FINAL-OWNER-FORM-2026-08-12.csv", "utf8");
const rows = [];
let row = [];
let cell = "";
let inQuotes = false;
for (let i = 0; i < csv.length; i++) {
  const ch = csv[i];
  const next = csv[i + 1];
  if (ch === '"') {
    if (inQuotes && next === '"') {
      cell += '"';
      i++;
    } else inQuotes = !inQuotes;
  } else if (ch === "," && !inQuotes) {
    row.push(cell);
    cell = "";
  } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
    if (ch === "\r" && next === "\n") i++;
    row.push(cell);
    if (row.some((c) => c.trim())) rows.push(row);
    row = [];
    cell = "";
  } else cell += ch;
}
if (cell || row.length) {
  row.push(cell);
  if (row.some((c) => c.trim())) rows.push(row);
}

const headers = rows[0];
const data = rows[1];
console.log("columns", headers.length);
headers.forEach((h, i) => {
  const v = (data[i] || "").trim();
  if (!v) return;
  console.log(`\n--- ${h} ---\n${v.slice(0, 1200)}${v.length > 1200 ? "…" : ""}`);
});
