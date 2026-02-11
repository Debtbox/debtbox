import { both, customer, merchant } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="how-we-work home-how-we-work landing-section" aria-label={t('howItWorks.ariaLabel', 'How it works')}>
        <div className="container_css how-we-work__container">
          <div className="how-we-work__text">
            <h4>{t('howItWorks.subtitle')}</h4>
            <h2>{t('howItWorks.title')}</h2>
          </div>
          <p className="how-we-work__desc">{t('howItWorks.description')}</p>
        </div>
      </section>
      <section className="features-container container_css home-for-who landing-section" aria-label={t('features.forWho.ariaLabel', 'For who')}>
        <div className="for-who-feature-card">
          <div className="icon-wrapper">
            <img src={both} alt="" loading="lazy" decoding="async" />
          </div>
          <h3>{t('features.bothParties.title')}</h3>
          <p>{t('features.bothParties.description')}</p>
        </div>

        <div className="for-who-feature-card">
          <div className="icon-wrapper">
            <img src={merchant} alt="" loading="lazy" decoding="async" />
          </div>
          <h3>{t('features.businesses.title')}</h3>
          <p>{t('features.businesses.description')}</p>
        </div>

        <div className="for-who-feature-card">
          <div className="icon-wrapper">
            <img src={customer} alt="" loading="lazy" decoding="async" />
          </div>
          <h3>{t('features.customers.title')}</h3>
          <p>{t('features.customers.description')}</p>
        </div>
      </section>
    </>
  );
};

export default HowItWorksSection;
