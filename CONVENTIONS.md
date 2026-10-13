# CONVENTIONS.md — GOOD TO GREAT(굿투그레이트) 개발 컨벤션

> 이 문서는 현재 레포지토리(`stylec-landing`)의 실제 코드에서 관찰·확정된 규칙을 정리한 것입니다. 새 코드는 아래 규칙을 따릅니다.

---

## 1. 기술 스택 (As-built)

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 14.2.35 |
| 언어 | TypeScript | ^5.5 |
| UI | React | ^18.3 |
| 스타일링 | Tailwind CSS | ^3.4 (+ PostCSS, Autoprefixer) |
| 폰트 | Pretendard | CDN |
| 에디터 | TipTap (`@tiptap/*`) | ^2.27 |
| 인증 | `jose`(JWT) + `bcryptjs` | — |
| 저장소 | `@vercel/blob` + 로컬 `data/*.json` | — |
| HTML 정제 | `sanitize-html` | ^2.17 |
| 린트 | ESLint (`eslint-config-next`) | 14.2.35 |
| 배포 | Vercel | — |

> 테스트 프레임워크는 현재 도입되어 있지 않습니다(§9 참고).

### npm 스크립트
```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 실행
npm run lint         # next lint
npm run seed:admin   # 관리자 계정 시드 (scripts/seed-admin.js)
```

---

## 2. 파일 및 디렉토리 네이밍

### 2-1. 공통 원칙 (실제 적용됨)
- 디렉토리명: **kebab-case** (예: `blog/[id]/edit`), 라우트 그룹은 `(auth)` 형태
- React 컴포넌트 파일: **PascalCase** (`Header.tsx`, `CampaignTypes.tsx`)
  - 단, 일부 소형 컴포넌트는 kebab-case 사용(`consultation-status.tsx`) — **신규 컴포넌트는 PascalCase 권장**
- 라이브러리/서비스/훅 파일: **camelCase** (`auth.ts`, `posts.ts`, `consultations.ts`)
- 상수 모듈 파일: **UPPER_SNAKE_CASE** (`CAMPAIGN_TYPES.ts`, `METRICS.ts`)
- Next.js 예약 파일: 프레임워크 규칙 그대로 (`page.tsx`, `layout.tsx`, `route.ts`, `actions.ts`, `robots.ts`, `sitemap.ts`)

### 2-2. 디렉토리 레이아웃
```
src/
├── app/          # 라우트(페이지/레이아웃/route handler/server actions)
├── components/   # common · landing · blog · admin
├── lib/          # 서버 전용 모듈 (import 'server-only')
└── constants/    # 정적 상수 (UPPER_SNAKE_CASE 파일)
```

---

## 3. 코드 네이밍 컨벤션

### 3-1. 변수 및 함수
```typescript
// 변수: camelCase
const activeTag = searchParams.tag?.trim() ?? '';
const posts = await getAllPosts();

// 함수: camelCase, 동사로 시작
async function getAllConsultations(): Promise<Consultation[]> {}
function formatDate(iso: string): string {}

// 불리언: is/has/can 접두어
const isActive = tag.toLowerCase() === activeTag.toLowerCase();

// Server Action: <동사>Action 접미어
export async function submitConsultationAction(...) {}
export async function uploadImageAction(formData: FormData) {}
```

### 3-2. 컴포넌트 (React)
```typescript
// PascalCase, 명시적 반환타입(JSX.Element) 사용
export function Header(): JSX.Element {}
export function KakaoConsult(): JSX.Element | null {}

// named export 선호 (default export는 Next.js page/layout에서만)
export default function HomePage(): JSX.Element {}

// Props 타입명: 컴포넌트명 + Props, interface로 정의
interface RootLayoutProps {
  children: React.ReactNode;
}
```

### 3-3. 상수 / Enum
```typescript
// 상수: UPPER_SNAKE_CASE
const COOKIE_NAME = 'g2g_session';
const MAX_BYTES = 5 * 1024 * 1024;

// Enum: PascalCase 이름, 값은 UPPER_SNAKE_CASE 문자열
export enum CampaignType {
  PAYBACK_REVIEW = 'PAYBACK_REVIEW',
  PURCHASE_REVIEW = 'PURCHASE_REVIEW',
  MISSION = 'MISSION',
}
```

### 3-4. 쿠키/프리픽스 네이밍
- 세션 쿠키: `g2g_session`
- Blob 경로 프리픽스: `posts/`, `consultations/items/`, `consultations/handled/`, `uploads/`

---

## 4. 주요 도메인 용어 (Ubiquitous Language)

| 한국어 | 코드 용어 | 설명 |
|--------|-----------|------|
| 상담 | Consultation | 랜딩에서 접수된 리드 문의 |
| 처리상태 | ConsultationStatus | `pending` \| `handled` |
| 게시글 | Post | 블로그 "리뷰이야기" 글 |
| 사용자(관리자) | User / PublicUser / StoredUser | 백오피스 계정 |
| 캠페인 유형 | CampaignType | 리뷰/가구매/구매평 등 6종 |
| 지표 | MetricItem | 랜딩 노출 KPI |
| 세션 | Session | JWT 기반 로그인 상태 |
| 가구매 | — (마케팅 용어) | 실제 구매 후 구매평 작성 + 제품비 페이백 |

---

## 5. 서버/클라이언트 경계 규칙

