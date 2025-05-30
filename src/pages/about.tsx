import * as React from "react"
import { PageProps } from "gatsby"
import Seo from "../components/seo"
import { StaticImage } from "gatsby-plugin-image"
import SplitScreen from "../components/SplitScreen"
import * as styles from "./about.module.css"
import bgImage from "../images/contact.jpg"
import Header from "../components/header"
import architekciLogo from "../images/architekci.png"
import webcraftLogo from "../images/webcraft.png"
import kFrameLogo from "../images/k-frame-logo.svg"

const AboutPage: React.FC<PageProps> = () => {
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
          <p>CONTACT: <a className={styles.contactLink} href="mailto:info@kijstudio.pl">INFO@KIJSTUDIO.PL</a></p>
        </div>
      </div>
    </div>
  )

  // Define right content with contact.jpg image
  const rightContent = (
    <StaticImage
      src={"../images/contact.jpg"}
      alt="Contact"
      placeholder="blurred"
      layout="fullWidth"
      style={{ height: "100%", width: "100%" }}
      objectFit="cover"
      formats={["auto", "webp"]}
      quality={95}
    />
  )

  return (
    <div className={styles.contactPage}>
      <Header 
        siteTitle="KIJ Studio" 
        isSticky={true} 
        transparentBg={true} 
        fullWidth={true} 
        navColor="white"
        className={styles.header}
      />
      <Seo 
        title="About Us" 
        description="Get in touch with KIJ Studio" 
        keywords={["contact", "about us", "KIJ Studio", "architecture firm", "visualization studio", "get in touch"]}
      />
      <SplitScreen
        leftContent={leftContent}
        rightContent={rightContent}
        fullWidth={true}
        leftRatio={4}
        rightRatio={6}
        backgroundImageSrc={bgImage}
      />
    </div>
  )
}

export default AboutPage
