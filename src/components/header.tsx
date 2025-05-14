import * as React from "react"
import { useState, useEffect } from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "./header.module.css"
import { breakpoints } from "../styles/breakpoints"

interface HeaderProps {
  siteTitle: string;
  isSticky?: boolean; 
  transparentBg?: boolean;
  fullWidth?: boolean;
  navColor?: string;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
}

const Header: React.FC<HeaderProps> = ({ 
  siteTitle, 
  isSticky = false, 
  transparentBg = false, 
  fullWidth = false, 
  navColor = "black", 
  className = "",
  innerClassName = "",
  style = {}
}) => {
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

  // Build class names with simple additions
  const headerClasses = [styles.headerWrapper];
  if (className) {
    headerClasses.push(className);
  }
  if (isSticky && !isMobile) {
    headerClasses.push(styles.sticky);
  }
  if (transparentBg && !isMobile) {
    headerClasses.push(styles.transparent);
  }
  if (fullWidth) {
    headerClasses.push(styles.fullWidth);
  }

  const innerClasses = [styles.inner];
  if (innerClassName) {
    innerClasses.push(innerClassName);
  }

  return (
    <header className={headerClasses.join(" ")}>
      <div
        className={innerClasses.join(" ")}
        style={style}
      >
        <Link
          to="/"
        >
          <StaticImage
            src="../images/logo.png"
            alt={siteTitle}
            width={120}
            placeholder="blurred"
            className={"logo"}
            layout="fixed"        
            formats={["auto", "webp"]}
            quality={95}
          />
        </Link>
        
        {/* Only render desktop navigation when not mobile */}
        {!isMobile && (
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link 
                to={item.path} 
                key={item.path} 
                className={`${styles.navLink} ${navColor === "white" ? styles.white : ""}`} 
                activeClassName={styles.navLinkActive}
              >
                <span className={styles.navText}>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Only render mobile button when is mobile */}
        {isMobile && (
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu - Only render when mobile and menu is open */}
      {isMobile && isMenuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <Link 
              to={item.path} 
              key={item.path} 
              className={styles.mobileNavLink} 
              activeClassName={styles.navLinkActive} 
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.navText}>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header 