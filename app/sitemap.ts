import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();

  const projectPages = slugs.map((item) => {
    const prefix =
      item._type === "visualisation" ? "visualizations" : "interior-design";
    return {
      url: `https://kijstudio.com/${prefix}/${item.slug.current}`,
      lastModified: new Date(item._updatedAt),
      priority: 0.6 as const,
    };
  });

  return [
    {
      url: "https://kijstudio.com",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://kijstudio.com/visualizations",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://kijstudio.com/interior-design",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://kijstudio.com/about",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: "https://kijstudio.com/contact",
      lastModified: new Date(),
      priority: 0.7,
    },
    ...projectPages,
  ];
}
