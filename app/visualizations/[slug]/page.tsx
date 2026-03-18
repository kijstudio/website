import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVisualization, getVisualizationSlugs } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import PageLayout from "@/components/page-layout";
import DetailContent from "@/components/detail-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getVisualizationSlugs();
  return slugs.map((item) => ({ slug: item.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const visualization = await getVisualization(slug);
  if (!visualization) return { title: "Not Found" };

  return {
    title: visualization.title,
    description:
      visualization.description ||
      `${visualization.title} - Architectural visualization by KIJ Studio`,
    keywords: [
      "architectural visualization",
      "3D rendering",
      visualization.title,
      "KIJ Studio",
    ],
  };
}

export default async function VisualizationPage({ params }: Props) {
  const { slug } = await params;
  const visualization = await getVisualization(slug);

  if (!visualization) {
    notFound();
  }

  const sliderItems = visualization.gallery
    ? visualization.gallery.map((item: any, index: number) => ({
        id: index,
        image: urlFor(item.asset).width(1600).format("webp").url(),
        imageAlt: item.alt || visualization.title,
        title: "",
        fullImageUrl: item.asset.url,
      }))
    : [];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://kijstudio.com" },
      { "@type": "ListItem", position: 2, name: "Visualizations", item: "https://kijstudio.com/visualizations" },
      { "@type": "ListItem", position: 3, name: visualization.title },
    ],
  };

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: visualization.title,
    description: visualization.description,
    creator: { "@type": "Organization", name: "KIJ Studio" },
    image: visualization.gallery?.map((item: any) => item.asset.url).filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }} />
      <PageLayout>
        <DetailContent
          title={visualization.title}
          description={visualization.description}
          items={sliderItems}
          backLink="/visualizations"
        />
      </PageLayout>
    </>
  );
}
