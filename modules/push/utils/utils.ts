export const urlBase64ToUint8Array = ( base64String: string ) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const hasRequiredLibs = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser.');
    return false;
  }

  if (!('PushManager' in window)) {
    console.warn('Push notifications are not supported in this browser.');
    return false;
  }

  if (!('Notification' in window)) {
    console.warn('Notifications are not supported in this browser.');
    return false;
  }
  
  return true;
};
