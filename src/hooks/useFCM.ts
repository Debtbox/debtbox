import { useEffect, useState } from 'react';
import { fcmService } from '@/services/fcmService';

export interface FCMState {
  isSupported: boolean;
  permission: NotificationPermission;
  token: string | null;
  isInitialized: boolean;
  error: string | null;
}

export const useFCM = () => {
  const [state, setState] = useState<FCMState>({
    isSupported: false,
    permission: 'default',
    token: null,
    isInitialized: false,
    error: null,
  });

  useEffect(() => {
    const initializeFCM = async () => {
      try {
        // Check if notifications are supported
        const isSupported = fcmService.isNotificationSupported();
        if (!isSupported) {
          setState(prev => ({
            ...prev,
            isSupported: false,
            error: 'Notifications are not supported in this browser',
          }));
          return;
        }

        // Get current permission status
        const permission = fcmService.getNotificationPermission();
        
        setState(prev => ({
          ...prev,
          isSupported: true,
          permission,
        }));

        // Initialize FCM service
        await fcmService.initialize();
        
        // Get token
        const token = await fcmService.getOrCreateToken();
        
        setState(prev => ({
          ...prev,
          token,
          isInitialized: true,
          error: null,
        }));
      } catch (error) {
        console.error('FCM initialization error:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize FCM',
        }));
      }
    };

    initializeFCM();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const permission = await fcmService.requestNotificationPermission();
      
      setState(prev => ({
        ...prev,
        permission,
      }));

      if (permission === 'granted') {
        // Get token after permission is granted
        const token = await fcmService.getOrCreateToken();
        setState(prev => ({
          ...prev,
          token,
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Permission request error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to request permission',
      }));
      return false;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const newToken = await fcmService.refreshToken();
      setState(prev => ({
        ...prev,
        token: newToken,
        error: null,
      }));
      return newToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh token',
      }));
      return null;
    }
  };

  return {
    ...state,
    requestPermission,
    refreshToken,
  };
};
