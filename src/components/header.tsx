import * as React from "react"
import { useState, useEffect } from "react"
import { Link } from "gatsby"
import Logo from "../images/logo.png"
import "./header.css"
import * as styles from "../styles/home.module.css"
import { breakpoints } from "../styles/breakpoints"

interface HeaderProps {
  siteTitle: string
}

const Header: React.FC<HeaderProps> = ({ siteTitle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if we're on the client and update the mobile state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= breakpoints.md);
      };
      
      // Initial check
      checkMobile();
      
      // Add event listener for window resize
      window.addEventListener('resize', checkMobile);
      
      // Cleanup
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/visualizations', label: 'Visualizations' },
    { path: '/interiors', label: 'Interiors' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={isMobile && isMenuOpen ? "header-fixed" : ""}
      style={{
        background: `transparent`,
        marginBottom: `0.5rem`,
      }}
    >
      <div
        className="header-inner"
        style={{
          padding: `1.45rem 1.0875rem`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative', // Add relative positioning
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
          <img src={Logo} alt={siteTitle} className={styles.logo} />
        </Link>
        
        {/* Only render desktop navigation when not mobile */}
        {!isMobile && (
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Link 
                to={item.path} 
                key={item.path} 
                className="navLink" 
                activeClassName="navLinkActive"
              >
                <span className="navText">{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Only render mobile button when is mobile */}
        {isMobile && (
          <button 
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{
              display: 'block',
              padding: '0',
              margin: '0',
              background: 'transparent',
              border: 'none'
            }}
          >
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}
              style={{
                padding: '0',
                margin: '0'
              }}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu - Only render when mobile and menu is open */}
      {isMobile && isMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link 
              to={item.path} 
              key={item.path} 
              className="mobile-navLink" 
              activeClassName="navLinkActive" 
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="navText">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header 