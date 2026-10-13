import { Button } from '@/components/common/Button';

interface HeroStat {
  k: string;
  v: string;
  note?: string;
}

const HERO_STATS: HeroStat[] = [
  { k: '체험단 등록', v: '5분' },
  { k: '건당 단가', v: '1,000원~10,000원', note: '구매플랫폼과 리뷰어컨디션에 따라 차등' },
  { k: '평균 모집률', v: '100% 이상' },
];

export function Hero(): JSX.Element {
  return (
    <section id="top" className="relative overflow-hidden bg-[#FFBA03]">
      <div className="container-x relative pt-20 pb-24 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">쿠팡·스마트스토어 리뷰체험단 / 가구매·상위노출</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] sm:text-5xl lg:text-6xl">
            굿투그레이트 부산지사와
            <br />
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">구매리뷰체험단</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-ink-900/10" />
            </span>
            <br />
            간편하게 이용하세요
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-ink-500 sm:text-base">
            쿠팡 리뷰, 스마트스토어(스스) 리뷰, 가구매, 상위노출까지 — 리뷰체험단 마케팅을 한 곳에서.
          </p>
          <ul className="mt-8 flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto whitespace-nowrap pb-2 sm:justify-center sm:gap-2 sm:overflow-x-visible sm:pb-0">
            {[
              '가구매',
              '쿠팡 가구매',
              '스스 가구매',
              '쿠팡 리뷰',
              '스스 리뷰',
              '스스 상위노출',
              '쿠팡 상위노출',
              '리뷰체험단',
              '가구매리뷰',
              '리뷰대행',
              '리뷰마케팅',
              '체험단마케팅',
              '쿠팡',
              '스마트스토어',
              '구매리뷰',
            ].map((item) => (
              <li
                key={item}
                className="shrink-0 rounded-full border border-ink-100 bg-white/80 px-2.5 py-1 text-xs font-semibold text-ink-700 shadow-sm backdrop-blur sm:px-3 sm:py-1.5 sm:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#cta" variant="primary" size="lg">
              무료 상담 신청하기
            </Button>
            <Button href="#features" variant="ghost" size="lg">
              서비스 자세히 보기
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 items-start gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          {HERO_STATS.map((item) => (
            <div key={item.k} className="text-center">
              <div className="text-xs font-semibold text-ink-500">{item.k}</div>
              <div className="mt-1 text-xl font-bold text-ink-900 sm:text-2xl">{item.v}</div>
              {item.note && (
                <div className="mt-2 text-[11px] leading-snug text-ink-500">{item.note}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
