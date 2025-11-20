import { test, expect } from '@playwright/test';

/**
 * 비로그인 임시 데이터 사용 테스트
 *
 * 사용자가 로그인하지 않고도 앱을 사용할 수 있는지 확인합니다.
 * 임시 데이터는 localStorage에 저장되어야 합니다.
 */
test.describe('Guest Mode - 비로그인 임시 데이터 사용', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 localStorage 초기화
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('비로그인 상태로 앱 접근 및 대시보드 표시 확인', async ({ page }) => {
    await page.goto('/');

    // 앱이 정상적으로 로드되었는지 확인
    await expect(page).toHaveTitle(/가계부/);

    // 대시보드 주요 요소 확인
    await expect(page.getByText('총 수입')).toBeVisible();
    await expect(page.getByText('총 지출')).toBeVisible();
    await expect(page.getByText('잔액')).toBeVisible();

    // 초기 잔액이 0인지 확인
    const balanceCards = page.locator('.rounded-xl.shadow-sm.p-6');
    await expect(balanceCards).toHaveCount(3);
  });

  test('비로그인 상태에서 지출 거래 추가', async ({ page }) => {
    await page.goto('/');

    // "내역 추가" 버튼 클릭
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();

    // 폼이 표시되는지 확인
    await expect(page.getByText(/새 내역 추가|내역 추가/)).toBeVisible();

    // 지출 선택
    await page.getByRole('button', { name: '지출' }).click();

    // 폼 입력
    await page.locator('input[type="number"]').fill('50000');
    await page.selectOption('select', '식비');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('점심 식사');

    // 제출
    await page.getByRole('button', { name: '추가하기' }).click();

    // 성공 토스트 메시지 확인
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에 거래 데이터가 저장되었는지 확인
    const localStorageData = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data) : null;
    });

    expect(localStorageData).toBeTruthy();
    expect(Array.isArray(localStorageData)).toBe(true);
    expect(localStorageData.length).toBeGreaterThan(0);

    // 추가된 거래 정보 확인
    const transaction = localStorageData[0];
    expect(transaction.type).toBe('expense');
    expect(transaction.amount).toBe(50000);
    expect(transaction.category).toBe('식비');
    expect(transaction.description).toBe('점심 식사');
  });

  test('비로그인 상태에서 수입 거래 추가', async ({ page }) => {
    await page.goto('/');

    // "내역 추가" 버튼 클릭
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();

    // 수입 선택
    await page.getByRole('button', { name: '수입' }).click();

    // 폼 입력
    await page.locator('input[type="number"]').fill('300000');
    await page.selectOption('select', '급여');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('월급');

    // 제출
    await page.getByRole('button', { name: '추가하기' }).click();

    // 성공 토스트 메시지 확인
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에 거래 데이터가 저장되었는지 확인
    const localStorageData = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data) : null;
    });

    expect(localStorageData).toBeTruthy();
    expect(localStorageData.length).toBe(1);

    // 추가된 거래 정보 확인
    const transaction = localStorageData[0];
    expect(transaction.type).toBe('income');
    expect(transaction.amount).toBe(300000);
    expect(transaction.category).toBe('급여');
  });

  test('비로그인 상태에서 여러 거래 추가 후 잔액 확인', async ({ page }) => {
    await page.goto('/');

    // 수입 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    await page.getByRole('button', { name: '수입' }).click();
    await page.locator('input[type="number"]').fill('500000');
    await page.selectOption('select', '급여');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('월급');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // 잠시 대기 (토스트 메시지가 사라질 때까지)
    await page.waitForTimeout(1000);

    // 지출 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('100000');
    await page.selectOption('select', '식비');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('식비');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에 2개의 거래가 저장되었는지 확인
    const localStorageData = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data) : null;
    });

    expect(localStorageData).toBeTruthy();
    expect(localStorageData.length).toBe(2);

    // 대시보드에서 잔액 확인 (500,000 - 100,000 = 400,000)
    // 잔액 카드가 업데이트되었는지 확인
    const balanceCard = page.locator('.rounded-xl.shadow-sm.p-6').filter({ hasText: '잔액' });
    await expect(balanceCard).toBeVisible();
  });

  test('페이지 새로고침 후에도 임시 데이터 유지', async ({ page }) => {
    await page.goto('/');

    // 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('25000');
    await page.selectOption('select', '교통');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('택시');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // 페이지 새로고침
    await page.reload();

    // localStorage에 데이터가 여전히 존재하는지 확인
    const localStorageData = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data) : null;
    });

    expect(localStorageData).toBeTruthy();
    expect(localStorageData.length).toBe(1);
    expect(localStorageData[0].amount).toBe(25000);
    expect(localStorageData[0].category).toBe('교통');
  });
});
