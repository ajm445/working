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
import CurrentTimeDisplay from './CurrentTimeDisplay';
import { TransactionCalendar } from '../Calendar';
import { StatisticsDashboard } from '../Statistics';

/**
 * 대시보드 뷰 모드 타입
 * - summary: 요약 보기 (현재 달 기준 수입/지출/잔액)
 * - calendar: 캘린더 보기 (월별 거래 내역 캘린더 형식)
 * - statistics: 통계 분석 (차트 및 분석 데이터)
 */
type ViewMode = 'summary' | 'calendar' | 'statistics';

/**
 * Dashboard 컴포넌트의 Props 정의
 */
interface DashboardProps {
  /** 전체 거래 내역 배열 */
  transactions: Transaction[];
  /** 뷰 모드 변경 시 호출되는 콜백 함수 */
  onViewModeChange?: (mode: ViewMode) => void;
  /** 현재 선택된 뷰 모드 (기본값: 'summary') */
  currentViewMode?: ViewMode;
  /** 캘린더에서 날짜 클릭 시 호출되는 콜백 함수 */
  onCalendarDateClick?: ((date?: Date) => void) | undefined;
  /** 거래 삭제 시 호출되는 콜백 함수 */
  onDeleteTransaction?: ((id: string) => void) | undefined;
  /** 거래 수정 시 호출되는 콜백 함수 */
  onEditTransaction?: ((transaction: Transaction) => void) | undefined;
}

/**
 * 대시보드 메인 컴포넌트
 *
 * 가계부의 메인 화면으로, 수입/지출/잔액 요약, 캘린더 뷰, 통계 분석을 제공합니다.
 * 세 가지 뷰 모드(요약/캘린더/통계) 간 전환이 가능합니다.
 *
 * @component
 * @example
 * ```tsx
 * <Dashboard
 *   transactions={transactions}
 *   currentViewMode="summary"
 *   onViewModeChange={setViewMode}
 *   onCalendarDateClick={handleDateClick}
 * />
 * ```
 */
const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  onViewModeChange,
  currentViewMode = 'summary',
  onCalendarDateClick,
  onDeleteTransaction,
  onEditTransaction
}) => {
  const today = getKSTDate();
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());

  /**
   * 뷰 모드 변경 핸들러
   *
   * @param mode - 변경할 뷰 모드
   */
  const handleViewModeChange = (mode: ViewMode): void => {
    onViewModeChange?.(mode);
  };

  /**
   * 캘린더 월 변경 핸들러
   *
   * 캘린더 뷰에서 월을 변경할 때 호출되며, 내부 상태를 업데이트합니다.
   *
   * @param year - 변경할 연도
   * @param month - 변경할 월 (0-11)
   */
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

  return (
    <div>
      {/* 오늘 날짜 및 시간 표시 - 1분마다 업데이트 */}
      <CurrentTimeDisplay updateInterval={60000} />

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
          onDeleteTransaction={onDeleteTransaction}
          onEditTransaction={onEditTransaction}
        />
      )}

      {currentViewMode === 'statistics' && (
        <StatisticsDashboard transactions={transactions} />
      )}
    </div>
  );
};

export default Dashboard;