import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MockModeIndicator } from "./MockModeIndicator";

vi.mock("@/content/content-mode", () => ({
  siteHasUnverifiedContent: true,
}));

describe("MockModeIndicator", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders in development when unverified content exists", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(<MockModeIndicator />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders nothing outside development", () => {
    vi.stubEnv("NODE_ENV", "production");
    const { container } = render(<MockModeIndicator />);
    expect(container).toBeEmptyDOMElement();
  });
});
