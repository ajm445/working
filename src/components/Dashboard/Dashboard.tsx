import React, { useState } from 'react';
import type { Transaction } from '../../types/transaction';
import {
  calculateMonthlyIncome,
  calculateMonthlyExpense,
  calculateMonthlyBalance
} from '../../utils/calculations';
import { getKSTDate } from '../../utils/dateUtils';
import BalanceCard from './BalanceCard';
import CurrencySelector from './CurrencySelector';
import { TransactionCalendar } from '../Calendar';
import { StatisticsDashboard } from '../Statistics';

type ViewMode = 'summary' | 'calendar' | 'statistics';

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
  const today = getKSTDate();
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect((): (() => void) => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // 현재 시간 포맷팅 (am/pm)
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  return (
    <div>
      {/* 오늘 날짜 및 시간 표시 */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-4 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <span className="text-lg font-semibold text-indigo-800">
            오늘: {formatTodayDate()}
          </span>
          <span className="text-lg font-semibold text-indigo-600">
            {formatTime(currentTime)}
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
        <div className="grid grid-cols-3">
          <button
            onClick={() => handleViewModeChange('summary')}
            className={`
              px-4 py-4 text-sm font-medium transition-colors
              ${currentViewMode === 'summary'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>📊</span>
              <span className="hidden sm:inline">요약 보기</span>
              <span className="sm:hidden">요약</span>
            </div>
          </button>
          <button
            onClick={() => handleViewModeChange('calendar')}
            className={`
              px-4 py-4 text-sm font-medium transition-colors border-l
              ${currentViewMode === 'calendar'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>📅</span>
              <span className="hidden sm:inline">캘린더 보기</span>
              <span className="sm:hidden">캘린더</span>
            </div>
          </button>
          <button
            onClick={() => handleViewModeChange('statistics')}
            className={`
              px-4 py-4 text-sm font-medium transition-colors border-l
              ${currentViewMode === 'statistics'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>📈</span>
              <span className="hidden sm:inline">통계 분석</span>
              <span className="sm:hidden">통계</span>
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

      {currentViewMode === 'statistics' && (
        <StatisticsDashboard transactions={transactions} />
      )}
    </div>
  );
};

export default Dashboard;