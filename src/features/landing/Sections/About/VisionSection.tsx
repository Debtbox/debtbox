import { vision } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const VisionSection = () => {
  const { t } = useTranslation();

  return (
    <div className="vision-section about-section" aria-label={t('aboutPage.visionSection.ariaLabel', 'Vision')}>
      <div className="vision-container about-container">
        <div className="vision-text" data-directional="rtl">
          <h2>{t('aboutPage.visionSection.title')}</h2>
          <p>{t('aboutPage.visionSection.description')}</p>
          <div className="vision-goals">
            <p>
              <strong>
                🔹
                {t('aboutPage.visionSection.goalsTitle')}
              </strong>
            </p>
            <ul>
              <li>{t('aboutPage.visionSection.goals.goal1')}</li>
              <li>{t('aboutPage.visionSection.goals.goal2')}</li>
              <li>{t('aboutPage.visionSection.goals.goal3')}</li>
            </ul>
          </div>
        </div>
        <div className="vision-image">
          <img src={vision} alt="" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  );
};

export default VisionSection;
