import React, { useState } from 'react';
import type { Transaction } from '../../types/transaction';
import {
  calculateMonthlyIncome,
  calculateMonthlyExpense,
  calculateMonthlyBalance
} from '../../utils/calculations';
import BalanceCard from './BalanceCard';
import CurrencySelector from './CurrencySelector';
import { TransactionCalendar } from '../Calendar';

type ViewMode = 'summary' | 'calendar';

interface DashboardProps {
  transactions: Transaction[];
  onViewModeChange?: (mode: ViewMode) => void;
  currentViewMode?: ViewMode;
  onCalendarDateClick?: ((date?: Date) => void) | undefined;
}

const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  onViewModeChange,
  currentViewMode = 'summary',
  onCalendarDateClick
}) => {
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());

  const handleViewModeChange = (mode: ViewMode): void => {
    onViewModeChange?.(mode);
  };

  const handleCalendarMonthChange = (year: number, month: number): void => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  // 요약 보기: 현재 달 기준, 캘린더 보기: 캘린더에서 보고 있는 달 기준
  const displayYear = currentViewMode === 'calendar' ? calendarYear : today.getFullYear();
  const displayMonth = currentViewMode === 'calendar' ? calendarMonth : today.getMonth();

  const totalIncome = calculateMonthlyIncome(transactions, displayYear, displayMonth);
  const totalExpense = calculateMonthlyExpense(transactions, displayYear, displayMonth);
  const balance = calculateMonthlyBalance(transactions, displayYear, displayMonth);

  // 오늘 날짜 포맷팅
  const formatTodayDate = (): string => {
    return today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div>
      {/* 오늘 날짜 표시 */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <span className="text-lg font-semibold text-indigo-800">
            오늘: {formatTodayDate()}
          </span>
        </div>
      </div>

      <CurrencySelector />

      {/* 잔액 카드들 - 항상 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BalanceCard
          title="총 수입"
          amount={totalIncome}
          icon="📈"
          type="income"
        />

        <BalanceCard
          title="총 지출"
          amount={totalExpense}
          icon="📉"
          type="expense"
        />

        <BalanceCard
          title="잔액"
          amount={balance}
          icon="💳"
          type="balance"
        />
      </div>

      {/* 뷰 모드 선택 탭 */}
      <div className="bg-white rounded-xl shadow-sm border mb-6 overflow-hidden">
        <div className="flex">
          <button
            onClick={() => handleViewModeChange('summary')}
            className={`
              flex-1 px-6 py-4 text-sm font-medium transition-colors
              ${currentViewMode === 'summary'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>📊</span>
              요약 보기
            </div>
          </button>
          <button
            onClick={() => handleViewModeChange('calendar')}
            className={`
              flex-1 px-6 py-4 text-sm font-medium transition-colors border-l
              ${currentViewMode === 'calendar'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>📅</span>
              캘린더 보기
            </div>
          </button>
        </div>
      </div>

      {/* 선택된 뷰 표시 */}
      {currentViewMode === 'calendar' && (
        <TransactionCalendar
          transactions={transactions}
          onDateClick={onCalendarDateClick}
          onMonthChange={handleCalendarMonthChange}
        />
      )}
    </div>
  );
};

export default Dashboard;