import { useTranslation } from 'react-i18next';
import '../../styles/terms-conditions.css';

const TermsContentSection = () => {
  const { t, i18n } = useTranslation();

  return (
    <section
      id="terms-and-conditions"
      className="terms-container"
      style={{ direction: i18n.language === 'en' ? 'ltr' : 'rtl' }}
    >
      <div className="translations-content-container">
        <div className="container">
          <div className="tab-content translations-content-item">
            <h2>{t('termsAndConditionsPage.content.title')}</h2>
            <p>{t('termsAndConditionsPage.content.lastUpdated')}</p>

            <h3>{t('termsAndConditionsPage.content.section1.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section1.description')}</p>

            <h3>{t('termsAndConditionsPage.content.section2.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section2.description')}</p>

            <h3>{t('termsAndConditionsPage.content.section3.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section3.company')}</p>
            <p>{t('termsAndConditionsPage.content.section3.country')}</p>
            <p>{t('termsAndConditionsPage.content.section3.device')}</p>
            <p>{t('termsAndConditionsPage.content.section3.service')}</p>
            <p>
              {t('termsAndConditionsPage.content.section3.thirdPartyService')}
            </p>
            <p>{t('termsAndConditionsPage.content.section3.website')}</p>
            <p>{t('termsAndConditionsPage.content.section3.you')}</p>

            <h3>{t('termsAndConditionsPage.content.section4.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section4.description')}</p>

            <h3>{t('termsAndConditionsPage.content.section5.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section5.description')}</p>

            <h3>{t('termsAndConditionsPage.content.section6.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section6.description')}</p>

            <h3>{t('termsAndConditionsPage.content.section7.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section7.description')}</p>

            <h3>{t('termsAndConditionsPage.content.section8.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section8.description')}</p>

            <h4>
              {t('termsAndConditionsPage.content.section8.subsection1.title')}
            </h4>
            <p>
              {t(
                'termsAndConditionsPage.content.section8.subsection1.description',
              )}
            </p>

            <h4>
              {t('termsAndConditionsPage.content.section8.subsection2.title')}
            </h4>
            <p>
              {t(
                'termsAndConditionsPage.content.section8.subsection2.description',
              )}
            </p>
            <ul>
              <li>
                <p>
                  {t(
                    'termsAndConditionsPage.content.section8.subsection2.list2',
                  )}
                </p>
              </li>
              <li>
                <p>
                  {t(
                    'termsAndConditionsPage.content.section8.subsection2.list3',
                  )}
                </p>
              </li>
            </ul>

            <h4>
              {t('termsAndConditionsPage.content.section8.subsection3.title')}
            </h4>
            <p>
              {t(
                'termsAndConditionsPage.content.section8.subsection3.description',
              )}
            </p>

            <h4>
              {t('termsAndConditionsPage.content.section8.subsection4.title')}
            </h4>
            <p>
              {t(
                'termsAndConditionsPage.content.section8.subsection4.description',
              )}
            </p>
            <ul>
              <li>
                <p>
                  {t(
                    'termsAndConditionsPage.content.section8.subsection4.list1',
                  )}
                </p>
              </li>
              <li>
                <p>
                  {t(
                    'termsAndConditionsPage.content.section8.subsection4.list2',
                  )}
                </p>
              </li>
              <li>
                <p>
                  {t(
                    'termsAndConditionsPage.content.section8.subsection4.list3',
                  )}
                </p>
              </li>
              <li>
                <p>
                  {t(
                    'termsAndConditionsPage.content.section8.subsection4.list4',
                  )}
                </p>
              </li>
            </ul>

            <h4>
              {t('termsAndConditionsPage.content.section8.subsection5.title')}
            </h4>
            <p>
              {t(
                'termsAndConditionsPage.content.section8.subsection5.description',
              )}
            </p>
            <ul>
              <li>
                <p>
                  {t(
                    'termsAndConditionsPage.content.section8.subsection5.list2',
                  )}
                </p>
              </li>
              <li>
                <p>
                  {t(
                    'termsAndConditionsPage.content.section8.subsection5.list3',
                  )}
                </p>
              </li>
            </ul>

            <h4>
              {t('termsAndConditionsPage.content.section8.subsection6.title')}
            </h4>
            <p>
              {t(
                'termsAndConditionsPage.content.section8.subsection6.description',
              )}
            </p>

            <h3>{t('termsAndConditionsPage.content.section9.title')}</h3>
            <p>{t('termsAndConditionsPage.content.section9.description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsContentSection;
