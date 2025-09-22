import { fcmService } from '@/services/fcmService';

/**
 * Generates a fallback device token for web browsers
 * This creates a fingerprint based on browser characteristics
 * and converts it to a unique token (used when FCM is not available)
 */
export const generateFallbackDeviceToken = (): string => {
  try {
    // Create canvas fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillText('Device fingerprint', 2, 2);
    }
    const canvasFingerprint = canvas.toDataURL();
    
    // Collect browser characteristics
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvasFingerprint,
      navigator.hardwareConcurrency || 0,
      (navigator as any).deviceMemory || 0,
      navigator.platform,
      window.devicePixelRatio || 1,
    ].join('|');
    
    // Create a hash of the fingerprint
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  } catch (error) {
    // Fallback to a simple random token if fingerprinting fails
    console.warn('Failed to generate device fingerprint, using fallback:', error);
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
};

/**
 * Gets or creates a device token for push notifications
 * Prioritizes FCM token, falls back to browser fingerprint
 */
export const getOrCreateDeviceToken = async (): Promise<string> => {
  try {
    // Initialize FCM service if not already done
    if (!fcmService.isReady()) {
      await fcmService.initialize();
    }

    // Try to get FCM token first
    const fcmToken = await fcmService.getOrCreateToken();
    if (fcmToken) {
      console.log('Using FCM token for device identification');
      return fcmToken;
    }

    // Fallback to browser fingerprint if FCM is not available
    console.log('FCM not available, using browser fingerprint');
    return getOrCreateFallbackToken();
  } catch (error) {
    console.warn('Failed to get FCM token, using fallback:', error);
    return getOrCreateFallbackToken();
  }
};

/**
 * Gets or creates a fallback device token
 * Stores the token in localStorage for consistency across sessions
 */
const getOrCreateFallbackToken = (): string => {
  const STORAGE_KEY = 'debtbox_device_token_fallback';
  
  try {
    // Try to get existing token from localStorage
    const existingToken = localStorage.getItem(STORAGE_KEY);
    if (existingToken) {
      return existingToken;
    }
    
    // Generate new token
    const newToken = generateFallbackDeviceToken();
    localStorage.setItem(STORAGE_KEY, newToken);
    return newToken;
  } catch (error) {
    // Fallback if localStorage is not available
    console.warn('localStorage not available, generating temporary token:', error);
    return generateFallbackDeviceToken();
  }
};

/**
 * Synchronous version for backward compatibility
 * Returns FCM token if available, otherwise fallback token
 */
export const getOrCreateDeviceTokenSync = (): string => {
  try {
    // Try to get FCM token from service
    const fcmToken = fcmService.getToken();
    if (fcmToken) {
      return fcmToken;
    }

    // Fallback to stored fallback token
    return getOrCreateFallbackToken();
  } catch (error) {
    console.warn('Failed to get device token synchronously, using fallback:', error);
    return getOrCreateFallbackToken();
  }
};
