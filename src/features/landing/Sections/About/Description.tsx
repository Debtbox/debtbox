import { headerLogo, descBg } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const Description = () => {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="description-container about-container"
      style={{ direction: i18n.language === 'en' ? 'ltr' : 'rtl' }}
    >
      <img src={descBg} alt="Description" className="description-bg" />
      <div className="description-header">
        <div className="description-header-content">
          <span>{t('aboutPage.aboutSection.title')}</span>
          <img
            src={headerLogo}
            alt="Header Logo"
            className="description-logo"
          />
        </div>
        <div className="description-text">
          <p>
            {t('aboutPage.aboutSection.description1')}
            {t('aboutPage.aboutSection.description2')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Description;
