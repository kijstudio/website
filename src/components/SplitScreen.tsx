import * as React from "react"
import * as styles from "./SplitScreen.module.css"

interface SplitScreenProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  fullWidth?: boolean;
  leftRatio?: number;
  rightRatio?: number;
}

const SplitScreen: React.FC<SplitScreenProps> = ({
  leftContent,
  rightContent,
  fullWidth = false,
  leftRatio = 1,
  rightRatio = 1,
}) => {
  // Calculate the grid template columns based on provided ratios
  const gridTemplateColumns = `${leftRatio}fr ${rightRatio}fr`;
  
  return (
    <div 
      className={styles.container}
      style={{ 
        gridTemplateColumns,
        maxWidth: fullWidth ? '100%' : 'var(--max-content-width)',
        margin: fullWidth ? '0' : '0 auto' 
      }}
    >
      <section className={styles.leftSection}>
        {leftContent}
      </section>

      <section className={styles.rightSection}>
        {rightContent}
      </section>
    </div>
  )
}

export default SplitScreen 