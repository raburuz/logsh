// components/PushNotificationButton.tsx
'use client';

import { useEffect } from 'react';
import { CircleAlert, Info, Monitor, MonitorSmartphone, Smartphone, Tablet, Trash2, UserKey } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePushNotification } from '../hook/use-push-notification';

export default function PushNotificationButton() {
  const pushNotification = usePushNotification();

  useEffect(() => {
    pushNotification.checkBrowserPermission();
    pushNotification.fetchSubscribedDevices();
  }, [])
  

  const handleSubscribe = async () => {
   await pushNotification.subscribe({ shadowEffect: 'get_device_list' });
   pushNotification.checkBrowserPermission();
  };

  return (
    <Card className="flex flex-col gap-4 pb-10">
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>Manage your push notification settings and connected devices.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='w-full flex flex-row items-center justify-between gap-2'>
            <div className="h-px w-full bg-zinc-900/30"></div>
            <Button
              size={'xs'}
              onClick={handleSubscribe}
              disabled={
                pushNotification.isCreatingSubscription || pushNotification.browserPermission === 'denied'
              }
            >
              {
                pushNotification.devices?.some( device => device.deviceId === pushNotification.deviceId ) ? 'Update push notification' : 'Enable push notification' 
              }
            </Button>
          </div>
          {/* List */}
          <div className="text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 pb-2">
              <UserKey className='w-4 h-4'/>
              <span>Device permissions:</span>
              <span className={cn(
                "font-bold text-gray-800",
                pushNotification.browserPermission === 'granted' ? 'text-green-800' : "",
                pushNotification.browserPermission === 'denied' ? 'text-red-800' : "",
              )}>
                {pushNotification.browserPermission === 'granted' ? 'Granted' : pushNotification.browserPermission === 'denied' ? 'Denied' : 'Pending'}
              </span>
            </div>

            <div className='flex items-center gap-2 text-xs'>
              <MonitorSmartphone className='w-4 h-4'/>
              <span>Devices:</span>
              <span className='font-bold text-zinc-500'>
                {pushNotification.devices?.length || 0} devices connected
              </span>
            </div>

          </div>
          {/* devices */}
          <div className='flex flex-col gap-2 mt-8'>
            {
              pushNotification.devices.map( device => (
                <div 
                  key={device.id}
                  className={cn(
                    "relative w- text-xs text-zinc-500 flex flex-row items-center gap-4 py-4 px-6 border rounded-md border-zinc-900/20",
                    device.deviceId === pushNotification.deviceId && pushNotification.browserPermission === 'granted' ? "bg-blue-800/5 border-blue-800/40" : "",
                    device.deviceId === pushNotification.deviceId && pushNotification.browserPermission === 'denied' ? "bg-red-800/5 border-red-800/40" : "",
                  )}
                >
                  <div className='absolute top-2 right-2'>
                    <button 
                      onClick={() => pushNotification.unsubscribe(device.deviceId)}
                      className='p-2 rounded-full cursor-pointer text-zinc-500 hover:text-red-800 hover:bg-red-500/10'
                      >
                      <Trash2 className='w-4 h-4'/>
                    </button>
                  </div>
                  <div className='border border-zinc-900/20 rounded-md p-3'>
                      { device.deviceInfo.device === 'mobile' && (<Smartphone className='w-6 h-6'/> ) }
                      { device.deviceInfo.device === 'tablet' && ( <Tablet className='w-6 h-6'/> ) }
                      { device.deviceInfo.device === 'desktop' && ( <Monitor className='w-6 h-6'/> ) }
                  </div>
                  <div className='flex flex-col gap-1'>
                    <div className='space-x-2 text-zinc-100'>
                      <span>{device.deviceInfo.platform}</span>
                      <span>·</span>
                      <span>{device.deviceInfo.browser}</span>
                    </div>
                    <span className='mt-1 mb-2 text-[10px] font-medium text-zinc-500'>{device.deviceInfo.userAgent.slice(0,40)}...</span>
                  </div>
                </div>
              ))
            } 
          </div>

          {/* Footer (alerts) */}
          <div className="h-px w-full bg-zinc-900/30"></div>
          {
            pushNotification.browserPermission === 'denied' && (
              <Alert variant={"destructive"}>
                <CircleAlert />
                <AlertTitle>Action required</AlertTitle>
                <AlertDescription>
                  <p>You have <span className='font-bold underline'>denied permission for push notifications on this device</span>. Please enable notifications in your <span className='font-bold underline'>browser settings</span> to receive updates.</p>
                </AlertDescription>
              </Alert>
            )
          }
          {
            (pushNotification.browserPermission === 'granted' && !pushNotification.devices.some(device => device.deviceId === pushNotification.deviceId)) && (
              <Alert>
                <Info />
                <AlertTitle>Required Action</AlertTitle>
                <AlertDescription>
                  <p>You have granted permission for push notifications, but this device is not yet registered. Please ensure your device is properly set up to receive updates.</p>
                  <div className="mt-2 mb-1">
                    <Button
                      size={'xs'}
                      onClick={handleSubscribe}
                      className='bg-white text-black hover:bg-white/95'
                    >
                      👉 Enable notifications
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )
          }
          {
            !['granted', 'denied'].includes(pushNotification.browserPermission) && (
              <Alert>
                <Info/>
                <AlertTitle>Action required</AlertTitle>
                <AlertDescription>
                  <p> You have not yet granted permission for push notifications on this device. Please allow notifications in your <span className='font-bold underline'>browser settings</span> to receive updates.</p>
                  <div className="mt-2 mb-1">
                    <Button
                      size={'xs'}
                      onClick={handleSubscribe}
                      className='bg-white text-black hover:bg-white/95'
                    >
                      👉 Enable notifications
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )
          }
      </div>

    </CardContent>
  </Card>
  );
}