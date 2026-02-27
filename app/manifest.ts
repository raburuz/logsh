import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'logsh',
    short_name: 'logsh',
    description: 'logsh description',
    scope: '/',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/logsh-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logsh-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}