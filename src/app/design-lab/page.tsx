import Link from "next/link";

const prototypes = [
  {
    code: "A",
    href: "/design-lab/revamp-a",
    title: "Revamp A — Kinetic Editorial",
    note: "Agent-recommended direction (historical). Preserved frozen artefact.",
  },
  {
    code: "B",
    href: "/design-lab/revamp-b",
    title: "Revamp B — Studio Pulse",
    note: "Owner-selected production direction. Prototype remains the frozen baseline.",
  },
  {
    code: "C",
    href: "/design-lab/revamp-c",
    title: "Revamp C — Movement System",
    note: "Preserved alternative concept. Do not delete or silently restyle.",
  },
] as const;

export default function DesignLabIndexPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.25rem 3rem",
        fontFamily: "system-ui, sans-serif",
        background: "#111",
        color: "#f4f1ea",
        lineHeight: 1.5,
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#9a958c",
          margin: "0 0 0.75rem",
        }}
      >
        Design lab · noindex · internal only
      </p>
      <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.75rem", fontWeight: 650 }}>
        Art-direction prototypes
      </h1>
      <p style={{ maxWidth: "42rem", margin: "0 0 2rem", color: "#c8c0b0" }}>
        These are visual concept prototypes, not three complete production
        websites.
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
        {prototypes.map((item) => (
          <li
            key={item.code}
            style={{
              border: "1px solid #333",
              padding: "1rem 1.1rem",
              background: "#18181b",
            }}
          >
            <Link
              href={item.href}
              style={{ color: "#fff", fontWeight: 600, textDecoration: "none" }}
            >
              {item.title}
            </Link>
            <p style={{ margin: "0.4rem 0 0", fontSize: "0.9rem", color: "#9a958c" }}>
              {item.note}
            </p>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "2rem", fontSize: "0.85rem", color: "#7a756c" }}>
        Incumbent component review (not a revamp prototype):{" "}
        <Link href="/design-lab/components" style={{ color: "#c8c0b0" }}>
          /design-lab/components
        </Link>
      </p>
    </main>
  );
}
