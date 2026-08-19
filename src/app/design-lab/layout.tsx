import type { Metadata } from "next";
import "@/components/design-lab/isolation.css";
import { designLabRobots } from "./design-lab-robots";

/**
 * Design-lab shell: route-level SEO protection for every /design-lab/** URL.
 * Prototypes own fonts/colour via nested layouts + frozen CSS modules.
 * Incumbent component review lives at /design-lab/components.
 */
export const metadata: Metadata = {
  title: "Design lab · Ankit's Studio",
  description:
    "Internal visual concept prototypes and design review. Not a public marketing page.",
  robots: designLabRobots,
};

export default function DesignLabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-design-lab-shell="true" data-noindex="true">
      {children}
    </div>
  );
}