- **`src/lib/*`는 모두 `import 'server-only'`** 로 서버 전용 강제 (auth/posts/consultations/users)
- **Server Action 파일 최상단에 `'use server';`** 선언 (`actions.ts`, `upload.ts`)
- 환경 비밀값(`AUTH_SECRET` 등)은 서버 코드에서만 접근, 클라이언트 노출 값은 `NEXT_PUBLIC_` 접두어
- 데이터 변경 후 `revalidatePath()`로 캐시 무효화, 리다이렉트는 `redirect()`
- 최신성이 중요한 라우트는 `export const dynamic = 'force-dynamic'`

---

## 6. 코드 스타일

### 6-1. 일반 규칙 (실제 적용)
- 들여쓰기: **2 spaces**
- 세미콜론: **사용**
- 따옴표: **single quote (`'`)**
- 함수는 단일 책임 원칙 준수

### 6-2. TypeScript
- 함수 반환타입 **명시** (`: Promise<Post>`, `: JSX.Element`, `: string`)
- 객체 형태는 `interface`, 유니언/별칭은 `type` (예: `type ConsultationStatus = 'pending' | 'handled'`)
- 파생 입력 타입은 `Pick<...>` 활용 (예: `NewPostInput = Pick<Post, 'title' | 'content' | ...>`)
- `any` 지양, 외부 JSON 파싱은 `as Partial<T>` 후 `migrate()`로 정규화
- 경로 별칭: `@/*` → `src/*` (tsconfig `paths`)

### 6-3. React
- **함수형 컴포넌트만** 사용
- 기본은 Server Component, 상호작용 필요한 경우에만 `'use client'`
- named export 우선, Next.js 예약 파일만 default export

### 6-4. 린트
- `eslint-config-next` 기반
- `dangerouslySetInnerHTML`(JSON-LD 주입) 등 불가피한 경우에만 인라인 `eslint-disable` 주석 사용

---

## 7. 데이터 / 저장소 규칙

- 블로그 글: Vercel Blob `posts/all.json` 단일 파일, 저장 전 `sanitizeContent()` 필수
- 상담: 레코드(`consultations/items/<id>.json`)와 처리상태(`consultations/handled/<id>` 마커 블롭) **분리 저장**
  - 공개 Blob의 overwrite 전파 지연 때문에 상태는 마커 블롭 + `list()`로 near-instant 읽기 보장
- 업로드 이미지: `uploads/<timestamp>-<rand><ext>`, 5MB 이하, JPG/PNG/WEBP/GIF만
- Blob 읽기 시 `cache: 'no-store'` + 난스 쿼리로 CDN 캐시 우회
- ID 생성 패턴: `` `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` ``

---

## 8. 환경 변수 관리

```bash
# .env.local.example (레포 포함, 실제 값 미포함)
NODE_ENV=development
AUTH_SECRET=replace_with_a_random_32+_character_string
NEXT_PUBLIC_KAKAO_CHANNEL_ID=        # 카카오 채널 ID(밑줄 포함, 예: _abcdef)

# 코드에서 참조하는 추가 변수 (선택)
NEXT_PUBLIC_SITE_URL=                 # 기본 https://www.g2gbusan.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION= # 구글 사이트 인증
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=  # 네이버 사이트 인증
BLOB_READ_WRITE_TOKEN=                # Vercel Blob (배포 환경 자동 주입)
```

- `.env.local`은 **절대 커밋 금지** (`.gitignore` 등록)
- 환경 변수명: **UPPER_SNAKE_CASE**, 클라이언트 노출 값은 `NEXT_PUBLIC_` 접두어 필수
- 민감 정보(세션 시크릿, Blob 토큰)는 반드시 환경 변수로 관리

---

## 9. 테스트 컨벤션 (현황 및 목표)

- **현재 자동화 테스트는 없습니다.** (테스트 러너/파일 미도입)
- 도입 시 목표:
  - Unit: `lib/` 순수 로직(sanitize, formatDate, migrate 등)
  - Integration: Server Action(상담 접수, 로그인) 경로
  - 파일명: 대상 + `.test.ts(x)`

---

## 10. Git / 커밋 컨벤션

### 10-1. 커밋 메시지 (Conventional Commits 권장)
```
<type>(<scope>): <subject>
```

| 타입 | 설명 |
|------|------|
| feat | 기능 추가 |
| fix | 버그 수정 |
| refactor | 리팩토링 |
| style | 포맷/스타일 |
| docs | 문서 |
| chore | 빌드/설정 |
| perf | 성능 |

예시:
```
feat(blog): TipTap 표 확장 추가
fix(consultations): 처리상태 토글 후 stale read 보정
docs(prd): 코드 기준으로 요구사항 현행화
```

### 10-2. PR 규칙
- 변경 요약 및 테스트 방법(수동 확인 절차) 명시
- `npm run lint` / `npm run build` 통과 확인

---

## 11. 코드 리뷰 기준

| 항목 | 기준 |
|------|------|
| 서버/클라 경계 | `server-only` / `'use server'` / `NEXT_PUBLIC_` 올바르게 사용했는가 |
| 보안 | 입력 검증, sanitize, 업로드 제한, 관리자 가드(`requireAdmin`)가 있는가 |
| 타입 안전성 | 반환타입 명시, 외부 JSON 정규화(`migrate`)가 되어 있는가 |
| 네이밍 | 본 문서의 컨벤션(파일/변수/상수/Action 접미어)을 따르는가 |
| 캐시/정합성 | `revalidatePath`, Blob 캐시 우회, `force-dynamic` 적용이 적절한가 |
| SEO | metadata/JSON-LD/sitemap 영향이 검토되었는가 |
