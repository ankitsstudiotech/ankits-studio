import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import "@/styles/studio.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600", "700"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

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
  return (
    <div
      className={[
        syne.variable,
        figtree.variable,
        "studio-shell has-sticky-cta",
        "flex min-h-full flex-col",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
