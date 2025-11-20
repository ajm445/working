import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 *
 * 가계부 앱의 주요 시나리오를 테스트합니다:
 * - 비로그인 임시 데이터 사용
 * - 로그인 및 거래 추가
 * - 통화 변경 및 환율 적용
 * - 캘린더에서 거래 추가
 */
export default defineConfig({
  testDir: './e2e',

  /* 최대 테스트 실행 시간 */
  timeout: 30 * 1000,

  /* 각 assertion의 최대 대기 시간 */
  expect: {
    timeout: 5000
  },

  /* 테스트 실패 시 재시도 */
  fullyParallel: true,

  /* CI 환경에서는 재시도 하지 않음 */
  forbidOnly: !!process.env.CI,

  /* CI 환경에서는 재시도 */
  retries: process.env.CI ? 2 : 0,

  /* 병렬 실행 워커 수 */
  workers: process.env.CI ? 1 : undefined,

  /* 테스트 리포터 */
  reporter: 'html',

  /* 모든 프로젝트에 적용되는 공통 설정 */
  use: {
    /* 액션 실행 시 베이스 URL */
    baseURL: 'http://localhost:5173',

    /* 실패한 테스트의 스크린샷 저장 */
    screenshot: 'only-on-failure',

    /* 실패한 테스트의 비디오 저장 */
    video: 'retain-on-failure',

    /* 트레이스 수집 (디버깅용) */
    trace: 'on-first-retry',
  },

  /* 다양한 브라우저 환경에서 테스트 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 모바일 뷰포트 테스트 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 테스트 전에 개발 서버 시작 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
