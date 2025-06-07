import * as React from "react"
import { graphql, PageProps, Link } from "gatsby"
import { getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Slider, { SliderItem } from "../components/Slider"
import * as styles from "./common.module.css"

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

const VisualizationTemplate: React.FC<PageProps<VisualizationTemplateData>> = ({
  data,
}) => {
  const visualization = data.sanityVisualisation

  // Preload original quality images in the background
  React.useEffect(() => {
    if (!visualization?.gallery) return

    // Delay preloading to not interfere with initial page load
    const preloadTimer = setTimeout(() => {
      visualization.gallery.forEach((item, index) => {
        if (item.asset.url) {
          const img = new Image()
          img.src = item.asset.url
          // Optional: Log when preloading completes (remove in production)
          img.onload = () => {
            console.log(
              `Preloaded image ${index + 1}/${visualization.gallery.length}`
            )
          }
          img.onerror = () => {
            console.warn(
              `Failed to preload image ${index + 1}:`,
              item.asset.url
            )
          }
        }
      })
    }, 2000) // Wait 2 seconds after component mount

    return () => clearTimeout(preloadTimer)
  }, [visualization?.gallery])

  if (!visualization) {
    return (
      <Layout
        title="Visualization Not Found"
        keywords={["visualization not found", "KIJ Studio", "error"]}
      >
        <p>Sorry, we couldn't find the visualization you were looking for.</p>
      </Layout>
    )
  }

  // Transform gallery items into SliderItems
  const sliderItems: SliderItem[] = visualization.gallery
    ? visualization.gallery.map((item, index) => ({
        id: index,
        image: item.asset.gatsbyImageData,
        imageAlt: visualization.title, // Use the visualization title as fallback
        title: "", // No caption available
        fullImageUrl: item.asset.url, // Add full image URL for original quality in popup
      }))
    : []

  return (
    <Layout
      title={visualization.title}
      description={visualization.description}
      keywords={[
        "architectural visualization",
        "3D rendering",
        visualization.title,
        "KIJ Studio",
        "visualization project",
      ]}
    >
      <div className={styles.container}>
        {/* Left column - Description */}
        <div className={styles.descriptionColumn}>
          <Link to="/visualizations" className={styles.backButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 12H8.414l3.293-3.293a1 1 0 1 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L8.414 14H19a1 1 0 0 0 0-2z" />
            </svg>
          </Link>
          <div className={styles.descriptionWrapper}>
            <h1 className={styles.title}>{visualization.title}</h1>
            {visualization.description &&
              visualization.description.trim() !== "" && (
                <p className={styles.description}>
                  {visualization.description}
                </p>
              )}
          </div>
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
