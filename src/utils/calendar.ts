import type { Transaction } from '../types/transaction';
import type { RecurringExpense } from '../types/database';
import type { CalendarDay, CalendarWeek, CalendarMonth, DayTransactionSummary } from '../types/calendar';
import { getKSTDate } from './dateUtils';

/**
 * 주어진 날짜가 오늘인지 확인 (KST/JST 기준)
 * 두 날짜 모두 로컬 시간대 기준이므로 get* 메서드 사용
 */
export const isToday = (date: Date): boolean => {
  const kstToday = getKSTDate();

  return kstToday.getFullYear() === date.getFullYear() &&
         kstToday.getMonth() === date.getMonth() &&
         kstToday.getDate() === date.getDate();
};

/**
 * 두 날짜가 같은 날인지 확인
 * 두 날짜 모두 로컬 시간대 기준이므로 get* 메서드 사용
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

/**
 * 거래 날짜를 Date 객체로 변환
 */
export const parseTransactionDate = (dateString: string): Date => {
  // "2025. 1. 15." 형식을 파싱
  if (dateString.includes('.')) {
    const parts = dateString.split('.').map(part => part.trim()).filter(part => part);
    if (parts.length >= 3) {
      const yearStr = parts[0];
      const monthStr = parts[1];
      const dayStr = parts[2];

      if (yearStr && monthStr && dayStr) {
        const year = parseInt(yearStr);
        const month = parseInt(monthStr) - 1; // JavaScript month is 0-indexed
        const day = parseInt(dayStr);
        return new Date(year, month, day);
      }
    }
  }

  // 기본적으로 Date 생성자로 파싱 시도
  return new Date(dateString);
};

/**
 * 특정 날짜의 거래 내역 필터링
 */
export const getTransactionsForDate = (transactions: Transaction[], date: Date): Transaction[] => {
  return transactions.filter(transaction => {
    const transactionDate = parseTransactionDate(transaction.date);
    return isSameDay(transactionDate, date);
  });
};

/**
 * 특정 날짜의 거래 요약 정보 계산 (고정지출 포함)
 */
export const getDayTransactionSummary = (
  transactions: Transaction[],
  date: Date,
  recurringExpenses?: RecurringExpense[]
): DayTransactionSummary => {
  const dayTransactions = getTransactionsForDate(transactions, date);

  const totalIncome = dayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amountInKRW, 0);

  let totalExpense = dayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amountInKRW, 0);

  // 해당 날짜에 고정지출이 있으면 추가 (생성일 이후이고 오늘 이전만)
  if (recurringExpenses) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거하고 날짜만 비교

    const dayOfMonth = date.getDate();
    const recurringExpenseAmount = recurringExpenses
      .filter(expense => {
        if (!expense.is_active || expense.day_of_month !== dayOfMonth) return false;

        // 고정지출 생성일
        const createdDate = new Date(expense.created_at);
        createdDate.setHours(0, 0, 0, 0);

        // 비교할 날짜도 시간 제거
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // 해당 날짜가 생성일 이후이고, 오늘 이하인 경우만 포함
        return targetDate >= createdDate && targetDate <= today;
      })
      .reduce((sum, expense) => sum + expense.amount_in_krw, 0);

    totalExpense += recurringExpenseAmount;
  }

  return {
    totalIncome,
    totalExpense,
    transactionCount: dayTransactions.length,
    hasTransactions: dayTransactions.length > 0 || totalExpense > 0,
  };
};

/**
 * 달력 데이터 생성
 */
export const generateCalendarMonth = (year: number, month: number, transactions: Transaction[]): CalendarMonth => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysInMonth = lastDay.getDate();

  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];

  // 이전 달의 날짜들로 첫 주 채우기
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    // month의 0일은 이전 달 마지막 날, -1일은 그 전날...
    const date = new Date(year, month, -i);
    const dayTransactions = getTransactionsForDate(transactions, date);

    currentWeek.push({
      date,
      dayNumber: date.getDate(), // Date 객체에서 직접 날짜 추출
      isCurrentMonth: false,
      isToday: isToday(date),
      transactions: dayTransactions,
    });
  }

  // 현재 달의 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayTransactions = getTransactionsForDate(transactions, date);

    currentWeek.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: isToday(date),
      transactions: dayTransactions,
    });

    // 주가 완성되면 weeks에 추가하고 새 주 시작
    if (currentWeek.length === 7) {
      weeks.push({ days: [...currentWeek] });
      currentWeek = [];
    }
  }

  // 다음 달의 날짜들로 마지막 주 채우기
  if (currentWeek.length > 0) {
    const remainingDays = 7 - currentWeek.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dayTransactions = getTransactionsForDate(transactions, date);

      currentWeek.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: isToday(date),
        transactions: dayTransactions,
      });
    }
    weeks.push({ days: currentWeek });
  }

  return {
    year,
    month,
    weeks,
  };
};

/**
 * 월 이름을 한국어로 반환
 */
export const getKoreanMonthName = (month: number): string => {
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  return months[month] || '';
};

/**
 * 요일 이름을 한국어로 반환
 */
export const getKoreanDayNames = (): string[] => {
  return ['일', '월', '화', '수', '목', '금', '토'];
};