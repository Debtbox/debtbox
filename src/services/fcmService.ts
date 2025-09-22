import { getFCMToken, onForegroundMessage } from '@/lib/firebase';

/**
 * FCM Service for managing Firebase Cloud Messaging
 */
export class FCMService {
  private static instance: FCMService;
  private token: string | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService();
    }
    return FCMService.instance;
  }

  /**
   * Initialize FCM service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Get or create FCM token
      this.token = await this.getOrCreateToken();
      
      // Set up foreground message listener
      onForegroundMessage();
      
      this.isInitialized = true;
      console.log('FCM Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize FCM service:', error);
      throw error;
    }
  }

  /**
   * Get FCM token (cached or generate new one)
   */
  public async getOrCreateToken(): Promise<string | null> {
    try {
      // Check if we already have a token
      if (this.token) {
        return this.token;
      }

      // Try to get token from localStorage first
      const storedToken = localStorage.getItem('fcm_token');
      if (storedToken) {
        this.token = storedToken;
        return storedToken;
      }

      // Generate new token
      const newToken = await getFCMToken();
      if (newToken) {
        this.token = newToken;
        localStorage.setItem('fcm_token', newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Get current FCM token
   */
  public getToken(): string | null {
    return this.token;
  }

  /**
   * Refresh FCM token
   */
  public async refreshToken(): Promise<string | null> {
    try {
      // Clear cached token
      this.token = null;
      localStorage.removeItem('fcm_token');
      
      // Get new token
      const newToken = await getFCMToken();
      if (newToken) {
        this.token = newToken;
        localStorage.setItem('fcm_token', newToken);
      }
      
      return newToken;
    } catch (error) {
      console.error('Error refreshing FCM token:', error);
      return null;
    }
  }

  /**
   * Check if notifications are supported
   */
  public isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Check notification permission status
   */
  public getNotificationPermission(): NotificationPermission {
    return Notification.permission;
  }

  /**
   * Request notification permission
   */
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!this.isNotificationSupported()) {
      throw new Error('Notifications are not supported in this browser');
    }

    return await Notification.requestPermission();
  }

  /**
   * Check if FCM is ready to use
   */
  public isReady(): boolean {
    return this.isInitialized && this.token !== null;
  }
}

// Export singleton instance
export const fcmService = FCMService.getInstance();
