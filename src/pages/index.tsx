import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "../styles/home.module.css"
import Logo from "../images/logo.png"
import Seo from "../components/seo"

const IndexPage: React.FC = () => {
  return (
    <>
      <Seo 
        title="Home" 
        description="Welcome to KIJ Studio - Architectural Visualization and Interior Design"
      >
        <meta name="keywords" content="interior design, visualization, architecture" />
      </Seo>
      <div className={styles.container}>
        <section className={styles.leftSection}>
          <img src={Logo} alt="KIJ Studio" className={styles.logo} />
          
          <div className={styles.contentWrapper}>
            <div className={styles.info}>
              <p>
                We are a creative studio specializing in architectural visualization 
                and interior design. Our passion lies in transforming spaces and 
                bringing architectural visions to life through stunning visualizations 
                and thoughtful interior solutions.
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
        </section>

        <section className={styles.rightSection}>
          <StaticImage
            src="../images/main.png"
            alt="Featured project"
            className={styles.fullImage}
            placeholder="blurred"
            layout="fullWidth"
            style={{ height: "100%", width: "100%" }}
            objectFit="cover"
            formats={["auto", "webp", "avif"]}
            quality={95}
          />
        </section>
      </div>
    </>
  )
}

export default IndexPage 