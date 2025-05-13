import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import * as styles from "./layout.module.css"
import Header from "./header"
import Seo from "./seo"

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string[]
}

const Layout: React.FC<LayoutProps> = ({ children, title, description, keywords }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  const siteTitle = data.site.siteMetadata?.title || `KIJ Studio`
  const siteDescription = data.site.siteMetadata?.description || `Bringing your dream spaces to life with creative design and breathtaking visuals.`
  const defaultKeywords = ["architecture", "visualization", "interior design", "KIJ Studio"]

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Seo 
        title={title || siteTitle} 
        description={description || siteDescription}
        keywords={keywords || defaultKeywords}
      />
      <Header siteTitle={siteTitle} />
      <div className={styles.contentInner}>
        <main style={{ flex: 1 }}>{children}</main>
        <footer
          style={{
            textAlign: `center`,
            fontSize: `0.8rem`,
            color: `#888`,
            padding: `1.5rem 0`,
          }}
        >
          © {new Date().getFullYear()}, Kij Studio
        </footer>
      </div>
    </div>
  )
}

export default Layout 