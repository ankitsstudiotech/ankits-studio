import { TestimonialCard, type TestimonialCardProps } from "./TestimonialCard";
import styles from "./pulse/pulse-home.module.css";

export type CommunityTestimonialsProps = {
  testimonials: TestimonialCardProps[];
};

export function CommunityTestimonials({ testimonials }: CommunityTestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="community-voices"
      className={styles.communityBand}
      aria-labelledby="home-voices-title"
    >
      <h2 id="home-voices-title" className={styles.bandTitle}>
        VOICES
      </h2>
      <p className={styles.disclaimer} style={{ marginBottom: "1.25rem", maxWidth: "48ch" }}>
        Illustrative quotes only — never attributed to a real, identifiable person until
        verified with consent.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.slice(0, 4).map((item, index) => (
          <TestimonialCard key={`${item.attributedName}-${index}`} {...item} />
        ))}
      </div>
    </section>
  );
}
