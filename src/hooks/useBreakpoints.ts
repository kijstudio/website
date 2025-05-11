import { useState, useEffect } from 'react';
import { breakpoints } from '../styles/breakpoints';

export type Breakpoint = keyof typeof breakpoints;

/**
 * Custom hook to handle responsive breakpoints
 * Returns an object with boolean values for each breakpoint
 */
const useBreakpoints = () => {
  // Initialize with default values for SSR
  const [windowSize, setWindowSize] = useState({
    //width: typeof window !== 'undefined' ? window.innerWidth : 0,
    // height: typeof window !== 'undefined' ? window.innerHeight : 0,
    width: 0,
    height: 0,
  });

  // Update dimensions on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away to update state with current window size
    handleResize();
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Return boolean values for each breakpoint
  return {
    isXs: windowSize.width <= breakpoints.xs,
    isSm: windowSize.width <= breakpoints.sm,
    isMd: windowSize.width <= breakpoints.md,
    isLg: windowSize.width <= breakpoints.lg,
    isXl: windowSize.width <= breakpoints.xl,
    windowWidth: windowSize.width,
    windowHeight: windowSize.height,
  };
};

export default useBreakpoints; 