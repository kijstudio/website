import * as React from "react"
import { PageProps } from "gatsby"
import Seo from "../components/seo"
import SplitScreen from "../components/SplitScreen"
import * as styles from "./contact.module.css"
import Header from "../components/header"
import architekciLogo from "../images/architekci.png"
import webcraftLogo from "../images/webcraft.png"
import kFrameLogo from "../images/k-frame-logo.svg"
// Import fallback image for when video is not available
import fallbackImage from "../images/contact.jpg"

// For the video, we need to use require to handle the case when the file doesn't exist yet
const videoSrc = typeof window !== 'undefined' ? 
  require('../movies/P2.mp4').default : null;

const ContactPage: React.FC<PageProps> = () => {
  // Define left content with the text from the image
  const leftContent = (
    <div className={styles.contactContentWrapper}>
      <div className={styles.contactContent}>
        <div className={styles.studioInfo}>
          <p className={styles.studioText}>
            KIJ STUDIO WAS FOUNDED BY TWO KRAKÓW-BASED ARCHITECTS WHO SPECIALIZE
            IN HIGH-QUALITY 3D RENDERINGS AND VISUALIZATIONS, TRANSFORMING
            ARCHITECTURAL IDEAS INTO STUNNING, LIFELIKE IMAGES. BY COMBINING
            CREATIVITY WITH PRECISION, WE BRING YOUR DESIGNS TO LIFE, ENSURING
            EVERY DETAIL IS CAREFULLY CRAFTED
          </p>
        </div>

        <div className={styles.contactInfo}>
          <p>CONTACT: <a className={styles.contactLink} href="mailto:info@kijstudio.pl">INFO@KIJSTUDIO.PL</a></p>
        </div>

        <div className={styles.partners}>
          <h3 className={styles.partnersTitle}>OUR PARTNERS</h3>
          <div className={styles.partnerLogos}>
            <img
              src={architekciLogo}
              alt="Architekci Team"
              className={styles.partnerLogo}
            />
            <a href="https://webcraftstudio.pl/" target="_blank" rel="noopener noreferrer">
              <img
                src={webcraftLogo}
                alt="Webcraft"
                className={`${styles.partnerLogo} ${styles.invert}`}
              />
            </a>
            <img
              src={kFrameLogo}
              alt="K-Frame"
              className={`${styles.partnerLogo} ${styles.invert}`}
            />
          </div>
        </div>
      </div>
    </div>
  )

  // Define right content with video or fallback image
  const rightContent = videoSrc ? (
    <div className={styles.videoWrapper}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.contactVideo}
        poster={fallbackImage}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : (
    <div className={styles.videoWrapper}>
      <img
        src={fallbackImage}
        alt="Contact"
        className={styles.contactVideo}
      />
    </div>
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
        poster={fallbackImage}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  ) : null;

  return (
    <div className={styles.contactPage}>
      <Header 
        siteTitle="KIJ Studio" 
        isSticky={true} 
        transparentBg={true} 
        fullWidth={true} 
        navColor="white" 
        className={styles.headerWrapper}
        innerClassName={styles.headerInner}
      />
      <Seo title="Contact" description="Get in touch with KIJ Studio" />
      {mobileVideoBackground}
      <SplitScreen
        leftContent={leftContent}
        rightContent={rightContent}
        fullWidth={true}
        leftRatio={4}
        rightRatio={6}
        backgroundImageSrc={!videoSrc ? fallbackImage : undefined}
      />
    </div>
  )
}

export default ContactPage
