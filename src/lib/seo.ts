// 대시보드/CLI로 넣은 환경변수에 BOM·공백이 섞이면 new URL()이 빌드를 깨뜨리므로 정리한다.
const ENV_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/[\uFEFF\s]/g, '').replace(/\/+$/, '');

export const SITE_URL = ENV_SITE_URL || 'https://www.g2gbusan.com';

export const SITE_NAME = 'GOOD TO GREAT';
export const SITE_ALT_NAME = '굿투그레이트';

export const PRIMARY_KEYWORDS = [
  '부산 리뷰체험단',
  '부산 체험단',
  '부산 리뷰마케팅',
  '부산 가구매',
  '부산 쿠팡 리뷰',
  '부산 스마트스토어 리뷰',
  '가구매',
  '쿠팡 가구매',
  '스스 가구매',
  '쿠팡 리뷰',
  '스스 리뷰',
  '스스 상위노출',
  '쿠팡 상위노출',
  '리뷰체험단',
  '스마트스토어 리뷰',
  '스마트스토어 상위노출',
  '쿠팡 체험단',
  '구매리뷰',
  '가구매리뷰',
  '리뷰대행',
  '리뷰마케팅',
  '체험단마케팅',
  '쿠팡',
  '스마트스토어',
  '구매평',
  '페이백 체험단',
  '인플루언서 마케팅',
  'GOOD TO GREAT',
  '굿투그레이트',
  '굿투그레이트 부산지사',
] as const;

export const SITE_DESCRIPTION =
  '부산 쿠팡 네이버 스마트스토어 리뷰 체험단 구매 가구매 상위노출 마케팅. 굿투그레이트 부산지사 전문 매니저가 캠페인을 운영해 빠른 리뷰를 제공합니다.';

export const SITE_TAGLINE = '부산 쿠팡 네이버 스마트스토어 리뷰 구매 가구매 체험단 마케팅';
