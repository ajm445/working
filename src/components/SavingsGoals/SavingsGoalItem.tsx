import React from 'react';
import { Edit2, Trash2, Target, Calendar, PiggyBank } from 'lucide-react';
import type { SavingsGoal } from '../../types/savingsGoal';
import {
  calculateProgress,
  calculateDaysRemaining,
  getSavingsGoalProgress
} from '../../types/savingsGoal';
import { formatCurrency } from '../../utils/currency';
import type { CurrencyCode } from '../../types/currency';

interface SavingsGoalItemProps {
  /** 저축 목표 데이터 */
  goal: SavingsGoal;
  /** 현재 선택된 통화 */
  currentCurrency: CurrencyCode;
  /** 통화 변환 함수 */
  convertAmount: (amountInKRW: number, targetCurrency: CurrencyCode) => number;
  /** 수정 버튼 클릭 핸들러 */
  onEdit: (goal: SavingsGoal) => void;
  /** 삭제 버튼 클릭 핸들러 */
  onDelete: (id: string) => void;
  /** 저축 추가 버튼 클릭 핸들러 */
  onAddSavings?: (goal: SavingsGoal) => void;
}

const SavingsGoalItem: React.FC<SavingsGoalItemProps> = ({
  goal,
  currentCurrency,
  convertAmount,
  onEdit,
  onDelete,
  onAddSavings
}) => {
  // 통화 변환
  const displayTargetAmount = convertAmount(goal.target_amount_in_krw, currentCurrency);
  const displayCurrentAmount = convertAmount(goal.current_amount_in_krw, currentCurrency);
  const displayRemainingAmount = displayTargetAmount - displayCurrentAmount;

  // 진행률 계산
  const progress = calculateProgress(goal.current_amount, goal.target_amount);
  const progressStatus = getSavingsGoalProgress(goal);

  // 남은 일수 계산
  const daysRemaining = calculateDaysRemaining(goal.deadline);

  // 진행 상태별 색상
  const getProgressColor = (): string => {
    if (goal.is_completed) return 'bg-green-600';
    if (progressStatus === 'almost-done') return 'bg-yellow-500';
    if (progressStatus === 'in-progress') return 'bg-indigo-600';
    return 'bg-gray-300';
  };

  // 데드라인 상태별 색상
  const getDeadlineColor = (): string => {
    if (!daysRemaining) return 'text-gray-500 dark:text-gray-400';
    if (daysRemaining < 0) return 'text-red-600 dark:text-red-400';
    if (daysRemaining <= 30) return 'text-orange-600 dark:text-orange-400';
    return 'text-gray-600 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300 hover:shadow-md">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {goal.name}
          </h3>
          {goal.category && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
              {goal.category}
            </span>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors duration-300"
            title="수정"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-300"
            title="삭제"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* 설명 */}
      {goal.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {goal.description}
        </p>
      )}

      {/* 진행 바 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">진행률</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* 금액 정보 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">현재 금액</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(displayCurrentAmount, currentCurrency)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">목표 금액</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(displayTargetAmount, currentCurrency)}
          </span>
        </div>
        {!goal.is_completed && displayRemainingAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">남은 금액</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {formatCurrency(displayRemainingAmount, currentCurrency)}
            </span>
          </div>
        )}
      </div>

      {/* 기한 정보 */}
      {goal.deadline && (
        <div className="flex items-center gap-2 text-sm mb-4">
          <Calendar size={16} className={getDeadlineColor()} />
          <span className={getDeadlineColor()}>
            {goal.deadline}
            {daysRemaining !== null && (
              <span className="ml-2">
                {daysRemaining < 0
                  ? `(${Math.abs(daysRemaining)}일 경과)`
                  : `(D-${daysRemaining})`}
              </span>
            )}
          </span>
        </div>
      )}

      {/* 완료 배지 또는 저축 추가 버튼 */}
      {goal.is_completed ? (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-medium">
          <Target size={18} />
          <span>목표 달성!</span>
        </div>
      ) : onAddSavings ? (
        <button
          onClick={() => onAddSavings(goal)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium transition-colors duration-300"
        >
          <PiggyBank size={18} />
          <span>저축 추가</span>
        </button>
      ) : null}
    </div>
  );
};

export default SavingsGoalItem;
