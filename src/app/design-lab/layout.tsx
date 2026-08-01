import type { Metadata } from "next";

/**
 * Design-lab shell is intentionally thin so revamp prototypes can own their
 * fonts, colour, and layout without inheriting the incumbent studio-shell.
 * The component review page (`/design-lab`) wraps itself in LabShell.
 */
export const metadata: Metadata = {
  title: "Design lab · Ankit's Studio",
  description:
    "Internal design and motion system review surface. Not a public marketing page.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignLabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
