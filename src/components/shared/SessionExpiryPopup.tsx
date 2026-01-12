import { AlertTriangle, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SessionExpiryPopupProps {
  isOpen: boolean;
  onRedirect: () => void;
}

const SessionExpiryPopup = ({ isOpen, onRedirect }: SessionExpiryPopupProps) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen) {
      // Reset countdown when popup opens
      setCountdown(5);
      
      // Auto-redirect after 5 seconds (more user-friendly)
      const timer = setTimeout(() => {
        onRedirect();
      }, 5000);

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [isOpen, onRedirect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-[61]">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('sessionExpiry.title')}
            </h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {t('sessionExpiry.description')}
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6">
            <p className="text-xs text-amber-800">
              {t('sessionExpiry.securityNotice')}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span>{t('sessionExpiry.redirectingIn', { count: countdown })}</span>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onRedirect}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <LogIn className="w-4 h-4" />
              {t('sessionExpiry.goToLoginNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiryPopup;
