'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { setConsultationStatus, deleteConsultation } from '@/lib/consultations';

async function requireAdmin(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/admin/consultations');
}

export async function toggleHandledAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const next = String(formData.get('status') ?? 'pending') as 'pending' | 'handled';
  await setConsultationStatus(id, next);
  revalidatePath('/admin/consultations');
  revalidatePath(`/admin/consultations/${id}`);
}

// Argument form for client-driven optimistic UI. The public Blob store is
// eventually consistent (a write takes a few hundred ms to propagate), so an
// immediate re-read after writing returns stale data. The client flips the
// status optimistically; this action just persists it in the background.
export async function setConsultationStatusById(
  id: string,
  status: 'pending' | 'handled',
): Promise<void> {
  await requireAdmin();
  await setConsultationStatus(id, status);
  revalidatePath('/admin/consultations');
  revalidatePath(`/admin/consultations/${id}`);
}

export async function deleteConsultationAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  await deleteConsultation(id);
  revalidatePath('/admin/consultations');
  redirect('/admin/consultations');
}
