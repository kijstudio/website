import * as React from "react"
import { graphql, PageProps, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Slider, { SliderItem } from "../components/Slider"
import * as styles from "./common.module.css"

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
  const [isClient, setIsClient] = React.useState(false)

  // Set client-side flag for browser-only operations
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Preload original quality images in the background - only on client side
  React.useEffect(() => {
    if (!isClient || !interior?.gallery) return

    // Delay preloading to not interfere with initial page load
    const preloadTimer = setTimeout(() => {
      interior.gallery.forEach(item => {
        if (item.asset.url) {
          const img = new Image()
          img.src = item.asset.url
          // Only log in development
          if (process.env.NODE_ENV === "development") {
            img.onload = () => {}
            img.onerror = () => {}
          }
        }
      })
    }, 2000) // Wait 2 seconds after component mount

    return () => clearTimeout(preloadTimer)
  }, [interior?.gallery, isClient])

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
              <path d="M19 12H8.414l3.293-3.293a1 1 0 1 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L8.414 14H19a1 1 0 0 0 0-2z" />
            </svg>
          </Link>
          <div className={styles.descriptionWrapper}>
            <h1 className={styles.title}>{interior.title}</h1>
            {interior.description && interior.description.trim() !== "" && (
              <p className={styles.description}>{interior.description}</p>
            )}
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
