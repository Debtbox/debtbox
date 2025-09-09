import {
  cart,
  clockFill,
  dashboard,
  flash,
  handsHelping,
  secure,
} from '@/assets/images';
import { useTranslation } from 'react-i18next';

const WhyUsSection = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="section-title" data-directional="rtl">
        {t('aboutPage.whyUsSection.title')}
      </h2>
      <section className="features-container" data-directional dir="rtl">
        <div
          className="for-who-feature-card why-us-card"
          data-directional
          dir="rtl"
        >
          <div className="icon-wrapper why-us-icon-wrapper">
            <img src={flash} alt="Logo" />
          </div>
          <h3>{t('aboutPage.whyUsSection.features.easeOfUse.title')}</h3>
          <p data-directional dir="rtl">
            {t('aboutPage.whyUsSection.features.easeOfUse.description')}
          </p>
        </div>
        <div
          className="for-who-feature-card why-us-card"
          data-directional
          dir="rtl"
        >
          <div className="icon-wrapper why-us-icon-wrapper">
            <img src={secure} alt="Logo" />
          </div>
          <h3>{t('aboutPage.whyUsSection.features.highSecurity.title')}</h3>
          <p data-directional dir="rtl">
            {t('aboutPage.whyUsSection.features.highSecurity.description')}
          </p>
        </div>
        <div
          className="for-who-feature-card why-us-card"
          data-directional
          dir="rtl"
        >
          <div className="icon-wrapper why-us-icon-wrapper">
            <img src={dashboard} alt="Logo" />
          </div>
          <h3>
            {t('aboutPage.whyUsSection.features.advancedDashboard.title')}
          </h3>
          <p data-directional dir="rtl">
            {t('aboutPage.whyUsSection.features.advancedDashboard.description')}
          </p>
        </div>
      </section>

      <section className="features-container" data-directional dir="rtl">
        <div
          className="for-who-feature-card why-us-card"
          data-directional
          dir="rtl"
        >
          <div className="icon-wrapper why-us-icon-wrapper">
            <img src={clockFill} alt="Logo" />
          </div>
          <h3>
            {t('aboutPage.whyUsSection.features.instantNotifications.title')}
          </h3>
          <p data-directional dir="rtl">
            {t(
              'aboutPage.whyUsSection.features.instantNotifications.description',
            )}
          </p>
        </div>
        <div
          className="for-who-feature-card why-us-card"
          data-directional
          dir="rtl"
        >
          <div className="icon-wrapper why-us-icon-wrapper">
            <img src={cart} alt="Logo" />
          </div>
          <h3>{t('aboutPage.whyUsSection.features.buyOnCredit.title')}</h3>
          <p data-directional dir="rtl">
            {t('aboutPage.whyUsSection.features.buyOnCredit.description')}
          </p>
        </div>
        <div
          className="for-who-feature-card why-us-card"
          data-directional
          dir="rtl"
        >
          <div className="icon-wrapper why-us-icon-wrapper">
            <img src={handsHelping} alt="Logo" />
          </div>
          <h3>{t('aboutPage.whyUsSection.features.buildingTrust.title')}</h3>
          <p data-directional dir="rtl">
            {t('aboutPage.whyUsSection.features.buildingTrust.description')}
          </p>
        </div>
      </section>
    </>
  );
};

export default WhyUsSection;
