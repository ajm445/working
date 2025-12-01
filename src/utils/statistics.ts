/**
 * 통계 계산 유틸리티 함수
 */

import type { Transaction } from '../types/transaction';
import type { RecurringExpense } from '../types/database';
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
  period: StatisticsPeriod,
  selectedYear?: number,
  selectedMonth?: number
): Transaction[] => {
  if (period === 'all') return transactions;

  // 월별 선택 모드
  if (period === 'monthly' && selectedYear !== undefined && selectedMonth !== undefined) {
    return transactions.filter(transaction => {
      const transactionDate = parseTransactionDate(transaction.date);
      return (
        transactionDate.getFullYear() === selectedYear &&
        transactionDate.getMonth() === selectedMonth - 1 // selectedMonth는 1-12
      );
    });
  }

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
 * 월별 트렌드 데이터 생성 (고정지출 포함)
 */
export const generateMonthlyTrend = (
  transactions: Transaction[],
  recurringExpenses: RecurringExpense[],
  period: StatisticsPeriod = '6months',
  selectedYear?: number,
  selectedMonth?: number
): MonthlyTrendData[] => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period, selectedYear, selectedMonth);

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

  // 고정지출을 각 월에 추가 - 생성일 이후이고 오늘 이전만
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  recurringExpenses
    .filter(expense => expense.is_active)
    .forEach(expense => {
      const dayOfMonth = expense.day_of_month;
      const createdDate = new Date(expense.created_at);
      createdDate.setHours(0, 0, 0, 0);

      monthlyMap.forEach((monthData, monthKey) => {
        // monthKey 형식: "2025-01"
        const [yearStr, monthStr] = monthKey.split('-');
        const year = parseInt(yearStr || '0');
        const month = parseInt(monthStr || '0') - 1; // 0-indexed

        // 해당 월의 고정지출 발생일
        const expenseDate = new Date(year, month, dayOfMonth);
        expenseDate.setHours(0, 0, 0, 0);

        // 고정지출 생성일 이후이고, 해당 월의 마지막 날보다 이전이며, 오늘 이하인 경우만 추가
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        if (expenseDate >= createdDate && expenseDate <= today && dayOfMonth <= lastDayOfMonth) {
          monthData.expense += expense.amount_in_krw;
        }
      });
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
 * 카테고리별 지출 분포 데이터 생성 (고정지출 포함)
 */
export const generateCategoryExpense = (
  transactions: Transaction[],
  recurringExpenses: RecurringExpense[],
  period: StatisticsPeriod = 'all',
  selectedYear?: number,
  selectedMonth?: number
): CategoryExpenseData[] => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period, selectedYear, selectedMonth);

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

  // 고정지출을 카테고리별로 추가 - 기간 내 실제 발생 횟수만큼
  if (recurringExpenses.length > 0 && period !== 'all') {
    const kstNow = getKSTDate();
    const today = new Date(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate());

    let startDate: Date;
    let endDate: Date = today;

    if (period === 'monthly' && selectedYear !== undefined && selectedMonth !== undefined) {
      startDate = new Date(selectedYear, selectedMonth - 1, 1);
      endDate = new Date(selectedYear, selectedMonth, 0);
    } else {
      startDate = new Date(today);
      switch (period) {
        case '1month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(today.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(today.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }
    }

    const todayForComparison = new Date();
    todayForComparison.setHours(0, 0, 0, 0);

    recurringExpenses
      .filter(expense => expense.is_active)
      .forEach(expense => {
        const dayOfMonth = expense.day_of_month;

        // 고정지출 생성일 이후부터만 적용
        const createdDate = new Date(expense.created_at);
        createdDate.setHours(0, 0, 0, 0);
        const effectiveStartDate = createdDate > startDate ? createdDate : startDate;

        let currentDate = new Date(effectiveStartDate.getFullYear(), effectiveStartDate.getMonth(), dayOfMonth);
        currentDate.setHours(0, 0, 0, 0);

        if (currentDate < effectiveStartDate) {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // 오늘 이전까지만 카운트 (미래 고정지출은 제외)
        const effectiveEndDate = endDate < todayForComparison ? endDate : todayForComparison;

        let count = 0;
        while (currentDate <= effectiveEndDate) {
          count++;
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        const category = expense.category;
        const currentAmount = categoryMap.get(category) || 0;
        const addAmount = expense.amount_in_krw * count;
        categoryMap.set(category, currentAmount + addAmount);
        totalExpense += addAmount;
      });
  } else if (period === 'all' && recurringExpenses.length > 0) {
    const dates = filteredTransactions.map(t => parseTransactionDate(t.date));
    if (dates.length > 0) {
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

      const todayForComparison = new Date();
      todayForComparison.setHours(0, 0, 0, 0);

      recurringExpenses
        .filter(expense => expense.is_active)
        .forEach(expense => {
          const dayOfMonth = expense.day_of_month;

          // 고정지출 생성일 이후부터만 적용
          const createdDate = new Date(expense.created_at);
          createdDate.setHours(0, 0, 0, 0);
          const effectiveStartDate = createdDate > minDate ? createdDate : minDate;

          let currentDate = new Date(effectiveStartDate.getFullYear(), effectiveStartDate.getMonth(), dayOfMonth);
          currentDate.setHours(0, 0, 0, 0);

          if (currentDate < effectiveStartDate) {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }

          // 오늘 이전까지만 카운트 (미래 고정지출은 제외)
          const effectiveEndDate = maxDate < todayForComparison ? maxDate : todayForComparison;

          let count = 0;
          while (currentDate <= effectiveEndDate) {
            count++;
            currentDate.setMonth(currentDate.getMonth() + 1);
          }

          const category = expense.category;
          const currentAmount = categoryMap.get(category) || 0;
          const addAmount = expense.amount_in_krw * count;
          categoryMap.set(category, currentAmount + addAmount);
          totalExpense += addAmount;
        });
    }
  }

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
  period: StatisticsPeriod = 'all',
  selectedYear?: number,
  selectedMonth?: number
): WeekdayExpenseData[] => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period, selectedYear, selectedMonth);

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
 * 통계 요약 정보 생성 (고정지출 포함)
 */
export const generateStatisticsSummary = (
  transactions: Transaction[],
  recurringExpenses: RecurringExpense[],
  period: StatisticsPeriod = 'all',
  selectedYear?: number,
  selectedMonth?: number
): StatisticsSummary => {
  const filteredTransactions = filterTransactionsByPeriod(transactions, period, selectedYear, selectedMonth);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amountInKRW, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amountInKRW, 0);

  // 고정지출 추가 - 기간 내에 실제로 발생한 횟수만큼 계산
  let recurringExpenseAmount = 0;
  if (recurringExpenses.length > 0 && period !== 'all') {
    const kstNow = getKSTDate();
    const today = new Date(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate());

    let startDate: Date;
    let endDate: Date = today;

    if (period === 'monthly' && selectedYear !== undefined && selectedMonth !== undefined) {
      // 월별 모드: 선택한 년/월의 1일부터 마지막 날까지
      startDate = new Date(selectedYear, selectedMonth - 1, 1);
      endDate = new Date(selectedYear, selectedMonth, 0); // 다음 달 0일 = 이번 달 마지막 날
    } else {
      // 다른 기간: 오늘부터 역산
      startDate = new Date(today);
      switch (period) {
        case '1month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(today.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(today.getMonth() - 6);
          break;
        case '1year':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }
    }

    // 각 고정지출에 대해 기간 내 발생 횟수 계산
    const todayForComparison = new Date();
    todayForComparison.setHours(0, 0, 0, 0);

    recurringExpenses
      .filter(expense => expense.is_active)
      .forEach(expense => {
        const dayOfMonth = expense.day_of_month;

        // 고정지출 생성일 이후부터만 적용
        const createdDate = new Date(expense.created_at);
        createdDate.setHours(0, 0, 0, 0);
        const effectiveStartDate = createdDate > startDate ? createdDate : startDate;

        let currentDate = new Date(effectiveStartDate.getFullYear(), effectiveStartDate.getMonth(), dayOfMonth);
        currentDate.setHours(0, 0, 0, 0);

        // 시작일보다 이전이면 다음 달로
        if (currentDate < effectiveStartDate) {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // 오늘 이전까지만 카운트 (미래 고정지출은 제외)
        const effectiveEndDate = endDate < todayForComparison ? endDate : todayForComparison;

        // 기간 내의 모든 발생일 카운트
        let count = 0;
        while (currentDate <= effectiveEndDate) {
          count++;
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        recurringExpenseAmount += expense.amount_in_krw * count;
      });
  } else if (period === 'all' && recurringExpenses.length > 0) {
    // 전체 모드: 필터링된 거래의 기간 내 발생 횟수 계산
    const dates = filteredTransactions.map(t => parseTransactionDate(t.date));
    if (dates.length > 0) {
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

      const todayForComparison = new Date();
      todayForComparison.setHours(0, 0, 0, 0);

      recurringExpenses
        .filter(expense => expense.is_active)
        .forEach(expense => {
          const dayOfMonth = expense.day_of_month;

          // 고정지출 생성일 이후부터만 적용
          const createdDate = new Date(expense.created_at);
          createdDate.setHours(0, 0, 0, 0);
          const effectiveStartDate = createdDate > minDate ? createdDate : minDate;

          let currentDate = new Date(effectiveStartDate.getFullYear(), effectiveStartDate.getMonth(), dayOfMonth);
          currentDate.setHours(0, 0, 0, 0);

          if (currentDate < effectiveStartDate) {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }

          // 오늘 이전까지만 카운트 (미래 고정지출은 제외)
          const effectiveEndDate = maxDate < todayForComparison ? maxDate : todayForComparison;

          let count = 0;
          while (currentDate <= effectiveEndDate) {
            count++;
            currentDate.setMonth(currentDate.getMonth() + 1);
          }

          recurringExpenseAmount += expense.amount_in_krw * count;
        });
    }
  }

  const totalExpenseWithRecurring = totalExpense + recurringExpenseAmount;

  const totalBalance = totalIncome - totalExpenseWithRecurring;

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
  const averageDailyExpense = totalExpenseWithRecurring / dayCount;

  // 가장 많이 지출한 카테고리 (고정지출 포함)
  const categoryExpense = generateCategoryExpense(transactions, recurringExpenses, period, selectedYear, selectedMonth);
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
    totalExpense: totalExpenseWithRecurring,
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
 * 전체 통계 데이터 생성 (고정지출 포함)
 */
export const generateStatistics = (
  transactions: Transaction[],
  recurringExpenses: RecurringExpense[],
  period: StatisticsPeriod = '6months',
  selectedYear?: number,
  selectedMonth?: number
): StatisticsData => {
  return {
    summary: generateStatisticsSummary(transactions, recurringExpenses, period, selectedYear, selectedMonth),
    monthlyTrend: generateMonthlyTrend(transactions, recurringExpenses, period, selectedYear, selectedMonth),
    categoryExpense: generateCategoryExpense(transactions, recurringExpenses, period, selectedYear, selectedMonth),
    weekdayExpense: generateWeekdayExpense(transactions, period, selectedYear, selectedMonth),
  };
};
