import { useTranslation } from 'react-i18next';
import { headerLogo } from '@/assets/images';

export const ErrorFallback = () => {
  const { t, i18n } = useTranslation();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f8f8] p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <img
            src={headerLogo}
            alt="Debtbox Logo"
            className="w-16 h-16 mx-auto mb-4"
          />
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#06101c] to-[#003153] rounded-full opacity-10 blur-sm" />
        </div>

        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h2
            className="text-2xl font-bold text-[#06101c] font-cairo"
            style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
          >
            {t('common.error.title', 'Something went wrong')}
          </h2>

          <p
            className="text-[#383838] font-cairo leading-relaxed"
            style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
          >
            {t(
              'common.error.description',
              "We're sorry, but something unexpected happened while loading this page.",
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={handleRetry}
              className="px-8 py-3 bg-[#06101c] text-white rounded-lg hover:bg-[#003153] transition-all duration-200 font-cairo font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('common.error.tryAgain', 'Try Again')}
            </button>

            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-white text-[#06101c] border-2 border-[#06101c] rounded-lg hover:bg-[#f8f8f8] transition-all duration-200 font-cairo font-semibold"
            >
              {t('common.error.goBack', 'Go Back')}
            </button>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <p
              className="text-sm text-[#383838] font-cairo"
              style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
            >
              {t(
                'common.error.help',
                'If this problem persists, please contact our support team.',
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
