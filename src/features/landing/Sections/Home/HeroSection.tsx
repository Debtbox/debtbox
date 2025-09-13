import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="container_css">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.description')}</p>
      </div>
    </section>
  );
};

export default HeroSection;
