"use client";

import type { ReactNode } from "react";
import styles from "./member-stories.module.css";

type MemberStoriesCtaProps = {
  href: string;
  children: ReactNode;
};

/** Low-tempo primary CTA — press feedback only. */
export function MemberStoriesCta({ href, children }: MemberStoriesCtaProps) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={styles.cta}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
