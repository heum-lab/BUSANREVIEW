/**
 * 카카오톡 채널 상담 플로팅 버튼.
 *
 * 모든 페이지 우측 하단에 고정 노출되며, 클릭 시 카카오톡 채널 상담(채팅)으로 연결됩니다.
 * 채널 공개 ID는 채팅 URL(pf.kakao.com/_xfycJs/chat)에 노출되는 공개 값이므로
 * 기본값으로 둡니다. 채널이 바뀌면 NEXT_PUBLIC_KAKAO_CHANNEL_ID 환경변수로 덮어쓸 수 있습니다.
 *   예) NEXT_PUBLIC_KAKAO_CHANNEL_ID=_abcdef  (앞의 밑줄 포함)
 * 카카오톡 채널 관리자센터 → 상세설정 → 채널 URL의 pf.kakao.com/ 뒤 값입니다.
 */
const DEFAULT_CHANNEL_ID = '_xfycJs';

export function KakaoConsult(): JSX.Element | null {
  const channelId = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID || DEFAULT_CHANNEL_ID;
  if (!channelId) {
    return null;
  }

  const chatUrl = `https://pf.kakao.com/${channelId}/chat`;

  return (
    <a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡으로 상담하기"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 font-semibold text-[#3C1E1E] shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
    >
      <KakaoIcon className="h-6 w-6" />
      <span className="hidden text-sm sm:inline">카카오톡 상담</span>
    </a>
  );
}

function KakaoIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3C6.477 3 2 6.582 2 11c0 2.86 1.92 5.37 4.81 6.78-.16.57-.84 3.06-.86 3.25 0 0-.02.16.08.22.1.06.22.01.22.01.27-.04 3.18-2.08 3.94-2.62.58.08 1.18.13 1.81.13 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
    </svg>
  );
}
