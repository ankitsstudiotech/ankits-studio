import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getTimetableSlots } from "@/content";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { metadata } from "@/app/(marketing)/timetable/page";

const FORBIDDEN_SD =
  /"(@type"\s*:\s*"(Event|Course|Schedule|Offer)"|"(eventSchedule|remainingAttendeeCapacity|availability)")/i;

describe("batch availability route — no fake timetable semantics", () => {
  it("public timetable accessor still returns no invented rows", () => {
    expect(getTimetableSlots()).toEqual([]);
  });

  it("timetable page module does not import or call getTimetableSlots", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "(marketing)", "timetable", "page.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/getTimetableSlots/);
    expect(source).not.toMatch(/BranchTimetable|BatchPreview|TimetablePreview/);
    expect(source).not.toMatch(/\bavailable seats\b|\blive availability\b/i);
    expect(source).toMatch(/AvailabilityEnquiryBuilder/);
    expect(source).toMatch(/FaqBlock/);
    expect(source).toMatch(/6:00 AM to 10:00 PM|6:00 AM and 10:00 PM/);
    expect(source).toMatch(/availability-enquiry/);
    expect(source).not.toMatch(/getTimetableSlots/);
    expect(source).toMatch(/buildWebPageJsonLd/);
  });

  it("metadata uses Batch Availability title and honest description", () => {
    expect(metadata.title).toMatch(/Batch Availability/i);
    const description = String(metadata.description ?? "");
    expect(description.toLowerCase()).toContain("whatsapp");
    expect(description.toLowerCase()).not.toContain("live seat");
    expect(description).toMatch(/6:00 AM|10:00 PM/);
  });

  it("emits only safe WebPage + BreadcrumbList shapes (no Event/Schedule)", () => {
    const page = buildWebPageJsonLd({
      name: "Batch Availability",
      description: "Check current class availability",
      path: "/timetable",
    });
    const crumbs = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Batch Availability", path: "/timetable" },
    ]);
    expect(page["@type"]).toBe("WebPage");
    expect(crumbs["@type"]).toBe("BreadcrumbList");
    expect(serializeJsonLd(page)).not.toMatch(FORBIDDEN_SD);
    expect(serializeJsonLd(crumbs)).not.toMatch(FORBIDDEN_SD);
  });
});
