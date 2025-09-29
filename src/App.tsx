import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { setDocDirection } from './utils/setDocDirection';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SessionExpiryPopup from './components/shared/SessionExpiryPopup';
import { useSessionStore } from './stores/SessionStore';

function App() {
  const { i18n } = useTranslation();
  const { showSessionExpiryPopup, setShowSessionExpiryPopup } = useSessionStore();

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

  const handleSessionRedirect = () => {
    setShowSessionExpiryPopup(false);
    window.location.replace('/auth/login');
  };

  return (
    <BrowserRouter basename="/">
      <AppRoutes />
      <SessionExpiryPopup 
        isOpen={showSessionExpiryPopup} 
        onRedirect={handleSessionRedirect} 
      />
    </BrowserRouter>
  );
}

export default App;
