import { MetadataRoute } from "next";
import { headerMenus, siteConfig } from "@/config/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteConfig.url;
  
  const routes = headerMenus.map((menu) => ({
    url: `${siteUrl}${menu.path}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 1,
    },
    ...routes,
  ];
}
