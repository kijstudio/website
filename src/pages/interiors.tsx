import * as React from "react"
import { graphql, PageProps, HeadFC } from "gatsby"
import { getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Slider, { SliderItem } from "../components/Slider"
import * as styles from "../components/Slider.module.css"

interface InteriorNode {
  title: string
  description: string
  location: string
  livingArea: number
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

interface InteriorsPageData {
  allSanityInterior: {
    nodes: InteriorNode[]
  }
}

const InteriorsPage: React.FC<PageProps<InteriorsPageData>> = ({ data }) => {
  const interiorsData = Array(4).fill(data.allSanityInterior.nodes).flat();

  // Map the Sanity data to format expected by the Slider component
  const sliderItems: SliderItem[] = interiorsData
    .filter(item => item.gallery && item.gallery[0] && getImage(item.gallery[0].asset.gatsbyImageData))
    .map((item, index) => ({
      id: `interior-${index}`,
      title: item.title,
      description: item.description,
      location: item.location,
      livingArea: item.livingArea,
      image: item.gallery[0].asset.gatsbyImageData,
      imageAlt: item.gallery[0].alt || item.title
    }));
  
  // Custom hover content renderer
  const renderHoverContent = (item: SliderItem) => (
    <div className={styles.hoverContent}>
      <h3 className={styles.imageTitle}>{item.title}</h3>
      <div className={styles.imageDetails}>
        {item.location && <p>{item.location}</p>}
        {item.livingArea && <p>{item.livingArea} m²</p>}
      </div>
    </div>
  );

  return (
    <Layout>
      <Seo
        title="Interiors"
        description="Explore our interior design and architectural visualizations"
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