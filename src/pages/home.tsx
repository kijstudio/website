import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "./home.module.css"
import Seo from "../components/seo"
import SplitScreen from "../components/SplitScreen"
import bgImage from "../images/main.png"

// For the video, we need to use require to handle the case when the file doesn't exist yet
const videoSrc = typeof window !== 'undefined' ? 
  require('../movies/P2.mp4').default : null;

const HomePage: React.FC = () => {
  const [isVideoLoading, setIsVideoLoading] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mobileVideoRef = React.useRef<HTMLVideoElement>(null);
  
  React.useEffect(() => {
    // If there's no video source, we shouldn't show loading state
    if (!videoSrc) {
      setIsVideoLoading(false);
      return;
    }
    
    console.log("Video source exists:", videoSrc);
    
    // If the video is already loaded in the DOM
    if (videoRef.current && videoRef.current.readyState >= 3) {
      console.log("Video already loaded (readyState):", videoRef.current.readyState);
      setIsVideoLoading(false);
    }
    
    // Fallback: Set a timeout to stop showing loading screen after 5 seconds
    // regardless of whether the video loaded properly
    const timeoutId = setTimeout(() => {
      console.log("Fallback timeout triggered - forcing load complete");
      setIsVideoLoading(false);
    }, 10000);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const handleVideoLoaded = () => {
    console.log("Video loaded event triggered");
    setIsVideoLoading(false);
  };
  
  const handleVideoLoadedMetadata = () => {
    console.log("Video metadata loaded");
  };
  
  const handleVideoCanPlay = () => {
    console.log("Video can play now");
    setIsVideoLoading(false);
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e);
    // If video errors, we should stop showing loading screen
    setIsVideoLoading(false);
  };
  
  // Define the left content section
  const leftContent = (
    <>
      <StaticImage
        src="../images/logo.png"
        width={200}
        alt="KIJ Studio"
        placeholder="blurred"
        className={"logo"}
        layout="fixed"
        formats={["auto", "webp"]}
        quality={95}
      />
      
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
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className={styles.homeVideo}
        poster={bgImage}
        onLoadedData={handleVideoLoaded}
        onLoad={handleVideoLoaded}
        onLoadedMetadata={handleVideoLoadedMetadata}
        onCanPlay={handleVideoCanPlay}
        onError={handleVideoError}
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
        ref={mobileVideoRef}
        autoPlay
        muted
        loop
        playsInline
        className={styles.mobileBackgroundVideo}
        poster={bgImage}
        onLoadedData={handleVideoLoaded}
        onLoad={handleVideoLoaded}
        onLoadedMetadata={handleVideoLoadedMetadata}
        onCanPlay={handleVideoCanPlay}
        onError={handleVideoError}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  ) : null;

  return (
    <>
      <Seo 
        title="KIJ Studio" 
        description="Welcome to KIJ Studio - Architectural Visualization and Interior Design"
      >
        <meta name="keywords" content="interior design, visualization, architecture" />
      </Seo>
      <div className={`${styles.pageContent} ${isVideoLoading ? styles.hidden : ''}`}>
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