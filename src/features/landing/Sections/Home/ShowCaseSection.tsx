import { blueIcon, phone, redIcon } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const ShowCaseSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  return (
    <section className="features-section">
      <div className="feature-card bottom-left">
        <img src={blueIcon} alt="Icon" className="card-icon" />
        <h3>{t('showcase.card1.title')}</h3>
        <p>{t('showcase.card1.description')}</p>
      </div>

      <div className="phone-image">
        <img src={phone} alt="Phone Mockup" className={isRtl ? 'rtl-phone' : 'ltr-phone'} />
      </div>

      <div className="feature-card top-right">
        <img src={redIcon} alt="Icon" className="card-icon" />
        <h3>{t('showcase.card2.title')}</h3>
        <p>{t('showcase.card2.description')}</p>
      </div>
    </section>
  );
};

export default ShowCaseSection;
