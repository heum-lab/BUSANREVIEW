import Link from 'next/link';
import { Logo } from './Logo';

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-ink-100 bg-ink-900 text-ink-100">
      <div className="container-x py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Logo variant="light" size="md" showWordmark />
            <p className="mt-4 text-sm text-ink-300">
              굿투그레이트 부산지사
              <br />
              리뷰체험단 마케팅 플랫폼
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">고객지원</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-300">
              <li>운영시간: 평일 10:00 ~ 18:00</li>
              <li>점심: 12:30 ~ 14:00 제외</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">정책</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-300">
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-1 border-t border-white/10 pt-6 text-xs text-ink-300">
          <div>
            사업자등록번호 762-43-00973
            <span className="mx-2 text-white/20">|</span>
            주소 부산광역시 해운대구 센텀동로 71, 10층 1009호(우동, 벽산이센텀클래스원2차)
            <span className="mx-2 text-white/20">|</span>
            통신판매번호 2024-서울용산-1282
          </div>
          <div>© {new Date().getFullYear()} Good to Great. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
