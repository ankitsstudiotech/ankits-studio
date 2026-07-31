import type { MetadataRoute } from "next";
import { buildRobotsRules } from "@/lib/seo/robots";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsRules();
}
