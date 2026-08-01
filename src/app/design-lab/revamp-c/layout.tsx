import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import type { Metadata } from "next";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--rc-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--rc-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Revamp C · Movement System · Design lab",
  robots: { index: false, follow: false },
};

export default function RevampCLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
