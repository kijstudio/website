import { graphql, navigate, PageProps } from "gatsby"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import * as React from "react"
import Layout from "../components/layout"
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
      url: string
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
  const [isClient, setIsClient] = React.useState(false)

  // Set client-side flag for browser-only operations
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const interiorsData = data.allSanityInterior.nodes

  // Map the Sanity data to format expected by the Slider component
  const sliderItems: SliderItem[] = interiorsData
    .filter(
      item =>
        item.gallery &&
        item.gallery[0] &&
        getImage(item.gallery[0].asset.gatsbyImageData),
    )
    .map((item, index) => ({
      id: `interior-${index}`,
      title: item.title,
      description: item.description,
      location: item.location,
      livingArea: item.livingArea,
      image: item.gallery[0].asset.gatsbyImageData,
      imageAlt: item.gallery[0].alt || item.title,
      link: item.slug ? `/interior-design/${item.slug.current}` : undefined,
      singleImageGallery: item.gallery.length === 1,
      galleryLength: item.gallery.length,
      fullImageUrl: item.gallery[0].asset.url,
    }))

  // Preload original quality images for single-image gallery items that can be opened in popup
  React.useEffect(() => {
    if (!isClient || !sliderItems?.length) return

    // Delay preloading to not interfere with initial page load
    const preloadTimer = setTimeout(() => {
      const singleImageItems = sliderItems.filter(
        item => item.singleImageGallery,
      )

      singleImageItems.forEach(item => {
        if (item.fullImageUrl) {
          const img = new Image()
          img.src = item.fullImageUrl
          // Only log in development
          if (process.env.NODE_ENV === "development") {
            img.onload = () => {}
            img.onerror = () => {}
          }
        }
      })
    }, 2000) // Wait 2 seconds after component mount

    return () => clearTimeout(preloadTimer)
  }, [sliderItems, isClient])

  // Custom hover content renderer
  const renderHoverContent = (item: SliderItem) => {
    const shouldRender = item.title || item.location || item.livingArea
    return (
      <div className={styles.hoverContent}>
        {shouldRender && (
          <div className={styles.hoverContentInner}>
            <h3 className={styles.imageTitle}>{item.title}</h3>
            <div className={styles.imageDetails}>
              {item.location && <p>{item.location}</p>}
              {item.livingArea && <p>{item.livingArea} m²</p>}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Predicate function for enabling fullscreen view
  const fullScreenPredicate = (item: SliderItem) => {
    return item.singleImageGallery === true
  }

  // Handle click event - prevent navigation for single gallery items
  const handleItemClick = (item: SliderItem) => {
    if (item.singleImageGallery) {
      return
    }
    return true
  }

  return (
    <Layout
      title="Interior Design"
      description="Explore our interior design"
      keywords={[
        "interior design",
        "interior visualization",
        "home design",
        "KIJ Studio",
        "living spaces",
        "interior projects",
      ]}
    >
      <Slider
        items={sliderItems}
        renderHoverContent={renderHoverContent}
        itemsPerPageDefault={4}
        breakpoints={{ mobile: 768, tablet: 992, desktop: 1200 }}
        mobileItems={1}
        tabletItems={2}
        transitionDuration={500}
        autoplay={true}
        autoplayInterval={5000}
        enableFullScreenView={false}
        fullScreenPredicate={fullScreenPredicate}
        onItemClick={handleItemClick}
      />
    </Layout>
  )
}

export const query = graphql`
  query InteriorsQuery {
    allSanityInterior(sort: { orderRank: ASC }) {
      nodes {
        title
        description
        location
        slug {
          current
        }
        livingArea
        gallery {
          asset {
            gatsbyImageData(
              width: 800
              placeholder: BLURRED
              formats: [AUTO, WEBP]
            )
            url
          }
        }
        _rawGallery
      }
    }
  }
`

export default InteriorsPage
