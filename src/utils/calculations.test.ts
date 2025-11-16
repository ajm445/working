import { describe, it, expect } from 'vitest';
import type { Transaction } from '../types/transaction';
import {
  calculateTotalIncome,
  calculateTotalExpense,
  calculateBalance,
  calculateExpensesByCategory,
  calculateMonthlyExpenses,
  filterTransactionsByMonth,
  calculateMonthlyIncome,
  calculateMonthlyExpense,
  calculateMonthlyBalance,
} from './calculations';

// 테스트용 더미 데이터
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 3000,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2025-01-15',
    currency: 'USD',
    amountInKRW: 3960000, // 3000 USD * 1320 KRW
  },
  {
    id: '2',
    type: 'expense',
    amount: 50000,
    category: 'Food',
    description: 'Grocery shopping',
    date: '2025-01-10',
    currency: 'KRW',
    amountInKRW: 50000,
  },
  {
    id: '3',
    type: 'expense',
    amount: 30000,
    category: 'Transport',
    description: 'Subway',
    date: '2025-01-12',
    currency: 'KRW',
    amountInKRW: 30000,
  },
  {
    id: '4',
    type: 'income',
    amount: 500000,
    category: 'Freelance',
    description: 'Project payment',
    date: '2025-01-20',
    currency: 'KRW',
    amountInKRW: 500000,
  },
  {
    id: '5',
    type: 'expense',
    amount: 80000,
    category: 'Food',
    description: 'Dining out',
    date: '2025-02-05',
    currency: 'KRW',
    amountInKRW: 80000,
  },
];

describe('calculations utils', () => {
  describe('calculateTotalIncome', () => {
    it('should calculate total income correctly', () => {
      const result = calculateTotalIncome(mockTransactions);
      expect(result).toBe(4460000); // 3960000 + 500000
    });

    it('should return 0 when no income transactions', () => {
      const expenses = mockTransactions.filter(t => t.type === 'expense');
      expect(calculateTotalIncome(expenses)).toBe(0);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalIncome([])).toBe(0);
    });
  });

  describe('calculateTotalExpense', () => {
    it('should calculate total expense correctly', () => {
      const result = calculateTotalExpense(mockTransactions);
      expect(result).toBe(160000); // 50000 + 30000 + 80000
    });

    it('should return 0 when no expense transactions', () => {
      const incomes = mockTransactions.filter(t => t.type === 'income');
      expect(calculateTotalExpense(incomes)).toBe(0);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalExpense([])).toBe(0);
    });
  });

  describe('calculateBalance', () => {
    it('should calculate balance correctly', () => {
      const result = calculateBalance(mockTransactions);
      expect(result).toBe(4300000); // 4460000 - 160000
    });

    it('should handle negative balance', () => {
      const negativeBalanceTransactions: Transaction[] = [
        { ...mockTransactions[0]!, amountInKRW: 10000, type: 'income' },
        { ...mockTransactions[1]!, amountInKRW: 50000, type: 'expense' },
      ];
      expect(calculateBalance(negativeBalanceTransactions)).toBe(-40000);
    });

    it('should return 0 for empty array', () => {
      expect(calculateBalance([])).toBe(0);
    });
  });

  describe('calculateExpensesByCategory', () => {
    it('should group expenses by category correctly', () => {
      const result = calculateExpensesByCategory(mockTransactions);
      expect(result).toEqual({
        Food: 130000, // 50000 + 80000
        Transport: 30000,
      });
    });

    it('should return empty object when no expenses', () => {
      const incomes = mockTransactions.filter(t => t.type === 'income');
      expect(calculateExpensesByCategory(incomes)).toEqual({});
    });

    it('should return empty object for empty array', () => {
      expect(calculateExpensesByCategory([])).toEqual({});
    });
  });

  describe('calculateMonthlyExpenses', () => {
    it('should group expenses by month correctly', () => {
      const result = calculateMonthlyExpenses(mockTransactions);
      expect(result).toEqual({
        '2025-01': 80000, // 50000 + 30000
        '2025-02': 80000,
      });
    });

    it('should format month key with zero padding', () => {
      const marchTransaction: Transaction[] = [
        {
          ...mockTransactions[1]!,
          date: '2025-03-01',
          amountInKRW: 10000,
        },
      ];
      const result = calculateMonthlyExpenses(marchTransaction);
      expect(result).toHaveProperty('2025-03');
    });
  });

  describe('filterTransactionsByMonth', () => {
    it('should filter transactions by month correctly', () => {
      const result = filterTransactionsByMonth(mockTransactions, 2025, 0); // January (month = 0)
      expect(result).toHaveLength(4);
      expect(result.every(t => t.date.startsWith('2025-01'))).toBe(true);
    });

    it('should return empty array when no transactions match', () => {
      const result = filterTransactionsByMonth(mockTransactions, 2024, 11); // December 2024
      expect(result).toEqual([]);
    });

    it('should handle February correctly', () => {
      const result = filterTransactionsByMonth(mockTransactions, 2025, 1); // February (month = 1)
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('5');
    });
  });

  describe('calculateMonthlyIncome', () => {
    it('should calculate monthly income correctly', () => {
      const result = calculateMonthlyIncome(mockTransactions, 2025, 0); // January
      expect(result).toBe(4460000); // All income transactions are in January
    });

    it('should return 0 when no income in that month', () => {
      const result = calculateMonthlyIncome(mockTransactions, 2025, 1); // February
      expect(result).toBe(0);
    });
  });

  describe('calculateMonthlyExpense', () => {
    it('should calculate monthly expense correctly', () => {
      const result = calculateMonthlyExpense(mockTransactions, 2025, 0); // January
      expect(result).toBe(80000); // 50000 + 30000
    });

    it('should calculate February expense correctly', () => {
      const result = calculateMonthlyExpense(mockTransactions, 2025, 1); // February
      expect(result).toBe(80000);
    });
  });

  describe('calculateMonthlyBalance', () => {
    it('should calculate monthly balance correctly', () => {
      const result = calculateMonthlyBalance(mockTransactions, 2025, 0); // January
      expect(result).toBe(4380000); // 4460000 - 80000
    });

    it('should calculate negative monthly balance', () => {
      const result = calculateMonthlyBalance(mockTransactions, 2025, 1); // February
      expect(result).toBe(-80000); // 0 - 80000
    });

    it('should return 0 when no transactions in that month', () => {
      const result = calculateMonthlyBalance(mockTransactions, 2024, 11); // December 2024
      expect(result).toBe(0);
    });
  });
});
