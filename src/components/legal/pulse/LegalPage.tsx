import type { ReactNode } from "react";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { RouteOpening } from "@/components/motion";
import styles from "./legal.module.css";

export type LegalPageProps = {
  kicker?: string;
  title: string;
  lastUpdated?: string;
  breadcrumbTrail: Array<{ name: string; path: string }>;
  children: ReactNode;
};

/**
 * Thin Pulse shell for privacy / terms — dark field, readable measure.
 */
export function LegalPage({
  kicker = "Legal",
  title,
  lastUpdated = "August 2026",
  breadcrumbTrail,
  children,
}: LegalPageProps) {
  return (
    <main className={`${styles.page} flex flex-1 flex-col`}>
      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>
      <article className={styles.article}>
        <RouteOpening>
          <p className={styles.kicker}>{kicker}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>Last updated: {lastUpdated}</p>
        </RouteOpening>
        {children}
      </article>
    </main>
  );
}
