import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInterior, getInteriorSlugs } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import PageLayout from "@/components/page-layout";
import DetailContent from "@/components/detail-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getInteriorSlugs();
  return slugs.map((item) => ({ slug: item.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const interior = await getInterior(slug);
  if (!interior) return { title: "Not Found" };

  return {
    title: interior.title,
    description:
      interior.description ||
      `${interior.title} - Interior design by KIJ Studio`,
    keywords: [
      "interior design",
      "interior visualization",
      interior.title,
      "KIJ Studio",
    ],
  };
}

export default async function InteriorPage({ params }: Props) {
  const { slug } = await params;
  const interior = await getInterior(slug);

  if (!interior) {
    notFound();
  }

  const sliderItems = interior.gallery
    ? interior.gallery.map((item: any, index: number) => ({
        id: index,
        image: urlFor(item.asset).width(1600).format("webp").url(),
        imageAlt: item.alt || interior.title,
        title: "",
        fullImageUrl: item.asset.url,
      }))
    : [];

  return (
    <PageLayout>
      <DetailContent
        title={interior.title}
        description={interior.description}
        items={sliderItems}
        backLink="/interior-design"
      />
    </PageLayout>
  );
}
