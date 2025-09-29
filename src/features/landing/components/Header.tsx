import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { arFlag, enFlag, headerLogo } from '@/assets/images';
import { changeLanguage } from '@/utils/changeLanguage';

const Header = () => {
  const { i18n, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="container_css">
        <div className="logo">
          <Link to="/">
            <img src={headerLogo} alt="Logo" />
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="lang-button-menu">
            <a
              href="#"
              onClick={() =>
                changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
              }
            >
              <img
                src={i18n.language === 'en' ? arFlag : enFlag}
                id="langIconMenu"
                alt="language"
              />
            </a>
          </div>
          <button
            className="burger-menu"
            id="burger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            &#9776;
          </button>
        </div>

        <nav className="nav-links">
          <Link to="/">{t('navigation.home')}</Link>
          <Link to="/contact-us">{t('navigation.contactUs')}</Link>
          <Link to="/about">{t('navigation.aboutUs')}</Link>
        </nav>

        <div className="header-buttons">
          <div className="cta-button">
            <Link to="/auth/login">{t('common.buttons.signIn')}</Link>
          </div>
          <div className="lang-button">
            <a
              href="#"
              onClick={() =>
                changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
              }
            >
              <img
                src={i18n.language === 'en' ? arFlag : enFlag}
                id="langIcon"
                alt="language"
              />{' '}
              <span className="lang-toggle">
                {i18n.language === 'en'
                  ? t('navigation.arabic')
                  : t('navigation.english')}
              </span>
            </a>
          </div>
        </div>
      </div>

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
    </header>
  );
};

export default Header;
