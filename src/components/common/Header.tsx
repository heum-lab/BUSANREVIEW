import Link from 'next/link';
import { Button } from './Button';
import { getCurrentUser } from '@/lib/auth';
import { logoutAction } from '@/app/(auth)/actions';

const NAV_ITEMS = [
  { label: '프로세스', href: '/#features' },
  { label: '체험단 유형', href: '/#types' },
  { label: '가격', href: '/#pricing' },
  { label: '리뷰이야기', href: '/blog' },
];

export async function Header(): Promise<JSX.Element> {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-100/80 bg-white/85 backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Good to Great 홈으로" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-full-dark.png"
            alt="Good to Great"
            width={64}
            height={64}
            className="h-14 w-auto select-none"
            draggable={false}
          />
        </Link>
        <div className="flex items-center gap-6 lg:gap-8">
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href="/admin/consultations"
                  className="hidden text-sm font-semibold text-ink-700 hover:text-ink-900 sm:inline"
                >
                  어드민
                </Link>
                <span className="hidden text-sm text-ink-500 sm:inline">
                  <span className="font-semibold text-ink-900">{user.name}</span>님
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-ink-900 ring-1 ring-ink-100 transition-colors hover:bg-ink-100/50"
                  >
                    로그아웃
                  </button>
                </form>
              </>
            ) : (
              <>
                <Button href="/login" variant="ghost" size="md">
                  로그인
                </Button>
                <Button href="/#cta" variant="secondary" size="md">
                  무료 상담
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
