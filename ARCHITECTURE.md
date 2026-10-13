# ARCHITECTURE.md — GOOD TO GREAT(굿투그레이트) 시스템 아키텍처

> 실제 구현(코드) 기준 문서입니다. 작성 기준: 레포지토리 `stylec-landing` / 2026.10

## 1. 프로젝트 개요

GOOD TO GREAT(굿투그레이트)는 쿠팡·네이버 스마트스토어 등 주요 커머스 플랫폼의 **리뷰체험단·가구매·구매평·상위노출 마케팅**을 전담 매니저가 대행하는 서비스이며, 본 레포지토리는 그 **마케팅 랜딩 페이지 + 상담 접수 + 블로그/관리자 백오피스**를 담당하는 단일 Next.js 애플리케이션입니다.

- 운영사: 굿투그레이트 부산지사
- 사업자등록번호: 762-43-00973 / 통신판매업: 2024-서울용산-1282
- 주소: 부산광역시 해운대구 센텀동로 71, 10층 1009호(우동, 벽산이센텀클래스원2차)
- 문의: g2g2024@naver.com / 카카오톡 채널 상담
- 서비스 URL: https://g2greview.com (환경변수 `NEXT_PUBLIC_SITE_URL`로 오버라이드)
- 패키지명: `stylec-landing` (레거시 명칭, 서비스 브랜드는 GOOD TO GREAT)

---

## 2. 전체 시스템 구성도

```
┌──────────────────────────────────────────────────────────┐
│                       Client (Browser)                     │
│      PC / Mobile 반응형 웹 · Pretendard 폰트(CDN)           │
└───────────────────────────────┬────────────────────────────┘
                                │  HTTPS
┌───────────────────────────────▼────────────────────────────┐
│                  Next.js 14 (App Router) — Vercel            │
│  ┌────────────────────────┐   ┌─────────────────────────┐   │
│  │  Server Components      │   │  Server Actions          │   │
│  │  (페이지 렌더링/SEO)     │   │  ('use server' 폼 처리)  │   │
│  └────────────────────────┘   └─────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  lib/  — auth(JWT) · posts · consultations · users · seo │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────┬───────────────────────────────┬──────────────┘
                │                               │
   ┌────────────▼────────────┐     ┌────────────▼──────────────┐
   │  Vercel Blob (public)    │     │  로컬 파일시스템 data/      │
   │  posts/all.json          │     │  users.json (관리자 계정)   │
   │  consultations/items/*   │     │  posts.json / consult.json │
   │  consultations/handled/* │     │  (레거시/시드 데이터)        │
   │  uploads/* (이미지)       │     └────────────────────────────┘
   └──────────────────────────┘

   외부: 카카오톡 채널 상담(pf.kakao.com) · 네이버/구글 사이트 인증
```

> ⚠️ 이전 설계안에 있던 MySQL / Redis / Object Storage 분리, API Gateway, 6개 마이크로서비스 구성은 **현재 구현되어 있지 않습니다.** 모든 저장은 Vercel Blob과 로컬 JSON으로 처리하는 모놀리식 구조입니다.

---

## 3. 애플리케이션 영역(도메인)

### 3-1. 마케팅 랜딩 (공개)
- 서비스 소개 랜딩 페이지 (`/`)
- 섹션: Hero → Features → CampaignTypes → Metrics → Pricing → CTA
- 상담 신청 폼(CTA)으로 리드 수집
- SEO: JSON-LD(Service/FAQ/Organization/WebSite), sitemap, robots, RSS

### 3-2. 상담 (Consultation)
- 방문자가 브랜드/이름/연락처/이메일/문의내용 제출
- 카카오톡 채널 플로팅 버튼(`KakaoConsult`)으로 실시간 상담 연결
- 관리자가 처리 상태(pending/handled) 토글 및 삭제

### 3-3. 블로그 "리뷰이야기" (`/blog`)
- 리뷰 운영 노하우/후기 게시글 CRUD
- TipTap 리치 텍스트 에디터 + 이미지 업로드
- 태그 필터링, HTML sanitize, RSS 노출

### 3-4. 관리자 백오피스 (`/admin`)
- 로그인(JWT 세션) 필요
- `/admin` → `/admin/consultations` 리다이렉트
- 상담 목록/상세, 처리 상태 관리

---

## 4. 디렉토리 구조 (실제)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── actions.ts            # loginAction / logoutAction
│   │   └── login/page.tsx        # 관리자 로그인
│   ├── actions/
│   │   └── consultation.ts       # submitConsultationAction (공개 상담 접수)
│   ├── admin/
│   │   ├── page.tsx              # → /admin/consultations 리다이렉트
│   │   ├── actions.ts            # 상담 상태 토글/삭제 (관리자 전용)
│   │   └── consultations/
│   │       ├── page.tsx          # 상담 목록
│   │       └── [id]/page.tsx     # 상담 상세
│   ├── blog/
│   │   ├── page.tsx              # 목록 (force-dynamic, 태그 필터)
│   │   ├── new/{page,actions,upload}.ts(x)   # 작성 + 이미지 업로드
│   │   ├── [id]/page.tsx         # 상세
│   │   └── [id]/edit/{page,actions}.ts(x)    # 수정
│   ├── privacy/page.tsx          # 개인정보처리방침
│   ├── terms/page.tsx            # 이용약관
│   ├── robots.ts · sitemap.ts · rss.xml/route.ts   # SEO
│   ├── layout.tsx                # 루트 레이아웃(metadata/JSON-LD/Kakao)
│   ├── page.tsx                  # 랜딩 페이지
│   └── globals.css
├── components/
│   ├── common/   # Header, Footer, Button, Logo, KakaoConsult
│   ├── landing/  # Hero, Features, CampaignTypes, Metrics, Pricing, CTA
│   ├── blog/     # RichTextEditor(TipTap), TagInput
│   └── admin/    # ConsultationRow, consultation-status
├── lib/          # auth, posts, consultations, users, seo  (모두 server-only)
└── constants/    # CAMPAIGN_TYPES.ts, METRICS.ts

