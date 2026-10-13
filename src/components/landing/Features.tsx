interface FeatureItem {
  step: string;
  title: string;
  body: string;
  bullets: string[];
}

const FEATURES: FeatureItem[] = [
  {
    step: '01',
    title: '빠르게 체험단 등록',
    body: '모집인원, 가이드라인을 한번에 빠르고 정확하게 설정합니다.',
    bullets: [
      '구매리뷰 체험단 유형 선택',
      '구매플랫폼 지정',
      '모집 인원·기간·제공 내용 설정',
      '이미지·가이드라인 일괄 등록',
    ],
  },
  {
    step: '02',
    title: '광고주 전담매니저 지정',
    body: '전담매니저가 광고주의 일을 줄여줍니다.',
    bullets: [
      '체험단 참여자 정보제공',
      '리뷰등록여부 확인',
      '페이백 대행',
      '양질의 리뷰작성 체크',
    ],
  },
  {
    step: '03',
    title: '체험단 완료후 결과 레포트 제공',
    body: '광고주가 원하는 형태로 맞춤 리포트 제공.',
    bullets: [
      '리뷰진행 결과 리포트 제공',
      '100% 참여 보장',
      '다양한 리뷰 작성형태 제공',
      '전문 리뷰어들의 퀄리티 높은 리뷰작성',
    ],
  },
];

export function Features(): JSX.Element {
  return (
    <section id="features" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">프로세스</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            빠르고 정확한 리뷰체험단 플랫폼
          </h2>
          <p className="mt-4 text-ink-500">
            광고주는 운영에만 집중하고, 나머지는 GOOD TO GREAT이 처리합니다.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.step}
              className="flex flex-col rounded-3xl bg-white p-8 shadow-card"
            >
              <div className="text-sm font-bold text-brand-500">STEP {feature.step}</div>
              <h3 className="mt-3 text-2xl font-bold leading-tight">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{feature.body}</p>
              <ul className="mt-6 space-y-2 border-t border-ink-100 pt-6 text-sm">
                {feature.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <span className="text-ink-700">{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
