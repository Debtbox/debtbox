import { z } from 'zod';

// Enhanced password validation for financial applications
export const createSecurePasswordSchema = (t: (key: string) => string) =>
  z.object({
    password: z
      .string()
      .min(1, t('common.validation.passwordRequired'))
      .min(12, t('common.validation.passwordMinLength')) // Increased from 6 to 12
      .max(128, t('common.validation.passwordMaxLength'))
      .regex(/[A-Z]/, t('common.validation.passwordUppercase'))
      .regex(/[a-z]/, t('common.validation.passwordLowercase'))
      .regex(/[0-9]/, t('common.validation.passwordNumber'))
      .regex(/[^A-Za-z0-9]/, t('common.validation.passwordSpecial'))
      .refine(
        (password) => {
          // Check for common patterns
          const commonPatterns = [
            /(.)\1{2,}/, // Repeated characters
            /123|234|345|456|567|678|789|890/, // Sequential numbers
            /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // Sequential letters
            /qwerty|asdfgh|zxcvbn/i, // Keyboard patterns
          ];
          return !commonPatterns.some(pattern => pattern.test(password));
        },
        t('common.validation.passwordPattern')
      ),
  });

// Enhanced national ID validation
export const createSecureNationalIdSchema = (t: (key: string) => string) =>
  z.object({
    identificationNumber: z
      .string()
      .min(1, t('common.validation.identificationNumberRequired'))
      .min(10, t('common.validation.identificationNumberMinLength'))
      .max(20, t('common.validation.identificationNumberMaxLength'))
      .regex(/^[0-9]+$/, t('common.validation.identificationNumberNumeric'))
      .refine(
        (id) => {
          // Basic checksum validation for Saudi National ID
          if (id.length === 10) {
            return validateSaudiNationalId(id);
          }
          return true; // Allow other formats for now
        },
        t('common.validation.identificationNumberInvalid')
      ),
  });

// Saudi National ID checksum validation
const validateSaudiNationalId = (id: string): boolean => {
  if (id.length !== 10) return false;
  
  const digits = id.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    const digit = digits[i];
    if (i % 2 === 0) {
      const doubled = digit * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    } else {
      sum += digit;
    }
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[9];
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if max attempts reached
    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    // Increment attempt count
    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return this.maxAttempts;
    
    const now = Date.now();
    if (now - attempt.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }
    
    return Math.max(0, this.maxAttempts - attempt.count);
  }

  getTimeUntilReset(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return 0;
    
    const now = Date.now();
    const timeSinceLastAttempt = now - attempt.lastAttempt;
    
    if (timeSinceLastAttempt > this.windowMs) {
      return 0;
    }
    
    return this.windowMs - timeSinceLastAttempt;
  }
}

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// XSS protection
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
