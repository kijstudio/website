import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import * as styles from "./layout.module.css"
import Header from "./header"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
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