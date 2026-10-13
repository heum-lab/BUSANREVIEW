import type { ReactNode } from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps): JSX.Element {
  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="container-x py-16 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm text-ink-500">최종 업데이트: {lastUpdated}</p>
            <article className="legal-prose mt-10">{children}</article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
