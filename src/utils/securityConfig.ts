// Security configuration constants
export const SECURITY_CONFIG = {
  // Session management
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  
  // Rate limiting
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
  API_RATE_LIMIT: 100, // requests per minute
  
  // Password requirements
  MIN_PASSWORD_LENGTH: 12,
  MAX_PASSWORD_LENGTH: 128,
  
  // Input validation
  MAX_INPUT_LENGTH: 1000,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Security headers
  CSP_POLICY: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://8.213.80.85; frame-ancestors 'none';",
  
  // Cookie settings
  COOKIE_SECURE: true,
  COOKIE_SAME_SITE: 'strict' as const,
  COOKIE_HTTP_ONLY: false, // Needed for SPA
};

// Environment-based configuration
export const getSecurityConfig = () => {
  const isProduction = import.meta.env?.PROD;
  const isDevelopment = import.meta.env?.DEV;
  
  return {
    ...SECURITY_CONFIG,
    // Override for development
    COOKIE_SECURE: isProduction,
    ENABLE_DEVTOOLS: isDevelopment,
    LOG_LEVEL: isProduction ? 'error' : 'debug',
  };
};
