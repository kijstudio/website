import * as React from "react"
import { graphql, PageProps } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Slider, { SliderItem } from "../components/Slider"
import * as styles from "./interior.module.css"

interface InteriorTemplateData {
  sanityInterior: {
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

const InteriorTemplate: React.FC<PageProps<InteriorTemplateData>> = ({ data }) => {
  const interior = data.sanityInterior

  if (!interior) {
    return (
      <Layout title="Interior Not Found" keywords={["interior not found", "KIJ Studio", "error"]}>
        <p>Sorry, we couldn't find the interior you were looking for.</p>
      </Layout>
    )
  }

  // Transform gallery items into SliderItems
  const sliderItems: SliderItem[] = interior.gallery ? 
    interior.gallery.map((item, index) => ({
      id: index,
      image: item.asset.gatsbyImageData,
      imageAlt: interior.title, // Use the visualization title as fallback
      title: "" // No caption available
    })) : [];

  return (
    <Layout
      title={interior.title}
      description={interior.description}
      keywords={["interior design", "interior visualization", interior.title, "KIJ Studio", "interior project"]}
    >
      <div className={styles.container}>
        {/* Left column - Description */}
        <div className={styles.descriptionColumn}>
          <h1 className={styles.title}>{interior.title}</h1>
        </div>
        
        {/* Right column - Slider */}
        <div className={styles.sliderColumn}>
          {interior.gallery && interior.gallery.length > 0 && (
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
  query InteriorTemplateQuery($id: String!) {
    sanityInterior(id: { eq: $id }) {
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

export default InteriorTemplate 