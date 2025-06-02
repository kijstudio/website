import * as React from "react"
import { graphql, PageProps, Link } from "gatsby"
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

const InteriorTemplate: React.FC<PageProps<InteriorTemplateData>> = ({
  data,
}) => {
  const interior = data.sanityInterior

  if (!interior) {
    return (
      <Layout
        title="Interior Not Found"
        keywords={["interior not found", "KIJ Studio", "error"]}
      >
        <p>Sorry, we couldn't find the interior you were looking for.</p>
      </Layout>
    )
  }

  // Transform gallery items into SliderItems
  const sliderItems: SliderItem[] = interior.gallery
    ? interior.gallery.map((item, index) => ({
        id: index,
        image: item.asset.gatsbyImageData,
        imageAlt: interior.title, // Use the visualization title as fallback
        title: "", // No caption available
        fullImageUrl: item.asset.url, // Add full image URL for original quality in popup
      }))
    : []

  return (
    <Layout
      title={interior.title}
      description={interior.description}
      keywords={[
        "interior design",
        "interior visualization",
        interior.title,
        "KIJ Studio",
        "interior project",
      ]}
    >
      <div className={styles.container}>
        {/* Left column - Description */}
        <div className={styles.descriptionColumn}>
          <Link to="/interior-design" className={styles.backButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.414l4.293-4.293c0.391-0.391 0.391-1.023 0-1.414s-1.023-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.023 0 1.414l6 6c0.391 0.391 1.023 0.391 1.414 0s0.391-1.023 0-1.414L7.414 13H20c0.552 0 1 0.447 1 1s-0.448 1-1 1z" />
            </svg>
          </Link>
          <div className={styles.descriptionWrapper}>
            <h1 className={styles.title}>{interior.title}</h1>
            <p className={styles.description}>{interior.description}</p>
          </div>
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
                desktop: 1200,
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
