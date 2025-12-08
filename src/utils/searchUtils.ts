import type { Transaction } from '../types/transaction';
import type { TransactionSearchFilter, SearchResultStats } from '../types/search';

/**
 * 거래 내역을 검색 필터에 따라 필터링합니다.
 *
 * @param transactions - 전체 거래 내역 배열
 * @param filter - 검색 필터 조건
 * @returns 필터링된 거래 내역 배열
 */
export const filterTransactions = (
  transactions: Transaction[],
  filter: TransactionSearchFilter
): Transaction[] => {
  return transactions.filter((transaction) => {
    // 1. 검색어 필터 (설명 또는 카테고리에서 검색)
    if (filter.searchText && filter.searchText.trim() !== '') {
      const searchLower = filter.searchText.toLowerCase().trim();
      const descriptionMatch = transaction.description.toLowerCase().includes(searchLower);
      const categoryMatch = transaction.category.toLowerCase().includes(searchLower);

      if (!descriptionMatch && !categoryMatch) {
        return false;
      }
    }

    // 2. 거래 타입 필터
    if (filter.type && filter.type !== 'all') {
      if (transaction.type !== filter.type) {
        return false;
      }
    }

    // 3. 카테고리 필터 (다중 선택)
    if (filter.categories && filter.categories.length > 0) {
      if (!filter.categories.includes(transaction.category)) {
        return false;
      }
    }

    // 4. 시작 날짜 필터
    if (filter.startDate && filter.startDate.trim() !== '') {
      const transactionDate = parseDateString(transaction.date);
      const startDate = new Date(filter.startDate);

      if (transactionDate < startDate) {
        return false;
      }
    }

    // 5. 종료 날짜 필터
    if (filter.endDate && filter.endDate.trim() !== '') {
      const transactionDate = parseDateString(transaction.date);
      const endDate = new Date(filter.endDate);
      endDate.setHours(23, 59, 59, 999); // 종료일 당일 포함

      if (transactionDate > endDate) {
        return false;
      }
    }

    // 6. 최소 금액 필터 (KRW 기준)
    if (filter.minAmount !== undefined && filter.minAmount > 0) {
      if (transaction.amountInKRW < filter.minAmount) {
        return false;
      }
    }

    // 7. 최대 금액 필터 (KRW 기준)
    if (filter.maxAmount !== undefined && filter.maxAmount > 0) {
      if (transaction.amountInKRW > filter.maxAmount) {
        return false;
      }
    }

    return true;
  });
};

/**
 * 날짜 문자열을 Date 객체로 변환합니다.
 * 한국어 형식과 ISO 형식 모두 지원합니다.
 *
 * @param dateString - 변환할 날짜 문자열
 * @returns Date 객체
 */
const parseDateString = (dateString: string): Date => {
  // ISO 형식 (YYYY-MM-DD)인 경우
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(dateString);
  }

  // 한국어 형식 (YYYY년 MM월 DD일)인 경우
  const match = dateString.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (match && match[1] && match[2] && match[3]) {
    const year = match[1];
    const month = match[2];
    const day = match[3];
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  // 파싱 실패 시 현재 날짜 반환
  return new Date();
};

/**
 * 검색 결과 통계를 계산합니다.
 *
 * @param transactions - 필터링된 거래 내역 배열
 * @returns 검색 결과 통계
 */
export const calculateSearchStats = (
  transactions: Transaction[]
): SearchResultStats => {
  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce(
    (sum, t) => sum + t.amountInKRW,
    0
  );
  const totalExpense = expenseTransactions.reduce(
    (sum, t) => sum + t.amountInKRW,
    0
  );

  return {
    totalCount: transactions.length,
    incomeCount: incomeTransactions.length,
    expenseCount: expenseTransactions.length,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  };
};

/**
 * 검색 필터가 활성화되어 있는지 확인합니다.
 *
 * @param filter - 검색 필터 조건
 * @returns 하나 이상의 필터가 활성화되어 있으면 true
 */
export const isFilterActive = (filter: TransactionSearchFilter): boolean => {
  return !!(
    (filter.searchText && filter.searchText.trim() !== '') ||
    (filter.type && filter.type !== 'all') ||
    (filter.categories && filter.categories.length > 0) ||
    (filter.startDate && filter.startDate.trim() !== '') ||
    (filter.endDate && filter.endDate.trim() !== '') ||
    (filter.minAmount !== undefined && filter.minAmount > 0) ||
    (filter.maxAmount !== undefined && filter.maxAmount > 0)
  );
};

/**
 * 검색어를 하이라이트 표시합니다.
 *
 * @param text - 원본 텍스트
 * @param searchText - 검색어 (선택적)
 * @returns 하이라이트가 적용된 HTML 문자열
 */
export const highlightSearchText = (
  text: string,
  searchText?: string
): string => {
  if (!searchText || searchText.trim() === '') {
    return text;
  }

  const regex = new RegExp(`(${searchText})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
};
