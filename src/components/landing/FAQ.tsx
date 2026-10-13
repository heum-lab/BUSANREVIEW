import { FAQ_ITEMS } from '@/constants/FAQ';

export function FAQ(): JSX.Element {
  return (
    <section id="faq" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">자주 묻는 질문</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">리뷰체험단·가구매 FAQ</h2>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
              <h3 className="text-lg font-bold text-ink-900">{item.question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
