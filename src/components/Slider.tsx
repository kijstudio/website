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
  loop?: boolean; // Flag to enable/disable looping for mobile view
  autoplay?: boolean; // Flag to enable/disable automatic slide changes
  autoplayInterval?: number; // Time in ms between automatic slide changes
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
  loop = false, // Default to disabled
  autoplay = false, // Default to disabled
  autoplayInterval = 5000, // Default to 5 seconds
}) => {
  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDefault);
  const maxIndex = Math.max(0, items.length - itemsPerPage);
  
  // Fullscreen popup state
  const [fullscreenImage, setFullscreenImage] = useState<SliderItem | null>(null);
  
  // State to track if we're in mobile view
  const [isMobileView, setIsMobileView] = useState(false);
  
  // State to track if user is hovering over the slider
  const [isPaused, setIsPaused] = useState(false);
  
  // Reference to the slider container for touch events
  const sliderRef = React.useRef<HTMLDivElement>(null);
  
  // Track autoplay direction (1 = forward, -1 = backward)
  const [autoplayDirection, setAutoplayDirection] = useState(1);
  
  // Track touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
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

  // Update mobile view state on window resize
  useEffect(() => {
    const checkMobileView = () => {
      if (typeof window !== 'undefined') {
        setIsMobileView(window.innerWidth <= breakpoints.mobile);
      }
    };
    
    if (typeof window !== 'undefined') {
      checkMobileView();
      window.addEventListener('resize', checkMobileView);
      return () => window.removeEventListener('resize', checkMobileView);
    }
  }, [breakpoints.mobile]);

  // Calculate offset for slider position
  const calculateOffset = () => {
    // Since we're using percentage widths for items, we can use a simpler calculation
    const itemWidth = 100 / itemsPerPage;
    return currentIndex * -itemWidth;
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    // Check if at the beginning and loop is enabled for mobile view
    if (currentIndex === 0 && loop && isMobileView) {
      setIsAnimating(true);
      
      // Loop to the end
      setCurrentIndex(maxIndex);
      
      // Then after animation is complete, allow next transition
      setTimeout(() => setIsAnimating(false), transitionDuration);
      return;
    }
    
    // Regular behavior if not looping or not at the beginning
    if (currentIndex === 0) return;
    setIsAnimating(true);
    
    // First move the state, which will update the visible elements
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    
    // Then after animation is complete, allow next transition
    setTimeout(() => setIsAnimating(false), transitionDuration);
  }
  
  const handleNext = () => {
    if (isAnimating) return;
    
    // Check if at the end and loop is enabled for mobile view
    if (currentIndex === maxIndex && loop && isMobileView) {
      setIsAnimating(true);
      
      // Loop to the beginning
      setCurrentIndex(0);
      
      // Then after animation is complete, allow next transition
      setTimeout(() => setIsAnimating(false), transitionDuration);
      return;
    }
    
    // Regular behavior if not looping or not at the end
    if (currentIndex === maxIndex) return;
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

  // Handle automatic slide changes when autoplay is enabled
  useEffect(() => {
    if (!autoplay || isPaused || isAnimating) return;
    
    const interval = setInterval(() => {
      if (loop) {
        // With loop enabled, always move forward and loop around
        if (currentIndex === maxIndex) {
          setIsAnimating(true);
          setCurrentIndex(0);
          setTimeout(() => setIsAnimating(false), transitionDuration);
        } else {
          setIsAnimating(true);
          setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
          setTimeout(() => setIsAnimating(false), transitionDuration);
        }
      } else {
        // Without loop, reverse direction at ends
        if (autoplayDirection === 1 && currentIndex === maxIndex) {
          // At the end, reverse direction to backward
          setAutoplayDirection(-1);
          setIsAnimating(true);
          setCurrentIndex(prev => Math.max(prev - 1, 0));
          setTimeout(() => setIsAnimating(false), transitionDuration);
        } else if (autoplayDirection === -1 && currentIndex === 0) {
          // At the beginning, reverse direction to forward
          setAutoplayDirection(1);
          setIsAnimating(true);
          setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
          setTimeout(() => setIsAnimating(false), transitionDuration);
        } else {
          // Normal movement based on current direction
          setIsAnimating(true);
          if (autoplayDirection === 1) {
            setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
          } else {
            setCurrentIndex(prev => Math.max(prev - 1, 0));
          }
          setTimeout(() => setIsAnimating(false), transitionDuration);
        }
      }
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [autoplay, isPaused, currentIndex, maxIndex, loop, autoplayInterval, isAnimating, transitionDuration, autoplayDirection]);

  // Setup touch event handlers for mobile
  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (!sliderElement || !autoplay) return;

    let touchTimeout: NodeJS.Timeout | null = null;
    
    // Resume autoplay after a delay when user stops touching
    const handleAutoplayResume = () => {
      // Resume autoplay after 3 seconds of no interaction
      touchTimeout = setTimeout(() => {
        setIsPaused(false);
      }, 3000);
    };
    
    // Clean up event handlers
    return () => {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }
    };
  }, [autoplay]);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    // Handle swipe detection
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setIsSwiping(false);
    
    // Pause autoplay during interaction if enabled
    if (autoplay) {
      setIsPaused(true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };
  
  const handleTouchEnd = () => {
    // Handle swipe navigation
    if (touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe && !isAnimating) {
        handleNext();
      } else if (isRightSwipe && !isAnimating) {
        handlePrev();
      }
    }
    
    // Reset swipe state
    setTimeout(() => {
      setIsSwiping(false);
    }, 300);
    
    // Reset touch coordinates
    setTouchStart(null);
    setTouchEnd(null);
    
    // Resume autoplay after a delay if enabled
    if (autoplay) {
      setTimeout(() => {
        setIsPaused(false);
      }, 3000);
    }
  };

  // Prevent click when swiping
  const handleItemClickWithSwipePrevention = (item: SliderItem, event: React.MouseEvent) => {
    if (isSwiping) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    handleItemClick(item, event);
  };

  // Default hover content if no custom renderer is provided
  const defaultHoverContent = (item: SliderItem) => (
    <div className={styles.hoverContent}>
      {item.title && <h3 className={styles.imageTitle}>{item.title}</h3>}
      {item.link && (
        <div 
          className={styles.linkIndicator}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling to parent
            if (!isSwiping) {
              handleItemClick(item, e);
            }
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
    
    // Custom class for mobile hover always-on effect
    const wrapperClassNames = [styles.itemWrapper];
    
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
          className={wrapperClassNames.join(' ')}
          onClick={(e) => isClickable && handleItemClickWithSwipePrevention(item, e)}
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
      <div 
        ref={sliderRef}
        className={styles.sliderContainer}
        onMouseEnter={() => !isMobileView && setIsPaused(true)}
        onMouseLeave={() => !isMobileView && setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          className={`${styles.sliderArrow} ${styles.left}`} 
          onClick={handlePrev} 
          disabled={(currentIndex === 0 && (!loop || !isMobileView)) || isAnimating}
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
          disabled={(currentIndex === maxIndex && (!loop || !isMobileView)) || isAnimating}
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