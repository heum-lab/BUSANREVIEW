import 'server-only';
import { put, head, BlobNotFoundError } from '@vercel/blob';
import sanitizeHtml from 'sanitize-html';

const POSTS_PATHNAME = 'posts/all.json';

export interface Post {
  id: string;
  title: string;
  content: string; // sanitized HTML
  tags: string[];
  author: string;
  createdAt: string;
}

export type NewPostInput = Pick<Post, 'title' | 'content' | 'author' | 'tags'>;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
    'h1', 'h2', 'h3', 'h4',
    'ul', 'ol', 'li',
    'blockquote',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'colgroup', 'col',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    col: ['style'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
  },
};

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

function migrate(raw: Partial<Post>): Post {
  return {
    id: raw.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: raw.title ?? '',
    content: raw.content ?? '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    author: raw.author ?? '익명',
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

async function readAll(): Promise<Post[]> {
  try {
    const blob = await head(POSTS_PATHNAME);
    const url = `${blob.url}?t=${blob.uploadedAt.getTime()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const parsed = (await res.json()) as Partial<Post>[];
    return parsed.map(migrate);
  } catch (err) {
    if (err instanceof BlobNotFoundError) return [];
    throw err;
  }
}

async function writeAll(posts: Post[]): Promise<void> {
  await put(POSTS_PATHNAME, JSON.stringify(posts, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 0,
  });
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await readAll();
  return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPostById(id: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export async function createPost(input: NewPostInput): Promise<Post> {
  const posts = await readAll();
  const post: Post = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    content: sanitizeContent(input.content),
    tags: input.tags.map((t) => t.trim()).filter(Boolean).slice(0, 10),
    author: input.author.trim() || '익명',
    createdAt: new Date().toISOString(),
  };
  posts.unshift(post);
  await writeAll(posts);
  return post;
}

export type UpdatePostInput = Pick<Post, 'title' | 'content' | 'tags'>;

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post | null> {
  const posts = await readAll();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const next: Post = {
    ...posts[idx],
    title: input.title.trim(),
    content: sanitizeContent(input.content),
    tags: input.tags.map((t) => t.trim()).filter(Boolean).slice(0, 10),
  };
  posts[idx] = next;
  await writeAll(posts);
  return next;
}

export async function deletePost(id: string): Promise<void> {
  const posts = await readAll();
  const filtered = posts.filter((p) => p.id !== id);
  await writeAll(filtered);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

export function extractPlainText(html: string, limit = 160): string {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}
