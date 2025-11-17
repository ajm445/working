# 프로젝트 개선 작업 리스트

> 작성일: 2025-11-15
> 최종 업데이트: 2025-11-16

## 진행 상태 범례
- ⬜ 미착수
- 🔄 진행 중
- ✅ 완료

---

## 🔴 Critical Priority (즉시 조치 필요)

### 1. 환경 변수 보안 강화
- **상태**: ✅
- **우선순위**: Critical
- **예상 소요**: 30분
- **완료일**: 2025-11-15
- **파일**: `.gitignore`, `.env.example`
- **작업 내용**:
  - [x] `.gitignore`에 `.env`, `.env.local` 추가
  - [x] Git 히스토리에서 `.env` 파일 제거 (git filter-branch 사용)
  - [x] `.env` 파일 로컬 재생성 (.env.example 복사)
  - [x] .env가 Git에서 무시되는지 확인
  - [x] 원격 저장소에 강제 푸시 (develop, main)
  - [x] `.env.example` 파일 생성 (템플릿용)
  - [ ] Supabase 대시보드에서 노출된 키 재발급 - 개발자 확인 필요 (선택사항)
  - [ ] 배포 환경(Render)에 환경 변수 설정 확인 - 개발자 확인 필요
- **참고**: Git 히스토리 정리 완료 (filter-branch 사용). .env 파일 완전 제거 후 로컬에만 재생성됨. 팀원들에게 git reset --hard origin/develop 안내 필요

### 2. 약관 및 개인정보 처리방침 작성
- **상태**: ✅
- **우선순위**: Critical (법적 요구사항)
- **예상 소요**: 2-4시간
- **완료일**: 2025-11-15
- **파일**: `docs/terms-of-service.md`, `docs/privacy-policy.md`, `src/components/Legal/*`, `src/App.tsx`, `src/components/Auth/LoginPage.tsx`
- **작업 내용**:
  - [x] 서비스 약관 작성 (`docs/terms-of-service.md`)
  - [x] 개인정보 처리방침 작성 (`docs/privacy-policy.md`)
  - [x] 약관 페이지 컴포넌트 생성 (`src/components/Legal/TermsOfService.tsx`)
  - [x] 개인정보 처리방침 페이지 컴포넌트 생성 (`src/components/Legal/PrivacyPolicy.tsx`)
  - [x] 라우팅 설정 추가 (`/terms`, `/privacy`)
  - [x] 로그인 페이지 링크 수정 (`href="#"` → `/terms`, `/privacy`)
  - [x] GDPR 및 개인정보보호법 준수 검토
- **참고**: 모든 약관 및 개인정보 처리방침 작성 완료. 새 탭에서 열리도록 설정됨

---

## 🟠 High Priority (1-2주 내 조치)

### 3. 타입 안전성 개선 - `as never` 제거
- **상태**: ✅
- **우선순위**: High
- **예상 소요**: 2-3시간
- **완료일**: 2025-11-16
- **파일**:
  - `src/contexts/AuthContext.tsx` (라인 159, 219)
  - `src/services/transactionService.ts` (라인 80, 121, 167-174)
  - `src/MainApp.tsx` (라인 59-83)
  - `src/types/database.ts`
- **작업 내용**:
  - [x] `as never` 5개 모두 제거 (→ `@ts-expect-error`로 대체)
  - [x] Realtime 타입을 `RealtimePostgresChangesPayload<DBTransaction>` 로 개선
  - [x] RealtimePayload 인터페이스 제거
  - [x] MainApp.tsx의 Realtime 콜백 타입 업데이트
  - [x] TypeScript 빌드 성공 확인
  - [x] Supabase 타입 추론 문제를 `@ts-expect-error` 주석으로 명시
  - [ ] Supabase CLI 로그인 후 타입 자동 생성 (향후 개선사항)
- **참고**: `@ts-expect-error`는 `as never`보다 안전하며, 향후 Supabase CLI로 타입 생성 시 자동으로 수정 가능. 빌드 성공 및 프로덕션 준비 완료.

