import { describe, expect, it } from "vitest";
import { metadata as notFoundMetadata } from "@/app/not-found";
import { baseMetadata } from "@/lib/metadata";

describe("404 robots metadata", () => {
  it("does not put indexable robots on the root layout base metadata", () => {
    expect(baseMetadata.robots).toBeUndefined();
  });

  it("marks not-found as noindex/nofollow", () => {
    expect(notFoundMetadata.robots).toEqual({ index: false, follow: false });
  });
});
