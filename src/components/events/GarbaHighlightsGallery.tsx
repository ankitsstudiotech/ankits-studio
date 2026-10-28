import Image from "next/image";
import type { GarbaGalleryImage } from "@/content/events/garba-night-2026";
import styles from "./garba-night.module.css";

export type GarbaHighlightsGalleryProps = {
  images: readonly GarbaGalleryImage[];
};

/**
 * Editorial photo grid for concluded Garba Night 2026 archive.
 * No lightbox / carousel dependency — CSS grid only.
 */
export function GarbaHighlightsGallery({ images }: GarbaHighlightsGalleryProps) {
  return (
    <ul className={styles.highlightsGallery} aria-label="Garba Night 2026 photos">
      {images.map((image) => (
        <li
          key={image.id}
          className={[
            styles.highlightsGalleryItem,
            image.span === "wide"
              ? styles.highlightsGalleryWide
              : image.span === "tall"
                ? styles.highlightsGalleryTall
                : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={
              image.span === "wide"
                ? "(max-width: 767px) 100vw, (max-width: 1199px) 100vw, 72rem"
                : "(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 36rem"
            }
            className={styles.highlightsGalleryImage}
            loading="lazy"
          />
        </li>
      ))}
    </ul>
  );
}
