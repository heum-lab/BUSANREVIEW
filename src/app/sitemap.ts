import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getAllPosts } from '@/lib/posts';

// Generated at request time so the build never depends on Blob credentials.
// A blob read failing at build would otherwise abort the whole deployment.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  let postPaths: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    postPaths = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.id}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {
    // Blob unavailable — still emit the static paths rather than failing.
    postPaths = [];
  }

  return [...staticPaths, ...postPaths];
}
