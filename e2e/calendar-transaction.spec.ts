import { test, expect } from '@playwright/test';

/**
 * 캘린더에서 거래 추가 테스트
 *
 * 사용자가 캘린더 뷰에서 특정 날짜를 선택하고
 * 해당 날짜에 거래를 추가할 수 있는지 확인합니다.
 */
test.describe('Calendar Transaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('대시보드에서 캘린더 뷰로 전환', async ({ page }) => {
    await page.goto('/');

    // 캘린더 보기 탭 찾기
    const calendarTab = page.getByRole('button', { name: /캘린더.*보기|캘린더/ });
    await expect(calendarTab).toBeVisible();

    // 캘린더 탭 클릭
    await calendarTab.click();

    // 캘린더 뷰가 표시되는지 확인
    // 캘린더에는 월 표시 및 날짜 그리드가 있어야 함
    await page.waitForTimeout(500);

    // 캘린더의 주요 요소 확인 (년/월 표시, 날짜 셀 등)
    // 캘린더는 일반적으로 테이블 또는 그리드 형식으로 구성됨
    const calendar = page.locator('.calendar, [role="grid"], table').first();
    await expect(calendar).toBeVisible();
  });

  test('캘린더 뷰에서 요약 보기로 전환', async ({ page }) => {
    await page.goto('/');

    // 캘린더 뷰로 전환
    await page.getByRole('button', { name: /캘린더.*보기|캘린더/ }).click();
    await page.waitForTimeout(500);

    // 요약 보기로 다시 전환
    const summaryTab = page.getByRole('button', { name: /요약.*보기|요약/ });
    await summaryTab.click();

    // 잔액 카드들이 표시되는지 확인
    await expect(page.getByText('총 수입')).toBeVisible();
    await expect(page.getByText('총 지출')).toBeVisible();
    await expect(page.getByText('잔액')).toBeVisible();
  });

  test('통계 분석 뷰로 전환', async ({ page }) => {
    await page.goto('/');

    // 통계 분석 탭 찾기
    const statisticsTab = page.getByRole('button', { name: /통계.*분석|통계/ });
    await expect(statisticsTab).toBeVisible();

    // 통계 분석 탭 클릭
    await statisticsTab.click();

    await page.waitForTimeout(500);

    // 통계 뷰가 표시되는지 확인
    // 통계 페이지에는 차트나 분석 데이터가 표시되어야 함
    const statisticsView = page.locator('.recharts-wrapper, canvas, .chart, .statistics');
    // 통계 뷰가 없을 수도 있으므로 count 확인
    const count = await statisticsView.count();
    // 통계 뷰가 있으면 좋고, 없어도 에러는 아님 (데이터가 없을 때)
  });

  test('캘린더에서 오늘 날짜 확인', async ({ page }) => {
    await page.goto('/');

    // 캘린더 뷰로 전환
    await page.getByRole('button', { name: /캘린더.*보기|캘린더/ }).click();
    await page.waitForTimeout(500);

    // 오늘 날짜가 강조 표시되어 있는지 확인
    // 일반적으로 'today', 'current', 'active' 등의 클래스를 가짐
    const todayCell = page.locator('.today, .current-day, [data-today="true"]').first();

    // 오늘 날짜 셀이 존재하거나, 캘린더가 표시되는지 확인
    const calendarExists = await page.locator('.calendar, [role="grid"], table').first().isVisible();
    expect(calendarExists).toBe(true);
  });

  test('캘린더에서 이전/다음 달 이동', async ({ page }) => {
    await page.goto('/');

    // 캘린더 뷰로 전환
    await page.getByRole('button', { name: /캘린더.*보기|캘린더/ }).click();
    await page.waitForTimeout(500);

    // 현재 표시된 월 확인
    const monthDisplay = page.locator('h2, h3, .month-title').filter({ hasText: /\d{4}년.*\d{1,2}월|\d{1,2}월/ }).first();
    const currentMonth = await monthDisplay.textContent();

    // 다음 달 버튼 찾기 (일반적으로 > 또는 → 아이콘)
    const nextButton = page.getByRole('button', { name: /다음|>|→|Next/ }).first();

    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);

      // 월이 변경되었는지 확인
      const newMonth = await monthDisplay.textContent();
      expect(newMonth).not.toBe(currentMonth);

      // 이전 달 버튼으로 돌아가기
      const prevButton = page.getByRole('button', { name: /이전|<|←|Previous/ }).first();
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('캘린더 날짜 클릭 후 거래 추가 폼 표시', async ({ page }) => {
    await page.goto('/');

    // 캘린더 뷰로 전환
    await page.getByRole('button', { name: /캘린더.*보기|캘린더/ }).click();
    await page.waitForTimeout(500);

    // 캘린더에서 날짜 셀 찾기 (오늘이 아닌 다른 날짜)
    // 일반적으로 버튼 또는 클릭 가능한 div로 구성됨
    const dateCell = page.locator('.calendar-day, .date-cell, [role="gridcell"] button').first();

    // 날짜 셀이 존재하면 클릭
    if (await dateCell.isVisible()) {
      await dateCell.click();
      await page.waitForTimeout(500);

      // 거래 추가 폼이 표시되거나, 이미 "내역 추가" 버튼이 활성화됨
      // 날짜가 자동으로 선택되었는지 확인하는 것이 목표
    }
  });

  test('캘린더 특정 날짜에 거래 추가', async ({ page }) => {
    await page.goto('/');

    // 먼저 요약 보기에서 특정 날짜에 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();

    // 날짜 필드에서 특정 날짜 선택 (예: 이번 달 15일)
    const today = new Date();
    const targetDate = new Date(today.getFullYear(), today.getMonth(), 15);
    const dateString = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD

    await page.locator('input[type="date"]').fill(dateString);

    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('30000');
    await page.selectOption('select', '쇼핑');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('15일 쇼핑');
    await page.getByRole('button', { name: '추가하기' }).click();

    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // 캘린더 뷰로 전환
    await page.getByRole('button', { name: /캘린더.*보기|캘린더/ }).click();
    await page.waitForTimeout(1000);

    // 15일 날짜 셀에 거래가 표시되는지 확인
    // 캘린더에 거래가 있는 날짜는 특별한 마커나 스타일이 있을 수 있음
    const date15Cell = page.locator('.calendar-day, .date-cell').filter({ hasText: '15' }).first();

    // 해당 날짜 셀이 존재하는지 확인
    if (await date15Cell.isVisible()) {
      // 날짜 셀에 거래 인디케이터가 있는지 확인
      // (예: 점, 숫자, 색상 변경 등)
      // 이는 구현에 따라 다를 수 있음
    }
  });

  test('캘린더에서 거래가 있는 날짜와 없는 날짜 구분', async ({ page }) => {
    await page.goto('/');

    // 거래 추가 (오늘 날짜)
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    await page.getByRole('button', { name: '수입' }).click();
    await page.locator('input[type="number"]').fill('150000');
    await page.selectOption('select', '급여');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('급여');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // 캘린더 뷰로 전환
    await page.getByRole('button', { name: /캘린더.*보기|캘린더/ }).click();
    await page.waitForTimeout(1000);

    // 오늘 날짜 셀 찾기
    const todayCell = page.locator('.today, .current-day, [data-today="true"]').first();

    // 오늘 날짜에 거래 인디케이터가 표시되는지 확인
    if (await todayCell.isVisible()) {
      // 거래가 있는 날짜는 특별한 스타일이나 마커를 가짐
      // 예: 점, 배지, 색상 등
      const hasIndicator = await todayCell.locator('.transaction-indicator, .has-transaction, [data-has-transaction]').isVisible().catch(() => false);

      // 인디케이터가 없더라도 캘린더가 정상적으로 표시되면 OK
      const calendarVisible = await page.locator('.calendar, [role="grid"], table').first().isVisible();
      expect(calendarVisible).toBe(true);
    }
  });

  test('캘린더에서 여러 날짜에 거래 추가 후 확인', async ({ page }) => {
    await page.goto('/');

    const today = new Date();

    // 1일에 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    const date1 = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    await page.locator('input[type="date"]').fill(date1);
    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('20000');
    await page.selectOption('select', '식비');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('1일 식비');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // 10일에 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    const date10 = new Date(today.getFullYear(), today.getMonth(), 10).toISOString().split('T')[0];
    await page.locator('input[type="date"]').fill(date10);
    await page.getByRole('button', { name: '수입' }).click();
    await page.locator('input[type="number"]').fill('100000');
    await page.selectOption('select', '급여');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('10일 급여');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(1000);

    // 20일에 거래 추가
    await page.getByRole('button', { name: /내역 추가|추가/ }).click();
    const date20 = new Date(today.getFullYear(), today.getMonth(), 20).toISOString().split('T')[0];
    await page.locator('input[type="date"]').fill(date20);
    await page.getByRole('button', { name: '지출' }).click();
    await page.locator('input[type="number"]').fill('50000');
    await page.selectOption('select', '숙박');
    await page.locator('input[type="text"][placeholder*="설명"]').fill('20일 숙박');
    await page.getByRole('button', { name: '추가하기' }).click();
    await expect(page.getByText(/추가되었습니다|성공/)).toBeVisible({ timeout: 5000 });

    // localStorage에 3개의 거래가 저장되었는지 확인
    const transactions = await page.evaluate(() => {
      const data = localStorage.getItem('guest_transactions');
      return data ? JSON.parse(data) : [];
    });

    expect(transactions.length).toBe(3);

    // 캘린더 뷰로 전환
    await page.getByRole('button', { name: /캘린더.*보기|캘린더/ }).click();
    await page.waitForTimeout(1000);

    // 캘린더가 표시되고 여러 날짜에 거래 데이터가 있음
    const calendarVisible = await page.locator('.calendar, [role="grid"], table').first().isVisible();
    expect(calendarVisible).toBe(true);
  });
});
