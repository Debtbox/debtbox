import { aboutVector4, whiteFullLogo } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const Description = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir(i18n.language);
  const isRtl = dir === 'rtl';

  return (
    <div
      className={`description-container about-container about-section ${isRtl ? 'is-rtl' : 'is-ltr'}`}
      dir={dir}
      lang={i18n.language}
      style={{ direction: dir }}
    >
      <img src={aboutVector4} alt="" className="description-vector" loading="lazy" decoding="async" />
      <img src={whiteFullLogo} alt="" className="description-bg" loading="lazy" decoding="async" />
      <div className="description-header">
        <div className="description-header-content">

          <span></span>
          <h2>{t('aboutPage.aboutSection.smartPlatform')}</h2>
        </div>
        <div className="description-text">
          <p>
            {t('aboutPage.aboutSection.description1')}{' '}
            {t('aboutPage.aboutSection.description2')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Description;
