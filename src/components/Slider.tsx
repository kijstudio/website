import * as React from "react"
import { useState, useEffect } from "react"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import { navigate } from "gatsby"
import * as styles from "./Slider.module.css"

// Interface for items that can be rendered in the slider
export interface SliderItem {
  title?: string;
  image: IGatsbyImageData;
  imageAlt?: string;
  id: string | number;
  link?: string; // Optional link URL for item click navigation
  slug?: string; // Optional slug for navigation to detail page
  [key: string]: any; // Allow any additional props for custom rendering
}

interface SliderProps {
  // Replace React.ReactNode[] with SliderItem[]
  items: SliderItem[];
  // Add a render prop for custom hover content
  renderHoverContent?: (item: SliderItem) => React.ReactNode;
  itemsPerPageDefault?: number;
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  mobileItems?: number;
  tabletItems?: number;
  transitionDuration?: number;
  onItemClick?: (item: SliderItem) => void | boolean; // Optional callback for custom click handling
  enableFullScreenView?: boolean; // Flag to enable/disable fullscreen popup globally
  fullScreenPredicate?: (item: SliderItem) => boolean; // Predicate function to enable fullscreen for specific items
  disableNavigation?: boolean; // Flag to disable navigation
}

const Slider: React.FC<SliderProps> = ({
  items,
  renderHoverContent,
  itemsPerPageDefault = 4,
  breakpoints = { mobile: 768, tablet: 992, desktop: 1200 },
  mobileItems = 1,
  tabletItems = 2,
  transitionDuration = 500,
  onItemClick,
  enableFullScreenView = true, // Default to enabled
  fullScreenPredicate,
  disableNavigation = false, // Default to enabled
}) => {
  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDefault);
  const maxIndex = Math.max(0, items.length - itemsPerPage);
  
  // Fullscreen popup state
  const [fullscreenImage, setFullscreenImage] = useState<SliderItem | null>(null);
  
  // Calculate number of items per page based on screen size
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      // For mobile screens
      if (window.innerWidth <= breakpoints.mobile) return mobileItems;
      // For tablet screens
      if (window.innerWidth <= breakpoints.tablet) return tabletItems;
    }
    return itemsPerPageDefault; // Default for desktop
  };

  // Update itemsPerPage on window resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage();
      
      // Check if itemsPerPage has changed
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage);
        
        // Adjust currentIndex to maintain visibility of current items when possible
        const currentFirstVisible = currentIndex;
        
        // Determine a new index that keeps the first visible item still visible if possible
        const maxNewIndex = items.length - newItemsPerPage;
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
  }, [currentIndex, itemsPerPage, items.length, breakpoints.mobile, breakpoints.tablet, mobileItems, tabletItems, itemsPerPageDefault]);

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
    setTimeout(() => setIsAnimating(false), transitionDuration);
  }
  
  const handleNext = () => {
    if (isAnimating || currentIndex === maxIndex) return;
    setIsAnimating(true);
    
    // First move the state, which will update the visible elements
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    
    // Then after animation is complete, allow next transition
    setTimeout(() => setIsAnimating(false), transitionDuration);
  }

  // Handle item click - trigger fullscreen popup if enabled
  const handleItemClick = (item: SliderItem, event: React.MouseEvent) => {
    if (onItemClick) {
      // If onItemClick returns false explicitly, stop further processing
      const result = onItemClick(item);
      if (result === false) return;
    }
    
    // Check if fullscreen should be enabled for this specific item
    const shouldEnableFullscreen = fullScreenPredicate 
      ? fullScreenPredicate(item) 
      : enableFullScreenView;
    
    if (shouldEnableFullscreen) {
      setFullscreenImage(item);
    } else if (item.link && !disableNavigation) {
      navigate(item.link);
    }
  };

  // Close fullscreen popup
  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage) {
        if (e.key === 'Escape') {
          closeFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage]);

  // Default hover content if no custom renderer is provided
  const defaultHoverContent = (item: SliderItem) => (
    <div className={styles.hoverContent}>
      {item.title && <h3 className={styles.imageTitle}>{item.title}</h3>}
      {item.link && (
        <div 
          className={styles.linkIndicator}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling to parent
            handleItemClick(item, e);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleItemClick(item, e as any);
            }
          }}
          aria-label={`View details for ${item.title || "item"}`}
        >
          View Details
        </div>
      )}
    </div>
  );

  // Process items to add positioning and visibility logic
  const sliderItems = items.map((item, index) => {
    // Determine if this item should be visible in the current view
    const isVisible = index >= currentIndex && index < currentIndex + itemsPerPage;
    
    // Dynamic class to handle first and last visible items
    const isFirstVisible = index === currentIndex;
    const isLastVisible = index === currentIndex + itemsPerPage - 1 || index === items.length - 1;
    
    // Build class names for the slider tile
    const tileClassNames = [styles.sliderTile];
    if (isFirstVisible) tileClassNames.push(styles.firstTile);
    if (isLastVisible) tileClassNames.push(styles.lastTile);
    
    // Calculate tile width based on items per page
    const tileWidth = 100 / itemsPerPage;
    
    // Add clickable behavior if item has a link or fullscreen view is enabled
    const isClickable = !!item.link || !!onItemClick || enableFullScreenView;
    
    return (
      <div 
        key={item.id || index} 
        className={tileClassNames.join(' ')}
        style={{
          width: `${tileWidth}%`,
          flex: `0 0 ${tileWidth}%`,
          opacity: isVisible ? 1 : 0.3,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          cursor: isClickable ? 'pointer' : 'default',
        }}
      >
        <div 
          className={styles.itemWrapper}
          onClick={(e) => isClickable && handleItemClick(item, e)}
          onKeyDown={(e) => {
            if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleItemClick(item, e as any);
            }
          }}
          role={isClickable ? "button" : undefined}
          tabIndex={isClickable ? 0 : undefined}
        >
          <GatsbyImage
            image={getImage(item.image)!}
            alt={item.imageAlt || item.title || ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          {renderHoverContent ? renderHoverContent(item) : defaultHoverContent(item)}
        </div>
      </div>
    );
  });

  return (
    <>
      <div className={styles.sliderContainer}>
        <button 
          className={`${styles.sliderArrow} ${styles.left}`} 
          onClick={handlePrev} 
          disabled={currentIndex === 0 || isAnimating}
          aria-label="Previous slide"
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
              transition: `transform ${transitionDuration}ms ease`,
            }}
          >
            {sliderItems}
          </div>
        </div>
        <button 
          className={`${styles.sliderArrow} ${styles.right}`} 
          onClick={handleNext} 
          disabled={currentIndex === maxIndex || isAnimating}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>

      {/* Fullscreen image popup */}
      {fullscreenImage && (
        <div className={styles.fullscreenOverlay} onClick={closeFullscreen}>
          <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={closeFullscreen}
              aria-label="Close fullscreen view"
            >
              ×
            </button>
            <GatsbyImage
              image={getImage(fullscreenImage.image)!}
              alt={fullscreenImage.imageAlt || fullscreenImage.title || ""}
              className={styles.fullscreenImage}
              imgStyle={{ objectFit: "contain" }}
            />
            {fullscreenImage.title && (
              <div className={styles.fullscreenCaption}>
                <h3>{fullscreenImage.title}</h3>
                {fullscreenImage.caption && <p>{fullscreenImage.caption}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Slider; 