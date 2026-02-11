// components/PushNotificationButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { usePushNotification } from '../hook/use-push-notication';
import { MonitorSmartphone } from 'lucide-react';

export default function PushNotificationButton() {
  const pushNotification = usePushNotification();

  const handleSubscribe = async () => {
   await pushNotification.subscribe();
  };

  return (
    <section className="flex flex-col gap-4 pb-10">
      <h2 className="font-bold text-lg">
        Push Notifications
      </h2>
      <div className="flex items-center gap-3 text-xs">
        <MonitorSmartphone className='w-4 h-4'/>
        <span>Status:</span>
        <span className={`${
          pushNotification.permission === 'granted' 
            ? 'text-green-800' 
            : pushNotification.permission === 'denied'
            ? 'text-red-800'
            : 'text-gray-800'
        }`}>
          {pushNotification.permission === 'granted' ? 'Granted' : pushNotification.permission === 'denied' ? 'Denied' : 'Pending'}
        </span>
      </div>

      {pushNotification.error && (
        <div className="p-3 bg-red-900/10 border border-red-900/15 rounded text-xs font-semibold">
          <p>{pushNotification.error.message}</p>
          {pushNotification.error.suggestedAction && (
            <p className='mt-1'>Suggested action: {pushNotification.error.suggestedAction}</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          size={'xs'}
          onClick={handleSubscribe}
          disabled={pushNotification.permission === 'denied'}
        >
          Start to receive notifications
        </Button>
      </div>
    </section>
  );
}