import * as React from "react"
import { graphql, PageProps } from "gatsby"
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
      <Layout>
        <Seo title="Visualization Not Found" />
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
    <Layout>
      <Seo 
        title={visualization.title} 
        description={visualization.description} 
      />
      <div className={styles.container}>
        {/* Left column - Description */}
        <div className={styles.descriptionColumn}>
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
            width: 1800
            height: 1200
            placeholder: BLURRED
            formats: [AUTO, WEBP]
          )
          url
        }
      }
      _rawGallery
    }
  }
`

export default VisualizationTemplate 