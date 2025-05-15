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

  const handleCanPlay = () => {
    videoRef.current?.play()
    setIsVideoLoading(false)
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
  const rightContent = <div className={styles.videoWrapper}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className={styles.homeVideo}
        onCanPlay={handleCanPlay}
      >
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  

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