/**
 * 통계 계산 유틸리티 함수
 */

import type { Transaction } from '../types/transaction';
import type {
  MonthlyTrendData,
  CategoryExpenseData,
  WeekdayExpenseData,
  StatisticsSummary,
  StatisticsData,
  StatisticsPeriod,
} from '../types/statistics';
import { CHART_COLORS } from '../types/statistics';
import { parseTransactionDate } from './calendar';
import { getKSTDate } from './dateUtils';

/**
 * 월 문자열을 "N월" 형식으로 변환
 */
const formatMonthLabel = (month: string): string => {
  const [, monthNum] = month.split('-');
  return `${parseInt(monthNum || '0')}월`;
};

/**
 * 요일 번호를 한글 요일로 변환 (0=일요일)
 */
const getKoreanWeekday = (dayIndex: number): string => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return weekdays[dayIndex] || '일';
};

/**
 * 요일 번호를 영문 요일로 변환 (0=일요일)
 */
const getEnglishWeekday = (dayIndex: number): string => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays[dayIndex] || 'Sun';
};

/**
 * 기간에 따른 필터링된 거래 내역 반환
 * KST 기준 오늘부터 지정된 기간 이전까지의 거래를 반환
 */
export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  period: StatisticsPeriod
): Transaction[] => {
  if (period === 'all') return transactions;

  // KST 기준 오늘 날짜 가져오기
  const kstNow = getKSTDate();

  // KST 기준 오늘 날짜를 로컬 타임존 Date로 변환 (parseTransactionDate와 동일한 기준)
  const today = new Date(
    kstNow.getUTCFullYear(),
    kstNow.getUTCMonth(),
    kstNow.getUTCDate()
  );

  const cutoffDate = new Date(today);

  switch (period) {
    case '1month':
      cutoffDate.setMonth(today.getMonth() - 1);
      break;
    case '3months':
      cutoffDate.setMonth(today.getMonth() - 3);
      break;
    case '6months':
      cutoffDate.setMonth(today.getMonth() - 6);
      break;
    case '1year':
      cutoffDate.setFullYear(today.getFullYear() - 1);
      break;
  }

  return transactions.filter(transaction => {
    const transactionDate = parseTransactionDate(transaction.date);
    return transactionDate >= cutoffDate;
  });
};

/**
 * 월별 트렌드 데이터 생성
 */
export const generateMonthlyTrend = (
  transactions: Transaction[],
  period: StatisticsPeriod = '6months'
): MonthlyTrendData[] => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);

  // 월별로 그룹화
  const monthlyMap = new Map<string, { income: number; expense: number }>();

  filteredTransactions.forEach(transaction => {
    const date = parseTransactionDate(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { income: 0, expense: 0 });
    }

    const monthData = monthlyMap.get(monthKey)!;
    if (transaction.type === 'income') {
      monthData.income += transaction.amountInKRW;
    } else {
      monthData.expense += transaction.amountInKRW;
    }
  });

  // 배열로 변환 및 정렬
  const monthlyTrend: MonthlyTrendData[] = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      monthLabel: formatMonthLabel(month),
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return monthlyTrend;
};

/**
 * 카테고리별 지출 분포 데이터 생성
 */
export const generateCategoryExpense = (
  transactions: Transaction[],
  period: StatisticsPeriod = 'all'
): CategoryExpenseData[] => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);

  // 지출만 필터링
  const expenses = filteredTransactions.filter(t => t.type === 'expense');

  // 카테고리별 합계
  const categoryMap = new Map<string, number>();
  let totalExpense = 0;

  expenses.forEach(transaction => {
    const category = transaction.category;
    const currentAmount = categoryMap.get(category) || 0;
    categoryMap.set(category, currentAmount + transaction.amountInKRW);
    totalExpense += transaction.amountInKRW;
  });

  // 배열로 변환 및 정렬 (금액 내림차순)
  const categoryExpense: CategoryExpenseData[] = Array.from(categoryMap.entries())
    .map(([category, amount], index) => ({
      category,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
      color: CHART_COLORS.categories[index % CHART_COLORS.categories.length] || '#9ca3af',
    }))
    .sort((a, b) => b.amount - a.amount);

  return categoryExpense;
};

