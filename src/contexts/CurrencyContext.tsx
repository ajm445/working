/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import type { ReactNode } from 'react';
import type { CurrencyCode } from '../types/currency';
import { DEFAULT_CURRENCY } from '../types/currency';
import { fetchExchangeRates, getExchangeRateSource } from '../utils/currency';

export interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrentCurrency: (currency: CurrencyCode) => void;
  exchangeRates: { [key: string]: number } | null;
  isLoadingRates: boolean;
  lastUpdated: string | null;
  exchangeRateSource: 'api' | 'localStorage' | 'default' | null;
  refreshExchangeRates: () => Promise<void>;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number } | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [exchangeRateSource, setExchangeRateSource] = useState<'api' | 'localStorage' | 'default' | null>(null);

  // 초기 로드 여부 추적 (중복 토스트 방지)
  const isInitialLoad = useRef(true);

  // useCallback으로 메모이제이션하여 불필요한 재생성 방지
  const refreshExchangeRates = useCallback(async (): Promise<void> => {
    setIsLoadingRates(true);
    try {
      const rates = await fetchExchangeRates();
      setExchangeRates(rates);
      setLastUpdated(new Date().toLocaleString('ko-KR'));

      // 환율 출처 확인 및 상태 업데이트
      const source = getExchangeRateSource();
      setExchangeRateSource(source);

      // 초기 로드 시에는 토스트를 표시하지 않음 (중복 방지)
      if (isInitialLoad.current) {
        console.log('📊 Initial exchange rates loaded:', source);
        isInitialLoad.current = false;
        return;
      }

      // 사용자에게 환율 출처 알림 (중복 방지를 위해 고유 ID 사용)
      if (source === 'localStorage') {
        toast('네트워크 오류로 저장된 환율 정보를 사용합니다.', {
          id: 'exchange-rate-localStorage', // 중복 방지
          duration: 4000,
          icon: '💾',
          style: {
            background: '#f59e0b',
            color: '#fff',
          },
        });
      } else if (source === 'default') {
        toast.error('환율 정보를 가져오는데 실패했습니다. 기본 환율이 적용됩니다.', {
          id: 'exchange-rate-error', // 중복 방지
          duration: 4000,
          icon: '⚠️',
        });
      } else if (source === 'api') {
        toast.success('환율 정보가 업데이트되었습니다.', {
          id: 'exchange-rate-success', // 중복 방지
          duration: 2000,
          icon: '✓',
        });
      }
    } catch (error) {
      console.error('환율 갱신 실패:', error);
      // fetchExchangeRates 내부에서 이미 fallback 처리되므로
      // 여기서는 추가 에러 처리 불필요
    } finally {
      setIsLoadingRates(false);
    }
  }, []); // exchangeRates 의존성 제거하여 무한 재생성 방지

  // 컴포넌트 마운트 시 환율 정보 로드
  useEffect((): void => {
    refreshExchangeRates();
  }, [refreshExchangeRates]);

  // 1시간마다 자동으로 환율 정보 갱신
  useEffect((): (() => void) => {
    const interval = setInterval((): void => {
      refreshExchangeRates();
    }, 60 * 60 * 1000); // 1시간

    return (): void => clearInterval(interval);
  }, [refreshExchangeRates]);

  const value: CurrencyContextType = {
    currentCurrency,
    setCurrentCurrency,
    exchangeRates,
    isLoadingRates,
    lastUpdated,
    exchangeRateSource,
    refreshExchangeRates,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};