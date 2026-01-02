import { featuresPhone } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="hero-content-column">
        <p className="sub-heading">{t('features.subHeading')}</p>
        <h1>{t('features.title')}</h1>
        <ul className="features-list">
          <li>{t('features.list.automaticReminders')}</li>
          <li>{t('features.list.storeDashboard')}</li>
          <li>{t('features.list.multiClientManagement')}</li>
          <li>{t('features.list.paymentIntegration')}</li>
        </ul>
        <Link to="/contact-us" className="feature-cta-button">
          {t('features.signUpButton')}
        </Link>
      </div>
      <div className="hero-image-column">
        <div className="phone-mockup">
          <img src={featuresPhone} alt="Logo" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
