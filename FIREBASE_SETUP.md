# Firebase Push Notifications Setup

This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications in your Debtbox application.

## Prerequisites

1. A Firebase project
2. Firebase project configured for web applications

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### 2. Add Web App to Firebase Project

1. In your Firebase project, click the web icon (`</>`)
2. Register your app with a nickname (e.g., "Debtbox Web")
3. Copy the Firebase configuration object

### 3. Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase VAPID Key for Web Push Notifications
VITE_FIREBASE_VAPID_KEY=your-vapid-key-here
```

### 4. Generate VAPID Key

1. In Firebase Console, go to **Project Settings** > **Cloud Messaging**
2. Scroll down to **Web Push certificates**
3. Click **Generate key pair** if you don't have one
4. Copy the key and add it to your `.env` file as `VITE_FIREBASE_VAPID_KEY`

### 5. Update Firebase Configuration

Update the Firebase configuration in the following files:

#### `/src/lib/firebase.ts`
Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

#### `/public/firebase-messaging-sw.js`
Replace the placeholder values in the service worker:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### 6. Test the Implementation

1. Start your development server: `pnpm dev`
2. Open your application in a browser
3. Check the browser console for FCM initialization messages
4. The device token should now be an FCM token instead of a browser fingerprint

## How It Works

### Device Token Generation

The application now uses a two-tier approach for device tokens:

1. **Primary**: Firebase Cloud Messaging (FCM) token
   - Generated when user grants notification permission
   - Enables push notifications
   - Unique per browser/device combination

2. **Fallback**: Browser fingerprint
   - Used when FCM is not available or permission is denied
   - Based on browser characteristics
   - Still provides device identification

### Permission Handling

The application will:
1. Check if notifications are supported
2. Request notification permission when needed
3. Generate FCM token upon permission grant
4. Fall back to browser fingerprint if permission is denied

### Service Worker

The service worker (`/public/firebase-messaging-sw.js`) handles:
- Background push notifications
- Notification click events
- App focus/opening when notifications are clicked

## Usage in Components

### Using the FCM Hook

```typescript
import { useFCM } from '@/hooks/useFCM';

const MyComponent = () => {
  const { 
    isSupported, 
    permission, 
    token, 
    isInitialized, 
    requestPermission 
  } = useFCM();

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      console.log('Notification permission granted!');
    }
  };

  return (
    <div>
      {isSupported && permission !== 'granted' && (
        <button onClick={handleRequestPermission}>
          Enable Notifications
        </button>
      )}
    </div>
  );
};
```

### Getting Device Token

```typescript
import { getOrCreateDeviceToken } from '@/utils/deviceToken';

const deviceToken = await getOrCreateDeviceToken();
// This will be an FCM token if available, otherwise a fallback token
```

## Troubleshooting

### Common Issues

1. **"Firebase not initialized"**
   - Check your environment variables
   - Ensure Firebase config is correct

2. **"No registration token available"**
   - Check if notification permission is granted
   - Verify VAPID key is correct

3. **Service worker not registering**
   - Ensure `firebase-messaging-sw.js` is in the `public` folder
   - Check browser console for service worker errors

### Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Limited support (iOS Safari has restrictions)
- **Edge**: Full support

## Security Notes

- Never commit your `.env` file to version control
- Keep your Firebase API keys secure
- Use environment variables for all sensitive configuration
- Consider implementing token refresh logic for production use
