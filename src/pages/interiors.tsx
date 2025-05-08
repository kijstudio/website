import * as React from "react"
import { graphql, PageProps, HeadFC } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Slider from "../components/Slider"
import * as styles from "./interiors.module.css"

interface InteriorNode {
  title: string
  description: string
  location: string
  livingArea: number
  gallery: {
    asset: {
      gatsbyImageData: any
    }
    alt: string
    caption?: string
  }[]
}

interface InteriorsPageData {
  allSanityInterior: {
    nodes: InteriorNode[]
  }
}

const InteriorsPage: React.FC<PageProps<InteriorsPageData>> = ({ data }) => {
  const interiors = Array(4).fill(data.allSanityInterior.nodes).flat();

  // Create slide items for the slider
  const sliderItems = interiors.map((interior, index) => (
    interior.gallery[0] && getImage(interior.gallery[0].asset.gatsbyImageData) && (
      <div className={styles.interiorWrapper} key={index}>
        <GatsbyImage
          image={getImage(interior.gallery[0].asset.gatsbyImageData)!}
          alt={interior.gallery[0].alt || interior.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
        <div className={styles.hoverContent}>
          <div className={styles.imageDetails}>
            {interior.location && <p>{interior.location}</p>}
            {interior.livingArea && <p>{interior.livingArea} m²</p>}
          </div>
        </div>
      </div>
    )
  ));
  
  // Remove any undefined items (in case some interiors don't have gallery images)
  const filteredSliderItems = sliderItems.filter(Boolean);

  return (
    <Layout>
      <Seo
        title="Interiors"
        description="Explore our interior design and architectural visualizations"
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

export const Head: HeadFC = () => <Seo title="Interiors" />

export const query = graphql`
  query InteriorsQuery {
    allSanityInterior {
      nodes {
        title
        description
        location
        livingArea
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

export default InteriorsPage 