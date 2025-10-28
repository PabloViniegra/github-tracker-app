import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // ⚠️ IMPORTANTE: Actualiza con tu dominio real antes del deploy
  const baseUrl = 'https://github-tracker.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Add more static pages as needed
    // Example:
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
  ];
}
