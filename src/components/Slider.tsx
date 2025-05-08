import * as React from "react"
import { useState, useEffect } from "react"
import * as styles from "./Slider.module.css"

interface SliderProps {
  items: React.ReactNode[];
  itemsPerPageDefault?: number;
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  mobileItems?: number;
  tabletItems?: number;
  transitionDuration?: number;
}

const Slider: React.FC<SliderProps> = ({
  items,
  itemsPerPageDefault = 4,
  breakpoints = { mobile: 768, tablet: 992, desktop: 1200 },
  mobileItems = 1,
  tabletItems = 2,
  transitionDuration = 500,
}) => {
  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDefault);
  const maxIndex = Math.max(0, items.length - itemsPerPage);
  
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
        {item}
      </div>
    );
  });

  return (
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
  );
};

export default Slider; 