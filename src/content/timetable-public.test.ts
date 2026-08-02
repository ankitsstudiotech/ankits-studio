import { describe, expect, it } from "vitest";
import { getTimetableSlots } from "@/content";
import { siteHasUnverifiedContent } from "@/content/content-mode";

describe("getTimetableSlots public accessor", () => {
  it("does not return mock/illustrative batch rows for public routes", () => {
    const slots = getTimetableSlots();
    expect(slots.every((slot) => slot.dataStatus === "verified")).toBe(true);
    expect(slots).toHaveLength(0);
  });

  it("still leaves the site in unverified mode while mock timetable rows exist for provenance", () => {
    expect(siteHasUnverifiedContent).toBe(true);
  });

  it("filters verified-only when branch or programme filters are applied", () => {
    expect(getTimetableSlots({ branchSlug: "airoli-sector-19" })).toEqual([]);
    expect(getTimetableSlots({ programmeSlug: "yoga" })).toEqual([]);
  });
});
