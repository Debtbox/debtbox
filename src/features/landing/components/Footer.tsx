import { fb, footerLogo, ig, ln, sidebarLogoWhite, x } from '@/assets/images';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container container_css">
        <div className="footer-section footer-logo">
          <Link to="/">
            <img src={i18n.language === 'ar' ? footerLogo : sidebarLogoWhite} alt="Logo" />
          </Link>
        </div>
        <div className="footer-section links" data-directional dir="rtl">
          <div className="links-column">
            <h3>{t('footer.siteInformation')}</h3>
            <ul>
              <li>
                <Link to="/privacy-policy">{t('footer.privacyPolicy')}</Link>
              </li>
              <li>
                <Link to="/terms-conditions">
                  {t('footer.termsConditions')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="links-column">
            <h3>{t('footer.aboutDebtBox')}</h3>
            <ul>
              <li>
                <Link to="/">{t('navigation.home')}</Link>
              </li>
              <li>
                <Link to="/about">{t('navigation.aboutUs')}</Link>
              </li>
              <li>
                <Link to="/contact-us">{t('navigation.contactUs')}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-section social-media">
          <div className="social-icons">
            <Link to="#">
              <img src={ig} alt="Instagram" />
            </Link>
            <Link to="#">
              <img src={ln} alt="LinkedIn" />
            </Link>
            <Link to="#">
              <img src={fb} alt="Facebook" />
            </Link>
            <Link to="#">
              <img src={x} alt="Twitter" />
            </Link>
          </div>
        </div>
      </div>
      <p className="footer-small">{t('footer.copyright')}</p>
    </footer>
  );
};

export default Footer;
