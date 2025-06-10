import * as React from "react"
import * as styles from "./SplitScreen.module.css"

interface SplitScreenProps {
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  fullWidth?: boolean
  leftRatio?: number
  rightRatio?: number
  backgroundImageSrc?: string
  backgroundVideoSrc?: string
  id?: string
}

let splitScreenCounter = 0

const SplitScreen: React.FC<SplitScreenProps> = ({
  leftContent,
  rightContent,
  fullWidth = false,
  leftRatio = 1,
  rightRatio = 1,
  backgroundImageSrc,
  backgroundVideoSrc,
  id,
}) => {
  // Calculate the grid template columns based on provided ratios
  const gridTemplateColumns = `${leftRatio}fr ${rightRatio}fr`
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Create a stable, deterministic ID for the section
  const [sectionId] = React.useState(() => {
    // Use provided id or create a sequential one
    return id || `split-screen-${splitScreenCounter++}`
  })

  // Inject custom styles for this specific section
  React.useEffect(() => {
    if (typeof window !== "undefined" && backgroundImageSrc) {
      // Create stylesheet
      const styleEl = document.createElement("style")
      styleEl.textContent = `
        @media (max-width: 768px) {
          #${sectionId}::after {
            background-image: url(${backgroundImageSrc}) !important;
          }
        }
      `
      document.head.appendChild(styleEl)

      return () => {
        document.head.removeChild(styleEl)
      }
    }
  }, [backgroundImageSrc, sectionId])

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        // Silently handle autoplay issues
        console.warn("Could not autoplay video background:", err)
      })
    }
  }, [backgroundVideoSrc])

  // Create video background element if backgroundVideoSrc is provided
  const videoBackground = backgroundVideoSrc ? (
    <div className={styles.videoBackground}>
      <video
        muted
        loop
        playsInline
        className={styles.backgroundVideo}
        ref={videoRef}
      >
        <source src={backgroundVideoSrc} type="video/mp4" />
      </video>
    </div>
  ) : null

  return (
    <div
      className={styles.container}
      style={{
        gridTemplateColumns,
        maxWidth: fullWidth ? "100%" : "var(--max-content-width)",
        margin: fullWidth ? "0" : "0 auto",
      }}
    >
      <section
        id={sectionId}
        className={`${styles.leftSection} ${backgroundVideoSrc ? styles.hasVideoBackground : ""}`}
        style={
          {
            "--bg-mobile-url":
              backgroundImageSrc && !backgroundVideoSrc
                ? `url(${backgroundImageSrc})`
                : undefined,
          } as React.CSSProperties
        }
      >
        {leftContent}
        {backgroundVideoSrc && videoBackground}
      </section>

      <section className={styles.rightSection}>{rightContent}</section>
    </div>
  )
}

export default SplitScreen
