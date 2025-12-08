import type { CurrencyCode } from './currency';

/**
 * 저축 목표 카테고리
 */
export const SAVINGS_GOAL_CATEGORIES = [
  '여행',
  '비상금',
  '대형구매',
  '주택자금',
  '교육자금',
  '결혼자금',
  '창업자금',
  '은퇴자금',
  '기타'
] as const;

export type SavingsGoalCategory = typeof SAVINGS_GOAL_CATEGORIES[number];

/**
 * 저축 목표 인터페이스
 */
export interface SavingsGoal {
  /** 저축 목표 고유 ID */
  id: string;
  /** 사용자 ID */
  user_id: string;
  /** 목표 이름 */
  name: string;
  /** 목표 금액 (원본 통화 기준) */
  target_amount: number;
  /** 현재 저축 금액 (원본 통화 기준) */
  current_amount: number;
  /** 통화 코드 */
  currency: CurrencyCode;
  /** 목표 금액 (KRW 기준) */
  target_amount_in_krw: number;
  /** 현재 저축 금액 (KRW 기준) */
  current_amount_in_krw: number;
  /** 목표 달성 기한 (YYYY-MM-DD) */
  deadline: string | null;
  /** 목표 카테고리 */
  category: SavingsGoalCategory | null;
  /** 목표 설명 */
  description: string | null;
  /** 목표 달성 여부 */
  is_completed: boolean;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * 저축 목표 생성/수정 폼 데이터
 */
export interface SavingsGoalFormData {
  /** 목표 이름 */
  name: string;
  /** 목표 금액 (문자열, 입력 폼용) */
  target_amount: string;
  /** 현재 저축 금액 (문자열, 입력 폼용) */
  current_amount: string;
  /** 통화 코드 */
  currency: CurrencyCode;
  /** 목표 달성 기한 (YYYY-MM-DD) */
  deadline: string;
  /** 목표 카테고리 */
  category: SavingsGoalCategory | '';
  /** 목표 설명 */
  description: string;
}

/**
 * 저축 목표 통계
 */
export interface SavingsGoalStats {
  /** 전체 목표 개수 */
  totalGoals: number;
  /** 완료된 목표 개수 */
  completedGoals: number;
  /** 진행 중인 목표 개수 */
  activeGoals: number;
  /** 전체 목표 금액 합계 (KRW) */
  totalTargetAmount: number;
  /** 전체 현재 금액 합계 (KRW) */
  totalCurrentAmount: number;
  /** 전체 진행률 (0-100) */
  overallProgress: number;
}

/**
 * 저축 목표 진행 상태
 */
export type SavingsGoalProgress = 'not-started' | 'in-progress' | 'almost-done' | 'completed';

/**
 * 저축 목표 진행 상태 계산
 */
export const getSavingsGoalProgress = (goal: SavingsGoal): SavingsGoalProgress => {
  if (goal.is_completed) {
    return 'completed';
  }

  const progress = (goal.current_amount / goal.target_amount) * 100;

  if (progress === 0) {
    return 'not-started';
  } else if (progress >= 90) {
    return 'almost-done';
  } else {
    return 'in-progress';
  }
};

/**
 * 저축 목표 진행률 계산 (0-100)
 */
export const calculateProgress = (currentAmount: number, targetAmount: number): number => {
  if (targetAmount === 0) return 0;
  const progress = (currentAmount / targetAmount) * 100;
  return Math.min(Math.round(progress), 100);
};

/**
 * 남은 금액 계산
 */
export const calculateRemainingAmount = (targetAmount: number, currentAmount: number): number => {
  return Math.max(targetAmount - currentAmount, 0);
};

/**
 * 목표 기한까지 남은 일수 계산
 */
export const calculateDaysRemaining = (deadline: string | null): number | null => {
  if (!deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
