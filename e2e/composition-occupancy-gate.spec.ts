import { expect, test } from "@playwright/test";

/**
 * Batch 04 — composition occupancy gate (Claude independent scanner heuristics).
 * At >=1366, targeted Root Cause 1 sections must not show:
 *   A: occupancy < 62% on a tall section
 *   B: unused-right > 32% for > 220px of vertical band
 */

const TARGETS: Array<{ route: string; selector: string; label: string }> = [
  { route: "/", selector: "#services", label: "home programme discovery" },
  { route: "/", selector: "#locations", label: "home branch discovery" },
  { route: "/programs", selector: '[data-discovery="programme-index"]', label: "programmes index" },
  { route: "/about", selector: '[data-discovery="meta-index"]', label: "about programme list" },
  {
    route: "/programs/functional-training",
    selector: '[data-discovery="related-close"]',
    label: "functional related+locations",
  },
  {
    route: "/locations/airoli-sector-19",
    selector: '[data-discovery="service-index"][aria-labelledby="branch-services"]',
    label: "branch available services",
  },
];

function measureSection() {
  function isVisible(el: Element) {
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 1 || rect.height <= 1) return false;
    return true;
  }

  function hasOwnText(el: Element) {
    for (const node of el.childNodes) {
      if (node.nodeType === 3 && (node.textContent || "").trim().length > 0) return true;
    }
    return false;
  }

  const MEDIA_TAGS = new Set(["img", "video", "svg", "input", "textarea", "select"]);

  function getLeafCandidates(root: Element) {
    const all = Array.from(
      root.querySelectorAll("h1,h2,h3,h4,p,li,button,a,img,video,svg,input,textarea,select,span,div,dt,dd"),
    );
    const candidates = all.filter((el) => {
      if (!isVisible(el)) return false;
      const tag = el.tagName.toLowerCase();
      if (MEDIA_TAGS.has(tag)) return true;
      return hasOwnText(el);
    });
    return candidates.filter((el) => !candidates.some((o) => o !== el && el.contains(o)));
  }

  function clusterRows(
    rects: Array<{ left: number; right: number; top: number; bottom: number }>,
  ) {
    const sorted = [...rects].sort((a, b) => a.top - b.top);
    const tolerance = 28;
    const rows: Array<{
      centerAvg: number;
      items: typeof rects;
    }> = [];
    for (const r of sorted) {
      const center = (r.top + r.bottom) / 2;
      let row = rows.find((candidate) => Math.abs(candidate.centerAvg - center) < tolerance);
      if (!row) {
        row = { centerAvg: center, items: [] };
        rows.push(row);
      }
      row.items.push(r);
      row.centerAvg =
        row.items.reduce((sum, item) => sum + (item.top + item.bottom) / 2, 0) / row.items.length;
    }
    return rows.map((row) => {
      const items = [...row.items].sort((a, b) => a.left - b.left);
      return {
        rowTop: Math.min(...items.map((item) => item.top)),
        rowBottom: Math.max(...items.map((item) => item.bottom)),
        rowRight: Math.max(...items.map((item) => item.right)),
      };
    });
  }

  const root = document.querySelector("[data-occupancy-target]") as HTMLElement | null;
  if (!root) return { error: "no target" };

  const secRect = root.getBoundingClientRect();
  const cs = window.getComputedStyle(root);
  const padLeft = parseFloat(cs.paddingLeft) || 0;
  const padRight = parseFloat(cs.paddingRight) || 0;
  const innerLeft = secRect.left + padLeft;
  const innerRight = secRect.right - padRight;
  const availableInnerWidth = Math.max(0, innerRight - innerLeft);
  const leaves = getLeafCandidates(root);
  const rects = leaves.map((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
  });
  if (rects.length === 0) return { error: "no content" };

  const leftmost = Math.min(...rects.map((r) => r.left));
  const rightmost = Math.max(...rects.map((r) => r.right));
  const topmost = Math.min(...rects.map((r) => r.top));
  const bottommost = Math.max(...rects.map((r) => r.bottom));
  const occupancyRatio = availableInnerWidth > 0 ? (rightmost - leftmost) / availableInnerWidth : 0;
  const rightEmptyRatio =
    availableInnerWidth > 0 ? Math.max(0, innerRight - rightmost) / availableInnerWidth : 0;
  const rows = clusterRows(rects).map((row) => {
    const rowRightEmpty = Math.max(0, innerRight - row.rowRight);
    const rowRightEmptyRatio = availableInnerWidth > 0 ? rowRightEmpty / availableInnerWidth : 0;
    return { ...row, rowRightEmptyRatio };
  });
  const FLAG_RATIO = 0.32;
  let flaggedBandHeight = 0;
  const sorted = [...rows].sort((a, b) => a.rowTop - b.rowTop);
  for (let i = 0; i < sorted.length; i++) {
    const row = sorted[i]!;
    if (row.rowRightEmptyRatio > FLAG_RATIO) {
      const next = sorted[i + 1];
      const bandBottom = next ? next.rowTop : row.rowBottom;
      flaggedBandHeight += Math.max(0, bandBottom - row.rowTop);
    }
  }
  const maxRowRightEmptyRatio = rows.length
    ? Math.max(...rows.map((row) => row.rowRightEmptyRatio))
    : 0;

  return {
    occupancyRatio,
    rightEmptyRatio,
    maxRowRightEmptyRatio,
    flaggedBandHeight,
    sectionHeight: bottommost - topmost,
  };
}

test.describe("composition occupancy gate — Batch 04 Root Cause 1", () => {
  for (const width of [1536, 1920] as const) {
    const height = width === 1536 ? 730 : 1080;
    for (const target of TARGETS) {
      test(`${target.label} has no P1 occupancy at ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(target.route, { waitUntil: "domcontentloaded" });
        const section = page.locator(target.selector).first();
        await expect(section).toBeVisible();
        await section.evaluate((el) => el.setAttribute("data-occupancy-target", "true"));
        await section.scrollIntoViewIfNeeded();
        const metrics = await page.evaluate(measureSection);
        expect(metrics, target.label).not.toHaveProperty("error");
        const occupancy = Number(metrics.occupancyRatio);
        const flagged = Number(metrics.flaggedBandHeight);
        const h = Number(metrics.sectionHeight);
        const p1A = occupancy < 0.62 && h > 220;
        const p1B = flagged > 220;
        expect(
          { occupancy, flagged, height: h, p1A, p1B, maxRowRE: metrics.maxRowRightEmptyRatio },
          `${target.label} @${width} occupancy=${occupancy.toFixed(2)} flagged=${Math.round(flagged)}px`,
        ).toEqual(expect.objectContaining({ p1A: false, p1B: false }));
      });
    }
  }
});
