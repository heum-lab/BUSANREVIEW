'use server';

import { redirect } from 'next/navigation';
import { findUserByEmail, verifyPassword } from '@/lib/users';
import { setSession, clearSession } from '@/lib/auth';

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/blog');

  const user = await findUserByEmail(email);
  if (!user) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  await setSession(user.id);
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect('/');
}
