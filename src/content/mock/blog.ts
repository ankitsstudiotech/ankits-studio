import type { BlogPost } from "../schema";

/**
 * Empty on purpose. Per docs/INFORMATION-ARCHITECTURE.md's Tier 3 guidance,
 * fabricated blog content has weak justification versus fabricated
 * UI-filler content elsewhere — /blog ships as a "coming soon" stub instead
 * of mock posts.
 */
export const mockBlogPosts: BlogPost[] = [];
