import { describe, expect, it } from "vitest";
import { composeFamilyFromSlug } from "@/components/programs/pulse/ProgrammeDetailView";

describe("Stage 5 composition families", () => {
  it("maps seven programmes into exactly four families", () => {
    expect(composeFamilyFromSlug("functional-training")).toBe("structured");
    expect(composeFamilyFromSlug("zumba")).toBe("fluid");
    expect(composeFamilyFromSlug("adult-dance")).toBe("fluid");
    expect(composeFamilyFromSlug("yoga")).toBe("calm");
    expect(composeFamilyFromSlug("wedding-choreography")).toBe("service");
    expect(composeFamilyFromSlug("home-personal-training")).toBe("service");
    expect(composeFamilyFromSlug("online-training")).toBe("service");
  });

  it("keeps Zumba and Dance in one family with distinct variants via tempo", () => {
    expect(composeFamilyFromSlug("zumba")).toBe(composeFamilyFromSlug("adult-dance"));
  });
});
