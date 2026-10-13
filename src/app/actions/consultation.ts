'use server';

import { revalidatePath } from 'next/cache';
import { createConsultation } from '@/lib/consultations';

export interface ConsultationFormState {
  ok: boolean;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitConsultationAction(
  _prev: ConsultationFormState,
  formData: FormData,
): Promise<ConsultationFormState> {
  const brand = String(formData.get('brand') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!brand || !name || !phone || !email) {
    return { ok: false, error: '필수 항목을 모두 입력해 주세요.' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, error: '이메일 형식이 올바르지 않습니다.' };
  }

  await createConsultation({ brand, name, phone, email, message });
  revalidatePath('/admin/consultations');
  return { ok: true };
}
