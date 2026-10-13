import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { getCurrentUser } from '@/lib/auth';
import { getConsultationById, formatDate } from '@/lib/consultations';
import { deleteConsultationAction } from '../../actions';
import {
  StatusProvider,
  StatusBadge,
  ToggleButton,
} from '@/components/admin/consultation-status';

interface PageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: '상담 신청 상세 — 어드민',
};

export const dynamic = 'force-dynamic';

export default async function ConsultationDetailPage({ params }: PageProps): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/admin/consultations');

  const item = await getConsultationById(params.id);
  if (!item) notFound();

  return (
    <>
      <Header />
      <main className="bg-ink-100/30">
        <div className="container-x py-14 sm:py-16">
          <div className="mx-auto max-w-3xl">
           <StatusProvider id={item.id} initial={item.status}>
            <div className="flex items-center gap-3 text-sm text-ink-500">
              <Link href="/admin/consultations" className="hover:text-ink-900">
                상담 신청 목록
              </Link>
              <span>·</span>
              <span className="text-ink-900">상세</span>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{item.brand}</h1>
              <StatusBadge size="md" />
            </div>

            <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-8 shadow-card">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <Item label="담당자명" value={item.name} />
                <Item label="연락처" value={item.phone} copy />
                <Item label="이메일" value={item.email} copy />
                <Item label="접수일시" value={formatDate(item.createdAt)} />
                {item.handledAt && (
                  <Item label="처리일시" value={formatDate(item.handledAt)} />
                )}
              </dl>

              <div className="mt-8 border-t border-ink-100 pt-6">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  문의 내용
                </dt>
                <dd className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-900">
                  {item.message || <span className="text-ink-300">(내용 없음)</span>}
                </dd>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                href="/admin/consultations"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-ink-900 ring-1 ring-ink-100 hover:bg-ink-100/50"
              >
                목록으로
              </Link>

              <div className="flex gap-2">
                <ToggleButton
                  variant="detail"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600"
                />
                <form action={deleteConsultationAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    삭제
                  </button>
                </form>
              </div>
            </div>
           </StatusProvider>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Item({ label, value, copy }: { label: string; value: string; copy?: boolean }): JSX.Element {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</dt>
      <dd className="mt-1 text-base font-medium text-ink-900">
        {copy ? (
          <a href={isEmail(value) ? `mailto:${value}` : `tel:${value}`} className="hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function isEmail(v: string): boolean {
  return v.includes('@');
}
