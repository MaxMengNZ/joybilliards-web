import type {MetadataRoute} from "next";
import {locales} from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const paths = ["/", "/events", "/booking", "/rankings", "/news", "/profile", "/auth/login", "/membership"]; 
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of paths) {
      entries.push({
        url: `${base}/${locale}${p}`,
        changeFrequency: "daily",
        priority: p === "/" ? 1 : 0.6,
      });
    }
  }
  return entries;
}


