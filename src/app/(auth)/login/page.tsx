import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/common/Button';
import { getCurrentUser } from '@/lib/auth';
import { loginAction } from '../actions';

export const metadata: Metadata = {
  title: '로그인 — GOOD TO GREAT',
};

interface LoginPageProps {
  searchParams: { error?: string; next?: string };
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid: '이메일 또는 비밀번호가 일치하지 않습니다.',
};

export default async function LoginPage({ searchParams }: LoginPageProps): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (user) {
    redirect(searchParams.next ?? '/blog');
  }

  const errorMessage = searchParams.error ? ERROR_MESSAGES[searchParams.error] : null;
  const next = searchParams.next ?? '/blog';

  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="container-x py-16 sm:py-20">
          <div className="mx-auto max-w-md">
            <h1 className="text-3xl font-extrabold tracking-tight">관리자 로그인</h1>
            <p className="mt-3 text-sm text-ink-500">
              관리자 계정으로만 글 작성이 가능합니다.
            </p>

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form action={loginAction} className="mt-8 space-y-5">
              <input type="hidden" name="next" value={next} />

              <div>
                <label htmlFor="email" className="text-sm font-semibold text-ink-700">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-semibold text-ink-700">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="비밀번호 입력"
                  className="mt-1.5 w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                로그인
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
