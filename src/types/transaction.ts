import type { CurrencyCode } from './currency';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: CurrencyCode;
  amountInKRW: number; // 원화 기준 금액
}

export type TransactionType = 'income' | 'expense';

export interface TransactionFormData {
  amount: string;
  category: string;
  description: string;
  type: TransactionType;
  currency: CurrencyCode;
}

export const EXPENSE_CATEGORIES = [
  '식비',
  '숙박',
  '교통',
  '쇼핑',
  '의료',
  '통신',
  '기타'
] as const;

export const INCOME_CATEGORIES = [
  '급여',
  '용돈',
  '기타수입'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type TransactionCategory = ExpenseCategory | IncomeCategory;