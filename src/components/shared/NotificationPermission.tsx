import { useFCM } from '@/hooks/useFCM';
import { toast } from 'sonner';

interface NotificationPermissionProps {
  onPermissionGranted?: (token: string) => void;
  className?: string;
}

export const NotificationPermission = ({ 
  onPermissionGranted, 
  className = '' 
}: NotificationPermissionProps) => {
  const { 
    isSupported, 
    permission, 
    token, 
    isInitialized, 
    requestPermission,
    error 
  } = useFCM();

  const handleRequestPermission = async () => {
    try {
      const granted = await requestPermission();
      if (granted && token) {
        toast.success('Notifications enabled successfully!');
        onPermissionGranted?.(token);
      } else {
        toast.error('Notification permission was denied');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      toast.error('Failed to enable notifications');
    }
  };

  // Don't render if notifications are not supported
  if (!isSupported) {
    return null;
  }

  // Don't render if already granted
  if (permission === 'granted') {
    return null;
  }

  // Don't render if there's an error
  if (error) {
    return null;
  }

  return (
    <div className={`notification-permission ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg 
              className="h-5 w-5 text-blue-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Enable Notifications
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Get notified about important updates, new messages, and account activities.
              </p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  onClick={handleRequestPermission}
                  disabled={!isInitialized}
                  className="bg-blue-50 px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isInitialized ? 'Initializing...' : 'Enable Notifications'}
                </button>
                <button
                  onClick={() => {/* Handle dismiss */}}
                  className="ml-3 bg-blue-50 px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 focus:ring-blue-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
