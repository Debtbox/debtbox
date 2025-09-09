import { both, customer, merchant } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="how-we-work">
        <div
          className="container how-we-work__container"
          data-directional
          dir="rtl"
        >
          <div className="how-we-work__text">
            <h4>{t('howItWorks.subtitle')}</h4>
            <h2>{t('howItWorks.title')}</h2>
          </div>
          <p className="how-we-work__desc">{t('howItWorks.description')}</p>
        </div>
      </section>
      <section className="features-container container">
        <div className="for-who-feature-card">
          <div className="icon-wrapper">
            <img src={both} alt="Logo" />
          </div>
          <h3>{t('features.bothParties.title')}</h3>
          <p>{t('features.bothParties.description')}</p>
        </div>

        <div className="for-who-feature-card">
          <div className="icon-wrapper">
            <img src={merchant} alt="Logo" />
          </div>
          <h3>{t('features.businesses.title')}</h3>
          <p>{t('features.businesses.description')}</p>
        </div>

        <div className="for-who-feature-card">
          <div className="icon-wrapper">
            <img src={customer} alt="Logo" />
          </div>
          <h3>{t('features.customers.title')}</h3>
          <p>{t('features.customers.description')}</p>
        </div>
      </section>
    </>
  );
};

export default HowItWorksSection;
