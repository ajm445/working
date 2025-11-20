/**
 * Google Analytics 컨텍스트
 * - Google Analytics 초기화 및 이벤트 추적 관리
 * - 페이지뷰 및 커스텀 이벤트 전송
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import ReactGA from 'react-ga4';
import type {
  GAEventParams,
  PageViewParams,
  GAConfig,
} from '../types/analytics';

interface AnalyticsContextType {
  /** Google Analytics 초기화 여부 */
  isInitialized: boolean;
  /** 이벤트 추적 함수 */
  trackEvent: (params: GAEventParams) => void;
  /** 페이지뷰 추적 함수 */
  trackPageView: (params?: PageViewParams) => void;
  /** 사용자 속성 설정 */
  setUserProperties: (properties: Record<string, string | number>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: Partial<GAConfig>;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  config = {},
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Google Analytics 초기화
  useEffect(() => {
    const measurementId =
      config.measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (!measurementId) {
      console.warn(
        'Google Analytics Measurement ID가 설정되지 않았습니다. ' +
          'VITE_GA_MEASUREMENT_ID 환경 변수를 설정해주세요.'
      );
      return;
    }

    try {
      ReactGA.initialize(measurementId, {
        testMode: config.testMode || import.meta.env.DEV,
        gaOptions: {
          debug_mode: config.debug || import.meta.env.DEV,
        },
      });

      setIsInitialized(true);

      if (import.meta.env.DEV) {
        console.log('✅ Google Analytics 초기화 완료:', measurementId);
      }
    } catch (error) {
      console.error('Google Analytics 초기화 실패:', error);
    }
  }, [config.measurementId, config.testMode, config.debug]);

  /**
   * 이벤트 추적
   */
  const trackEvent = useCallback(
    (params: GAEventParams) => {
      if (!isInitialized) {
        if (import.meta.env.DEV) {
          console.log('[GA 미초기화] 이벤트:', params);
        }
        return;
      }

      try {
        const { category, action, label, value, ...customParams } = params;

        // ReactGA.event는 특정 타입만 허용하므로 별도 처리
        const eventData = {
          category,
          action,
          ...(label !== undefined && { label }),
          ...(value !== undefined && { value }),
          ...customParams,
        };

        ReactGA.event(eventData as never);

        if (import.meta.env.DEV) {
          console.log('📊 GA 이벤트:', {
            category,
            action,
            label,
            value,
            ...customParams,
          });
        }
      } catch (error) {
        console.error('이벤트 추적 실패:', error);
      }
    },
    [isInitialized]
  );

  /**
   * 페이지뷰 추적
   */
  const trackPageView = useCallback(
    (params?: PageViewParams) => {
      if (!isInitialized) {
        if (import.meta.env.DEV) {
          console.log('[GA 미초기화] 페이지뷰:', params);
        }
        return;
      }

      try {
        ReactGA.send({
          hitType: 'pageview',
          page: params?.page_path || window.location.pathname,
          title: params?.page_title || document.title,
          ...params,
        });

        if (import.meta.env.DEV) {
          console.log('📄 GA 페이지뷰:', params);
        }
      } catch (error) {
        console.error('페이지뷰 추적 실패:', error);
      }
    },
    [isInitialized]
  );

  /**
   * 사용자 속성 설정
   */
  const setUserProperties = useCallback(
    (properties: Record<string, string | number>) => {
      if (!isInitialized) {
        if (import.meta.env.DEV) {
          console.log('[GA 미초기화] 사용자 속성:', properties);
        }
        return;
      }

      try {
        ReactGA.set(properties);

        if (import.meta.env.DEV) {
          console.log('👤 GA 사용자 속성:', properties);
        }
      } catch (error) {
        console.error('사용자 속성 설정 실패:', error);
      }
    },
    [isInitialized]
  );

  const value: AnalyticsContextType = {
    isInitialized,
    trackEvent,
    trackPageView,
    setUserProperties,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
