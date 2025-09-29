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

  const formatAmount = (amount: number, showZero: boolean = false): string => {
    if (amount === 0 && !showZero) return '';

    const convertedAmount = convertAmount(amount, 'KRW', currentCurrency);
    const symbol = currentCurrency === 'KRW' ? '₩' : currentCurrency === 'JPY' ? '¥' : '$';
    const absAmount = Math.abs(convertedAmount);

    let formattedAmount: string;
    if (absAmount >= 1000000) {
      formattedAmount = `${symbol}${(absAmount / 1000000).toFixed(1)}M`;
    } else if (absAmount >= 1000) {
      formattedAmount = `${symbol}${(absAmount / 1000).toFixed(0)}K`;
    } else {
      formattedAmount = `${symbol}${Math.round(absAmount).toLocaleString()}`;
    }

    return convertedAmount < 0 ? `-${formattedAmount}` : formattedAmount;
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

          {/* 일일 순액 (수입 - 지출) */}
          {(summary.totalIncome > 0 || summary.totalExpense > 0) && (
            <div className={`text-xs font-medium ${
              summary.totalIncome - summary.totalExpense >= 0
                ? 'text-blue-600'
                : 'text-red-600'
            }`}>
              순액: {formatAmount(summary.totalIncome - summary.totalExpense, true)}
            </div>
          )}
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