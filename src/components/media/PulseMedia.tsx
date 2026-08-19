import type { StudioMediaItem } from "@/content/media";
import { EditorialMediaFrame } from "./EditorialMediaFrame";
import { MediaReveal } from "./MediaReveal";

export type PulseMediaProps = {
  item: StudioMediaItem;
  className?: string;
  overlay?: boolean;
  sizes?: string;
  priority?: boolean;
  /** Skip motion wrapper when parent already choreographs */
  reveal?: boolean;
};

/**
 * Primary Pulse media entry — status-aware frame + optional Stage 3 reveal.
 */
export function PulseMedia({
  item,
  className = "",
  overlay = false,
  sizes,
  priority = false,
  reveal = true,
}: PulseMediaProps) {
  const frame = (
    <EditorialMediaFrame
      item={item}
      className={className}
      overlay={overlay}
      sizes={sizes}
      priority={priority}
    />
  );

  if (!reveal) return frame;

  return (
    <MediaReveal treatment={item.motionTreatment ?? "section-reveal"}>
      {frame}
    </MediaReveal>
  );
}
