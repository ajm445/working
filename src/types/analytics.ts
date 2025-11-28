/**
 * Google Analytics 이벤트 및 설정 관련 타입 정의
 */

/**
 * Google Analytics 이벤트 카테고리
 */
export type GAEventCategory =
  | 'Transaction' // 거래 관련
  | 'Navigation' // 네비게이션
  | 'Currency' // 통화 관련
  | 'Auth' // 인증 관련
  | 'Mode' // 앱 모드 전환
  | 'Calendar' // 캘린더
  | 'Statistics' // 통계
  | 'InitialCost'; // 초기비용 계산기

/**
 * Google Analytics 이벤트 액션
 */
export type GAEventAction =
  // Transaction 액션
  | 'add_transaction'
  | 'delete_transaction'
  | 'view_transaction'
  // Navigation 액션
  | 'view_summary'
  | 'view_calendar'
  | 'view_statistics'
  | 'switch_mode'
  // Currency 액션
  | 'change_currency'
  | 'refresh_exchange_rate'
  // Auth 액션
  | 'login'
  | 'logout'
  | 'signup'
  | 'login_attempt'
  // Calendar 액션
  | 'navigate_month'
  | 'select_date'
  | 'view_day_detail'
  // Statistics 액션
  | 'change_period'
  | 'view_chart'
  // InitialCost 액션
  | 'calculate_cost'
  | 'change_region';

/**
 * Google Analytics 이벤트 파라미터
 */
export interface GAEventParams {
  category: GAEventCategory;
  action: GAEventAction;
  label?: string;
  value?: number;
  // 커스텀 디멘션
  transaction_type?: 'income' | 'expense';
  currency?: string;
  app_mode?: 'budget' | 'initial-cost' | 'recurring-expenses';
  view_type?: 'summary' | 'calendar' | 'statistics';
  auth_method?: 'email' | 'google' | 'line';
  is_authenticated?: boolean;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Google Analytics 설정
 */
export interface GAConfig {
  measurementId: string;
  debug?: boolean;
  testMode?: boolean;
}

/**
 * 페이지뷰 파라미터
 */
export interface PageViewParams {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}
