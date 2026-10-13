'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { updatePost, deletePost } from '@/lib/posts';
import { getCurrentUser } from '@/lib/auth';

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is string => typeof t === 'string');
    }
  } catch {
    // ignore
  }
  return [];
}

export async function updatePostAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const id = String(formData.get('id') ?? '');
  if (!user) {
    redirect(`/login?next=/blog/${id}/edit`);
  }

  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const tags = parseTags(String(formData.get('tags') ?? '[]'));

  const isEmptyContent = !content || content === '<p></p>';
  if (!title || isEmptyContent) {
    redirect(`/blog/${id}/edit?error=missing`);
  }

  const updated = await updatePost(id, { title, content, tags });
  if (!updated) {
    redirect('/blog?error=notfound');
  }
  revalidatePath('/blog');
  revalidatePath(`/blog/${id}`);
  redirect(`/blog/${id}`);
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const id = String(formData.get('id') ?? '');
  if (!user) {
    redirect(`/login?next=/blog/${id}`);
  }
  await deletePost(id);
  revalidatePath('/blog');
  redirect('/blog');
}
