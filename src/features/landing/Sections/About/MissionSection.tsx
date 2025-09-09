import { mission } from '@/assets/images';
import { useTranslation } from 'react-i18next';

const MissionSection = () => {
  const { t } = useTranslation();

  return (
    <div className="vision-section">
      <div className="vision-container about-container">
        <div className="vision-image">
          <img src={mission} alt="مدينة مستقبلية" />
        </div>
        <div className="vision-text" data-directional="rtl">
          <h2>{t('aboutPage.missionSection.title')}</h2>
          <p>{t('aboutPage.missionSection.description')}</p>
          <div className="vision-goals">
            <p>
              <strong>{t('aboutPage.missionSection.goalsTitle')}</strong>
            </p>
            <ul>
              <li>{t('aboutPage.missionSection.goals.goal1')}</li>
              <li>{t('aboutPage.missionSection.goals.goal2')}</li>
              <li>{t('aboutPage.missionSection.goals.goal3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;
