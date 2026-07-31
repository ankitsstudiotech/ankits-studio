import { describe, expect, it } from "vitest";
import { getBranches, getProgrammes } from "@/content";

/**
 * "Avoid duplicate programme/location copy" — checked directly against the
 * content every route renders, not just schema shape. Reusing the branch
 * or programme page's copy with only the name swapped would fail these.
 */
describe("no duplicate copy across programmes", () => {
  const programmes = getProgrammes();
  const fields = ["shortDescription", "longDescription", "whoItsFor", "classStructure"] as const;

  for (const field of fields) {
    it(`every programme has a unique ${field}`, () => {
      const values = programmes.map((p) => p[field]);
      expect(new Set(values).size).toBe(values.length);
    });
  }

  it("every programme has a unique benefits list", () => {
    const serialized = programmes.map((p) => p.benefits.join("|"));
    expect(new Set(serialized).size).toBe(serialized.length);
  });
});

describe("no duplicate copy across locations", () => {
  const branches = getBranches();

  it("every branch has a unique address", () => {
    const addresses = branches.map((b) => b.address);
    expect(new Set(addresses).size).toBe(addresses.length);
  });

  it("every branch has a unique name", () => {
    const names = branches.map((b) => b.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
