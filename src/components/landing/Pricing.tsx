import { Button } from '@/components/common/Button';

const FEATURES = [
  '체험단 등록',
  '유형별 사용',
  '다양한 플랫폼 운영',
  '체험단 완료후 결과 레포트 제공',
  '세금계산서 발급',
  '전담 매니저 상시 상담 지원',
];

export function Pricing(): JSX.Element {
  return (
    <section id="pricing" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">가격</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">실 리뷰실행사가 운영</h2>
          <p className="mt-4 text-ink-500">
            전문 매니저의 상담받고 캠페인을 늘릴수록 단가가 낮아집니다.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-ink-100 bg-white p-10 shadow-elevated">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
                전담매니저 상담
              </div>
              <h3 className="mt-4 text-2xl font-bold">플랫폼별 단가상이</h3>
              <p className="mt-2 text-sm text-ink-500">VAT 별도</p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                  1,000원~10,000원
                </span>
                <span className="text-lg font-bold text-ink-700">건당</span>
              </div>
            </div>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  ✓
                </span>
                <span className="text-ink-700">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="#cta" variant="primary" size="lg" className="flex-1">
              지금 무료 상담 신청
            </Button>
            <Button href="#cta" variant="ghost" size="lg" className="flex-1">
              세금계산서 안내
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
