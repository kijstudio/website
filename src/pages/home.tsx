import * as React from "react"
import { Link, HeadFC } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "./home.module.css"
import Logo from "../images/logo.png"
import Seo from "../components/seo"
import SplitScreen from "../components/SplitScreen"
import bgImage from "../images/main.png"

// For the video, we need to use require to handle the case when the file doesn't exist yet
const videoSrc = typeof window !== 'undefined' ? 
  require('../movies/P2.mp4').default : null;

const HomePage: React.FC = () => {
  // Define the left content section
  const leftContent = (
    <>
      <img src={Logo} alt="KIJ Studio" className={styles.logo} />
      
      <div className={styles.contentWrapper}>
        <div className={styles.info}>
          <p>
            Bringing your dream spaces to life with creative design and breathtaking visuals.
          </p>
        </div>

        <nav className={styles.nav}>
          <Link to="/visualizations" className={styles.navLink} activeClassName={styles.navLinkActive}>
            Visualizations
          </Link>
          <Link to="/interiors" className={styles.navLink} activeClassName={styles.navLinkActive}>
            Interiors
          </Link>
          <Link to="/contact" className={styles.navLink} activeClassName={styles.navLinkActive}>
            Contact
          </Link>
        </nav>
      </div>
    </>
  );

  // Define the right content section with video or fallback image
  const rightContent = videoSrc ? (
    <div className={styles.videoWrapper}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.homeVideo}
        poster={bgImage}
      >
        <source src={videoSrc} type="video/mp4" />
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
  );

  // Create the mobile video background element
  const mobileVideoBackground = videoSrc ? (
    <div className={styles.mobileVideoBackground}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.mobileBackgroundVideo}
        poster={bgImage}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  ) : null;

  return (
    <>
      <Seo 
        title="Home" 
        description="Welcome to KIJ Studio - Architectural Visualization and Interior Design"
      >
        <meta name="keywords" content="interior design, visualization, architecture" />
      </Seo>
      {mobileVideoBackground}
      <SplitScreen 
        leftContent={leftContent}
        rightContent={rightContent}
        fullWidth={true}
        leftRatio={4}
        rightRatio={6}
        backgroundImageSrc={bgImage}
      />
    </>
  )
}

export const Head: HeadFC = () => (
  <Seo 
    title="Home" 
    description="Welcome to KIJ Studio - Architectural Visualization and Interior Design"
  >
    <meta name="keywords" content="interior design, visualization, architecture" />
  </Seo>
)

export default HomePage 