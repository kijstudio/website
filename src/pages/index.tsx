import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "./index.module.css"
import Seo from "../components/seo"
import SplitScreen from "../components/SplitScreen"
import videoSrc from "../movies/P2.webm"

const HomePage: React.FC = () => {
  const [isVideoLoading, setIsVideoLoading] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const mobileVideoRef = React.useRef<HTMLVideoElement>(null)

  console.log("isVideoLoading", isVideoLoading)

  const handleMobileVideoCanPlay = () => {
    console.log("handleMobileVideoCanPlay")
    if (mobileVideoRef.current && isVideoLoading) {
      setIsVideoLoading(false)
    }
  }

  const handleVideoCanPlay = () => {
    console.log("handleVideoCanPlay")
    if (videoRef.current && isVideoLoading) {
      setIsVideoLoading(false)
    }
  }

  React.useEffect(() => {
    if (mobileVideoRef.current && isVideoLoading) {
      mobileVideoRef.current.play(); // workaround for autoplay not working on mobile
    }

    if (videoRef.current && isVideoLoading) {
      videoRef.current.play(); // workaround for autoplay not working on mobile
    }

    if (mobileVideoRef.current && !isVideoLoading) {
      mobileVideoRef.current.pause();
      mobileVideoRef.current.currentTime = 0;
      mobileVideoRef.current.play(); // workaround for autoplay not working on mobile
    }
    if (videoRef.current && !isVideoLoading) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.play(); // workaround for autoplay not working on mobile
    }
  }, [isVideoLoading]);

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    console.error("Video error:", e)
  }

  // Define the left content section
  const leftContent = (
    <div className={styles.contentWrapper}>
      <StaticImage
        src="../images/logo.png"
        width={200}
        alt="KIJ Studio"
        placeholder="blurred"
        className={`logo ${styles.logo}`}
        layout="fixed"
        formats={["auto", "webp"]}
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
          to="/interiors"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Interiors
        </Link>
        <Link
          to="/contact"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Contact
        </Link>
      </nav>
    </div>
  )

  // Define the right content section with video or fallback image
  const rightContent = videoSrc ? (
    <div className={styles.videoWrapper}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className={styles.homeVideo}
        onError={handleVideoError}
        onCanPlay={handleVideoCanPlay}
        onLoad={handleVideoCanPlay}
      >
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : (
    <StaticImage
      src={"../images/main.png"}
      alt="Featured project"
      className={styles.fullImage}
      placeholder="blurred"
      layout="fullWidth"
      style={{ height: "100%", width: "100%" }}
      objectFit="cover"
      formats={["auto", "webp"]}
      quality={95}
    />
  )

  // Create the mobile video background element
  const mobileVideoBackground = videoSrc ? (
    <div className={styles.mobileVideoBackground}>
      <video
        ref={mobileVideoRef}
        autoPlay
        muted
        loop
        playsInline
        className={styles.mobileBackgroundVideo}
        onCanPlay={handleMobileVideoCanPlay}
        onLoad={handleMobileVideoCanPlay}
        onError={handleVideoError}
      >
        <source src={videoSrc} type="video/webm" />
      </video>
    </div>
  ) : null

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
        {mobileVideoBackground}
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