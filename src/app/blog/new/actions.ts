'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createPost } from '@/lib/posts';
import { getCurrentUser } from '@/lib/auth';

export async function createPostAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?next=/blog/new');
  }

  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const tagsRaw = String(formData.get('tags') ?? '[]');

  let tags: string[] = [];
  try {
    const parsed = JSON.parse(tagsRaw);
    if (Array.isArray(parsed)) {
      tags = parsed.filter((t): t is string => typeof t === 'string');
    }
  } catch {
    tags = [];
  }

  const isEmptyContent = !content || content === '<p></p>';
  if (!title || isEmptyContent) {
    redirect('/blog/new?error=missing');
  }

  const post = await createPost({ title, content, author: user.name, tags });
  revalidatePath('/blog');
  redirect(`/blog/${post.id}`);
}
