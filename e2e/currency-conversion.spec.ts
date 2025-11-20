import { test, expect } from '@playwright/test';

/**
 * 통화 변경 및 환율 적용 테스트
 *
 * 사용자가 다양한 통화로 거래를 추가하고,
 * 환율이 올바르게 적용되어 KRW로 환산되는지 확인합니다.
 */
test.describe('Currency Conversion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('통화 선택기가 표시되고 3개 통화 옵션 확인', async ({ page }) => {
    await page.goto('/');

    // 통화 선택기 찾기
    const currencySelector = page.locator('select').filter({ hasText: /KRW|USD|JPY/ });
    await expect(currencySelector).toBeVisible();

    // 3개의 통화 옵션 확인 (KRW, USD, JPY)
    const options = await currencySelector.locator('option').allTextContents();

    // KRW, USD, JPY가 모두 포함되어 있는지 확인
    const hasKRW = options.some(opt => opt.includes('KRW') || opt.includes('원'));
    const hasUSD = options.some(opt => opt.includes('USD') || opt.includes('달러'));
    const hasJPY = options.some(opt => opt.includes('JPY') || opt.includes('엔'));

    expect(hasKRW).toBe(true);
    expect(hasUSD).toBe(true);
    expect(hasJPY).toBe(true);
  });

  test('기본 통화는 KRW로 설정됨', async ({ page }) => {
    await page.goto('/');

    // 대시보드의 통화 선택기 확인
    const currencySelector = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).first();
    const selectedValue = await currencySelector.inputValue();

    expect(selectedValue).toBe('KRW');
  });

  test('KRW 통화로 거래 추가', async ({ page }) => {
    await page.goto('/');

    // 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();

    // 폼에서 통화 선택기 찾기
    const formCurrencySelector = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).last();
    await formCurrencySelector.selectOption('KRW');

    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('50000');
    await page.selectOption('select', '식비');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('한식당');
    await page.getByRole('button', { name: '추가하기' }).click();

    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에서 거래 확인
    const transaction = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data)[0] : null;
    });

    expect(transaction).toBeTruthy();
    expect(transaction.currency).toBe('KRW');
    expect(transaction.amount).toBe(50000);
    expect(transaction.amountInKRW).toBe(50000); // KRW -> KRW는 1:1
  });

  test('USD 통화로 거래 추가 및 환율 적용 확인', async ({ page }) => {
    await page.goto('/');

    // 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();

    // USD 선택
    const formCurrencySelector = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).last();
    await formCurrencySelector.selectOption('USD');

    // 금액 입력 필드의 심볼이 변경되었는지 확인
    await expect(page.getByText(/\$/)).toBeVisible();

    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('100');
    await page.selectOption('select', '쇼핑');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('온라인 쇼핑');
    await page.getByRole('button', { name: '추가하기' }).click();

    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에서 거래 확인
    const transaction = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data)[0] : null;
    });

    expect(transaction).toBeTruthy();
    expect(transaction.currency).toBe('USD');
    expect(transaction.amount).toBe(100);

    // amountInKRW는 환율이 적용되어야 함 (100 USD는 약 130,000 KRW 이상)
    expect(transaction.amountInKRW).toBeGreaterThan(100000);
    expect(transaction.amountInKRW).toBeLessThan(200000); // 합리적인 범위 내
  });

  test('JPY 통화로 거래 추가 및 환율 적용 확인', async ({ page }) => {
    await page.goto('/');

    // 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();

    // JPY 선택
    const formCurrencySelector = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).last();
    await formCurrencySelector.selectOption('JPY');

    // 금액 입력 필드의 심볼이 변경되었는지 확인
    await expect(page.getByText(/¥/)).toBeVisible();

    await page.getByRole('button', { name: '수입' }).click();
    await page.locator('input[type="number"]').fill('10000');
    await page.selectOption('select', '급여');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('알바비');
    await page.getByRole('button', { name: '추가하기' }).click();

    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에서 거래 확인
    const transaction = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data)[0] : null;
    });

    expect(transaction).toBeTruthy();
    expect(transaction.currency).toBe('JPY');
    expect(transaction.amount).toBe(10000);

    // amountInKRW는 환율이 적용되어야 함 (10,000 JPY는 약 80,000-100,000 KRW)
    expect(transaction.amountInKRW).toBeGreaterThan(50000);
    expect(transaction.amountInKRW).toBeLessThan(150000);
  });

  test('다양한 통화로 여러 거래 추가 후 총합 계산 확인', async ({ page }) => {
    await page.goto('/');

    // KRW 수입 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    const formCurrencySelector1 = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).last();
    await formCurrencySelector1.selectOption('KRW');
    await page.getByRole('button', { name: '수입' }).click();
    await page.locator('input[type="number"]').fill('500000');
    await page.selectOption('select', '급여');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('월급 KRW');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // USD 지출 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    const formCurrencySelector2 = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).last();
    await formCurrencySelector2.selectOption('USD');
    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('50');
    await page.selectOption('select', '식비');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('레스토랑 USD');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // JPY 지출 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    const formCurrencySelector3 = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).last();
    await formCurrencySelector3.selectOption('JPY');
    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('5000');
    await page.selectOption('select', '교통');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('전철 JPY');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에 3개의 거래가 저장되었는지 확인
    const transactions = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data) : [];
    });

    expect(transactions.length).toBe(3);

    // 각 거래가 올바른 통화로 저장되었는지 확인
    const currencies = transactions.map((t: any) => t.currency);
    expect(currencies).toContain('KRW');
    expect(currencies).toContain('USD');
    expect(currencies).toContain('JPY');

    // 모든 거래에 amountInKRW가 있는지 확인
    transactions.forEach((t: any) => {
      expect(t.amountInKRW).toBeDefined();
      expect(typeof t.amountInKRW).toBe('number');
      expect(t.amountInKRW).toBeGreaterThan(0);
    });

    // 대시보드의 잔액 카드가 표시되는지 확인
    const balanceCard = page.locator('.rounded-xl.shadow-sm.p-6').filter({ hasText: '잔액' });
    await expect(balanceCard).toBeVisible();
  });

  test('대시보드 통화 선택기 변경 시 표시 통화 업데이트', async ({ page }) => {
    await page.goto('/');

    // KRW 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    const formCurrencySelector = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).last();
    await formCurrencySelector.selectOption('KRW');
    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('100000');
    await page.selectOption('select', '식비');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('식사');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // 대시보드 통화 선택기 변경
    const dashboardCurrencySelector = page.locator('select').filter({ hasText: /KRW|USD|JPY/ }).first();

    // USD로 변경
    await dashboardCurrencySelector.selectOption('USD');
    await page.waitForTimeout(500);

    // 화면에 $ 심볼이 표시되는지 확인
    await expect(page.getByText(/\$/)).toBeVisible();

    // JPY로 변경
    await dashboardCurrencySelector.selectOption('JPY');
    await page.waitForTimeout(500);

    // 화면에 ¥ 심볼이 표시되는지 확인
    await expect(page.getByText(/¥/)).toBeVisible();

    // 다시 KRW로 변경
    await dashboardCurrencySelector.selectOption('KRW');
    await page.waitForTimeout(500);

    // 화면에 ₩ 심볼이 표시되는지 확인
    await expect(page.getByText(/₩/)).toBeVisible();
  });
});
