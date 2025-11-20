# E2E 테스트 가이드

이 디렉토리에는 Playwright를 사용한 End-to-End (E2E) 테스트가 포함되어 있습니다.

## 테스트 파일 구조

```
e2e/
├── guest-mode.spec.ts           # 비로그인 임시 데이터 사용 테스트
├── auth-transaction.spec.ts     # 로그인 및 거래 추가 테스트
├── currency-conversion.spec.ts  # 통화 변경 및 환율 적용 테스트
└── calendar-transaction.spec.ts # 캘린더에서 거래 추가 테스트
```

## 테스트 실행 방법

### 기본 테스트 실행 (헤드리스 모드)
```bash
npm run test:e2e
```

### UI 모드로 테스트 실행 (디버깅에 유용)
```bash
npm run test:e2e:ui
```

### 브라우저를 보면서 테스트 실행
```bash
npm run test:e2e:headed
```

### 특정 브라우저에서만 테스트 실행
```bash
npm run test:e2e:chromium
```

### 테스트 리포트 보기
```bash
npm run test:e2e:report
```

## 테스트 시나리오

### 1. 비로그인 임시 데이터 사용 (guest-mode.spec.ts)
- 로그인 없이 앱 접근
- 임시 데이터로 거래 추가
- localStorage에 데이터 저장 확인
- 페이지 새로고침 후 데이터 유지 확인

### 2. 로그인 및 거래 추가 (auth-transaction.spec.ts)
- 로그인 페이지 UI 확인
- 게스트 모드 링크 동작 확인
- Google OAuth 플로우 시작 확인
- 로그인 상태에서 거래 추가 (모킹)

### 3. 통화 변경 및 환율 적용 (currency-conversion.spec.ts)
- 3개 통화 (KRW, USD, JPY) 선택 가능 확인
- 각 통화로 거래 추가
- 환율 자동 변환 확인
- 대시보드 통화 선택기 동작 확인

### 4. 캘린더에서 거래 추가 (calendar-transaction.spec.ts)
- 캘린더 뷰 전환
- 특정 날짜 선택
- 선택된 날짜에 거래 추가
- 여러 날짜에 거래 추가 후 캘린더 표시 확인

## 설정 파일

테스트 설정은 `playwright.config.ts`에 정의되어 있습니다.

### 주요 설정
- **baseURL**: `http://localhost:5173`
- **timeout**: 30초
- **retries**: CI 환경에서 2번 재시도
- **브라우저**: Chromium, Firefox, WebKit + 모바일 (Chrome, Safari)
- **webServer**: 테스트 전 자동으로 개발 서버 시작

## 주의사항

### 실제 로그인 테스트
현재 Google OAuth 로그인의 전체 플로우는 테스트하지 않습니다.
실제 로그인 테스트를 위해서는:
1. 테스트 전용 Supabase 프로젝트 사용
2. 테스트 계정 생성
3. OAuth 플로우 모킹 또는 테스트 토큰 사용이 필요합니다.

### 환율 API
테스트에서는 실제 환율 API를 호출합니다.
API 제한이나 네트워크 문제로 인해 테스트가 실패할 수 있습니다.

### localStorage
각 테스트 전에 localStorage를 초기화하여 격리된 환경에서 실행됩니다.

## CI/CD 통합

CI/CD 파이프라인에서 E2E 테스트를 실행하려면:

```yaml
# .github/workflows/test.yml 예시
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 디버깅

### 스크린샷 및 비디오
실패한 테스트의 스크린샷과 비디오는 자동으로 저장됩니다:
- **스크린샷**: `test-results/` 디렉토리
- **비디오**: 실패 시에만 저장

### 트레이스
실패한 테스트의 트레이스는 `playwright-report/` 디렉토리에 저장됩니다.
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### UI 모드
UI 모드를 사용하면 각 단계를 시각적으로 확인하며 디버깅할 수 있습니다:
```bash
npm run test:e2e:ui
```

## 기여 가이드

새로운 E2E 테스트를 추가할 때:
1. 명확한 테스트 시나리오 작성
2. 각 테스트는 독립적이어야 함 (beforeEach에서 상태 초기화)
3. 적절한 대기 시간 설정 (waitForTimeout, expect 타임아웃 등)
4. 실패 시 디버깅을 위한 명확한 에러 메시지
5. JSDoc 주석으로 테스트 목적 설명
