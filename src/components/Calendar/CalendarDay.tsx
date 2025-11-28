import React from 'react';
import type { CalendarDay as CalendarDayType } from '../../types/calendar';
import { getDayTransactionSummary } from '../../utils/calendar';
import { useCurrency } from '../../hooks/useCurrency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';

interface CalendarDayProps {
  day: CalendarDayType;
  recurringExpenses?: any[];
  onDayClick?: ((day: CalendarDayType) => void) | undefined;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, recurringExpenses = [], onDayClick }) => {
  const { currentCurrency } = useCurrency();
  const { convertAmount } = useCurrencyConverter();

  const summary = getDayTransactionSummary(day.transactions, day.date);

  // 해당 날짜의 고정지출이 있는지 확인
  const dayOfMonth = day.date.getDate();
  const hasRecurringExpense = recurringExpenses.some(
    expense => expense.is_active && expense.day_of_month === dayOfMonth
  );

  const formatAmount = (amount: number, showZero: boolean = false): string => {
    if (amount === 0 && !showZero) return '';

    const convertedAmount = convertAmount(amount, 'KRW', currentCurrency);
    const symbol = currentCurrency === 'KRW' ? '₩' : currentCurrency === 'JPY' ? '¥' : '$';
    const absAmount = Math.abs(convertedAmount);

    // 금액을 쉼표와 함께 표시하고 통화 단위를 뒤에 배치
    const formattedAmount = `${Math.round(absAmount).toLocaleString()}${symbol}`;

    return convertedAmount < 0 ? `-${formattedAmount}` : formattedAmount;
  };

  return (
    <div
      className={`
        relative min-h-[100px] md:min-h-[120px] p-2 md:p-3 border cursor-pointer transition-all duration-200
        touch-manipulation active:scale-95
        ${day.isCurrentMonth
          ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 border-gray-200 dark:border-gray-600'
          : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-600'
        }
        ${day.isToday
          ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
          : ''
        }
        ${summary.hasTransactions
          ? 'shadow-sm'
          : ''
        }
        hover:shadow-md
      `}
      onClick={() => onDayClick?.(day)}
      role="button"
      tabIndex={0}
      aria-label={`${day.dayNumber}일 ${summary.hasTransactions ? `거래 ${summary.transactionCount}건` : ''}`}
    >
      {/* 날짜 */}
      <div className="flex items-center justify-between mb-1">
        <div className={`
          text-sm font-medium transition-colors duration-200
          ${day.isToday ? 'text-indigo-700 dark:text-indigo-300' : day.isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}
        `}>
          {day.dayNumber}
        </div>
        {/* 고정지출 표시 */}
        {hasRecurringExpense && day.isCurrentMonth && (
          <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded font-medium transition-colors duration-200">
            고정
          </span>
        )}
      </div>

      {/* 거래 내역이 있는 경우 */}
      {summary.hasTransactions && (
        <div className="space-y-1">
          {/* 수입 */}
          {summary.totalIncome > 0 && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium transition-colors duration-200">
              +{formatAmount(summary.totalIncome)}
            </div>
          )}

          {/* 지출 */}
          {summary.totalExpense > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 font-medium transition-colors duration-200">
              -{formatAmount(summary.totalExpense)}
            </div>
          )}

          {/* 일일 순액 (수입 - 지출) */}
          {(summary.totalIncome > 0 || summary.totalExpense > 0) && (
            <div className={`text-xs font-medium transition-colors duration-200 ${
              summary.totalIncome - summary.totalExpense >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              순액: {formatAmount(summary.totalIncome - summary.totalExpense, true)}
            </div>
          )}
        </div>
      )}

      {/* 오늘 표시 */}
      {day.isToday && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full transition-colors duration-200"></div>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;