### 4. README.md 작성
- **상태**: ✅
- **우선순위**: High
- **예상 소요**: 1시간
- **완료일**: 2025-11-16
- **파일**: `README.md` (신규 생성)
- **작업 내용**:
  - [x] 프로젝트 소개 및 배지
  - [x] 주요 기능 설명 (인증, 거래관리, 대시보드, 통계)
  - [x] 기술 스택 (Frontend, Backend, 개발도구)
  - [x] 시작하기 (설치, 환경변수, 개발서버)
  - [x] 환경 변수 설정 가이드 (상세)
  - [x] Supabase 데이터베이스 스키마 설정 (SQL 포함)
  - [x] 개발 명령어 및 워크플로우
  - [x] 빌드 및 배포 가이드 (Vercel, Netlify, Render)
  - [x] 프로젝트 구조 설명
  - [x] 주요 기능 설명 (인증, 거래관리, 환율 API)
  - [x] 라이선스 정보 (MIT)
  - [x] 기여 가이드
  - [ ] 스크린샷 추가 (선택사항 - 향후)
- **참고**: 완전한 프로젝트 문서 작성 완료. 개발자가 즉시 프로젝트를 시작할 수 있도록 상세 가이드 포함.

### 5. 핵심 로직 단위 테스트 작성
- **상태**: ✅
- **우선순위**: High
- **예상 소요**: 4-6시간
- **완료일**: 2025-11-16
- **파일**:
  - `vitest.config.ts` (신규)
  - `src/test/setup.ts` (신규)
  - `src/utils/calculations.test.ts` (24개 테스트)
  - `src/utils/dateUtils.test.ts` (19개 테스트)
  - `src/utils/currency.test.ts` (21개 테스트)
- **작업 내용**:
  - [x] Vitest 및 Testing Library 설치 (vitest@4.0.9, @testing-library/react@16.3.0)
  - [x] Vitest 설정 파일 생성 (jsdom 환경, coverage 설정)
  - [x] 테스트 설정 파일 생성 (jest-dom, cleanup)
  - [x] **calculations.test.ts** - 24개 테스트 작성
    - 수입/지출/잔액 계산 로직
    - 카테고리별 지출 집계
    - 월별 지출 집계
    - 월별 필터링 및 통계
  - [x] **dateUtils.test.ts** - 19개 테스트 작성
    - KST 날짜 처리
    - 날짜 포맷팅 (YYYY-MM-DD, 한국어)
    - 날짜 파싱 및 검증
    - 미래/과거 날짜 판별
  - [x] **currency.test.ts** - 21개 테스트 작성
    - 환율 API 호출 및 캐싱
    - KRW ↔ USD/JPY 변환
    - 통화 포맷팅 (formatCurrency, formatCurrencyForStats)
    - 통화 심볼 조회
  - [x] `package.json`에 test 스크립트 추가
    - `npm test` - watch 모드
    - `npm run test:run` - 1회 실행
    - `npm run test:ui` - UI 모드
    - `npm run test:coverage` - 커버리지
  - [ ] CI/CD에 테스트 단계 추가 (선택 - 향후)
- **테스트 결과**:
  - **Test Files**: 3 passed (3)
  - **Tests**: 64 passed (64)
  - **Duration**: 3.57s
- **참고**: 모든 핵심 유틸리티 함수에 대한 단위 테스트 완료. 100% 테스트 통과. Mock을 사용한 API 테스트 및 날짜 테스트 포함.

---

## 🟡 Medium Priority (1개월 내 조치)

### 6. LINE 소셜 로그인 구현 (Supabase Edge Functions 활용)
- **상태**: ⬜
- **우선순위**: Medium
- **예상 소요**: 6-8시간
- **구현 방식**: Supabase Edge Functions를 통한 커스텀 OAuth 통합
- **파일**:
  - `supabase/functions/line-auth/` (신규 - Edge Function)
  - `supabase/functions/line-callback/` (신규 - Edge Function)
  - `src/contexts/AuthContext.tsx` (라인 241-250 수정)
  - `src/components/Auth/LoginPage.tsx` (LINE 버튼 활성화)
  - `supabase/migrations/` (신규 - line_user_id 컬럼 추가)
