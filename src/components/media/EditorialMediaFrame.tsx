import Image from "next/image";
import type { CSSProperties } from "react";
import type { FocalPoint, StudioMediaItem } from "@/content/media";
import { isConceptPreview } from "@/lib/concept-preview";
import { isSyntheticMediaEnabled } from "@/lib/media/feature-flag";
import styles from "./pulse-media.module.css";

export type EditorialMediaFrameProps = {
  item: StudioMediaItem;
  className?: string;
  /** Soft left scrim for text-adjacent heroes */
  overlay?: boolean;
  sizes?: string;
  priority?: boolean;
};

function toObjectPosition(point?: FocalPoint): string {
  if (!point) return "50% 50%";
  return `${point.x}% ${point.y}%`;
}

/**
 * Editorial media window — image/video/poster, focal points, optional overlay.
 * Geometry surface when `src` is absent (Stage 4A Part 1).
 */
export function EditorialMediaFrame({
  item,
  className = "",
  overlay = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: EditorialMediaFrameProps) {
  const showSyntheticLabel =
    item.status === "synthetic-preview" &&
    (isSyntheticMediaEnabled() || isConceptPreview());
  const desktopPos = toObjectPosition(item.focalPoint);
  const tabletPos = toObjectPosition(item.tabletFocalPoint ?? item.focalPoint);
  const mobilePos = toObjectPosition(item.mobileFocalPoint ?? item.focalPoint);
  const aspect = (item.aspectRatio || "16/9").replace("/", " / ");
  const mobileAspect = (item.mobileAspectRatio || item.aspectRatio || "16/9").replace(
    "/",
    " / ",
  );
  const style = {
    aspectRatio: aspect,
    ["--media-aspect-mobile" as string]: mobileAspect,
    ["--media-object-position" as string]: desktopPos,
    ["--media-object-position-tablet" as string]: tabletPos,
    ["--media-object-position-mobile" as string]: mobilePos,
  } as CSSProperties;

  return (
    <figure
      className={[styles.frame, className].filter(Boolean).join(" ")}
      style={style}
      data-media-slot={item.slot}
      data-media-status={item.status}
      data-media-kind={item.kind}
      data-media-source={item.source}
    >
      {item.src && item.kind !== "video" ? (
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width ?? 1600}
          height={item.height ?? 900}
          className={styles.frameMedia}
          sizes={sizes}
          priority={priority}
        />
      ) : item.src && item.kind === "video" ? (
        <video
          className={styles.frameMedia}
          muted
          playsInline
          preload="metadata"
          aria-label={item.alt}
        >
          <source src={item.src} />
        </video>
      ) : (
        <div className={styles.geometry} role="img" aria-label={item.alt} />
      )}

      {overlay ? <div className={styles.overlay} aria-hidden /> : null}

      {showSyntheticLabel ? (
        <p className={styles.previewLabel}>AI concept preview</p>
      ) : null}
    </figure>
  );
}
