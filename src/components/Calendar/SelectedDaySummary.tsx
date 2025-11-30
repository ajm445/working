import React from 'react';
import type { CalendarDay } from '../../types/calendar';
import type { RecurringExpense } from '../../types/database';
import { getDayTransactionSummary } from '../../utils/calendar';
import { useCurrency } from '../../hooks/useCurrency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';

interface SelectedDaySummaryProps {
  selectedDay: CalendarDay | null;
  recurringExpenses?: RecurringExpense[];
  onAddTransaction?: ((date?: Date) => void) | undefined;
}

const SelectedDaySummary: React.FC<SelectedDaySummaryProps> = ({
  selectedDay,
  recurringExpenses = [],
  onAddTransaction
}) => {
  const { currentCurrency } = useCurrency();
  const { convertAmount } = useCurrencyConverter();

  if (!selectedDay) {
    return (
      <div className="sm:hidden bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center transition-colors duration-300">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          날짜를 선택하면 상세 금액을 확인할 수 있습니다
        </p>
      </div>
    );
  }

  const summary = getDayTransactionSummary(selectedDay.transactions, selectedDay.date);

  // 해당 날짜의 고정지출이 있는지 확인
  const dayOfMonth = selectedDay.date.getDate();
  const recurringExpense = recurringExpenses.find(
    expense => expense.is_active && expense.day_of_month === dayOfMonth
  );

  const formatAmount = (amount: number): string => {
    const convertedAmount = convertAmount(amount, 'KRW', currentCurrency);
    const symbol = currentCurrency === 'KRW' ? '₩' : currentCurrency === 'JPY' ? '¥' : '$';
    const absAmount = Math.abs(convertedAmount);
    return `${Math.round(absAmount).toLocaleString()}${symbol}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const netAmount = summary.totalIncome - summary.totalExpense;

  // 수입과 지출 거래 분리
  const incomeTransactions = selectedDay.transactions.filter(t => t.type === 'income');
  const expenseTransactions = selectedDay.transactions.filter(t => t.type === 'expense');

  return (
    <div className="sm:hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-300">
      {/* 선택된 날짜 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatDate(selectedDay.date)}
        </h3>
        {recurringExpense && (
          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded font-medium">
            고정지출
          </span>
        )}
      </div>

      {/* 거래 내역이 있는 경우 */}
      {summary.hasTransactions ? (
        <div className="space-y-3">
          {/* 수입 내역 */}
          {incomeTransactions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                <span>💰</span>
                <span>수입 ({incomeTransactions.length}건)</span>
              </div>
              {incomeTransactions.map((transaction) => (
                <div key={transaction.id} className="pl-4 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {transaction.category}
                      </span>
                      {transaction.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 ml-2 whitespace-nowrap">
                      +{formatAmount(transaction.amountInKRW)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pl-4 pt-1 border-t border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">소계</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    +{formatAmount(summary.totalIncome)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 지출 내역 */}
          {expenseTransactions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>💸</span>
                <span>지출 ({expenseTransactions.length}건)</span>
              </div>
              {expenseTransactions.map((transaction) => (
                <div key={transaction.id} className="pl-4 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {transaction.category}
                      </span>
                      {transaction.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400 ml-2 whitespace-nowrap">
                      -{formatAmount(transaction.amountInKRW)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pl-4 pt-1 border-t border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">소계</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    -{formatAmount(summary.totalExpense)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 구분선 */}
          <div className="border-t-2 dark:border-gray-700"></div>

          {/* 순액 */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">일일 순액</span>
            <span className={`text-lg font-bold ${
              netAmount >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {netAmount >= 0 ? '+' : ''}{formatAmount(netAmount)}
            </span>
          </div>

          {/* 내역 추가 버튼 */}
          {onAddTransaction && (
            <button
              onClick={() => onAddTransaction(selectedDay.date)}
              className="w-full mt-2 bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 touch-manipulation active:scale-95"
            >
              <span>➕</span>
              <span>이 날짜에 내역 추가</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              이 날짜에는 거래 내역이 없습니다
            </p>
          </div>

          {/* 거래 내역이 없을 때도 내역 추가 버튼 표시 */}
          {onAddTransaction && (
            <button
              onClick={() => onAddTransaction(selectedDay.date)}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 touch-manipulation active:scale-95"
            >
              <span>➕</span>
              <span>이 날짜에 내역 추가</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedDaySummary;
