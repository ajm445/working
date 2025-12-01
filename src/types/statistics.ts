/**
 * 통계 관련 TypeScript 타입 정의
 */

/**
 * 월별 트렌드 데이터 포인트
 */
export interface MonthlyTrendData {
  month: string;          // "2025-01", "2025-02" 형식
  monthLabel: string;     // "1월", "2월" 형식
  income: number;         // 수입
  expense: number;        // 지출
  balance: number;        // 순액 (수입 - 지출)
}

/**
 * 카테고리별 지출 데이터
 */
export interface CategoryExpenseData {
  category: string;       // 카테고리 이름
  amount: number;         // 금액
  percentage: number;     // 전체 대비 퍼센트
  color: string;          // 차트 색상
}

/**
 * 요일별 지출 패턴 데이터
 */
export interface WeekdayExpenseData {
  weekday: string;        // "월", "화", "수"...
  weekdayEn: string;      // "Mon", "Tue", "Wed"...
  averageExpense: number; // 평균 지출
  totalExpense: number;   // 총 지출
  transactionCount: number; // 거래 수
}

/**
 * 통계 요약 정보
 */
export interface StatisticsSummary {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  averageDailyExpense: number;
  averageDailyIncome: number;
  transactionCount: number;
  mostExpensiveCategory: string;
  mostExpensiveCategoryAmount: number;
  highestExpenseDay: string;
  highestExpenseAmount: number;
}

/**
 * 통계 데이터 전체
 */
export interface StatisticsData {
  summary: StatisticsSummary;
  monthlyTrend: MonthlyTrendData[];
  categoryExpense: CategoryExpenseData[];
  weekdayExpense: WeekdayExpenseData[];
}

/**
 * 통계 기간 옵션
 */
export type StatisticsPeriod = 'monthly' | '1month' | '3months' | '6months' | '1year' | 'all';

/**
 * 차트 색상 팔레트
 */
export const CHART_COLORS = {
  income: '#10b981',      // 녹색 (수입)
  expense: '#ef4444',     // 빨간색 (지출)
  balance: '#3b82f6',     // 파란색 (순액)
  categories: [
    '#8b5cf6',  // 보라
    '#ec4899',  // 핑크
    '#f59e0b',  // 주황
    '#10b981',  // 녹색
    '#3b82f6',  // 파란
    '#6366f1',  // 인디고
    '#f97316',  // 오렌지
    '#14b8a6',  // 청록
  ],
} as const;
