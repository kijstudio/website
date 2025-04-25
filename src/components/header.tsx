import * as React from "react"
import { Link } from "gatsby"
import Logo from "../images/logo.png"
import "./header.css"

interface HeaderProps {
  siteTitle: string
}

const Header: React.FC<HeaderProps> = ({ siteTitle }) => (
  <header
    style={{
      background: `transparent`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
        style={{
          color: `black`,
          textDecoration: `none`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img src={Logo} alt={siteTitle} style={{ height: '40px', width: 'auto', margin: 0 }} />
      </Link>
      <nav style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
      }}>
        <Link to="/visualizations" className="navLink" activeClassName="navLinkActive">
          <span className="navText">Visualizations</span>
        </Link>
        <Link to="/interiors" className="navLink" activeClassName="navLinkActive">
          <span className="navText">Interiors</span>
        </Link>
        <Link to="/contact" className="navLink" activeClassName="navLinkActive">
          <span className="navText">Contact</span>
        </Link>
      </nav>
    </div>
  </header>
)

export default Header 