import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  arFlag,
  enFlag,
  urFlag,
  bnFlag,
  pkFlag,
  headerLogo,
} from '@/assets/images';
import { changeLanguage } from '@/utils/changeLanguage';
import { debounce } from '@/utils/debounce';

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
  const desktopLangDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollTopRef = useRef(0);

  const languages = [
    { code: 'en', name: 'English', flag: enFlag },
    { code: 'ar', name: 'العربية', flag: arFlag },
    { code: 'ur', name: 'اوردو', flag: urFlag },
    { code: 'bn', name: 'বাংলা', flag: bnFlag },
    { code: 'pk', name: 'پاکستانی', flag: pkFlag },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Handle scroll for auto-hide/show navbar (About page only, desktop only)
  const handleScroll = useCallback(() => {
    if (!headerRef.current || location.pathname !== '/about') return;

    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > lastScrollTopRef.current && st > 100) {
      // Scrolling down - hide navbar if not hovered
      if (!isHovered) {
        setOpacity(0);
      }
    } else {
      // Scrolling up - show navbar
      setOpacity(1);
    }

    lastScrollTopRef.current = st <= 0 ? 0 : st;
  }, [isHovered, location.pathname]);

  const handleScrollDebouncedRef = useRef(debounce(handleScroll, 100));

  useEffect(() => {
    handleScrollDebouncedRef.current = debounce(handleScroll, 100);
  }, [handleScroll]);

  // Reset opacity when navigating away from About page
  useEffect(() => {
    if (location.pathname !== '/about') {
      setOpacity(1);
      setIsHovered(false);
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

    // Only add scroll listener on About page
    const scrollHandler = () => handleScrollDebouncedRef.current();
    if (location.pathname === '/about') {
      window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (location.pathname === '/about') {
        window.removeEventListener('scroll', scrollHandler);
      }
    };
  }, [handleScroll, location.pathname]);

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

  return (
    <>
      {/* Desktop Header with sticky and auto-hide (About page only) */}
      <header
        ref={headerRef}
        className={`main-header main-header-desktop ${isAboutPage ? 'about-page-header' : ''}`}
        style={
          isAboutPage
            ? { opacity: opacity, pointerEvents: opacity ? 'all' : 'none' }
            : {}
        }
        onMouseEnter={
          isAboutPage
            ? () => {
                setIsHovered(true);
                setOpacity(1);
              }
            : undefined
        }
        onMouseLeave={
          isAboutPage
            ? () => {
                setIsHovered(false);
              }
            : undefined
        }
      >
        <div className="container_css">
          <div className="logo">
            <Link to="/">
              <img src={headerLogo} alt="Logo" />
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
