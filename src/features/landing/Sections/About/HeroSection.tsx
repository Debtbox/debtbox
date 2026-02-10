import { aboutHero } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="about-hero">
      <div className="about-overlay">
        <div
          className="about-hero-content"
          style={{ direction: i18n.language === 'en' ? 'ltr' : 'rtl' }}
        >
          <h1>{t('aboutPage.hero.title')}</h1>
          <p>{t('aboutPage.hero.description')}</p>
        </div>
        <img src={aboutHero} alt="about" className="about-hero-image" fetchPriority="high" width={1200} height={600} />
      </div>
    </section>
  );
};

export default HeroSection;
