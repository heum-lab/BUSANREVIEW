import { METRICS } from '@/constants/METRICS';

export function Metrics(): JSX.Element {
  return (
    <section className="section bg-ink-900 text-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-white">
            성과 지표
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            숫자로 증명하는 GOOD TO GREAT
          </h2>
          <p className="mt-4 text-ink-300">
            TOP5 안에 드는 리뷰플랫폼 규모를 자랑합니다.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur"
            >
              <div className="text-sm font-semibold text-ink-300">{m.label}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {m.value}
                </span>
                {m.suffix && (
                  <span className="text-lg font-bold text-ink-300">{m.suffix}</span>
                )}
              </div>
              {m.caption && (
                <div className="mt-3 text-xs text-ink-300">{m.caption}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
