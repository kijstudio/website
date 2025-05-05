import * as React from "react"
import { useState, useEffect } from "react"
import { Link } from "gatsby"
import Logo from "../images/logo.png"
import * as headerStyles from "./header.module.css"
import { breakpoints } from "../styles/breakpoints"

interface HeaderProps {
  siteTitle: string;
  isSticky?: boolean; 
  transparentBg?: boolean;
  fullWidth?: boolean;
  navColor?: string;
}

const Header: React.FC<HeaderProps> = ({ siteTitle, isSticky = false, transparentBg = false, fullWidth = false, navColor = "black" }) => {
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

  const determineHeaderInnerClass = (isSticky: boolean, transparentBg: boolean, fullWidth: boolean) => {
    let headerClass = [headerStyles.headerInner];
    if (isSticky) {
      headerClass.push(headerStyles.headerSticky);
    }
    if (transparentBg) {
      headerClass.push(headerStyles.transparentBg);
    }
    if (fullWidth) {
      headerClass.push(headerStyles.fullWidth);
    }
    return headerClass.join(" ")
  };

  return (
    <header className={isMobile && isMenuOpen ? headerStyles.headerFixed : ""}>
      <div
        className={determineHeaderInnerClass(isSticky, transparentBg, fullWidth)}
      >
        <Link
          to="/"
        >
          <img src={Logo} alt={siteTitle} className={headerStyles.logo} />
        </Link>
        
        {/* Only render desktop navigation when not mobile */}
        {!isMobile && (
          <nav className={headerStyles.desktopNav}>
            {navItems.map((item) => (
              <Link 
                to={item.path} 
                key={item.path} 
                className={`${headerStyles.navLink} ${navColor === "white" ? headerStyles.white : ""}`} 
                activeClassName={headerStyles.navLinkActive}
              >
                <span className={headerStyles.navText}>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Only render mobile button when is mobile */}
        {isMobile && (
          <button 
            className={headerStyles.mobileMenuButton}
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
            <div className={`${headerStyles.hamburger} ${isMenuOpen ? headerStyles.open : ''}`}
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
        <div className={headerStyles.mobileMenu}>
          {navItems.map((item) => (
            <Link 
              to={item.path} 
              key={item.path} 
              className={headerStyles.mobileNavLink} 
              activeClassName={headerStyles.navLinkActive} 
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={headerStyles.navText}>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header 