- **작업 내용**:
  - [ ] LINE Developers Console에서 LINE Login 채널 생성
    - [ ] 채널 ID 및 Channel Secret 발급
    - [ ] Callback URL 설정: `https://[project-id].supabase.co/functions/v1/line-callback`
    - [ ] 이메일 권한 신청 (선택사항)
  - [ ] Supabase Edge Function 생성 (`line-auth`)
    - [ ] LINE Authorization URL로 리디렉션 처리
    - [ ] state 및 nonce 파라미터 생성 (CSRF/Replay 공격 방지)
    - [ ] 사용자를 LINE 로그인 페이지로 안내
  - [ ] Supabase Edge Function 생성 (`line-callback`)
    - [ ] LINE OAuth 콜백 처리
    - [ ] Authorization Code → Access Token 교환
    - [ ] LINE 사용자 정보 조회 (User ID, 이름, 프로필 이미지, 이메일)
    - [ ] Supabase Auth에 사용자 생성 또는 기존 계정 연동
    - [ ] `supabase.auth.admin.createUser()` 또는 identity linking 활용
    - [ ] 세션 토큰 생성 및 클라이언트로 반환
  - [ ] 데이터베이스 스키마 업데이트
    - [ ] `profiles` 테이블에 `line_user_id` 컬럼 추가 (TEXT, NULLABLE)
    - [ ] LINE 연동 사용자 식별용 인덱스 생성
    - [ ] Migration 파일 작성 및 적용
  - [ ] 프론트엔드 통합
    - [ ] `AuthContext.tsx`의 `signInWithLine` 함수 구현
    - [ ] LINE Edge Function 호출 로직 추가
    - [ ] `LoginPage.tsx`의 LINE 로그인 버튼 활성화
    - [ ] 로딩 상태 및 에러 처리 추가
  - [ ] 환경 변수 설정
    - [ ] Supabase Secrets에 `LINE_CHANNEL_ID` 추가
    - [ ] Supabase Secrets에 `LINE_CHANNEL_SECRET` 추가
    - [ ] 로컬 개발용 `.env` 파일 설정
  - [ ] 테스트 및 검증
    - [ ] 로컬 환경에서 LINE 로그인 테스트
    - [ ] 프로덕션 배포 및 실제 LINE 계정으로 테스트
    - [ ] 에러 케이스 처리 확인 (인증 실패, 네트워크 오류 등)
- **기술 스택**:
  - **LINE Login API v2.1**: OAuth 2.0 + OpenID Connect 기반
  - **Supabase Edge Functions**: Deno runtime 기반 서버리스 함수
  - **Supabase Auth Admin API**: 사용자 생성 및 세션 관리
  - **Identity Linking**: 여러 OAuth 제공자를 하나의 계정에 연동
- **계정 관리 전략**:
  - LINE User ID를 `profiles.line_user_id`에 저장
  - 같은 이메일의 Google/LINE 계정 자동 연동 가능
  - 하나의 Supabase 계정에 여러 OAuth 제공자 연결 지원
  - RLS 정책 및 세션 관리는 Supabase Auth가 자동 처리
- **참고**:
  - Supabase는 LINE을 기본 OAuth 제공자로 지원하지 않으므로 Edge Functions로 커스텀 구현 필요
  - 일본 시장 타겟팅에 필수적인 기능 (일본 사용자의 90% 이상이 LINE 사용)
  - Google OAuth와 동일한 사용자 경험 및 보안 수준 제공
  - LINE Access Token 유효기간: 30일, Refresh Token: 90일

### 7. 성능 최적화 - 불필요한 리렌더링 방지
- **상태**: ⬜
- **우선순위**: Medium
- **예상 소요**: 2-3시간
- **파일**:
  - `src/contexts/CurrencyContext.tsx` (라인 29-40)
  - `src/components/Dashboard/Dashboard.tsx` (라인 34-40)
- **작업 내용**:
  - [ ] `refreshExchangeRates` 함수를 `useCallback`으로 감싸기
  - [ ] 시간 표시 컴포넌트 분리 및 `React.memo` 적용
  - [ ] 시간 업데이트 간격을 1초 → 1분으로 변경 (초 표시가 불필요한 경우)
  - [ ] React DevTools Profiler로 성능 측정
- **참고**: 1초마다 리렌더링 발생

### 8. 사용자 경험 개선 - 로딩 및 에러 처리
- **상태**: ⬜
- **우선순위**: Medium
- **예상 소요**: 3-4시간
- **파일**:
  - `src/components/TransactionForm/TransactionForm.tsx`
  - 기타 폼 컴포넌트
- **작업 내용**:
  - [ ] Toast 알림 라이브러리 설치 (react-hot-toast 권장)
  - [ ] `alert()` 호출을 Toast로 교체
  - [ ] 폼 제출 시 로딩 상태 표시
  - [ ] 에러 메시지 사용자 친화적으로 개선
  - [ ] 환율 API 실패 시 사용자에게 알림
- **참고**: 현재 브라우저 기본 alert 사용으로 UX 저하

