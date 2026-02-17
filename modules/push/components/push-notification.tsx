// components/PushNotificationButton.tsx
'use client';

import { useEffect } from 'react';
import { Activity, CircleAlert, Info, Monitor, MonitorSmartphone, Smartphone, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { usePushNotification } from '../hook/use-push-notification';

export default function PushNotificationButton() {
  const pushNotification = usePushNotification();

  useEffect(() => {
    pushNotification.checkBrowserPermission();
    pushNotification.fetchSubscribedDevices();
  }, [])
  

  const handleSubscribe = async () => {
   await pushNotification.subscribe({ shadowEffect: 'get_device_list' });
  };

  return (
    <section className="flex flex-col gap-2 pb-10">
      <h2 className="font-bold text-lg">
        Push Notifications
      </h2>
      <div className='text-xs flex flex-col gap-2'>
        <p className="pb-0.5 text-zinc-500">Stay informed about important events and real-time updates.</p>
        {
          pushNotification.browserPermission === 'denied' && (
            <Alert className='w-fit my-2'>
              <CircleAlert />
              <AlertTitle>Action required</AlertTitle>
              <AlertDescription>
                You have denied permission for push notifications. Please enable notifications in your browser settings to receive updates.
              </AlertDescription>
            </Alert>
          )
        }
        {
          !['granted', 'denied'].includes(pushNotification.browserPermission) && (
            <Alert className='w-fit my-2'>
              <Info />
              <AlertTitle>Action required</AlertTitle>
              <AlertDescription>
                You have not yet granted permission for push notifications. Please allow notifications in your browser settings to receive updates.
              </AlertDescription>
            </Alert>
          )
        }
        <div className="flex items-center gap-3 pb-2">
          <Activity className='w-4 h-4'/>
          <span>Status:</span>
          <span className={`${
            pushNotification.browserPermission === 'granted' 
              ? 'text-green-800' 
              : pushNotification.browserPermission === 'denied'
              ? 'text-red-800'
              : 'text-gray-800'
          }`}>
            {pushNotification.browserPermission === 'granted' ? 'Granted' : pushNotification.browserPermission === 'denied' ? 'Denied' : 'Pending'}
          </span>
        </div>
        <div className='flex flex-col pb-2'>
          <div className='flex items-center gap-3'>
            <MonitorSmartphone className='w-4 h-4'/>
            <span>Connected devices:</span>
            <span className='font-bold text-zinc-500'>
              {pushNotification.devices?.length || 0} active
            </span>
          </div>
          
          <div className='pt-3 space-y-2 w-fit'>
            {
              pushNotification.devices?.length !== 0 ? (
                pushNotification.devices.map( device => (
                  <div 
                    key={device.id}
                     className={cn(
                        "relative text-xs text-zinc-500 flex flex-row items-center gap-4 py-4 px-6 border rounded-md",
                        device.deviceId === pushNotification.deviceId ? "bg-blue-900/20 border-blue-800" : "border-zinc-900/20"
                      )}
                    >
                    {
                      device.deviceId === pushNotification.deviceId && ( 
                        <div className='absolute top-0 right-0'>
                          <span className='block p-1 text-[10px] font-medium bg-blue-900 text-white rounded-b-sm rounded-r-sm rounded-br-none'>Current</span>
                        </div>
                      )
                    }
                    <div className='border rounded-md p-3'>
                        { device.deviceInfo.device === 'mobile' && (<Smartphone className='w-4 h-4'/> ) }
                        { device.deviceInfo.device === 'tablet' && ( <Tablet className='w-4 h-4'/> ) }
                        { device.deviceInfo.device === 'desktop' && ( <Monitor className='w-4 h-4'/> ) }
                    </div>
                    <div className='flex flex-col gap-1'>
                      <p>
                        {device.deviceInfo.platform}
                        {' · '}
                        {device.deviceInfo.browser}
                      </p>
                      <div className=''>
                        {
                          pushNotification.deviceId !== device.deviceId && (
                            <>
                              { device.status === 'active' && <span className='text-green-800'>Notification are enabled</span> }
                              { device.status === 'inactive' && <span className='text-red-800'>Notifications are disabled</span> }
                            </>
                          )
                        }
                        {
                          pushNotification.deviceId === device.deviceId && (
                            <>
                            {pushNotification.browserPermission === 'granted' && device.status === 'active' && <span className='text-green-800'>Notification are enabled on this device</span>}
                            {pushNotification.browserPermission === 'granted' && device.status === 'inactive' && <span className='text-red-800'>Notifications are disabled on this device</span>}
                            {pushNotification.browserPermission === 'denied' && <span className='text-red-800'>Permission denied. Please enable notifications in your browser settings.</span>}
                            {!['granted', 'denied'].includes(pushNotification.browserPermission) && <span className='text-zinc-400'>Permission pending. Please allow notifications in your browser settings.</span>}
                            </>
                          )
                          
                        }
                      </div>
                    </div>
                  </div>
                ))) : (
                  <span className='text-xs text-zinc-500'>No devices subscribed</span>
                )
            } 
          </div>
        </div>
      </div>

      {
        pushNotification.browserPermission !== 'denied' && (
          <div className="flex gap-3 pt-4">
            <Button
              size={'xs'}
              onClick={handleSubscribe}
              disabled={pushNotification.isCreatingSubscription}
            >
              { !['granted', 'denied'].includes(pushNotification.browserPermission) && 'Enable notifications' }
              {  pushNotification.browserPermission === 'granted' && pushNotification.devices?.some( device => device.deviceId === pushNotification.deviceId ) && 'Update Subscription' }
              {  pushNotification.browserPermission === 'granted' && !pushNotification.devices?.some( device => device.deviceId === pushNotification.deviceId ) && 'Subscribe to notifications' }
            </Button>
          </div>
        )
      }

    </section>
  );
}