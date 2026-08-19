const base = "https://ankits-studio.vercel.app";
const routes = [
  "/",
  "/about",
  "/programs",
  "/programs/functional-training",
  "/programs/yoga",
  "/locations",
  "/locations/airoli-sector-19",
  "/locations/airoli-sector-8",
  "/locations/ghansoli",
  "/locations/thane",
  "/pricing",
  "/timetable",
  "/trial",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  "/locations/airoli",
  "/book-a-free-trial",
  "/programs/not-a-real-slug",
  "/blog/sample-starting-with-strength",
  "/trainers",
  "/transformations",
  "/blog",
];

for (const r of routes) {
  const res = await fetch(base + r, { redirect: "manual" });
  const loc = res.headers.get("location") || "";
  let body = "";
  if (res.status !== 308 && res.status !== 307 && res.status !== 301 && res.status !== 302) {
    body = await res.text();
  }
  const robotsMatch =
    body.match(/name=["']robots["']\s+content=["']([^"']+)["']/i) ||
    body.match(/content=["']([^"']+)["']\s+name=["']robots["']/i);
  const canonMatch =
    body.match(/rel=["']canonical["']\s+href=["']([^"']+)["']/i) ||
    body.match(/href=["']([^"']+)["']\s+rel=["']canonical["']/i);
  const robots = robotsMatch?.[1] || "-";
  const canon = canonMatch?.[1] || "-";
  const synth = /AI concept preview/i.test(body) ? "LEAK" : "ok";
  const mock = /Mock preview|Development preview/i.test(body) ? "LEAK" : "ok";
  console.log([r, res.status, loc || "-", synth, mock, robots, canon].join(" | "));
}
