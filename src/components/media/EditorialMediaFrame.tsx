import Image from "next/image";
import type { CSSProperties } from "react";
import type { StudioMediaItem } from "@/content/media";
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

function objectPosition(item: StudioMediaItem, mobile = false): string {
  const point = mobile && item.mobileFocalPoint ? item.mobileFocalPoint : item.focalPoint;
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
    item.status === "synthetic-preview" && isSyntheticMediaEnabled();
  const aspect = item.aspectRatio.replace("/", " / ");
  const style = {
    aspectRatio: aspect,
    ["--media-object-position" as string]: objectPosition(item),
    ["--media-object-position-mobile" as string]: objectPosition(item, true),
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
          style={{ objectPosition: objectPosition(item) }}
          sizes={sizes}
          priority={priority}
        />
      ) : item.src && item.kind === "video" ? (
        <video
          className={styles.frameMedia}
          style={{ objectPosition: objectPosition(item) }}
          poster={undefined}
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
