import { graphql, PageProps } from "gatsby"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import * as React from "react"
import Layout from "../components/layout"
import Slider, { SliderItem } from "../components/Slider"
import * as styles from "../components/Slider.module.css"
import breakpoints from "../styles/breakpoints"

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
  const visualizationsData = data.allSanityVisualisation.nodes
  
  // Map the Sanity data to format expected by the Slider component
  const sliderItems: SliderItem[] = visualizationsData
    .filter(item => item.gallery && item.gallery[0] && item.gallery[0].asset)
    .filter(item => getImage(item.gallery[0].asset.gatsbyImageData))
    .map((item, index) => ({
      id: `viz-${index}`,
      title: item.title,
      description: item.description,
      image: item.gallery[0].asset.gatsbyImageData,
      imageAlt: item.gallery[0].alt || item.title,
      link: item.slug ? `/visualizations/${item.slug.current}` : undefined,
      // Add flag to identify items with only one gallery image
      singleImageGallery: item.gallery.length === 1,
      // Add the original gallery length for reference
      galleryLength: item.gallery.length
    }));
  
  // Custom hover content renderer
  const renderHoverContent = (item: SliderItem) => {
    return (
      <div className={styles.hoverContent}>
        <h3 className={styles.imageTitle}>{item.title}</h3>
      </div>
    );
  };

  // Predicate function for enabling fullscreen view
  const fullScreenPredicate = (item: SliderItem) => {
    // Enable fullscreen view for items with only one gallery image
    return item.singleImageGallery === true;
  };

  // Handle click event - prevent navigation for single gallery items
  const handleItemClick = (item: SliderItem) => {
    if (item.singleImageGallery) {
      // For single gallery items, let the fullscreen predicate handle it
      return;
    }
    // For multi-gallery items, use default navigation
    return true;
  };

  return (
    <Layout
      title="Visualizations"
      description="Explore our architectural visualizations"
      keywords={["architectural visualization", "3D rendering", "architectural design", "KIJ Studio", "visualization projects"]}
    >
      <Slider 
        items={sliderItems}
        renderHoverContent={renderHoverContent}
        itemsPerPageDefault={4}
        breakpoints={{ mobile: breakpoints.md, tablet: breakpoints.lg, desktop: breakpoints.xl }}
        mobileItems={1}
        tabletItems={2}
        transitionDuration={500}
        enableFullScreenView={false} // Disable global fullscreen
        fullScreenPredicate={fullScreenPredicate} // Use per-item fullscreen
        onItemClick={handleItemClick}
      />
    </Layout>
  )
}

export const query = graphql`
  query VisualizationsQuery {
    allSanityVisualisation(sort: {orderRank: ASC}) {
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
