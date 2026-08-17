import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

describe("mobile editorial reduction — Stage 2 regression gate", () => {
  it("homepage no longer carries a Practical information band or four-item FAQ dump", () => {
    const home = read("src/app/(marketing)/page.tsx");
    expect(home).not.toMatch(/Practical information|Practical Information/);
    expect(home).toMatch(/faq-batches/);
    expect(home).toMatch(/faq-batch-times/);
    expect(home).not.toMatch(/faq-hours|faq-registration|faq-whatsapp/i);
  });

  it("about uses directional links instead of a second programme/location directory dump", () => {
    const about = read("src/app/(marketing)/about/page.tsx");
    expect(about).toMatch(/Explore programmes/);
    expect(about).toMatch(/Find a studio/);
    expect(about).not.toMatch(/Browse all programmes|All locations/);
    expect(about).not.toMatch(/about-faq-machine-free/);
    expect(about).toMatch(/[Mm]achine-free is already covered/);
  });

  it("pricing centres the enquiry builder and drops the programme/location directory", () => {
    const pricing = read("src/app/(marketing)/pricing/page.tsx");
    expect(pricing).toMatch(/PricingEnquiryBuilder/);
    expect(pricing).toMatch(/Explore programmes/);
    expect(pricing).toMatch(/Find a studio/);
    expect(pricing).not.toMatch(/Studio services/);
    expect(pricing).not.toMatch(/Other ways to train/);
    expect(pricing).toMatch(/Not a monthly fee/);
  });

  it("batch availability states the vary-by-branch rule once and drops the directory", () => {
    const timetable = read("src/app/(marketing)/timetable/page.tsx");
    expect(timetable).toMatch(/Batch times vary by branch and programme/);
    expect(timetable).toMatch(/AvailabilityEnquiryBuilder/);
    expect(timetable).toMatch(/Explore programmes/);
    expect(timetable).not.toMatch(/Studio services/);
    expect(timetable).toMatch(/6:00 AM to 10:00 PM/);
  });

  it("programme detail removes Format & Delivery duplication and caps related services", () => {
    const detail = read("src/components/programs/pulse/ProgrammeDetailView.tsx");
    expect(detail).not.toMatch(/Format &amp; delivery|Format & delivery/);
    expect(detail).toMatch(/related\.slice\(0, 3\)/);
    expect(detail).toMatch(/Train near you/);
    expect(detail).toMatch(/Find a studio/);
    expect(detail).toMatch(/GENERIC_FAQ_IDS/);
  });

  it("mobile footer uses a compact two-column explore/branches layout at ≤640px", () => {
    const footer = read("src/components/layout/SiteFooter.tsx");
    expect(footer).toMatch(/max-\[640px\]:grid-cols-2/);
    expect(footer).not.toMatch(/accordion|details/i);
  });
});
