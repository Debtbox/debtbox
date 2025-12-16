/**
 * Gets the device push notification token for web platform
 * Uses Web Push API to get subscription endpoint and keys
 */
export interface DeviceTokenData {
  token: string;
  p256dh?: string;
  auth?: string;
}

const DEVICE_TOKEN_DATA_STORAGE_KEY = 'debtbox_device_token_data';

/**
 * Gets the device token from Web Push API
 * Returns cached token if available, otherwise requests permission and creates subscription
 */
export async function getDeviceToken(): Promise<DeviceTokenData> {
  // Check if we have a cached token
  const cachedTokenData = localStorage.getItem(DEVICE_TOKEN_DATA_STORAGE_KEY);
  if (cachedTokenData) {
    try {
      const parsed = JSON.parse(cachedTokenData) as DeviceTokenData;
      if (parsed.token) {
        return parsed;
      }
    } catch {
      // Invalid cache, continue to get new token
    }
  }

  // Check if browser supports push notifications
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported in this browser');
    return { token: '' };
  }

  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return { token: '' };
    }

    // Get or wait for service worker registration
    let registration: ServiceWorkerRegistration;
    
    // Check if service worker is already registered
    if (navigator.serviceWorker.controller) {
      registration = await navigator.serviceWorker.ready;
    } else {
      // Try to get existing registration first
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();
      if (existingRegistrations.length > 0) {
        registration = existingRegistrations[0];
        await registration.update();
      } else {
        // If no service worker exists, we can't create a push subscription
        // Return empty token - service worker needs to be set up separately
        console.warn('Service worker not registered. Push subscription requires a service worker.');
        return { token: '' };
      }
    }

    // Get existing subscription or create new one
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Note: To create a subscription, you need a VAPID public key
      // You can get this from your backend or environment variables
      // For now, we'll return empty if no subscription exists
      console.warn('No existing push subscription found. VAPID key may be required to create one.');
      return { token: '' };
    }

    // Extract token data from subscription
    const endpoint = subscription.endpoint;
    const key = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');

    const tokenData: DeviceTokenData = {
      token: endpoint,
      p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : undefined,
      auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : undefined,
    };

    // Cache the token data
    localStorage.setItem(DEVICE_TOKEN_DATA_STORAGE_KEY, JSON.stringify(tokenData));

    return tokenData;
  } catch (error) {
    console.error('Error getting device token:', error);
    return { token: '' };
  }
}

/**
 * Clears the cached device token
 */
export function clearDeviceToken(): void {
  localStorage.removeItem(DEVICE_TOKEN_DATA_STORAGE_KEY);
}

