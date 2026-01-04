import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  arFlag,
  enFlag,
  urFlag,
  bnFlag,
  headerLogo,
  whiteLogo,
} from '@/assets/images';
import { changeLanguage } from '@/utils/changeLanguage';

const Header = () => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopLangDropdownOpen, setIsDesktopLangDropdownOpen] =
    useState(false);
  const [isMobileLangDropdownOpen, setIsMobileLangDropdownOpen] =
    useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const desktopLangDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const lastScrollTopRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const languages = [
    { code: 'en', name: 'English', flag: enFlag },
    { code: 'ar', name: 'العربية', flag: arFlag },
    { code: 'ur', name: 'اوردو', flag: urFlag },
    { code: 'bn', name: 'বাংলা', flag: bnFlag },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Handle scroll for auto-hide/show navbar and detect hero section (About page only, desktop only)
  const handleScroll = useCallback(() => {
    if (!headerRef.current || location.pathname !== '/about') return;

    const st = window.pageYOffset || document.documentElement.scrollTop;

    // Cache hero section reference
    if (!heroSectionRef.current) {
      heroSectionRef.current = document.querySelector(
        '.about-hero',
      ) as HTMLElement;
    }

    if (heroSectionRef.current) {
      const heroHeight = heroSectionRef.current.clientHeight;
      const isInHero = st < heroHeight - 50; // Add small buffer for smoother transition
      setIsInHeroSection(isInHero);

      // Only apply auto-hide/show when in hero section
      if (isInHero) {
        if (st > lastScrollTopRef.current && st > 100) {
          // Scrolling down - hide navbar if not hovered
          if (!isHovered) {
            setOpacity(0);
          }
        } else {
          // Scrolling up - show navbar
          setOpacity(1);
        }
      } else {
        // Past hero section - always show navbar
        setOpacity(1);
      }
    }

    lastScrollTopRef.current = st <= 0 ? 0 : st;
  }, [isHovered, location.pathname]);

  // Use requestAnimationFrame for smooth scroll handling
  const handleScrollRAF = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      handleScroll();
    });
  }, [handleScroll]);

  useEffect(() => {
    if (location.pathname !== '/about') {
      setOpacity(1);
      setIsHovered(false);
      setIsInHeroSection(false);
      heroSectionRef.current = null;
    } else {
      // Check initial position on About page
      const heroSection = document.querySelector('.about-hero') as HTMLElement;
      if (heroSection) {
        heroSectionRef.current = heroSection;
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = heroSection.clientHeight;
        setIsInHeroSection(st < heroHeight - 50);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopLangDropdownRef.current &&
        !desktopLangDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopLangDropdownOpen(false);
      }
      if (
        mobileLangDropdownRef.current &&
        !mobileLangDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Only add scroll listener on About page with requestAnimationFrame for smooth updates
    if (location.pathname === '/about') {
      window.addEventListener('scroll', handleScrollRAF, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (location.pathname === '/about') {
        window.removeEventListener('scroll', handleScrollRAF);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [handleScrollRAF, location.pathname]);

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsDesktopLangDropdownOpen(false);
    setIsMobileLangDropdownOpen(false);
  };

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const isAboutPage = location.pathname === '/about';
  const shouldUseHeroStyling = isAboutPage && isInHeroSection;

  return (
    <>
      {/* Desktop Header with sticky and auto-hide (Hero section only on About page) */}
      <header
        ref={headerRef}
        className={`main-header main-header-desktop ${shouldUseHeroStyling ? 'about-page-header' : ''}`}
        style={
          shouldUseHeroStyling
            ? { opacity: opacity, pointerEvents: opacity ? 'all' : 'none' }
            : {}
        }
        onMouseEnter={
          shouldUseHeroStyling
            ? () => {
                setIsHovered(true);
                setOpacity(1);
              }
            : undefined
        }
        onMouseLeave={
          shouldUseHeroStyling
            ? () => {
                setIsHovered(false);
              }
            : undefined
        }
      >
        <div className="container_css">
          <div className="logo">
            <Link to="/">
              <img
                src={shouldUseHeroStyling ? whiteLogo : headerLogo}
                alt="Logo"
              />
            </Link>
          </div>

          <nav className="nav-links">
            <Link to="/" className={isActiveLink('/') ? 'active' : ''}>
              {t('navigation.home')}
              {isActiveLink('/') && (
                <span className="nav-active-indicator"></span>
              )}
            </Link>
            <Link
              to="/contact-us"
              className={isActiveLink('/contact-us') ? 'active' : ''}
            >
              {t('navigation.contactUs')}
              {isActiveLink('/contact-us') && (
                <span className="nav-active-indicator"></span>
              )}
            </Link>
            <Link
              to="/about"
              className={isActiveLink('/about') ? 'active' : ''}
            >
              {t('navigation.aboutUs')}
              {isActiveLink('/about') && (
                <span className="nav-active-indicator"></span>
              )}
            </Link>
          </nav>

          <div className="header-buttons">
            <div className="cta-button">
              <Link to="/auth/login">{t('common.buttons.signIn')}</Link>
            </div>
            <div className="lang-button" ref={desktopLangDropdownRef}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDesktopLangDropdownOpen(!isDesktopLangDropdownOpen);
                }}
              >
                <img src={currentLanguage.flag} id="langIcon" alt="language" />{' '}
                <span className="lang-toggle">{currentLanguage.name}</span>
                <svg
                  style={{
                    width: '12px',
                    height: '12px',
                    marginLeft: '4px',
                    transition: 'transform 0.2s',
                    transform: isDesktopLangDropdownOpen
                      ? 'rotate(180deg)'
                      : 'rotate(0deg)',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
              {isDesktopLangDropdownOpen && (
                <div className="lang-dropdown">
                  {languages.map((language) => (
                    <a
                      key={language.code}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLanguageChange(language.code);
                      }}
                      className={
                        language.code === currentLanguage.code ? 'active' : ''
                      }
                    >
                      <img src={language.flag} alt={`${language.code}-flag`} />
                      <span>{language.name}</span>
                      {language.code === currentLanguage.code && (
                        <svg
                          style={{
                            width: '16px',
                            height: '16px',
                            marginLeft: 'auto',
                          }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="main-header main-header-mobile">
        <div className="container_css">
          <div className="logo">
            <Link to="/">
              <img src={headerLogo} alt="Logo" />
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="lang-button-menu" ref={mobileLangDropdownRef}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileLangDropdownOpen(!isMobileLangDropdownOpen);
                }}
              >
                <img
                  src={currentLanguage.flag}
                  id="langIconMenu"
                  alt="language"
                />
              </a>
              {isMobileLangDropdownOpen && (
                <div className="lang-dropdown-menu">
                  {languages.map((language) => (
                    <a
                      key={language.code}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLanguageChange(language.code);
                      }}
                      className={
                        language.code === currentLanguage.code ? 'active' : ''
                      }
                    >
                      <img src={language.flag} alt={`${language.code}-flag`} />
                      <span>{language.name}</span>
                      {language.code === currentLanguage.code && (
                        <svg
                          style={{
                            width: '16px',
                            height: '16px',
                            marginLeft: 'auto',
                          }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <button
              className="burger-menu"
              id="burger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              &#9776;
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}
        id="mobileMenu"
      >
        <div className="logo">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={headerLogo} alt="Logo" />
          </Link>
        </div>
        <nav>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navigation.home')}
          </Link>
          <Link to="/contact-us" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navigation.contactUs')}
          </Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navigation.aboutUs')}
          </Link>
          <Link
            to="/auth/login"
            className="mobile-cta"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('common.buttons.signIn')}
          </Link>
        </nav>
      </div>

      <div
        className={`overlay ${isMobileMenuOpen ? 'active' : ''}`}
        id="overlay"
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
    </>
  );
};

export default Header;
