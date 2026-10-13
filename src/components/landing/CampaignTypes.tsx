import { CAMPAIGN_TYPES } from '@/constants/CAMPAIGN_TYPES';

export function CampaignTypes(): JSX.Element {
  return (
    <section id="types" className="section bg-brand-100">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">체험단 유형</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">원하는 유형에 따라 6가지 중 선택</h2>
          <p className="mt-4 text-ink-500">
            광고주의 선택에 따라 최적의 캠페인을 운영합니다.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGN_TYPES.map((c, idx) => (
            <article
              key={c.type}
              className="group rounded-2xl border border-ink-100 bg-white p-6 transition-shadow hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{c.title}</h3>
                <span className="text-sm font-semibold text-ink-300">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-ink-500">프로세스</dt>
                  <dd className="mt-1 text-ink-900">{c.process}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-600">지원 플랫폼</dt>
                  <dd className="mt-1 text-ink-900">{c.platforms}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
