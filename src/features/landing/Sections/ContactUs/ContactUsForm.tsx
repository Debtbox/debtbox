import {
  contactSmallEmail,
  contactSmallLocation,
  contactSmallPhone,
} from '@/assets/images';
import { useTranslation } from 'react-i18next';

const ContactUsForm = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="contact-section">
        <div className="contact-container">
          <form
            className="contact-form"
            id="contactForm"
            data-directional
            dir="rtl"
          >
            <div className="form-row">
              <div className="form-group">
                <label>{t('contactUsPage.form.firstName')}</label>
                <input
                  type="text"
                  placeholder={t('contactUsPage.form.firstNamePlaceholder')}
                  name="first_name"
                />
              </div>
              <div className="form-group">
                <label>{t('contactUsPage.form.lastName')}</label>
                <input
                  type="text"
                  placeholder={t('contactUsPage.form.lastNamePlaceholder')}
                  name="last_name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('contactUsPage.form.email')}</label>
                <input
                  type="email"
                  placeholder={t('contactUsPage.form.emailPlaceholder')}
                  name="email"
                />
              </div>
              <div className="form-group">
                <label>{t('contactUsPage.form.phone')}</label>
                <input
                  type="text"
                  placeholder={t('contactUsPage.form.phonePlaceholder')}
                  name="phone"
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('contactUsPage.form.message')}</label>
              <textarea
                placeholder={t('contactUsPage.form.messagePlaceholder')}
                name="message"
              ></textarea>
            </div>

            <button type="submit">
              {t('contactUsPage.form.submitButton')}
            </button>
          </form>
          <div className="frame contact-info">
            <div className="overlap-group">
              <div className="ellipse"></div>
              <div className="div"></div>
              <div className="div-2" data-directional dir="rtl">
                <div className="div-3">
                  <img className="img" src={contactSmallPhone} />
                  <div className="text-wrapper">0555580220</div>
                </div>
                <div className="div-4">
                  <div className="img">
                    <img className="group" src={contactSmallEmail} />
                  </div>
                  <div className="text-wrapper">demo@gmail.com</div>
                </div>
                <div className="div-5">
                  <img className="img" src={contactSmallLocation} />
                  <p className="p">{t('contactUsPage.contactInfo.location')}</p>
                </div>
              </div>
              <div className="div-6" data-directional dir="rtl">
                <div className="text-wrapper-2">
                  {t('contactUsPage.contactInfo.title')}
                </div>
                <div className="text-wrapper-3">
                  {t('contactUsPage.contactInfo.subtitle')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        id="form-message"
        style={{ margin: '24px auto', color: 'green', textAlign: 'center' }}
      ></div>
    </>
  );
};

export default ContactUsForm;
