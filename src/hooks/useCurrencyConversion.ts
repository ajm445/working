import { useState, useEffect, useCallback } from 'react';
import type { CurrencyCode } from '../types/currency';
import { convertFromKRW } from '../utils/currency';
import { useCurrency } from './useCurrency';

// 기존 훅 (특정 금액 변환용)
export const useCurrencyConversion = (amountInKRW: number): {
  convertedAmount: number;
  currency: CurrencyCode;
  isConverting: boolean;
} => {
  const { currentCurrency, exchangeRates } = useCurrency();
  const [convertedAmount, setConvertedAmount] = useState<number>(amountInKRW);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  useEffect(() => {
    const convertAmount = async (): Promise<void> => {
      if (currentCurrency === 'KRW') {
        setConvertedAmount(amountInKRW);
        return;
      }

      if (!exchangeRates) {
        // 환율 정보가 없으면 원화 그대로 표시
        setConvertedAmount(amountInKRW);
        return;
      }

      setIsConverting(true);
      try {
        const converted = await convertFromKRW(amountInKRW, currentCurrency);
        setConvertedAmount(converted);
      } catch (error) {
        console.error('통화 변환 실패:', error);
        // 실패 시 원화 금액 그대로 표시
        setConvertedAmount(amountInKRW);
      } finally {
        setIsConverting(false);
      }
    };

    convertAmount();
  }, [amountInKRW, currentCurrency, exchangeRates]);

  return {
    convertedAmount,
    currency: currentCurrency,
    isConverting
  };
};

// 새로운 훅 (유연한 통화 변환용)
export const useCurrencyConverter = (): {
  convertAmount: (amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode) => number;
  isReady: boolean;
} => {
  const { exchangeRates } = useCurrency();

  const convertAmount = useCallback((
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
  ): number => {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    if (!exchangeRates) {
      // 환율 정보가 없으면 원본 금액 반환
      return amount;
    }

    try {
      if (fromCurrency === 'KRW') {
        // KRW에서 다른 통화로
        const rate = exchangeRates[toCurrency];
        return rate ? amount * rate : amount;
      } else if (toCurrency === 'KRW') {
        // 다른 통화에서 KRW로
        const rate = exchangeRates[fromCurrency];
        return rate ? amount / rate : amount;
      } else {
        // 다른 통화 간 변환 (KRW를 중간 단계로 사용)
        const fromRate = exchangeRates[fromCurrency];
        const toRate = exchangeRates[toCurrency];
        if (fromRate && toRate) {
          const krwAmount = amount / fromRate;
          return krwAmount * toRate;
        }
        return amount;
      }
    } catch (error) {
      console.error('통화 변환 실패:', error);
      return amount;
    }
  }, [exchangeRates]);

  return {
    convertAmount,
    isReady: !!exchangeRates
  };
};