import React from 'react';
import { useTranslation } from 'react-i18next';
import { headerLogo } from '@/assets/images';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  showLogo?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  showLogo = true,
}) => {
  const { t, i18n } = useTranslation();

  const logoSizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const displayText = text || t('common.loading.text', 'Loading...');

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#f0f0f0] ${className}`}
    >
      <div className="flex flex-col items-center space-y-8">
        {showLogo && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#06101c] to-[#003153] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative bg-white p-4 rounded-2xl shadow-xl">
              <img
                src={headerLogo}
                alt="Debtbox Logo"
                className={`${logoSizeClasses[size]} object-contain transition-transform duration-300 group-hover:scale-105`}
              />
            </div>
          </div>
        )}

        <div className="text-center space-y-3">
          <div
            className="bg-gradient-to-r from-[#06101c] to-[#003153] bg-clip-text text-transparent font-cairo font-bold text-xl"
            style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
          >
            {displayText}
          </div>

          <div className="flex justify-center space-x-2">
            <div
              className="w-2 h-2 bg-[#06101c] rounded-full animate-bounce"
              style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
            />
            <div
              className="w-2 h-2 bg-[#003153] rounded-full animate-bounce"
              style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
            />
            <div
              className="w-2 h-2 bg-[#06101c] rounded-full animate-bounce"
              style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonLoader: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export const ProgressiveLoader: React.FC<{
  stage: 'initial' | 'loading' | 'almost-ready' | 'ready';
  children: React.ReactNode;
}> = ({ stage, children }) => {
  if (stage === 'ready') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {stage === 'initial' && (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your experience...</p>
        </div>
      )}

      {stage === 'loading' && (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      )}

      {stage === 'almost-ready' && (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Almost ready...</p>
        </div>
      )}
    </div>
  );
};
