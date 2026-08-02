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

  it("renders nothing in production without ALLOW_MOCK_PUBLISH (ADR-002 layer 3 already blocks this build anyway)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "");
    const { container } = render(<MockModeIndicator />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders on an ALLOW_MOCK_PUBLISH=true preview build, even though NODE_ENV is production (ADR-013 MOCK-001)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    render(<MockModeIndicator />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status").textContent).toContain("Mock preview");
    expect(screen.getByRole("status").textContent).toMatch(/pending confirmation/i);
  });

  it("labels the banner as a development preview, not a generic preview build, when NODE_ENV is development", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(<MockModeIndicator />);
    expect(screen.getByRole("status").textContent).toContain("Development preview");
    expect(screen.getByRole("status").textContent).toMatch(/noindex/i);
  });
});