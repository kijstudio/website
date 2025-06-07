import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import { useEffect } from "react"
import Seo from "../components/seo"
import SplitScreen from "../components/SplitScreen"
import videoSrc from "../movies/P2.webm"
import logo from "../images/logo.png"
import * as styles from "./index.module.css"

const HomePage: React.FC = () => {
  const [isVideoLoading, setIsVideoLoading] = React.useState(true)
  const [videoError, setVideoError] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handleVideoReady = async () => {
    if (!videoRef.current) return

    try {
      // Simple approach for all platforms
      await videoRef.current.play()
      setIsVideoLoading(false)
    } catch (error) {
      console.error("Video play failed:", error)
      setVideoError(true)
      setIsVideoLoading(false)
    }
  }

  const handleVideoPlay = () => {
    setIsVideoLoading(false)
  }

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    console.error("Video error:", e)
    setVideoError(true)
    setIsVideoLoading(false)
  }

  const handleLoadedData = () => {
    // Video data is loaded, try to play
    handleVideoReady()
  }

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current

      // Set video properties
      video.muted = true
      video.loop = true
      video.playsInline = true

      // Load the video
      video.load()

      // Add a fallback timeout
      const timeout = setTimeout(() => {
        if (isVideoLoading) {
          console.warn("Video loading timeout, showing content anyway")
          setIsVideoLoading(false)
        }
      }, 5000) // 5 second timeout

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [isVideoLoading])

  // Define the left content section
  const leftContent = (
    <div className={styles.contentWrapper}>
      <img
        src={logo}
        alt="KIJ Studio"
        className={"logo " + styles.logo}
        width={200}
      />
      <div className={styles.info}>
        <p>
          Bringing your dream spaces to life with creative design and
          breathtaking visuals.
        </p>
      </div>

      <nav className={styles.nav}>
        <Link
          to="/visualizations"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Visualizations
        </Link>
        <Link
          to="/interior-design"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Interior Design
        </Link>
        <Link
          to="/about"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          About us
        </Link>
        <Link
          to="https://www.instagram.com/kijstudio"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </Link>
      </nav>
    </div>
  )

  // Define the right content section with video or fallback image
  const rightContent = (
    <div className={styles.videoWrapper}>
      <video
        ref={videoRef}
        muted={true}
        loop={true}
        playsInline={true}
        preload="auto" // Preload the video
        className={styles.homeVideo}
        onLoadedData={handleLoadedData}
        onPlay={handleVideoPlay}
        onError={handleVideoError}
      >
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      {videoError && (
        <div>
          {/* You could add a fallback image here */}
          <p>Video unavailable</p>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Seo
        title="KIJ Studio"
        description="Welcome to KIJ Studio - Architectural Visualization and Interior Design"
        keywords={[
          "KIJ Studio",
          "interior design",
          "visualization",
          "architecture",
          "home",
          "3D renderings",
        ]}
      />

      {/* JSON-LD Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KIJ Studio",
          description:
            "Bringing your dream spaces to life with creative design and breathtaking visuals. Specializing in architectural visualization and interior design.",
          url:
            typeof window !== "undefined"
              ? window.location.origin
              : "https://kijstudio.com",
          logo:
            typeof window !== "undefined"
              ? window.location.origin + logo
              : logo,
          sameAs: ["https://www.instagram.com/kijstudio"],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
          },
          areaServed: "Global",
          knowsAbout: [
            "Interior Design",
            "Architectural Visualization",
            "3D Rendering",
            "Space Design",
            "Home Design",
          ],
        })}
      </script>

      <div
        className={`${styles.pageContent} ${
          isVideoLoading ? styles.hidden : ""
        }`}
      >
        <SplitScreen
          leftContent={leftContent}
          rightContent={rightContent}
          fullWidth={true}
          leftRatio={4}
          rightRatio={6}
        />
      </div>
      {isVideoLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}></div>
        </div>
      )}
    </>
  )
}

export default HomePage
