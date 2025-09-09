import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="about-hero">
      <div className="about-overlay">
        <div className="about-hero-content" data-directional dir="rtl">
          <h1>
            {t('aboutPage.hero.title')}
          </h1>
          <p>
            {t('aboutPage.hero.description')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
