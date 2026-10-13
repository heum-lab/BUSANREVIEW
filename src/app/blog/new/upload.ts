'use server';

import path from 'path';
import { put } from '@vercel/blob';
import { getCurrentUser } from '@/lib/auth';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export interface UploadResult {
  url?: string;
  error?: string;
}

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  const user = await getCurrentUser();
  if (!user) return { error: '로그인이 필요합니다.' };

  const file = formData.get('file');
  if (!(file instanceof File)) return { error: '파일이 첨부되지 않았습니다.' };
  if (!ALLOWED.has(file.type)) return { error: 'JPG/PNG/WEBP/GIF만 업로드 가능합니다.' };
  if (file.size > MAX_BYTES) return { error: '5MB 이하의 이미지만 업로드 가능합니다.' };

  const ext = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.png';
  const pathname = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

  const blob = await put(pathname, file, {
    access: 'public',
    contentType: file.type,
  });

  return { url: blob.url };
}