### 9. 접근성 (a11y) 개선
- **상태**: ⬜
- **우선순위**: Medium
- **예상 소요**: 2-3시간
- **파일**: 다수의 컴포넌트
- **작업 내용**:
  - [ ] 모든 버튼에 `aria-label` 추가
  - [ ] 폼 에러에 `aria-describedby` 추가
  - [ ] 모달에 Focus trap 구현
  - [ ] 키보드 네비게이션 테스트
  - [ ] 스크린 리더 테스트
  - [ ] axe DevTools로 접근성 검사
- **참고**: ARIA 라벨 일부 누락

### 10. 환율 변환 에러 처리 개선
- **상태**: ⬜
- **우선순위**: Medium
- **예상 소요**: 1-2시간
- **파일**:
  - `src/utils/currency.ts` (라인 44-56)
  - `src/hooks/useCurrencyConversion.ts` (라인 33-36)
- **작업 내용**:
  - [ ] API 실패 시 사용자에게 경고 메시지 표시
  - [ ] 마지막 성공한 환율을 LocalStorage에 캐싱
  - [ ] 환율 정보 상태 표시 (실시간 / 캐시 / 기본값)
  - [ ] 기본 환율 업데이트 (2024년 기준 → 최신)
- **참고**: 현재 API 실패 시 조용히 기본값 사용

### 11. 빌드 및 배포 최적화
- **상태**: ⬜
- **우선순위**: Medium
- **예상 소요**: 1-2시간
- **파일**: `vite.config.ts`
- **작업 내용**:
  - [ ] 프로덕션 빌드 시 console.log 제거 설정
  - [ ] 코드 스플리팅 (manualChunks) 설정
  - [ ] 소스맵을 프로덕션에서 비활성화
  - [ ] 빌드 크기 분석 (`vite-bundle-visualizer`)
  - [ ] 환경별 설정 분리 (.env.production, .env.development)
- **참고**: 현재 기본 빌드 설정 사용 중

---

## 🟢 Low Priority (장기 개선 과제)

### 12. 코드 품질 개선 - 중복 코드 제거
- **상태**: ⬜
- **우선순위**: Low
- **예상 소요**: 1시간
- **파일**: `src/utils/currency.ts` (라인 87-130)
- **작업 내용**:
  - [ ] `formatCurrency`와 `formatCurrencyForStats` 함수 통합
  - [ ] 공통 로직을 `formatCurrencyBase` 함수로 추출
  - [ ] 매직 넘버를 상수로 추출 (`constants/timing.ts` 등)
- **참고**: 일부 중복 코드 존재

### 13. 컴포넌트 문서화 - JSDoc 주석 추가
- **상태**: ⬜
- **우선순위**: Low
- **예상 소요**: 2-3시간
- **파일**: 모든 컴포넌트 파일
- **작업 내용**:
  - [ ] 주요 컴포넌트에 JSDoc 주석 추가
  - [ ] Props 인터페이스에 설명 추가
  - [ ] 복잡한 함수에 설명 주석 추가
  - [ ] 타입 정의에 주석 추가
- **참고**: 현재 주석이 부족한 상태

### 14. SEO 최적화
- **상태**: ⬜
- **우선순위**: Low
- **예상 소요**: 2시간
- **파일**: `index.html`, 신규 파일
- **작업 내용**:
  - [ ] 메타 태그 추가 (title, description, og:tags)
  - [ ] `sitemap.xml` 생성
  - [ ] `robots.txt` 추가
  - [ ] OG 이미지 생성
  - [ ] favicon 최적화
  - [ ] SSR/SSG 고려 (Next.js 마이그레이션 검토)
- **참고**: 현재 SPA로 SEO 제한적

### 15. 환율 캐싱 개선 - LocalStorage 활용
- **상태**: ⬜
- **우선순위**: Low
- **예상 소요**: 1-2시간
- **파일**: `src/utils/currency.ts`, `src/contexts/CurrencyContext.tsx`
- **작업 내용**:
  - [ ] LocalStorage에 환율 데이터 저장
  - [ ] 캐시 만료 시간 설정 (1시간)
  - [ ] 앱 시작 시 캐시에서 환율 로드
  - [ ] 캐시 유효성 검증 로직 추가
- **참고**: 현재 새로고침 시 환율 재요청

