import type { CategoryBudget } from '../types/database';

/**
 * 비로그인 사용자를 위한 월별 카테고리 예산 localStorage 관리 유틸리티
 */

/**
 * 특정 년월의 카테고리 예산 localStorage 키 생성
 */
export const getCategoryBudgetKey = (year: number, month: number): string => {
  return `temp_category_budgets_${year}_${month}`;
};

/**
 * 현재 년월의 카테고리 예산 localStorage 키 생성
 */
export const getCurrentCategoryBudgetKey = (): string => {
  const now = new Date();
  return getCategoryBudgetKey(now.getFullYear(), now.getMonth() + 1);
};

/**
 * 특정 년월의 카테고리 예산 조회
 */
export const loadCategoryBudgetsFromLocal = (
  year: number,
  month: number
): CategoryBudget[] => {
  try {
    const key = getCategoryBudgetKey(year, month);
    const stored = localStorage.getItem(key);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as CategoryBudget[];
    return parsed;
  } catch (error) {
    console.error('Failed to load category budgets from localStorage:', error);
    return [];
  }
};

/**
 * 현재 월의 카테고리 예산 조회
 */
export const loadCurrentMonthBudgetsFromLocal = (): CategoryBudget[] => {
  const now = new Date();
  return loadCategoryBudgetsFromLocal(now.getFullYear(), now.getMonth() + 1);
};

/**
 * 특정 년월의 카테고리 예산 저장
 */
export const saveCategoryBudgetsToLocal = (
  year: number,
  month: number,
  budgets: CategoryBudget[]
): void => {
  try {
    const key = getCategoryBudgetKey(year, month);
    localStorage.setItem(key, JSON.stringify(budgets));
    console.log(`💾 Saved ${budgets.length} budgets to localStorage: ${key}`);
  } catch (error) {
    console.error('Failed to save category budgets to localStorage:', error);
  }
};

/**
 * 현재 월의 카테고리 예산 저장
 */
export const saveCurrentMonthBudgetsToLocal = (budgets: CategoryBudget[]): void => {
  const now = new Date();
  saveCategoryBudgetsToLocal(now.getFullYear(), now.getMonth() + 1, budgets);
};

/**
 * 특정 년월의 카테고리 예산 삭제
 */
export const clearCategoryBudgetsFromLocal = (year: number, month: number): void => {
  try {
    const key = getCategoryBudgetKey(year, month);
    localStorage.removeItem(key);
    console.log(`🗑️ Cleared category budgets from localStorage: ${key}`);
  } catch (error) {
    console.error('Failed to clear category budgets from localStorage:', error);
  }
};

/**
 * 모든 카테고리 예산 localStorage 키 조회 (히스토리 기능용)
 */
export const getAllCategoryBudgetKeys = (): { year: number; month: number }[] => {
  const keys: { year: number; month: number }[] = [];
  const pattern = /^temp_category_budgets_(\d{4})_(\d{1,2})$/;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const match = key.match(pattern);
    if (match && match[1] && match[2]) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      keys.push({ year, month });
    }
  }

  // 년월 기준 내림차순 정렬
  keys.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return keys;
};

/**
 * 전월 예산을 현재 월로 복사 (비로그인 사용자용)
 */
export const copyPreviousMonthBudgetsLocal = (
  fromYear: number,
  fromMonth: number,
  toYear: number,
  toMonth: number
): CategoryBudget[] => {
  try {
    // 전월 예산 조회
    const previousBudgets = loadCategoryBudgetsFromLocal(fromYear, fromMonth);
    if (previousBudgets.length === 0) {
      console.log('⚠️ No previous month budgets to copy');
      return [];
    }

    // 새로운 월로 복사 (id는 새로 생성)
    const newBudgets: CategoryBudget[] = previousBudgets.map((budget) => ({
      ...budget,
      id: `local-${Date.now()}-${Math.random()}`,
      year: toYear,
      month: toMonth,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // 목표 월에 저장
    saveCategoryBudgetsToLocal(toYear, toMonth, newBudgets);

    console.log(`✅ Copied ${newBudgets.length} budgets from ${fromYear}-${fromMonth} to ${toYear}-${toMonth}`);
    return newBudgets;
  } catch (error) {
    console.error('Failed to copy previous month budgets:', error);
    return [];
  }
};

/**
 * 로그아웃 시 모든 카테고리 예산 localStorage 삭제
 */
export const clearAllCategoryBudgetsFromLocal = (): void => {
  const keys = getAllCategoryBudgetKeys();
  keys.forEach(({ year, month }) => {
    clearCategoryBudgetsFromLocal(year, month);
  });

  // 레거시 키도 삭제 (이전 버전 호환성)
  localStorage.removeItem('temp_category_budgets');

  console.log(`🗑️ Cleared all category budgets from localStorage (${keys.length} months)`);
};
