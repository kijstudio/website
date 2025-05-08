import * as React from "react"
import { graphql, PageProps } from "gatsby"
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
        gatsbyImageData: any // Adjust if you have a more specific type
        url: string
      }
      alt: string
      caption?: string
    }[]
    // Add any other fields you need from Sanity
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
    visualization.gallery
    .filter(item => item.asset.gatsbyImageData)
    .map((item, index) => ({
      id: index,
      image: item.asset.gatsbyImageData,
      imageAlt: item.alt || visualization.title,
      title: item.caption
    })) : [];

  return (
    <Layout>
      <Seo 
        title={visualization.title} 
        description={visualization.description} 
        // You might want to add a specific image for social sharing
        // image={visualization.gallery && visualization.gallery.length > 0 ? visualization.gallery[0].asset.url : undefined}
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
            width: 1200
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