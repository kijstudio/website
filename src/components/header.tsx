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
    { path: '/interior-design', label: 'Interior Design' },
    { path: '/visualizations', label: 'Visualizations' },
    { path: '/about', label: 'About Us' },
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
            
            {/* Instagram Icon */}
            <a 
              href="https://www.instagram.com/kijstudio" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.instagramLink} ${navColor === "white" ? styles.white : ""}`}
              aria-label="Follow us on Instagram"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className={styles.instagramIcon}
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
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
          
          {/* Instagram Icon for Mobile */}
          <a 
            href="https://www.instagram.com/kijstudio" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.mobileInstagramLink}
            aria-label="Follow us on Instagram"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className={styles.instagramIcon}
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      )}
    </header>
  )
}

export default Header 