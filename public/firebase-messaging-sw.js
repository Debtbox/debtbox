// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// You'll need to replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Debtbox Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'debtbox-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app when notification is clicked
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // If the app is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If the app is not open, open it
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
