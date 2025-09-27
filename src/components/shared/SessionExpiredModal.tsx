import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from './Button';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const SessionExpiredModal = ({
  isOpen,
  onClose,
  onLogin,
}: SessionExpiredModalProps) => {
  const { t } = useTranslation();

  const handleLogin = () => {
    onClose();
    onLogin();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false} // Prevent closing with X button
      className="z-[9999]" // Higher z-index to ensure it's on top
    >
      <div className="text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
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

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t('auth.sessionExpired', 'Session Expired')}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {t(
            'auth.sessionExpiredMessage',
            'Your session has expired. Please log in again to continue.',
          )}
        </p>

        {/* Action Button */}
        <Button
          onClick={handleLogin}
          variant="primary"
          className="w-full"
          text={t('auth.loginAgain', 'Log In Again')}
        />
      </div>
    </Modal>
  );
};

export default SessionExpiredModal;
