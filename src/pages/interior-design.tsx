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
  const interiorsData = data.allSanityInterior.nodes

  // Map the Sanity data to format expected by the Slider component
  const sliderItems: SliderItem[] = interiorsData
    .filter(
      item =>
        item.gallery &&
        item.gallery[0] &&
        getImage(item.gallery[0].asset.gatsbyImageData)
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
      galleryLength: item.gallery.length
    }))

  // Custom hover content renderer
  const renderHoverContent = (item: SliderItem) => {
    const handleLinkClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (item.link) {
        navigate(item.link)
      }
    }

    return (
      <div className={styles.hoverContent}>
        <h3 className={styles.imageTitle}>{item.title}</h3>
        <div className={styles.imageDetails}>
          {item.location && <p>{item.location}</p>}
          {item.livingArea && <p>{item.livingArea} m²</p>}
        </div>
      </div>
    )
  }
  
  // Predicate function for enabling fullscreen view
  const fullScreenPredicate = (item: SliderItem) => {
    return item.singleImageGallery === true;
  };
  
  // Handle click event - prevent navigation for single gallery items
  const handleItemClick = (item: SliderItem) => {
    if (item.singleImageGallery) {
      return;
    }
    return true;
  };

  return (
    <Layout
      title="Interior Design"
      description="Explore our interior design"
      keywords={["interior design", "interior visualization", "home design", "KIJ Studio", "living spaces", "interior projects"]}
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
          }
        }
        _rawGallery
      }
    }
  }
`

export default InteriorsPage
