import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../styles/styles.css';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="mb-2 text-8xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            {t('notFound.title', 'Page Not Found')}
          </h2>
          <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
            {t(
              'notFound.description',
              'The page you are looking for does not exist or has been moved.'
            )}
          </p>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {t('notFound.goHome', 'Go to Home')}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};
