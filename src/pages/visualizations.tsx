import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { getImage } from "gatsby-plugin-image"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Slider, { SliderItem } from "../components/Slider"
import * as styles from "../components/Slider.module.css"

interface VisualizationNode {
  title: string
  description: string
  slug: {
    current: string
  }
  gallery: {
    asset: {
      gatsbyImageData: any
    }
    alt: string
    caption?: string
  }[]
}

interface VisualizationsPageData {
  allSanityVisualisation: {
    nodes: VisualizationNode[]
  }
}

const VisualizationsPage: React.FC<PageProps<VisualizationsPageData>> = ({
  data,
}) => {
  // Create a flat array of visualizations
  const visualizationsData = Array(4).fill(data.allSanityVisualisation.nodes).flat();
  
  // Map the Sanity data to format expected by the Slider component
  const sliderItems: SliderItem[] = visualizationsData
    .filter(item => item.gallery && item.gallery[0] && getImage(item.gallery[0].asset.gatsbyImageData))
    .map((item, index) => ({
      id: `viz-${index}`,
      title: item.title,
      description: item.description,
      image: item.gallery[0].asset.gatsbyImageData,
      imageAlt: item.gallery[0].alt || item.title,
      link: item.slug ? `/visualizations/${item.slug.current}` : undefined
    }));
  
  // Custom hover content renderer
  const renderHoverContent = (item: SliderItem) => {
    const handleLinkClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (item.link) {
        navigate(item.link);
      }
    };

    return (
      <div className={styles.hoverContent}>
        <h3 className={styles.imageTitle}>{item.title}</h3>
        {item.link && (
          <div 
            className={styles.linkIndicator}
            onClick={handleLinkClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLinkClick(e as any);
              }
            }}
            aria-label={`View details for ${item.title}`}
          >
            View Project
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <Seo
        title="Visualizations"
        description="Explore our architectural visualizations and 3D renderings"
      />
      <Slider 
        items={sliderItems}
        renderHoverContent={renderHoverContent}
        itemsPerPageDefault={4}
        breakpoints={{ mobile: 768, tablet: 992, desktop: 1200 }}
        mobileItems={1}
        tabletItems={2}
        transitionDuration={500}
      />
    </Layout>
  )
}

export const query = graphql`
  query VisualizationsQuery {
    allSanityVisualisation {
      nodes {
        title
        description
        slug {
          current
        }
        gallery {
          asset {
            gatsbyImageData(
              width: 800
              placeholder: BLURRED
              formats: [AUTO, WEBP]
            )
          }
        }
        _rawGallery
      }
    }
  }
`

export default VisualizationsPage
