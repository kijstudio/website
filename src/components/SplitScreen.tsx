import * as React from "react"
import * as styles from "./SplitScreen.module.css"

interface SplitScreenProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  fullWidth?: boolean;
  leftRatio?: number;
  rightRatio?: number;
  backgroundImageSrc?: string;
}

const SplitScreen: React.FC<SplitScreenProps> = ({
  leftContent,
  rightContent,
  fullWidth = false,
  leftRatio = 1,
  rightRatio = 1,
  backgroundImageSrc,
}) => {
  // Calculate the grid template columns based on provided ratios
  const gridTemplateColumns = `${leftRatio}fr ${rightRatio}fr`;
  
  // Create a unique ID for the section
  const sectionId = React.useMemo(() => `section-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Inject custom styles for this specific section
  React.useEffect(() => {
    if (typeof window !== 'undefined' && backgroundImageSrc) {
      // Create stylesheet
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        @media (max-width: 768px) {
          #${sectionId}::after {
            background-image: url(${backgroundImageSrc}) !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        document.head.removeChild(styleEl);
      };
    }
  }, [backgroundImageSrc, sectionId]);
  
  return (
    <div 
      className={styles.container}
      style={{ 
        gridTemplateColumns,
        maxWidth: fullWidth ? '100%' : 'var(--max-content-width)',
        margin: fullWidth ? '0' : '0 auto' 
      }}
    >
      <section 
        id={sectionId}
        className={styles.leftSection}
        style={{
          "--bg-mobile-url": backgroundImageSrc ? `url(${backgroundImageSrc})` : undefined,
        } as React.CSSProperties}
      >
        {leftContent}
      </section>

      <section className={styles.rightSection}>
        {rightContent}
      </section>
    </div>
  )
}

export default SplitScreen 