# GOOD TO GREAT (굿투그레이트)

쿠팡·네이버 스마트스토어 등 주요 커머스 플랫폼의 **리뷰체험단·가구매·구매평·상위노출 마케팅**을 소개하고 상담을 접수하는 서비스입니다. 마케팅 랜딩 페이지 + 상담 접수 + 블로그("리뷰이야기") + 관리자 백오피스로 구성된 단일 Next.js 애플리케이션입니다.

- 운영사: 굿투그레이트 부산지사
- 서비스 URL: https://www.g2gbusan.com
- 문의: g2g2024@naver.com / 카카오톡 채널 상담

> 패키지명은 레거시로 `stylec-landing`이지만 서비스 브랜드는 GOOD TO GREAT입니다.

## 기술 스택

- Next.js 14 (App Router) + TypeScript
- React 18 / Tailwind CSS 3
- Pretendard (CDN)
- 인증: `jose`(JWT) + `bcryptjs`
- 저장소: `@vercel/blob`(게시글·상담·이미지) + 로컬 `data/*.json`(관리자 계정)
- 에디터: TipTap / 본문 정제: `sanitize-html`
- 배포: Vercel

## 실행 방법

```bash
npm install
cp .env.local.example .env.local   # 환경 변수 설정 (AUTH_SECRET 등)
npm run seed:admin                 # 관리자 계정 시드 (최초 1회)
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

### 관리자 계정 시드

```bash
# 기본값: admin@goodtogreat.co.kr / g2g!admin2026
npm run seed:admin

# 또는 인자/환경변수로 지정
node scripts/seed-admin.js <email> <password> <name>
```

로그인은 `/login`, 관리자 백오피스는 `/admin`(→ `/admin/consultations`)입니다.

## 빌드 / 프로덕션

```bash
npm run build
npm run start
npm run lint
```

## 환경 변수

`.env.local.example` 참고. 자세한 설명은 [CONVENTIONS.md §8](./CONVENTIONS.md)를 확인하세요.

| 변수 | 설명 |
|------|------|
| `AUTH_SECRET` | JWT 서명 시크릿 (32자 이상 권장, 필수) |
| `AUTH_USERS_JSON` | 관리자 계정 목록(`data/users.json` 내용 그대로). 배포 환경은 파일이 없으므로 필수 |
| `NEXT_PUBLIC_KAKAO_CHANNEL_ID` | 카카오톡 채널 ID(밑줄 포함, 기본 `_xfycJs`) |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (기본 `https://www.g2gbusan.com`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 구글 사이트 인증 코드 |
| `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` | 네이버 사이트 인증 코드 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 토큰 (배포 환경 자동 주입) |

## 디렉토리 구조

```
src/
├── app/
│   ├── (auth)/login/           # 관리자 로그인 + loginAction/logoutAction
│   ├── actions/consultation.ts # 공개 상담 접수 Server Action
│   ├── admin/                  # 백오피스 (상담 목록/상세/상태 관리)
│   ├── blog/                   # 리뷰이야기 (목록/상세/작성/수정 + 이미지 업로드)
│   ├── privacy · terms/        # 법적 고지 페이지
│   ├── robots.ts · sitemap.ts · rss.xml/  # SEO
│   ├── layout.tsx              # 루트 레이아웃 (metadata/JSON-LD/카카오 버튼)
│   └── page.tsx                # 랜딩 페이지
├── components/
│   ├── common/                 # Header, Footer, Button, Logo, KakaoConsult
│   ├── landing/                # Hero, Features, CampaignTypes, Metrics, Pricing, CTA
│   ├── blog/                   # RichTextEditor(TipTap), TagInput
│   └── admin/                  # ConsultationRow, consultation-status
├── lib/                        # auth, posts, consultations, users, seo (server-only)
└── constants/                  # CAMPAIGN_TYPES.ts, METRICS.ts

data/      # users.json 등 로컬 데이터
scripts/   # seed-admin.js, migrate-posts-to-blob.js
public/    # brand/ 로고, uploads/ 업로드 이미지
```

## 주요 기능

| 영역 | 경로 | 설명 |
|------|------|------|
| 랜딩 | `/` | 서비스 소개 + 상담 CTA + SEO(JSON-LD/sitemap/RSS) |
| 상담 | 랜딩 CTA / 카카오 버튼 | 폼 접수(Vercel Blob 저장) + 카카오톡 채널 상담 |
| 블로그 | `/blog` | 리뷰 운영 노하우 글 (작성/수정은 관리자) |
| 관리자 | `/admin` | 로그인 후 상담 관리(처리상태 토글/삭제) |

## 문서

- [PRD.md](./PRD.md) — 제품 요구사항
- [ARCHITECTURE.md](./ARCHITECTURE.md) — 시스템 아키텍처
- [CONVENTIONS.md](./CONVENTIONS.md) — 개발 컨벤션
