import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.VITE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error?: Error }) {
  const { t } = useTranslation();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div
      className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8 text-center"
      role="alert"
    >
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-950/30">
        <h2 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-200">
          {t('error.something_went_wrong', 'Something went wrong')}
        </h2>
        <p className="mb-6 text-sm text-red-700 dark:text-red-300">
          {t(
            'error.try_refreshing',
            'An unexpected error occurred. Please try refreshing the page.'
          )}
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {t('error.refresh_page', 'Refresh Page')}
        </button>
      </div>
      {import.meta.env.VITE_ENV === 'development' && error && (
        <pre className="max-w-full overflow-auto rounded border border-gray-200 bg-gray-100 p-4 text-left text-xs text-gray-800">
          {error.message}
        </pre>
      )}
    </div>
  );
}

export function ErrorBoundary({ children, fallback }: Props) {
  return (
    <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>
  );
}
