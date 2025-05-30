import * as React from "react"
import { graphql, PageProps, Link } from "gatsby"
import { getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Slider, { SliderItem } from "../components/Slider"
import * as styles from "./visualization.module.css"

interface VisualizationTemplateData {
  sanityVisualisation: {
    title: string
    description: string
    slug: {
      current: string
    }
    gallery: {
      asset: {
        gatsbyImageData: any
        url: string
      }
    }[]
  }
}

const VisualizationTemplate: React.FC<PageProps<VisualizationTemplateData>> = ({ data }) => {
  const visualization = data.sanityVisualisation

  if (!visualization) {
    return (
      <Layout title="Visualization Not Found" keywords={["visualization not found", "KIJ Studio", "error"]}>
        <p>Sorry, we couldn't find the visualization you were looking for.</p>
      </Layout>
    )
  }

  // Transform gallery items into SliderItems
  const sliderItems: SliderItem[] = visualization.gallery ? 
    visualization.gallery.map((item, index) => ({
      id: index,
      image: item.asset.gatsbyImageData,
      imageAlt: visualization.title, // Use the visualization title as fallback
      title: "" // No caption available
    })) : [];

  return (
    <Layout
      title={visualization.title}
      description={visualization.description}
      keywords={["architectural visualization", "3D rendering", visualization.title, "KIJ Studio", "visualization project"]}
    >
      <div className={styles.container}>
        {/* Left column - Description */}
        <div className={styles.descriptionColumn}>
          <Link to="/visualizations" className={styles.backButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.414l4.293-4.293c0.391-0.391 0.391-1.023 0-1.414s-1.023-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.023 0 1.414l6 6c0.391 0.391 1.023 0.391 1.414 0s0.391-1.023 0-1.414L7.414 13H20c0.552 0 1 0.447 1 1s-0.448 1-1 1z"/>
            </svg>
          </Link>
          <h1 className={styles.title}>{visualization.title}</h1>
        </div>
        
        {/* Right column - Slider */}
        <div className={styles.sliderColumn}>
          {visualization.gallery && visualization.gallery.length > 0 && (
            <Slider 
              items={sliderItems}
              itemsPerPageDefault={2}
              mobileItems={1}
              tabletItems={1}
              breakpoints={{ 
                mobile: 768, 
                tablet: 992, 
                desktop: 1200 
              }}
              enableFullScreenView={true} // Disable fullscreen view in the main gallery
            />
          )}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query VisualizationTemplateQuery($id: String!) {
    sanityVisualisation(id: { eq: $id }) {
      title
      description
      slug {
        current
      }
      gallery {
        asset {
          gatsbyImageData(
            width: 1600
            placeholder: BLURRED
            formats: [AUTO, WEBP]
            fit: MIN
            aspectRatio: null
          )
          url
        }
      }
      _rawGallery
    }
  }
`

export default VisualizationTemplate 