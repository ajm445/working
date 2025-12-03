import React from 'react';
import type { CalendarDay as CalendarDayType } from '../../types/calendar';
import type { RecurringExpense } from '../../types/database';
import { getDayTransactionSummary } from '../../utils/calendar';
import { useCurrency } from '../../hooks/useCurrency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';

interface CalendarDayProps {
  day: CalendarDayType;
  recurringExpenses?: RecurringExpense[];
  onDayClick?: ((day: CalendarDayType) => void) | undefined;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, recurringExpenses = [], onDayClick }) => {
  const { currentCurrency } = useCurrency();
  const { convertAmount } = useCurrencyConverter();

  const summary = getDayTransactionSummary(day.transactions, day.date, recurringExpenses);

  // 실제 거래내역 건수 계산
  const incomeCount = day.transactions.filter(t => t.type === 'income').length;
  const expenseCount = day.transactions.filter(t => t.type === 'expense').length;

  // 해당 날짜의 고정지출이 있는지 확인 (생성일 이후이고 오늘 이전만)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfMonth = day.date.getDate();
  const hasRecurringExpense = recurringExpenses.some(expense => {
    if (!expense.is_active || expense.day_of_month !== dayOfMonth) return false;

    // 고정지출 생성일
    const createdDate = new Date(expense.created_at);
    createdDate.setHours(0, 0, 0, 0);

    // 해당 날짜 준비
    const targetDate = new Date(day.date);
    targetDate.setHours(0, 0, 0, 0);

    // 해당 날짜가 생성일 이후이고 오늘 이하인지 확인
    return targetDate >= createdDate && targetDate <= today;
  });

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
        relative min-h-[70px] md:min-h-[100px] lg:min-h-[120px] p-1.5 md:p-2 lg:p-3 cursor-pointer transition-all duration-200
        touch-manipulation active:scale-95
        ${day.isCurrentMonth
          ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600'
          : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600'
        }
        ${day.isToday
          ? 'border-2 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
          : 'border border-gray-200 dark:border-gray-600'
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
          text-xs sm:text-sm font-medium transition-colors duration-200
          ${day.isToday ? 'text-indigo-700 dark:text-indigo-300' : day.isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}
        `}>
          {day.dayNumber}
        </div>
        {/* 고정지출 표시 */}
        {hasRecurringExpense && day.isCurrentMonth && (
          <span className="text-[6.5px] min-[360px]:text-[7px] min-[400px]:text-[8px] sm:text-[10px] md:text-xs lg:text-sm px-1 py-0.5 bg-purple-200 dark:bg-purple-800/70 text-purple-700 dark:text-purple-200 rounded font-medium whitespace-nowrap transition-colors duration-200">
            고정
          </span>
        )}
      </div>

      {/* 거래 내역이 있는 경우 */}
      {summary.hasTransactions && (
        <>
          {/* 데스크톱: 수입, 지출, 순액 모두 표시 */}
          <div className="hidden md:block space-y-1">
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

          {/* 태블릿: 일일 순액만 전체 금액으로 표시 */}
          <div className="hidden sm:block md:hidden">
            {(summary.totalIncome > 0 || summary.totalExpense > 0) && (
              <div className={`text-xs font-semibold transition-colors duration-200 ${
                summary.totalIncome - summary.totalExpense >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatAmount(summary.totalIncome - summary.totalExpense, true)}
              </div>
            )}
          </div>

          {/* 모바일: 도트 인디케이터만 표시 (실제 거래내역이 있을 때만) */}
          <div className="sm:hidden flex flex-col gap-0.5 mt-1">
            {/* 수입이 있는 경우 녹색 도트와 건수 */}
            {incomeCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 transition-colors duration-200"></div>
                <span className="text-[10px] text-green-600 dark:text-green-400 transition-colors duration-200">
                  {incomeCount}건
                </span>
              </div>
            )}

            {/* 지출이 있는 경우 빨간색 도트와 건수 */}
            {expenseCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 transition-colors duration-200"></div>
                <span className="text-[10px] text-red-600 dark:text-red-400 transition-colors duration-200">
                  {expenseCount}건
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarDay;