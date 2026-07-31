import Image from "next/image";
import type { ReactNode } from "react";

export type MediaFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Decorative frame label shown when mock/placeholder media is used. */
  placeholderLabel?: string;
  children?: ReactNode;
};

/**
 * next/image wrapper with reserved aspect box (CLS-safe) and optional
 * visible placeholder labelling for mock media.
 */
export function MediaFrame({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  placeholderLabel,
  children,
}: MediaFrameProps) {
  return (
    <figure
      className={[
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-surface-sunken",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full object-cover"
      />
      {placeholderLabel ? (
        <figcaption className="absolute bottom-3 left-3 rounded-[var(--radius-sm)] bg-surface-inverse/75 px-2.5 py-1 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-inverse">
          {placeholderLabel}
        </figcaption>
      ) : null}
      {children}
    </figure>
  );
}

export type VideoFrameProps = {
  poster: string;
  title: string;
  className?: string;
  captionNote?: string;
};

/**
 * Non-autoplay video shell — poster only until a real source is wired.
 * Autoplay hero video is out of policy (PERFORMANCE-BUDGET.md).
 */
export function VideoFrame({
  poster,
  title,
  className = "",
  captionNote = "Video placeholder — captions required before any real source ships.",
}: VideoFrameProps) {
  return (
    <figure
      className={[
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-surface-inverse",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- poster is a static mock asset */}
      <img src={poster} alt="" className="aspect-video w-full object-cover opacity-80" />
      <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <span className="rounded-full border border-ink-inverse/40 px-4 py-2 text-sm font-medium text-ink-inverse">
          {title}
        </span>
        <span className="max-w-sm text-[length:var(--text-caption)] text-ink-inverse/80">
          {captionNote}
        </span>
      </figcaption>
    </figure>
  );
}
