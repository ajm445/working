import React from 'react';
import type { Transaction } from '../../types/transaction';
import { calculateTotalIncome, calculateTotalExpense, calculateBalance } from '../../utils/calculations';
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
  const handleViewModeChange = (mode: ViewMode): void => {
    onViewModeChange?.(mode);
  };

  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  const balance = calculateBalance(transactions);

  return (
    <div>
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
        />
      )}
    </div>
  );
};

export default Dashboard;