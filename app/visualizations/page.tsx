import type { Metadata } from "next";
import { getVisualizations } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import PageLayout from "@/components/page-layout";
import VisualizationsContent from "./visualizations-content";

export const metadata: Metadata = {
  title: "Visualizations",
  description:
    "Explore our architectural visualizations and 3D renderings at KIJ Studio.",
  keywords: [
    "architectural visualization",
    "3D rendering",
    "architectural design",
    "KIJ Studio",
  ],
};

export default async function VisualizationsPage() {
  const visualizations = await getVisualizations();

  const sliderItems = visualizations
    .filter((item: any) => item.gallery?.[0]?.asset)
    .map((item: any, index: number) => ({
      id: `viz-${index}`,
      title: item.title,
      description: item.description,
      image: urlFor(item.gallery[0].asset).width(800).format("webp").url(),
      imageAlt: item.gallery[0].alt || item.title,
      link: item.slug ? `/visualizations/${item.slug.current}` : undefined,
      singleImageGallery: item.gallery.length === 1,
      galleryLength: item.gallery.length,
      fullImageUrl: item.gallery[0].asset.url,
    }));

  return (
    <PageLayout>
      <VisualizationsContent items={sliderItems} />
    </PageLayout>
  );
}
