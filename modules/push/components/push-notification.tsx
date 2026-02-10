// components/PushNotificationButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { usePushNotification } from '../hook/use-push-notication';

export default function PushNotificationButton() {
  const pushNotification = usePushNotification();

  const handleSubscribe = async () => {
   await pushNotification.subscribe();
  };

  return (
    <div className="space-y-4 py-10">
      <div className="flex items-center gap-3">
        <span className="font-medium">
          Push Notification Permission:
        </span>
        <span className={`px-3 py-1 rounded-full text-sm ${
          pushNotification.permission === 'granted' 
            ? 'bg-green-900/10 text-green-800' 
            : pushNotification.permission === 'denied'
            ? 'bg-red-900/10 text-red-800'
            : 'bg-zinc-900/10 text-gray-800'
        }`}>
          {pushNotification.permission === 'granted' ? 'Granted' : pushNotification.permission === 'denied' ? 'Denied' : 'Pending'}
        </span>
      </div>

      {pushNotification.error && (
        <div className="p-3 bg-red-900/10 border border-red-900/15 rounded text-sm font-semibold">
          <p>{pushNotification.error.message}</p>
          {pushNotification.error.suggestedAction && (
            <p className='mt-1 text-xs'>Suggested action: {pushNotification.error.suggestedAction}</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleSubscribe}
          disabled={pushNotification.permission === 'denied'}
        >
          Activate Notifications
        </Button>
      </div>
    </div>
  );
}