/**
 * Breakpoint values for consistent responsive design
 * IMPORTANT: These values MUST match CSS variables in global.css
 */

export const breakpoints = {
  xs: 480,  // Extra small devices
  sm: 576,  // Small devices
  md: 768,  // Medium devices
  lg: 992,  // Large devices
  xl: 1200, // Extra large devices
};

export const mediaQueries = {
  xs: `@media (max-width: ${breakpoints.xs}px)`,
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  md: `@media (max-width: ${breakpoints.md}px)`,
  lg: `@media (max-width: ${breakpoints.lg}px)`,
  xl: `@media (max-width: ${breakpoints.xl}px)`,
};

export default breakpoints; 