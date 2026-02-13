import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
      dir: (lng?: string) => (lng === 'ar' ? 'rtl' : 'ltr'),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));