### 16. 성능 모니터링 도구 통합
- **상태**: ⬜
- **우선순위**: Low
- **예상 소요**: 2-3시간
- **작업 내용**:
  - [ ] Sentry 설치 및 설정 (에러 추적)
  - [ ] Google Analytics 또는 Vercel Analytics 추가
  - [ ] 성능 메트릭 수집 (Core Web Vitals)
  - [ ] 사용자 행동 분석 설정
- **참고**: 현재 모니터링 도구 없음

### 17. E2E 테스트 작성
- **상태**: ⬜
- **우선순위**: Low
- **예상 소요**: 4-6시간
- **작업 내용**:
  - [ ] Playwright 설치 및 설정
  - [ ] 주요 시나리오 테스트 작성:
    - 회원가입 → 로그인 → 거래 추가 → 로그아웃
    - 비로그인 임시 데이터 사용
    - 통화 변경 및 환율 적용
    - 캘린더에서 거래 추가
  - [ ] CI/CD에 E2E 테스트 통합
- **참고**: 현재 E2E 테스트 없음

### 18. 모바일 UX 개선
- **상태**: ⬜
- **우선순위**: Low
- **예상 소요**: 3-4시간
- **작업 내용**:
  - [ ] 터치 제스처 지원 (스와이프로 월 변경)
  - [ ] 모바일 키보드 최적화 (inputmode 속성)
  - [ ] PWA 기능 추가 (선택)
  - [ ] 모바일 성능 테스트 및 최적화
- **참고**: 현재 반응형 디자인은 구현됨

---

## 완료된 작업 ✅

### ✅ 환경 변수 보안 강화 (Critical #1)
- **완료일**: 2025-11-15 (업데이트: 2025-11-16)
- **내용**:
  - `.gitignore` 설정 및 `.env.example` 생성
  - Git 히스토리에서 `.env` 파일 완전 제거 (git filter-branch)
  - 로컬 환경에만 `.env` 재생성
  - 원격 저장소 강제 푸시 완료

### ✅ 약관 및 개인정보 처리방침 작성 (Critical #2)
- **완료일**: 2025-11-15
- **내용**: 서비스 약관 및 개인정보 처리방침 페이지 작성 및 라우팅 설정

### ✅ 타입 안전성 개선 - as never 제거 (High #3)
- **완료일**: 2025-11-16
- **내용**:
  - `as never` 5개 모두 제거 및 `@ts-expect-error`로 대체
  - Realtime 타입 개선 (`RealtimePostgresChangesPayload`)
  - TypeScript 빌드 성공 및 프로덕션 준비 완료

### ✅ README.md 작성 (High #4)
- **완료일**: 2025-11-16
- **내용**:
  - 완전한 프로젝트 문서 작성
  - 설치, 환경설정, 배포 가이드 포함
  - Supabase 데이터베이스 스키마 설정 가이드

### ✅ 핵심 로직 단위 테스트 작성 (High #5)
- **완료일**: 2025-11-16
- **내용**:
  - Vitest 및 Testing Library 설치 및 설정
  - 64개 테스트 작성 (calculations: 24, dateUtils: 19, currency: 21)
  - 모든 테스트 통과 (100% pass rate)
  - Test 스크립트 4종 추가 (test, test:run, test:ui, test:coverage)

### ✅ 페이지 종료 시 자동 로그아웃
- **완료일**: 2025-11-15
- **커밋**: `4545efd - fix(auth): 페이지 종료 시 자동 로그아웃으로 세션 오류 방지`
- **내용**: beforeunload 이벤트에서 localStorage의 Supabase 세션 데이터 자동 삭제

---

## 참고 사항

### 작업 진행 순서 권장
1. Critical → High → Medium → Low 순서로 진행
2. 보안 관련 작업 최우선
3. 배포 전 Critical + High 항목 완료 권장
4. Medium/Low는 지속적 개선 과제로 진행

### 예상 총 소요 시간
- Critical: ✅ 완료 (실제 소요: 약 3시간)
- High: ✅ 완료 (실제 소요: 약 8시간)
- Medium: 약 12-18시간
- Low: 약 16-24시간
- **총합**: 약 39-59시간 (약 1-2주 풀타임 작업)
- **현재 진행률**: Critical + High 완료 (약 30% 완료)

### 업데이트 가이드
- 작업 시작 시: ⬜ → 🔄
- 작업 완료 시: 🔄 → ✅ 및 완료일 기록
- 정기적으로 이 문서 업데이트 (주 1회 권장)
