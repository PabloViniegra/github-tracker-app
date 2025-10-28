import type { MetadataRoute } from 'next';

// ⚠️ IMPORTANTE: Las imágenes de iconos deben crearse (ver public/ASSETS_NEEDED.md)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GitHub Activity Tracker',
    short_name: 'GitHub Tracker',
    description: 'Monitor your GitHub activity in real-time. Track repositories, receive webhook notifications, and stay updated with all your GitHub events.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['productivity', 'developer tools', 'utilities'],
    lang: 'es-ES',
    dir: 'ltr',
    scope: '/',
  };
}
