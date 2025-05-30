import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import { useEffect } from "react"
import Seo from "../components/seo"
import SplitScreen from "../components/SplitScreen"
import videoSrc from "../movies/P2.webm"
import * as styles from "./index.module.css"

const HomePage: React.FC = () => {
  const [isVideoLoading, setIsVideoLoading] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handleCanPlay = () => {
    setIsVideoLoading(false)
    console.log("handleCanPlay")
  }

  const handlePlaying = () => {
    setIsVideoLoading(false)
    console.log("handlePlaying")
  }

  const handleLoadedMetadata = () => {
    setIsVideoLoading(false)
    console.log("handleLoadedMetadata")
  }

  const handleLoadedData = () => {
    setIsVideoLoading(false)
    console.log("handleLoadedData")
  }

  const handleLoadStart = () => {
    setIsVideoLoading(false)
    console.log("handleLoadStart")
  }

  const handleLoad = () => {
    setIsVideoLoading(false)
    console.log("handleLoad")
  }

  useEffect(() => {
    // wait 10 seconds before playing the video as fallback
    const timeout = setTimeout(() => {
      setIsVideoLoading(false)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      console.log("videoRef.current", videoRef.current)
      videoRef.current.muted = true
      videoRef.current.loop = true
      videoRef.current.playsInline = true
      videoRef.current.preload = "none"
      videoRef.current.play()
      //videoRef.current.play()
      //alert("useEffect")
    }
  }, [videoRef])

  // Define the left content section
  const leftContent = (
    <div className={styles.contentWrapper}>
      <StaticImage
        src={"../images/logo.png"}
        width={200}
        alt="KIJ Studio"
        placeholder="blurred"
        className={`logo ${styles.logo}`}
        formats={["auto", "webp"]}
        layout="fixed"
        quality={95}
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
          to="/contact"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Contact
        </Link>
        <Link
          to="https://www.instagram.com/kijstudio"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.instagramIcon}
          >
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
        className={styles.homeVideo}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={handleLoadedData}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onCanPlay={handleCanPlay}
        onPlaying={handlePlaying}
      >
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
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
