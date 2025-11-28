import type { Transaction } from '../types/transaction';
import type { RecurringExpense } from '../types/database';

// 총 수입 계산 (원화 기준)
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amountInKRW, 0);
};

// 총 지출 계산 (원화 기준)
export const calculateTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amountInKRW, 0);
};

// 잔액 계산 (원화 기준)
export const calculateBalance = (transactions: Transaction[]): number => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  return totalIncome - totalExpense;
};

// 카테고리별 지출 합계
export const calculateExpensesByCategory = (transactions: Transaction[]): { [category: string]: number } => {
  const expenses = transactions.filter(t => t.type === 'expense');

  return expenses.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + transaction.amountInKRW;
    return acc;
  }, {} as { [category: string]: number });
};

// 월별 지출 합계
export const calculateMonthlyExpenses = (transactions: Transaction[]): { [month: string]: number } => {
  const expenses = transactions.filter(t => t.type === 'expense');

  return expenses.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + transaction.amountInKRW;
    return acc;
  }, {} as { [month: string]: number });
};

// 특정 월의 거래만 필터링
export const filterTransactionsByMonth = (transactions: Transaction[], year: number, month: number): Transaction[] => {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
  });
};

// 특정 월의 총 수입 계산
export const calculateMonthlyIncome = (transactions: Transaction[], year: number, month: number): number => {
  const monthlyTransactions = filterTransactionsByMonth(transactions, year, month);
  return calculateTotalIncome(monthlyTransactions);
};

// 특정 월의 총 지출 계산
export const calculateMonthlyExpense = (transactions: Transaction[], year: number, month: number): number => {
  const monthlyTransactions = filterTransactionsByMonth(transactions, year, month);
  return calculateTotalExpense(monthlyTransactions);
};

// 특정 월의 고정지출 합계 계산
export const calculateMonthlyRecurringExpense = (recurringExpenses: RecurringExpense[], year: number, month: number): number => {
  // 활성화된 고정지출만 포함
  return recurringExpenses
    .filter(expense => expense.is_active)
    .reduce((sum, expense) => sum + expense.amount_in_krw, 0);
};

// 특정 월의 총 지출 계산 (고정지출 포함)
export const calculateMonthlyExpenseWithRecurring = (
  transactions: Transaction[],
  recurringExpenses: RecurringExpense[],
  year: number,
  month: number
): number => {
  const regularExpense = calculateMonthlyExpense(transactions, year, month);
  const recurringExpense = calculateMonthlyRecurringExpense(recurringExpenses, year, month);
  return regularExpense + recurringExpense;
};

// 특정 월의 잔액 계산
export const calculateMonthlyBalance = (transactions: Transaction[], year: number, month: number): number => {
  const monthlyIncome = calculateMonthlyIncome(transactions, year, month);
  const monthlyExpense = calculateMonthlyExpense(transactions, year, month);
  return monthlyIncome - monthlyExpense;
};

// 특정 월의 잔액 계산 (고정지출 포함)
export const calculateMonthlyBalanceWithRecurring = (
  transactions: Transaction[],
  recurringExpenses: RecurringExpense[],
  year: number,
  month: number
): number => {
  const monthlyIncome = calculateMonthlyIncome(transactions, year, month);
  const monthlyExpenseWithRecurring = calculateMonthlyExpenseWithRecurring(transactions, recurringExpenses, year, month);
  return monthlyIncome - monthlyExpenseWithRecurring;
};