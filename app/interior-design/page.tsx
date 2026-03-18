import type { Metadata } from "next";
import { getInteriors } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import PageLayout from "@/components/page-layout";
import InteriorDesignContent from "./interior-design-content";

export const metadata: Metadata = {
  title: "Interior Design",
  description: "Explore our interior design projects at KIJ Studio.",
  keywords: [
    "interior design",
    "interior visualization",
    "home design",
    "KIJ Studio",
    "living spaces",
  ],
};

export default async function InteriorDesignPage() {
  const interiors = await getInteriors();

  const sliderItems = interiors
    .filter((item: any) => item.gallery?.[0]?.asset)
    .map((item: any, index: number) => ({
      id: `interior-${index}`,
      title: item.title,
      description: item.description,
      location: item.location,
      livingArea: item.livingArea,
      image: urlFor(item.gallery[0].asset).width(800).format("webp").url(),
      imageAlt: item.gallery[0].alt || item.title,
      link: item.slug ? `/interior-design/${item.slug.current}` : undefined,
      singleImageGallery: item.gallery.length === 1,
      galleryLength: item.gallery.length,
      fullImageUrl: item.gallery[0].asset.url,
    }));

  return (
    <PageLayout>
      <InteriorDesignContent items={sliderItems} />
    </PageLayout>
  );
}
