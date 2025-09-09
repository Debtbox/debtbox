import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="container">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
    </section>
  );
};

export default HeroSection;
