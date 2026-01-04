import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/shared/Button';
import CheckBox from '@/components/shared/CheckBox';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';

const TermsAgreementForm = () => {
  const { t, i18n } = useTranslation();
  const { setActiveStep } = useAuthFlowStore();
  const [consentChecked, setConsentChecked] = useState(false);

  const handleAgree = () => {
    setActiveStep(5);
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-4">
        {t('auth.signUp.termsAndConditionsAgreement')}
      </h1>
      
      <div className="w-full mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="overflow-y-auto p-4 bg-white"
          style={{ 
            maxHeight: '400px',
            direction: i18n.language === 'en' ? 'ltr' : 'rtl'
          }}
        >
          <div className="space-y-4 text-sm text-gray-700">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('termsAndConditionsPage.content.title')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('termsAndConditionsPage.content.lastUpdated')}
            </p>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section1.title')}
              </h3>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section1.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section2.title')}
              </h3>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section2.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section3.title')}
              </h3>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section3.company')}
              </p>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section3.country')}
              </p>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section3.device')}
              </p>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section3.service')}
              </p>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section3.thirdPartyService')}
              </p>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section3.website')}
              </p>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section3.you')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section4.title')}
              </h3>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section4.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section5.title')}
              </h3>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section5.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section6.title')}
              </h3>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section6.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section7.title')}
              </h3>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section7.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section8.title')}
              </h3>
              <p className="text-gray-700 mb-2">
                {t('termsAndConditionsPage.content.section8.description')}
              </p>

              <div className="ml-4 space-y-2">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection1.title')}
                  </h4>
                  <p className="text-gray-700">
                    {t('termsAndConditionsPage.content.section8.subsection1.description')}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection2.title')}
                  </h4>
                  <p className="text-gray-700 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection2.description')}
                  </p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li className="text-gray-700">
                      {t('termsAndConditionsPage.content.section8.subsection2.list2')}
                    </li>
                    <li className="text-gray-700">
                      {t('termsAndConditionsPage.content.section8.subsection2.list3')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection3.title')}
                  </h4>
                  <p className="text-gray-700">
                    {t('termsAndConditionsPage.content.section8.subsection3.description')}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection4.title')}
                  </h4>
                  <p className="text-gray-700 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection4.description')}
                  </p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li className="text-gray-700">
                      {t('termsAndConditionsPage.content.section8.subsection4.list1')}
                    </li>
                    <li className="text-gray-700">
                      {t('termsAndConditionsPage.content.section8.subsection4.list2')}
                    </li>
                    <li className="text-gray-700">
                      {t('termsAndConditionsPage.content.section8.subsection4.list3')}
                    </li>
                    <li className="text-gray-700">
                      {t('termsAndConditionsPage.content.section8.subsection4.list4')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection5.title')}
                  </h4>
                  <p className="text-gray-700 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection5.description')}
                  </p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li className="text-gray-700">
                      {t('termsAndConditionsPage.content.section8.subsection5.list2')}
                    </li>
                    <li className="text-gray-700">
                      {t('termsAndConditionsPage.content.section8.subsection5.list3')}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t('termsAndConditionsPage.content.section8.subsection6.title')}
                  </h4>
                  <p className="text-gray-700">
                    {t('termsAndConditionsPage.content.section8.subsection6.description')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('termsAndConditionsPage.content.section9.title')}
              </h3>
              <p className="text-gray-700">
                {t('termsAndConditionsPage.content.section9.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 mb-6">
        <CheckBox
          checked={consentChecked}
          onChange={() => setConsentChecked(!consentChecked)}
        />
        <label 
          className="text-sm text-gray-700 cursor-pointer flex-1"
          onClick={() => setConsentChecked(!consentChecked)}
        >
          {t('auth.signUp.dataConsent')}
        </label>
      </div>

      <Button
        onClick={handleAgree}
        disabled={!consentChecked}
        className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        text={t('auth.signUp.iAgree')}
      />
    </div>
  );
};

export default TermsAgreementForm;

