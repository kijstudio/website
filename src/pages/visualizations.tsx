import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { useState } from "react"

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
      if (window.innerWidth <= 700) return 1;
      if (window.innerWidth <= 900) return 2;
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
        const currentLastVisible = Math.min(currentIndex + itemsPerPage - 1, visualizations.length - 1);
        
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
    
    return (
      <div 
        key={index} 
        className={`slider-tile ${isFirstVisible ? 'first-tile' : ''} ${isLastVisible ? 'last-tile' : ''}`}
        style={{
          opacity: isVisible ? 1 : 0.3,
          visibility: 'visible', // Keep all items visible but with different opacity
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}
      >
        {visualization.gallery[0] && getImage(visualization.gallery[0].asset.gatsbyImageData) && (
          <div className="visualization-wrapper">
            <GatsbyImage
              image={getImage(visualization.gallery[0].asset.gatsbyImageData)!}
              alt={visualization.gallery[0].alt || visualization.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
            <div className="hover-content">
              <h3 className="image-title">{visualization.title}</h3>
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
      <div className="slider-container">
        <button 
          className="slider-arrow left" 
          onClick={handlePrev} 
          disabled={currentIndex === 0 || isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        <div className="slider-track-container">
          <div 
            className="slider-track" 
            style={{ 
              transform: `translateX(${calculateOffset()}%)`,
            }}
          >
            {sliderItems}
          </div>
        </div>
        <button 
          className="slider-arrow right" 
          onClick={handleNext} 
          disabled={currentIndex === maxIndex || isAnimating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      <style>
        {`
          .slider-container {
            position: relative;
            max-width: 100%;
            width: 100%;
            margin: 0 auto;
            padding: 0;
            overflow: visible;
            min-height: calc(100vh - 150px); /* Approximate space for header and footer */
            min-height: 600px; /* Absolute minimum height */
            max-height: 800px; /* Maximum height */
            height: calc(min(100vh - 150px, 800px));
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: transparent;
          }
          .slider-track-container {
            width: 100%;
            max-width: var(--max-content-width);
            margin: 0 auto;
            overflow: hidden;
            min-height: 600px;
            max-height: 800px;
            height: 100%;
            padding: 0;
            background: transparent;
            display: flex;
            align-items: center;
          }
          .slider-track {
            display: flex;
            width: 100%;
            transition: transform 0.5s ease;
            will-change: transform;
            background: transparent;
            height: 100%;
          }
          .slider-arrow {
            background: rgba(0,0,0,0.8);
            color: white;
            border: none;
            font-size: 2rem;
            width: 2.5rem;
            font-weight: 500;
            height: 4rem;
            border-radius: 0;
            cursor: pointer;
            z-index: 10;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            font-family: Arial, sans-serif;
            line-height: 0;
            padding: 0;
            margin: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          .slider-arrow:hover {
            background: rgba(0,0,0,1);
          }
          .slider-arrow:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            background: rgba(0,0,0,0.5);
          }
          .slider-arrow.left {
            left: 0;
          }
          .slider-arrow.right {
            right: 0;
          }
          .slider-tile {
            width: ${100 / itemsPerPage}%;
            flex: 0 0 ${100 / itemsPerPage}%;
            min-width: 0;
            min-height: 600px;
            max-height: 800px;
            height: 100%;
            overflow: hidden;
            position: relative;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding: 0 0.75rem;
          }
          .slider-tile.first-tile {
            padding-left: 0;
          }
          .slider-tile.last-tile {
            padding-right: 0;
          }
          .visualization-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 600px;
            max-height: 800px;
            cursor: pointer;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .visualization-wrapper img,
          .visualization-wrapper .gatsby-image-wrapper {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
          .hover-content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0);
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            transition: background-color 0.3s ease;
          }
          .image-title {
            color: white;
            margin: 20px;
            font-size: 1.2rem;
            font-weight: 300;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: "futura-pt", sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .visualization-wrapper:hover .hover-content {
            background: rgba(0, 0, 0, 0.5);
          }
          .visualization-wrapper:hover .image-title {
            opacity: 1;
          }
          @media (max-width: 1200px) {
            .slider-arrow.left {
              margin-left: 0;
            }
            .slider-arrow.right {
              margin-right: 0;
            }
          }
          @media (max-width: 900px) {
            .slider-tile {
              padding: 0 0.5rem;
              width: ${100 / itemsPerPage}%;
              flex: 0 0 ${100 / itemsPerPage}%;
            }
            .slider-tile.first-tile {
              padding-left: 0;
            }
            .slider-tile.last-tile {
              padding-right: 0;
            }
            .visualization-wrapper {
              min-height: 500px;
            }
          }
          @media (max-width: 700px) {
            .slider-container {
              margin: 0 auto;
              padding: 0;
            }
            .slider-tile {
              padding: 0 0.375rem;
              min-width: 0;
              width: ${100 / itemsPerPage}%;
              flex: 0 0 ${100 / itemsPerPage}%;
              max-height: 800px;
            }
            .slider-tile.first-tile {
              padding-left: 0;
            }
            .slider-tile.last-tile {
              padding-right: 0;
            }
            .visualization-wrapper {
              min-height: 400px;
            }
            .slider-arrow {
              width: 2rem;
              height: 3.5rem;
              margin: 0 0.25rem;
            }
          }
          .slider-arrow svg {
            width: 1.5rem;
            height: 1.5rem;
          }
        `}
      </style>
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
