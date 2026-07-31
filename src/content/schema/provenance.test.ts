import { describe, expect, it } from "vitest";
import { z } from "zod";
import { provenanced } from "./provenance";

const testSchema = provenanced({ name: z.string() });

describe("provenanced", () => {
  it("rejects a mock record without mockDisclaimer", () => {
    const result = testSchema.safeParse({ dataStatus: "mock", name: "x" });
    expect(result.success).toBe(false);
  });

  it("accepts a mock record with mockDisclaimer", () => {
    const result = testSchema.safeParse({
      dataStatus: "mock",
      name: "x",
      mockDisclaimer: "placeholder",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a reference-only record without mockDisclaimer", () => {
    const result = testSchema.safeParse({ dataStatus: "reference-only", name: "x" });
    expect(result.success).toBe(false);
  });

  it("accepts a reference-only record with mockDisclaimer", () => {
    const result = testSchema.safeParse({
      dataStatus: "reference-only",
      name: "x",
      mockDisclaimer: "owner-supplied pointer, not confirmed",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a verified record without mockDisclaimer", () => {
    const result = testSchema.safeParse({ dataStatus: "verified", name: "x" });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown dataStatus value", () => {
    const result = testSchema.safeParse({ dataStatus: "confirmed", name: "x" });
    expect(result.success).toBe(false);
  });
});
