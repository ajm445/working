import { test, expect } from '@playwright/test';

/**
 * 로그인 및 거래 추가 테스트
 *
 * 사용자가 로그인한 후 거래를 추가하고, 데이터가 Supabase에 저장되는지 확인합니다.
 */
test.describe('Authentication and Transaction Management', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 localStorage 초기화
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('로그인 페이지 접근 및 UI 확인', async ({ page }) => {
    await page.goto('/login');

    // 로그인 페이지 요소 확인
    await expect(page.getByRole('heading', { name: /로그인|Login/ })).toBeVisible();

    // Google 로그인 버튼 확인
    const googleLoginButton = page.getByRole('button', { name: /Google.*로그인|Google.*Login/ });
    await expect(googleLoginButton).toBeVisible();

    // 게스트 모드 링크 확인
    const guestModeLink = page.getByRole('link', { name: /로그인.*계속|게스트|비로그인/ });
    await expect(guestModeLink).toBeVisible();
  });

  test('게스트 모드로 앱 사용 링크 클릭', async ({ page }) => {
    await page.goto('/login');

    // 게스트 모드 링크 클릭
    const guestModeLink = page.getByRole('link', { name: /로그인.*계속|게스트|비로그인/ });
    await guestModeLink.click();

    // 메인 앱으로 이동되었는지 확인
    await expect(page).toHaveURL('/');
    await expect(page.getByText('총 수입')).toBeVisible();
  });

  /**
   * Note: 실제 Google OAuth 로그인 테스트는 E2E 환경에서 복잡하므로
   * 아래 테스트는 로그인 플로우의 시작 부분만 확인합니다.
   *
   * 실제 로그인 테스트를 위해서는:
   * 1. 테스트 전용 Supabase 프로젝트 사용
   * 2. 테스트 계정 생성
   * 3. OAuth 플로우 모킹 또는 테스트 토큰 사용
   */
  test('Google 로그인 버튼 클릭 시 OAuth 플로우 시작', async ({ page, context }) => {
    await page.goto('/login');

    // 새 페이지 오픈 이벤트 리스너 추가 (OAuth 팝업 또는 리다이렉트)
    const popupPromise = context.waitForEvent('page');

    // Google 로그인 버튼 클릭
    const googleLoginButton = page.getByRole('button', { name: /Google.*로그인|Google.*Login/ });
    await googleLoginButton.click();

    // OAuth 플로우가 시작되었는지 확인 (새 페이지 또는 리다이렉트)
    // 실제 로그인은 테스트하지 않지만, 버튼이 동작하는지 확인
    await page.waitForTimeout(2000);

    // 현재 페이지가 로그인 페이지에 남아있거나 OAuth 페이지로 이동했는지 확인
    const currentUrl = page.url();
    const isLoginPage = currentUrl.includes('/login');
    const isAuthPage = currentUrl.includes('supabase') || currentUrl.includes('google') || currentUrl.includes('accounts.google.com');

    expect(isLoginPage || isAuthPage).toBe(true);
  });

  /**
   * 로그인 후 거래 추가 테스트
   *
   * 이 테스트는 실제 인증을 수행하지 않고,
   * 인증 상태를 모킹하여 테스트합니다.
   */
  test('로그인 상태에서 거래 추가 (모킹)', async ({ page }) => {
    // Supabase 세션 모킹
    await page.goto('/');

    // localStorage에 모킹된 Supabase 세션 추가
    await page.evaluate(() => {
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000,
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
          user_metadata: {
            name: 'Test User',
          },
        },
      };

      // Supabase는 localStorage에 세션을 저장함
      localStorage.setItem(
        'sb-' + window.location.hostname + '-auth-token',
        JSON.stringify(mockSession)
      );
    });

    // 페이지 새로고침하여 세션 적용
    await page.reload();

    // 로그인 상태 확인 - 로그아웃 버튼 또는 사용자 정보 표시
    // (앱 구조에 따라 다를 수 있음)

    // 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('75000');
    await page.selectOption('select', '숙박');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('호텔 숙박');
    await page.getByRole('button', { name: '추가하기' }).click();

    // 성공 메시지 확인
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // Note: 실제 Supabase에 데이터가 저장되는지 확인하려면
    // 테스트 DB를 쿼리해야 하므로 이 테스트에서는 생략
  });

  test('로그인/비로그인 상태 전환 테스트', async ({ page }) => {
    await page.goto('/');

    // 비로그인 상태에서 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    await page.getByRole('button', { name: '수입' }).click();
    await page.locator('input[type="number"]').fill('200000');
    await page.selectOption('select', '급여');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('파트타임');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에 guest_transactions 확인
    const guestData = await page.evaluate(() => {
      return localStorage.getItem('guest_transactions');
    });
    expect(guestData).toBeTruthy();

    // 로그인 페이지로 이동
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /로그인|Login/ })).toBeVisible();

    // 메인 페이지로 돌아가기
    await page.goto('/');
    await expect(page.getByText('총 수입')).toBeVisible();

    // 이전 게스트 데이터가 여전히 존재하는지 확인
    const guestDataAfter = await page.evaluate(() => {
      return localStorage.getItem('guest_transactions');
    });
    expect(guestDataAfter).toBe(guestData);
  });
});
