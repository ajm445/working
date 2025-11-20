import { test, expect } from '@playwright/test';

/**
 * 간단한 예제 테스트
 * Playwright 설치 및 설정이 올바른지 확인합니다.
 */
test('basic test - 설정 확인', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // 페이지 타이틀 확인
  await expect(page).toHaveTitle(/Playwright/);

  // Get started 링크 확인
  const getStarted = page.getByRole('link', { name: 'Get started' });
  await expect(getStarted).toBeVisible();
});