data/             # users.json, posts.json, consultations.json (로컬 데이터)
scripts/          # seed-admin.js, migrate-posts-to-blob.js
public/           # brand/ 로고, uploads/ 업로드 이미지
```

---

## 5. 서버 모듈 상세 (`src/lib`)

모든 `lib` 모듈은 `import 'server-only'`로 서버 전용임을 강제합니다.

### auth.ts — 인증/세션
- `jose`의 `SignJWT`/`jwtVerify`로 HS256 JWT 발급·검증
- 쿠키명 `g2g_session`, 유효기간 7일, `httpOnly` + `sameSite=lax` + prod에서 `secure`
- 비밀키: 환경변수 `AUTH_SECRET` (미설정 시 개발용 기본값)
- `getCurrentUser()`로 현재 사용자 조회

### users.ts — 사용자 저장소
- **로컬 파일시스템** `data/users.json` (bcrypt 해시)
- `findUserByEmail` / `findUserById` / `createUser` / `verifyPassword`
- 관리자 계정은 `scripts/seed-admin.js`로 시드

### posts.ts — 블로그 게시글
- **Vercel Blob** `posts/all.json` 단일 파일에 전체 글 저장
- 읽기 시 `head()` + `downloadUrl?t=<uploadedAt>` 로 캐시 우회 fetch
- `sanitize-html`로 허용 태그/속성만 통과(링크는 `target=_blank rel=noopener`)
- CRUD: `getAllPosts` / `getPostById` / `createPost` / `updatePost` / `deletePost`

### consultations.ts — 상담 접수
- **Vercel Blob**에 레코드/상태 분리 저장
  - `consultations/items/<id>.json` — 불변 상담 레코드
  - `consultations/handled/<id>` — 존재 여부로 "처리완료"를 표현하는 마커 블롭
- 공개 Blob 스토어의 콘텐츠 overwrite 전파 지연(~5s)을 피하기 위해 상태를 **마커 블롭 + `list()`**로 모델링(읽기-쓰기 지연 <1s)
- CRUD: `getAllConsultations` / `getConsultationById` / `createConsultation` / `setConsultationStatus` / `deleteConsultation`

### seo.ts — SEO 상수
- `SITE_URL`, `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, `PRIMARY_KEYWORDS`

---

## 6. 데이터 저장 전략

| 데이터 | 저장소 | 비고 |
|--------|--------|------|
| 게시글(블로그) | Vercel Blob `posts/all.json` | 단일 JSON, sanitize 적용 |
| 상담 레코드 | Vercel Blob `consultations/items/*.json` | 1건 1파일, 불변 |
| 상담 처리상태 | Vercel Blob `consultations/handled/*` | 마커 블롭(존재=처리완료) |
| 업로드 이미지 | Vercel Blob `uploads/*` | 5MB 이하 JPG/PNG/WEBP/GIF |
| 관리자 계정 | 로컬 `data/users.json` | bcrypt 해시 |

> Blob은 결과적 일관성(eventually consistent)을 가지므로, 읽기 시 `cache: 'no-store'` + 난스(nonce) 쿼리로 CDN 캐시를 우회합니다.

---

## 7. 외부 연동

| 서비스 | 용도 | 구현 위치 |
|--------|------|-----------|
| Vercel Blob | 게시글·상담·이미지 저장 | `@vercel/blob` |
| 카카오톡 채널 | 실시간 상담(채팅) 플로팅 버튼 | `KakaoConsult` (`pf.kakao.com/<id>/chat`) |
| 네이버 사이트 인증 | 검색 등록 | `layout.tsx` + `naver*.html` |
| 구글 사이트 인증 | 검색 등록 | `layout.tsx` metadata verification |

> 결제(PG), SNS Graph API, SMS/이메일 발송, 공정위 API 등은 **현재 연동되어 있지 않습니다.** 상담은 폼 접수 + 카카오 채널로 처리합니다.

---

## 8. 인프라 / 배포

| 항목 | 내용 |
|------|------|
| 호스팅 | Vercel (`.vercel` 링크 존재) |
| 프레임워크 | Next.js 14.2.35 (App Router, `reactStrictMode`) |
| 런타임 | Node.js (Vercel Functions) |
| 저장소 | Vercel Blob + 로컬 `data/` JSON |
| 폰트 | Pretendard (CDN) |
| 스타일 | Tailwind CSS 3.4 |

상세 기술 스택과 코딩 규칙은 [CONVENTIONS.md](./CONVENTIONS.md), 기능 요구사항은 [PRD.md](./PRD.md)를 참고하세요.

---

## 9. 보안 / 개인정보

- 전 구간 HTTPS
- 관리자 영역은 JWT 세션 검증(`requireAdmin`) 후 접근, 미인증 시 `/login`으로 리다이렉트
- 업로드는 로그인 사용자만, 타입/용량 검증(5MB, 이미지 MIME 화이트리스트)
- 게시글 본문은 `sanitize-html`로 XSS 방지
- 환경 비밀값(`AUTH_SECRET` 등)은 환경변수로 관리, `.env.local`은 커밋 금지
- 개인정보 수집·파기 정책은 `/privacy`(개인정보처리방침) 페이지 고지
