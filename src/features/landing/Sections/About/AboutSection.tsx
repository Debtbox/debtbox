import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section className="about-frame-container">
      <div className="frame" data-directional dir="rtl">
        <div className="div" data-directional dir="rtl">
          <div className="text-wrapper">
            {t('aboutPage.aboutSection.title')}
          </div>
          <div className="">
            <a href="/">
              <img src="assets/about-logo2.svg" alt="Logo" />
            </a>
          </div>
        </div>
        <div>
          <p className="element">
            {t('aboutPage.aboutSection.description1')}
          </p>
          <p className="element">
            {t('aboutPage.aboutSection.description2')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
