import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SITE_URL = 'https://debtbox.sa';

type RouteMeta = {
  titleKey: string;
  descriptionKey: string;
  noindex?: boolean;
};

const ROUTE_META: Record<string, RouteMeta> = {
  '/': { titleKey: 'seo.home.title', descriptionKey: 'seo.home.description' },
  '/about': {
    titleKey: 'seo.about.title',
    descriptionKey: 'seo.about.description',
  },
  '/contact-us': {
    titleKey: 'seo.contact.title',
    descriptionKey: 'seo.contact.description',
  },
  '/privacy-policy': {
    titleKey: 'seo.privacy.title',
    descriptionKey: 'seo.privacy.description',
  },
  '/terms-conditions': {
    titleKey: 'seo.terms.title',
    descriptionKey: 'seo.terms.description',
  },
  '/auth/login': {
    titleKey: 'seo.login.title',
    descriptionKey: 'seo.login.description',
    noindex: true,
  },
  '/auth/sign-up': {
    titleKey: 'seo.signup.title',
    descriptionKey: 'seo.signup.description',
    noindex: true,
  },
  '/auth/forgot-password': {
    titleKey: 'seo.forgotPassword.title',
    descriptionKey: 'seo.forgotPassword.description',
    noindex: true,
  },
  '/dashboard': {
    titleKey: 'seo.dashboard.title',
    descriptionKey: 'seo.dashboard.description',
    noindex: true,
  },
  '/businesses': {
    titleKey: 'seo.businesses.title',
    descriptionKey: 'seo.businesses.description',
    noindex: true,
  },
  '/transactions': {
    titleKey: 'seo.transactions.title',
    descriptionKey: 'seo.transactions.description',
    noindex: true,
  },
};

function getMetaForPath(pathname: string): RouteMeta {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];
  if (pathname.startsWith('/dashboard')) return ROUTE_META['/dashboard'];
  if (pathname.startsWith('/businesses')) return ROUTE_META['/businesses'];
  if (pathname.startsWith('/transactions')) return ROUTE_META['/transactions'];
  return ROUTE_META['/'];
}

function setMetaTag(
  selector: 'name' | 'property',
  key: string,
  value: string,
) {
  let el = document.querySelector(`meta[${selector}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(selector, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

/**
 * Updates document title and meta tags for SEO based on current route.
 * Handles both public and protected routes.
 */
export function DocumentMeta() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const meta = getMetaForPath(pathname);
    const title = t(meta.titleKey, 'Debt Box | Smart Debt Management');
    const description = t(meta.descriptionKey, '');

    document.title = title;

    setMetaTag('name', 'description', description || 'Debt Box - Smart platform for managing deferred debts.');
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description || '');
    setMetaTag('property', 'og:url', `${SITE_URL}${pathname}`);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description || '');
    setMetaTag('name', 'robots', meta.noindex ? 'noindex, nofollow' : 'index, follow');

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${SITE_URL}${pathname}`);
    }

    // Update hreflang links for current path
    const currentUrl = `${SITE_URL}${pathname}`;
    ['en', 'ar', 'bn', 'ur', 'x-default'].forEach((lang) => {
      const el = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
      if (el) {
        el.setAttribute('href', currentUrl);
      }
    });

    const ogLocale = i18n.language === 'ar' ? 'ar_SA' : 'en_SA';
    setMetaTag('property', 'og:locale', ogLocale);
  }, [pathname, t, i18n.language]);

  return null;
}
