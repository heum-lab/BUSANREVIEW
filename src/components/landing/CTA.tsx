'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/common/Button';
import {
  submitConsultationAction,
  type ConsultationFormState,
} from '@/app/actions/consultation';

const INITIAL_STATE: ConsultationFormState = { ok: false };

export function CTA(): JSX.Element {
  const [state, formAction] = useFormState(submitConsultationAction, INITIAL_STATE);

  return (
    <section id="cta" className="section bg-[#FFBA03] text-ink-900">
      <div className="container-x">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-brand-700 shadow-sm backdrop-blur">
              무료 상담
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
              지금 바로 신청하세요.
              <br />전문매니저를 매칭해 드립니다.
            </h2>
            <p className="mt-5 text-ink-700">
              접수후 24시간 이내에 전문 매니저가 연락 드립니다.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-ink-700">
              <li>· 간단정보만 입력해 주세요.</li>
              <li>· 단가에 VAT는 별도입니다.</li>
              <li>· 운영시간: 평일 10:00 ~ 18:00 (점심 12:30 ~ 14:00 제외)</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 text-ink-900 shadow-elevated">
            {state.ok ? (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                <div className="text-4xl">🎉</div>
                <h3 className="mt-3 text-xl font-bold">신청이 접수되었습니다</h3>
                <p className="mt-2 text-sm text-ink-500">
                  영업일 기준 24시간 이내에 연락드리겠습니다.
                </p>
              </div>
            ) : (
              <form action={formAction}>
                <h3 className="text-xl font-bold">무료 상담 신청</h3>
                <p className="mt-1 text-sm text-ink-500">필수 정보만 입력해 주세요.</p>

                {state.error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {state.error}
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <Field id="brand" label="브랜드명" placeholder="예) Good to Great" />
                  <Field id="name" label="담당자명" placeholder="홍길동" />
                  <Field id="phone" label="연락처" placeholder="010-0000-0000" type="tel" />
                  <Field id="email" label="이메일" placeholder="contact@example.com" type="email" />
                  <div>
                    <label htmlFor="message" className="text-sm font-semibold text-ink-700">
                      문의 내용 (선택)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                      placeholder="원하시는 체험단 유형, 예상 인원 등을 알려주세요."
                    />
                  </div>
                </div>

                <SubmitButton />

                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  ※ 수집된 정보는 상담 목적으로만 사용됩니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitButton(): JSX.Element {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" className="mt-6 w-full" disabled={pending}>
      {pending ? '제출 중…' : '무료 상담 신청하기'}
    </Button>
  );
}

interface FieldProps {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}

function Field({ id, label, placeholder, type = 'text' }: FieldProps): JSX.Element {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}
