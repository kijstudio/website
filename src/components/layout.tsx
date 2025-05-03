import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

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
      <div
        className="content-inner"
        style={{
          padding: `0 1.0875rem`,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout 