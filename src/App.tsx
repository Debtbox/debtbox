import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { setDocDirection } from './utils/setDocDirection';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SecurityErrorBoundary from './components/security/SecurityErrorBoundary';
import { useSecurityMonitoring } from './hooks/useSecurityMonitoring';

function App() {
  const { i18n } = useTranslation();
  
  // Initialize security monitoring
  useSecurityMonitoring({
    enableConsoleLogging: true,
    enableNetworkMonitoring: true,
    enableDOMMonitoring: true,
    enableErrorMonitoring: true,
    sessionCheckInterval: 30000,
  });

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

  return (
    <SecurityErrorBoundary>
      <BrowserRouter basename="/">
        <AppRoutes />
      </BrowserRouter>
    </SecurityErrorBoundary>
  );
}

export default App;
