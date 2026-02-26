import { PushNotification } from "./interface";


const sw = self as unknown as ServiceWorkerGlobalScope;

const builder = ( message: PushNotification ): { event: string, body: string, icon: string } => {
  switch (message.type) {
    case 'event':
      return {
        event: message.data.event,
        body: message.data.description ?? '',
        icon: sw.location.origin + '/logsh.png',
      };
    default: {
      return {
        event: 'Notification',
        body: 'You have a new notification',
        icon: sw.location.origin + '/logsh.png',
      }
    }
  
  }

}
const main = () => {
  console.log("Push Notification Service Worker Loaded");
  
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/push_event
  sw.addEventListener("push", async ( payload ) => {

    if(payload.data === null) return;

    const data = payload.data.text();
    
    try {
      const notification = builder(JSON.parse(data) as PushNotification);
      await sw.registration.showNotification(notification.event, {
        body: notification.body,
        icon: notification.icon,
        data, // keep the original data for notificationclick event
      });
      
    } catch (error) {
      if(error instanceof SyntaxError) {
        console.error('Error parsing push data:', error);
      }
      console.log('Unauthorized: ', error);
    }
    
  });

  sw.addEventListener('notificationclick', async ( event ) => {
    event.notification.close()

    const notification = JSON.parse(event.notification.data) as PushNotification;
    const origin = self.location.origin;
    
    let href = new URL('/', origin).href;

    switch(notification.type) {
      case 'event': 
        //href = new URL(`/workspace/${notification.data.workspaceId}/channel/${notification.data.channelId}/event/${notification.data.id}`, origin).href;
        break;
/*       case 'message':
        if(notification.data.link){
          href = new URL(notification.data.link, origin).href
        }
      break; */
    }

    event.waitUntil(
      sw.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        // If an existing tab is open, focus it
/*         for (const client of clientList) {
          // ✅ Focus the tab if it's already open and on the same origin
          client.navigate(href.replace(origin, '')); // navigate to the path only
          client.focus();

          return;
        } */
        // Otherwise, open a new tab
        return sw.clients.openWindow(href);
      }),
    );

  });

};

main();