/**
 * 요일별 지출 패턴 데이터 생성
 */
export const generateWeekdayExpense = (
  transactions: Transaction[],
  period: StatisticsPeriod = 'all'
): WeekdayExpenseData[] => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);

  // 요일별 데이터 초기화 (0=일요일, 6=토요일)
  const weekdayMap = new Map<number, { total: number; count: number }>();
  for (let i = 0; i < 7; i++) {
    weekdayMap.set(i, { total: 0, count: 0 });
  }

  // 지출만 필터링하여 요일별 집계
  const expenses = filteredTransactions.filter(t => t.type === 'expense');

  expenses.forEach(transaction => {
    const date = parseTransactionDate(transaction.date);
    const weekday = date.getDay();
    const data = weekdayMap.get(weekday)!;
    data.total += transaction.amountInKRW;
    data.count += 1;
  });

  // 배열로 변환
  const weekdayExpense: WeekdayExpenseData[] = Array.from(weekdayMap.entries())
    .map(([dayIndex, data]) => ({
      weekday: getKoreanWeekday(dayIndex),
      weekdayEn: getEnglishWeekday(dayIndex),
      totalExpense: data.total,
      averageExpense: data.count > 0 ? data.total / data.count : 0,
      transactionCount: data.count,
    }));

  return weekdayExpense;
};

/**
 * 통계 요약 정보 생성
 */
export const generateStatisticsSummary = (
  transactions: Transaction[],
  period: StatisticsPeriod = 'all'
): StatisticsSummary => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amountInKRW, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amountInKRW, 0);

  const totalBalance = totalIncome - totalExpense;

  // 날짜 범위 계산
  const dates = filteredTransactions.map(t => parseTransactionDate(t.date));
  const dayCount = dates.length > 0
    ? Math.max(
        1,
        Math.ceil(
          (Math.max(...dates.map(d => d.getTime())) -
            Math.min(...dates.map(d => d.getTime()))) /
            (1000 * 60 * 60 * 24)
        ) + 1
      )
    : 1;

  const averageDailyIncome = totalIncome / dayCount;
  const averageDailyExpense = totalExpense / dayCount;

  // 가장 많이 지출한 카테고리
  const categoryExpense = generateCategoryExpense(transactions, period);
  const mostExpensiveCategory = categoryExpense[0]?.category || '없음';
  const mostExpensiveCategoryAmount = categoryExpense[0]?.amount || 0;

  // 가장 많이 지출한 날
  const dailyExpenseMap = new Map<string, number>();
  filteredTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const dateStr = t.date;
      const current = dailyExpenseMap.get(dateStr) || 0;
      dailyExpenseMap.set(dateStr, current + t.amountInKRW);
    });

  let highestExpenseDay = '없음';
  let highestExpenseAmount = 0;
  dailyExpenseMap.forEach((amount, date) => {
    if (amount > highestExpenseAmount) {
      highestExpenseAmount = amount;
      highestExpenseDay = date;
    }
  });

  return {
    totalIncome,
    totalExpense,
    totalBalance,
    averageDailyIncome,
    averageDailyExpense,
    transactionCount: filteredTransactions.length,
    mostExpensiveCategory,
    mostExpensiveCategoryAmount,
    highestExpenseDay,
    highestExpenseAmount,
  };
};

/**
 * 전체 통계 데이터 생성
 */
export const generateStatistics = (
  transactions: Transaction[],
  period: StatisticsPeriod = '6months'
): StatisticsData => {
  return {
    summary: generateStatisticsSummary(transactions, period),
    monthlyTrend: generateMonthlyTrend(transactions, period),
    categoryExpense: generateCategoryExpense(transactions, period),
    weekdayExpense: generateWeekdayExpense(transactions, period),
  };
};
