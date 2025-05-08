import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Slider from "../components/Slider"
import * as styles from "./visualizations.module.css"

interface VisualizationNode {
  title: string
  description: string
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
  const visualizations = Array(4).fill(data.allSanityVisualisation.nodes).flat();
  
  // Create slide items for the slider
  const sliderItems = visualizations.map((visualization, index) => (
    visualization.gallery[0] && getImage(visualization.gallery[0].asset.gatsbyImageData) && (
      <div className={styles.visualizationWrapper} key={index}>
        <GatsbyImage
          image={getImage(visualization.gallery[0].asset.gatsbyImageData)!}
          alt={visualization.gallery[0].alt || visualization.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
        <div className={styles.hoverContent}>
          <h3 className={styles.imageTitle}>{visualization.title}</h3>
        </div>
      </div>
    )
  ));
  
  // Remove any undefined items (in case some visualizations don't have gallery images)
  const filteredSliderItems = sliderItems.filter(Boolean);

  return (
    <Layout>
      <Seo
        title="Visualizations"
        description="Explore our architectural visualizations and 3D renderings"
      />
      <Slider 
        items={filteredSliderItems}
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
