import type { Metadata } from "next";
import HomeContent from "./home-content";

export const metadata: Metadata = {
  title: "KIJ Studio | Architectural Visualization & Interior Design",
  description:
    "Bringing your dream spaces to life with creative design and breathtaking visuals. Specializing in architectural visualization and interior design.",
  keywords: [
    "KIJ Studio",
    "interior design",
    "visualization",
    "architecture",
    "3D renderings",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "KIJ Studio",
                description:
                  "Bringing your dream spaces to life with creative design and breathtaking visuals. Specializing in architectural visualization and interior design.",
                url: "https://kijstudio.com",
                logo: "https://kijstudio.com/images/logo.png",
                sameAs: ["https://www.instagram.com/kijstudio"],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                },
                areaServed: "Global",
                knowsAbout: [
                  "Interior Design",
                  "Architectural Visualization",
                  "3D Rendering",
                  "Space Design",
                  "Home Design",
                ],
              },
              {
                "@type": "WebSite",
                name: "KIJ Studio",
                url: "https://kijstudio.com",
              },
            ],
          }),
        }}
      />
      <HomeContent />
    </>
  );
}
