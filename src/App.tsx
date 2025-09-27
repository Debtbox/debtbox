import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { setDocDirection } from './utils/setDocDirection';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SessionExpiredModal from './components/shared/SessionExpiredModal';
import { useSessionStore } from './stores/SessionStore';

function App() {
  const { i18n } = useTranslation();
  const { isSessionExpiredModalOpen, hideSessionExpiredModal } = useSessionStore();

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setDocDirection(lng);
    };
    setDocDirection(i18n.language);
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleLogin = () => {
    window.location.replace('/auth/login');
  };

  return (
    <BrowserRouter basename="/">
      <AppRoutes />
      <SessionExpiredModal
        isOpen={isSessionExpiredModalOpen}
        onClose={hideSessionExpiredModal}
        onLogin={handleLogin}
      />
    </BrowserRouter>
  );
}

export default App;
