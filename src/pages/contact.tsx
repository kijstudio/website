import * as React from "react"
import { PageProps } from "gatsby"
import Seo from "../components/seo"
import { StaticImage } from "gatsby-plugin-image"
import SplitScreen from "../components/SplitScreen"
import * as styles from "./contact.module.css"
import bgImage from "../images/contact.jpg"
import Header from "../components/header"

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
          <p>CONTACT: INFO@KIJSTUDIO.PL</p>
        </div>

        <div className={styles.partners}>
          <h3 className={styles.partnersTitle}>OUR PARTNERS</h3>
          <div className={styles.partnerLogos}>
            <img
              src="/product-team-logo.png"
              alt="Product Team"
              className={styles.partnerLogo}
            />
            <img
              src="/webcraft-logo.png"
              alt="Webcraft"
              className={styles.partnerLogo}
            />
          </div>
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
    <>
      <Header siteTitle="KIJ Studio" isSticky={true} transparentBg={true} fullWidth={true} navColor="white"/>
      <Seo title="Contact" description="Get in touch with KIJ Studio" />
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

export default ContactPage
