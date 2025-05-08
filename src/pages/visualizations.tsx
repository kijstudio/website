import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { useState } from "react"
import { breakpoints } from "../styles/breakpoints"
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
  const visualizations = Array(4).fill(data.allSanityVisualisation.nodes).flat()

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const maxIndex = visualizations.length - itemsPerPage
  
  // Calculate number of items per page based on screen size
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      // For mobile screens (xs and sm breakpoints), always show only 1 tile
      if (window.innerWidth <= breakpoints.md) return 1;
      // For tablet screens
      if (window.innerWidth <= breakpoints.lg) return 2;
    }
    return 4; // Default for desktop
  };

  // Update itemsPerPage on window resize
  React.useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage();
      
      // Check if itemsPerPage has changed
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage);
        
        // Adjust currentIndex to maintain visibility of current items when possible
        // Calculate how many items would be visible after resize
        const currentFirstVisible = currentIndex;
        
        // Determine a new index that keeps as many currently visible items in view as possible
        // Priority is to keep the first visible item still visible if possible
        const maxNewIndex = visualizations.length - newItemsPerPage;
        let newIndex = Math.min(currentFirstVisible, maxNewIndex);
        
        // Ensure we don't go beyond bounds
        newIndex = Math.max(0, Math.min(newIndex, maxNewIndex));
        
        // Only update if the index needs to change
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      setItemsPerPage(getItemsPerPage());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [currentIndex, itemsPerPage, visualizations.length]);

  // Calculate offset for slider position
  const calculateOffset = () => {
    // Since we're using percentage widths for items, we can use a simpler calculation
    const itemWidth = 100 / itemsPerPage;
    return currentIndex * -itemWidth;
  };

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    
    // First move the state, which will update the visible elements
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    
    // Then after animation is complete, allow next transition
    setTimeout(() => setIsAnimating(false), 500);
  }
  
  const handleNext = () => {
    if (isAnimating || currentIndex === maxIndex) return;
    setIsAnimating(true);
    
    // First move the state, which will update the visible elements
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    
    // Then after animation is complete, allow next transition
    setTimeout(() => setIsAnimating(false), 500);
  }

  // Instead of slicing, we'll show all and position them
  const sliderItems = visualizations.map((visualization, index) => {
    // Determine if this item should be visible in the current view (considering current index)
    const isVisible = index >= currentIndex && index < currentIndex + itemsPerPage;
    
    // Dynamic class to handle first and last visible items
    const isFirstVisible = index === currentIndex;
    const isLastVisible = index === currentIndex + itemsPerPage - 1 || index === visualizations.length - 1;
    
    // Build class names for the slider tile
    const tileClassNames = [styles.sliderTile];
    if (isFirstVisible) tileClassNames.push(styles.firstTile);
    if (isLastVisible) tileClassNames.push(styles.lastTile);
    
    // Calculate tile width based on items per page
    const tileWidth = 100 / itemsPerPage;
    
    return (
      <div 
        key={index} 
        className={tileClassNames.join(' ')}
        style={{
          width: `${tileWidth}%`,
          flex: `0 0 ${tileWidth}%`,
          opacity: isVisible ? 1 : 0.3,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        {visualization.gallery[0] && getImage(visualization.gallery[0].asset.gatsbyImageData) && (
          <div className={styles.visualizationWrapper}>
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
        )}
      </div>
    );
  });

  return (
    <Layout>
      <Seo
        title="Visualizations"
        description="Explore our architectural visualizations and 3D renderings"
      />
      <div className={styles.sliderContainer}>
        <button 
          className={`${styles.sliderArrow} ${styles.left}`} 
          onClick={handlePrev} 
          disabled={currentIndex === 0 || isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        <div className={styles.sliderTrackContainer}>
          <div 
            className={styles.sliderTrack} 
            style={{ 
              transform: `translateX(${calculateOffset()}%)`,
            }}
          >
            {sliderItems}
          </div>
        </div>
        <button 
          className={`${styles.sliderArrow} ${styles.right}`} 
          onClick={handleNext} 
          disabled={currentIndex === maxIndex || isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
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
