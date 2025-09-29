import type { Transaction } from './transaction';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  transactions: Transaction[];
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarWeek[];
}

export interface DayTransactionSummary {
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  hasTransactions: boolean;
}