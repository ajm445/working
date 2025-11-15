# 프로젝트 개선 작업 리스트

> 작성일: 2025-11-15
> 최종 업데이트: 2025-11-15

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
  - [ ] Git 히스토리에서 `.env` 파일 제거 (이미 커밋된 경우) - 개발자 확인 필요
  - [ ] Supabase 대시보드에서 노출된 키 재발급 - 개발자 확인 필요
  - [x] `.env.example` 파일 생성 (템플릿용)
  - [ ] 배포 환경(Render)에 환경 변수 설정 확인 - 개발자 확인 필요
- **참고**: `.gitignore` 설정 완료, `.env.example` 생성 완료. Git 히스토리 및 키 재발급은 개발자가 직접 확인 필요

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
- **상태**: ⬜
- **우선순위**: High
- **예상 소요**: 2-3시간
- **파일**:
  - `src/contexts/AuthContext.tsx` (라인 158, 217)
  - `src/services/transactionService.ts` (라인 75, 114, 171, 177, 178)
  - `src/types/database.ts`
- **작업 내용**:
  - [ ] Supabase CLI로 타입 자동 생성: `npx supabase gen types typescript`
  - [ ] `database.ts`에 정확한 타입 정의 추가
  - [ ] 모든 `as never` 타입 단언을 적절한 타입으로 교체
  - [ ] TypeScript 컴파일 에러 수정
- **참고**: 타입 단언 남용으로 런타임 에러 가능성 있음

### 4. README.md 작성
- **상태**: ⬜
- **우선순위**: High
- **예상 소요**: 1시간
- **파일**: `README.md` (신규 생성)
- **작업 내용**:
  - [ ] 프로젝트 소개
  - [ ] 주요 기능 설명
  - [ ] 기술 스택
  - [ ] 설치 및 실행 방법
  - [ ] 환경 변수 설정 가이드
  - [ ] 배포 가이드
  - [ ] 라이선스 정보
  - [ ] 스크린샷 추가 (선택)
- **참고**: 현재 README 파일이 없음

### 5. 핵심 로직 단위 테스트 작성
- **상태**: ⬜
- **우선순위**: High
- **예상 소요**: 4-6시간
- **파일**: 테스트 파일 신규 생성
- **작업 내용**:
  - [ ] Vitest 및 Testing Library 설치
  - [ ] `utils/currency.test.ts` - 환율 변환 로직 테스트
  - [ ] `utils/calculations.test.ts` - 금액 계산 로직 테스트
  - [ ] `utils/dateUtils.test.ts` - 날짜 처리 로직 테스트
  - [ ] `package.json`에 test 스크립트 추가
  - [ ] CI/CD에 테스트 단계 추가 (선택)
- **참고**: 현재 테스트 파일이 전혀 없음

---

## 🟡 Medium Priority (1개월 내 조치)

### 6. LINE 로그인 기능 완성 또는 제거
- **상태**: ⬜
- **우선순위**: Medium
- **예상 소요**: 1-2시간
- **파일**:
  - `src/contexts/AuthContext.tsx` (라인 185-193)
  - `src/components/Auth/LoginPage.tsx`
- **작업 내용**:
  - 옵션 A: LINE 로그인 구현
    - [ ] Supabase에서 LINE OAuth 설정
    - [ ] `provider: 'google'`을 `provider: 'line'`으로 변경
    - [ ] 테스트 및 검증
  - 옵션 B: 미구현 기능 제거
    - [ ] UI에서 LINE 로그인 버튼 제거
    - [ ] `signInWithLine` 함수 제거
- **참고**: 현재 LINE 로그인이 Google로 대체되어 있어 혼란 가능성

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
- Critical: 약 3-5시간
- High: 약 8-12시간
- Medium: 약 12-18시간
- Low: 약 16-24시간
- **총합**: 약 39-59시간 (약 1-2주 풀타임 작업)

### 업데이트 가이드
- 작업 시작 시: ⬜ → 🔄
- 작업 완료 시: 🔄 → ✅ 및 완료일 기록
- 정기적으로 이 문서 업데이트 (주 1회 권장)
