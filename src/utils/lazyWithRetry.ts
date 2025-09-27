import { lazy } from 'react';
import type { ComponentType } from 'react';

/**
 * Enhanced lazy loading with retry mechanism for React 19
 * Provides better error handling and retry logic for failed chunk loads
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
) {
  return lazy(() =>
    importFn().catch((error) => {
      if (retries > 0) {
        console.warn(
          `Chunk load failed, retrying... (${retries} attempts left)`,
        );
        return new Promise<{ default: T }>((resolve) => {
          setTimeout(
            () => {
              resolve(importFn());
            },
            1000 * (4 - retries),
          ); // Exponential backoff
        });
      }
      throw error;
    }),
  );
}

/**
 * Lazy load with preloading for better performance
 * Preloads the component when user hovers over navigation links
 */
export function lazyWithPreload<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
) {
  const LazyComponent = lazy(importFn);

  // Add preload method to the component
  (LazyComponent as { preload?: () => Promise<{ default: T }> }).preload =
    importFn;

  return LazyComponent;
}
