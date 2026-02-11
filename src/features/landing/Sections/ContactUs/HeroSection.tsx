import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="hero contact-section" aria-label={t('contactUsPage.hero.ariaLabel', 'Contact us')}>
      <div className="container_css">
        <h1>{t('contactUsPage.hero.title')}</h1>
        <p>{t('contactUsPage.hero.description')}</p>
      </div>
    </section>
  );
};

export default HeroSection;
