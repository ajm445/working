/**
 * Google Analytics 이벤트 추적 커스텀 훅
 * - 자주 사용하는 이벤트 추적 함수들을 제공
 */

import { useCallback } from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import type { CurrencyCode } from '../types/currency';
import type { TransactionType } from '../types/transaction';

/**
 * 분석 이벤트 추적 훅
 */
export const useAnalyticsEvent = () => {
  const { trackEvent, trackPageView, setUserProperties } = useAnalytics();

  /**
   * 거래 추가 이벤트
   */
  const trackAddTransaction = useCallback(
    (type: TransactionType, currency: CurrencyCode, amount: number) => {
      trackEvent({
        category: 'Transaction',
        action: 'add_transaction',
        label: `${type}_${currency}`,
        value: amount,
        transaction_type: type,
        currency,
      });
    },
    [trackEvent]
  );

  /**
   * 거래 삭제 이벤트
   */
  const trackDeleteTransaction = useCallback(
    (type: TransactionType, currency: CurrencyCode) => {
      trackEvent({
        category: 'Transaction',
        action: 'delete_transaction',
        label: `${type}_${currency}`,
        transaction_type: type,
        currency,
      });
    },
    [trackEvent]
  );

  /**
   * 통화 변경 이벤트
   */
  const trackChangeCurrency = useCallback(
    (fromCurrency: CurrencyCode, toCurrency: CurrencyCode) => {
      trackEvent({
        category: 'Currency',
        action: 'change_currency',
        label: `${fromCurrency}_to_${toCurrency}`,
        currency: toCurrency,
      });
    },
    [trackEvent]
  );

  /**
   * 환율 갱신 이벤트
   */
  const trackRefreshExchangeRate = useCallback(() => {
    trackEvent({
      category: 'Currency',
      action: 'refresh_exchange_rate',
    });
  }, [trackEvent]);

  /**
   * 뷰 전환 이벤트
   */
  const trackViewChange = useCallback(
    (viewType: 'summary' | 'calendar' | 'statistics' | 'recurring-expenses' | 'savings-goals') => {
      trackEvent({
        category: 'Navigation',
        action:
          viewType === 'summary'
            ? 'view_summary'
            : viewType === 'calendar'
              ? 'view_calendar'
              : viewType === 'statistics'
                ? 'view_statistics'
                : viewType === 'savings-goals'
                  ? 'view_savings_goals'
                  : 'view_recurring_expenses',
        view_type: viewType,
      });
    },
    [trackEvent]
  );

  /**
   * 앱 모드 전환 이벤트
   */
  const trackModeSwitch = useCallback(
    (mode: 'budget' | 'initial-cost' | 'recurring-expenses') => {
      trackEvent({
        category: 'Mode',
        action: 'switch_mode',
        label: mode,
        app_mode: mode,
      });
    },
    [trackEvent]
  );

  /**
   * 로그인 이벤트
   */
  const trackLogin = useCallback(
    (method: 'email' | 'google' | 'line', success: boolean) => {
      trackEvent({
        category: 'Auth',
        action: success ? 'login' : 'login_attempt',
        label: method,
        auth_method: method,
        value: success ? 1 : 0,
      });
    },
    [trackEvent]
  );

  /**
   * 로그아웃 이벤트
   */
  const trackLogout = useCallback(() => {
    trackEvent({
      category: 'Auth',
      action: 'logout',
    });
  }, [trackEvent]);

  /**
   * 회원가입 이벤트
   */
  const trackSignup = useCallback(
    (method: 'email' | 'google' | 'line') => {
      trackEvent({
        category: 'Auth',
        action: 'signup',
        label: method,
        auth_method: method,
      });
    },
    [trackEvent]
  );

  /**
   * 캘린더 월 네비게이션 이벤트
   */
  const trackNavigateMonth = useCallback(
    (direction: 'prev' | 'next' | 'today') => {
      trackEvent({
        category: 'Calendar',
        action: 'navigate_month',
        label: direction,
      });
    },
    [trackEvent]
  );

  /**
   * 캘린더 날짜 선택 이벤트
   */
  const trackSelectDate = useCallback(
    (date: string) => {
      trackEvent({
        category: 'Calendar',
        action: 'select_date',
        label: date,
      });
    },
    [trackEvent]
  );

  /**
   * 일일 상세 모달 열기 이벤트
   */
  const trackViewDayDetail = useCallback(
    (date: string, transactionCount: number) => {
      trackEvent({
        category: 'Calendar',
        action: 'view_day_detail',
        label: date,
        value: transactionCount,
      });
    },
    [trackEvent]
  );

  /**
   * 통계 기간 변경 이벤트
   */
  const trackChangePeriod = useCallback(
    (period: string) => {
      trackEvent({
        category: 'Statistics',
        action: 'change_period',
        label: period,
      });
    },
    [trackEvent]
  );

  /**
   * 차트 조회 이벤트
   */
  const trackViewChart = useCallback(
    (chartType: 'monthly' | 'category' | 'weekday') => {
      trackEvent({
        category: 'Statistics',
        action: 'view_chart',
        label: chartType,
      });
    },
    [trackEvent]
  );

  /**
   * 초기비용 계산 이벤트
   */
  const trackCalculateCost = useCallback(
    (region: string, totalCost: number) => {
      trackEvent({
        category: 'InitialCost',
        action: 'calculate_cost',
        label: region,
        value: totalCost,
      });
    },
    [trackEvent]
  );

  /**
   * 지역 변경 이벤트
   */
  const trackChangeRegion = useCallback(
    (fromRegion: string, toRegion: string) => {
      trackEvent({
        category: 'InitialCost',
        action: 'change_region',
        label: `${fromRegion}_to_${toRegion}`,
      });
    },
    [trackEvent]
  );

  /**
   * 페이지뷰 추적 (래퍼)
   */
  const trackPage = useCallback(
    (path?: string, title?: string) => {
      const params: Record<string, string> = {};

      if (path !== undefined) {
        params.page_path = path;
      }

      if (title !== undefined) {
        params.page_title = title;
      }

      trackPageView(params);
    },
    [trackPageView]
  );

  /**
   * 사용자 속성 설정 (래퍼)
   */
  const setUser = useCallback(
    (userId: string, properties?: Record<string, string | number>) => {
      setUserProperties({
        user_id: userId,
        ...properties,
      });
    },
    [setUserProperties]
  );

  return {
    // 거래 관련
    trackAddTransaction,
    trackDeleteTransaction,

    // 통화 관련
    trackChangeCurrency,
    trackRefreshExchangeRate,

    // 네비게이션 관련
    trackViewChange,
    trackModeSwitch,

    // 인증 관련
    trackLogin,
    trackLogout,
    trackSignup,

    // 캘린더 관련
    trackNavigateMonth,
    trackSelectDate,
    trackViewDayDetail,

    // 통계 관련
    trackChangePeriod,
    trackViewChart,

    // 초기비용 계산기 관련
    trackCalculateCost,
    trackChangeRegion,

    // 일반
    trackPage,
    setUser,
  };
};
