import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="container">
        <h1>{t('contactUsPage.hero.title')}</h1>
        <p>{t('contactUsPage.hero.description')}</p>
      </div>
    </section>
  );
};

export default HeroSection;
