import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
// You'll need to replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

// VAPID key for web push notifications
// You'll need to generate this in your Firebase Console > Project Settings > Cloud Messaging
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "your-vapid-key";

/**
 * Get FCM registration token for the current device
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn('This browser does not support service workers');
      return null;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    // Get the registration token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log('FCM registration token:', token);
      return token;
    } else {
      console.warn('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

/**
 * Listen for foreground messages
 */
export const onForegroundMessage = () => {
  return onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // You can customize the notification here
    const notificationTitle = payload.notification?.title || 'New Message';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new message',
      icon: '/favicon.ico', // You can customize this
      badge: '/favicon.ico',
      tag: 'debtbox-notification',
      requireInteraction: true,
    };

    // Show notification
    if (Notification.permission === 'granted') {
      new Notification(notificationTitle, notificationOptions);
    }
  });
};

export default app;
