import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog'],
        disallow: ['/admin', '/login', '/blog/new', '/blog/*/edit', '/api', '/uploads/'],
      },
      {
        userAgent: 'Yeti', // Naver
        allow: ['/', '/blog'],
        disallow: ['/admin', '/login', '/blog/new', '/blog/*/edit', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
