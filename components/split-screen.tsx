"use client";

import * as React from "react"
import styles from "./split-screen.module.css"

interface SplitScreenProps {
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  fullWidth?: boolean
  leftRatio?: number
  rightRatio?: number
  backgroundImageSrc?: string
  backgroundVideoSrc?: string
  id?: string
  /**
   * Flip which side leftContent/rightContent visually appear on for desktop
   * (>768px) layouts, via CSS `order`, without changing DOM order. Mobile
   * behavior is untouched: leftContent stays the visible mobile section and
   * rightContent stays hidden, regardless of `mirrored`.
   */
  mirrored?: boolean
}

const SplitScreen: React.FC<SplitScreenProps> = ({
  leftContent,
  rightContent,
  fullWidth = false,
  leftRatio = 1,
  rightRatio = 1,
  backgroundImageSrc,
  backgroundVideoSrc,
  id,
  mirrored = false,
}) => {
  // Calculate the grid template columns based on provided ratios
  const gridTemplateColumns = `${leftRatio}fr ${rightRatio}fr`
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Deterministic id, stable across server render and client hydration.
  // (A module-level counter isn't safe here: the server process reuses
  // this module across requests for different routes, so its count when
  // rendering one page's markup depends on what else rendered first,
  // while a fresh client mount always starts at 0 — causing mismatches.)
  // useId() includes colons, which are valid in an HTML id attribute but
  // need escaping to use in a raw CSS selector, so strip them for the id
  // we actually render and match against below.
  const generatedId = React.useId().replace(/:/g, "")
  const sectionId = id || `split-screen-${generatedId}`

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
      className={`${styles.container} ${mirrored ? styles.mirrored : ""}`}
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
