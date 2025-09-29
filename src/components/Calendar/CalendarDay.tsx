import React from 'react';
import type { CalendarDay as CalendarDayType } from '../../types/calendar';
import { getDayTransactionSummary } from '../../utils/calendar';
import { useCurrency } from '../../hooks/useCurrency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';

interface CalendarDayProps {
  day: CalendarDayType;
  onDayClick?: ((day: CalendarDayType) => void) | undefined;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, onDayClick }) => {
  const { currentCurrency } = useCurrency();
  const { convertAmount } = useCurrencyConverter();

  const summary = getDayTransactionSummary(day.transactions, day.date);

  const formatAmount = (amount: number): string => {
    if (amount === 0) return '';

    const convertedAmount = convertAmount(amount, 'KRW', currentCurrency);
    const symbol = currentCurrency === 'KRW' ? '₩' : currentCurrency === 'JPY' ? '¥' : '$';

    if (convertedAmount >= 1000000) {
      return `${symbol}${(convertedAmount / 1000000).toFixed(1)}M`;
    } else if (convertedAmount >= 1000) {
      return `${symbol}${(convertedAmount / 1000).toFixed(0)}K`;
    } else {
      return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
    }
  };

  return (
    <div
      className={`
        relative min-h-[100px] p-2 border cursor-pointer transition-all duration-200
        ${day.isCurrentMonth
          ? 'bg-white hover:bg-gray-50 border-gray-200'
          : 'bg-gray-50 border-gray-100 text-gray-400'
        }
        ${day.isToday
          ? 'ring-2 ring-indigo-500 bg-indigo-50'
          : ''
        }
        ${summary.hasTransactions
          ? 'shadow-sm'
          : ''
        }
        hover:shadow-md
      `}
      onClick={() => onDayClick?.(day)}
    >
      {/* 날짜 */}
      <div className={`
        text-sm font-medium mb-1
        ${day.isToday ? 'text-indigo-700' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
      `}>
        {day.dayNumber}
      </div>

      {/* 거래 내역이 있는 경우 */}
      {summary.hasTransactions && (
        <div className="space-y-1">
          {/* 수입 */}
          {summary.totalIncome > 0 && (
            <div className="text-xs text-green-600 font-medium">
              +{formatAmount(summary.totalIncome)}
            </div>
          )}

          {/* 지출 */}
          {summary.totalExpense > 0 && (
            <div className="text-xs text-red-600 font-medium">
              -{formatAmount(summary.totalExpense)}
            </div>
          )}

          {/* 거래 수 표시 */}
          <div className="text-xs text-gray-500">
            {summary.transactionCount}건
          </div>

          {/* 간단한 거래 내역 미리보기 */}
          <div className="space-y-0.5">
            {day.transactions.slice(0, 2).map((transaction) => (
              <div
                key={transaction.id}
                className="text-xs text-gray-600 truncate"
                title={transaction.description}
              >
                {transaction.description}
              </div>
            ))}
            {day.transactions.length > 2 && (
              <div className="text-xs text-gray-400">
                +{day.transactions.length - 2}개 더
              </div>
            )}
          </div>
        </div>
      )}

      {/* 오늘 표시 */}
      {day.isToday && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;