import type { Transaction } from '../types/transaction';
import type { CalendarDay, CalendarWeek, CalendarMonth, DayTransactionSummary } from '../types/calendar';

/**
 * 주어진 날짜가 오늘인지 확인
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * 두 날짜가 같은 날인지 확인
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
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
 * 특정 날짜의 거래 요약 정보 계산
 */
export const getDayTransactionSummary = (transactions: Transaction[], date: Date): DayTransactionSummary => {
  const dayTransactions = getTransactionsForDate(transactions, date);

  const totalIncome = dayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amountInKRW, 0);

  const totalExpense = dayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amountInKRW, 0);

  return {
    totalIncome,
    totalExpense,
    transactionCount: dayTransactions.length,
    hasTransactions: dayTransactions.length > 0,
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

  // 이전 달의 마지막 날들
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const weeks: CalendarWeek[] = [];
  let currentWeek: CalendarDay[] = [];

  // 이전 달의 날짜들로 첫 주 채우기
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    const dayTransactions = getTransactionsForDate(transactions, date);

    currentWeek.push({
      date,
      dayNumber: daysInPrevMonth - i,
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