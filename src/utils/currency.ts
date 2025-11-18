import axios from 'axios';
import type { ExchangeRateResponse, CurrencyCode } from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../types/currency';

// 환율 API - ExchangeRate API (무료)
const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/KRW';

// 환율 캐시 (1시간 유지)
interface CachedExchangeRate {
  rates: { [key: string]: number };
  timestamp: number;
  source: 'api' | 'localStorage' | 'default';
}

let exchangeRateCache: CachedExchangeRate | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1시간
const LOCALSTORAGE_KEY = 'exchange_rates_cache';

export const fetchExchangeRates = async (): Promise<{ [key: string]: number }> => {
  // 메모리 캐시 확인 (1시간 유효)
  if (exchangeRateCache && Date.now() - exchangeRateCache.timestamp < CACHE_DURATION) {
    return exchangeRateCache.rates;
  }

  try {
    const response = await axios.get<ExchangeRateResponse>(EXCHANGE_RATE_API_URL, {
      timeout: 10000 // 10초 타임아웃
    });

    if (response.data && response.data.rates) {
      const rates = response.data.rates;

      // 메모리 캐시 업데이트
      exchangeRateCache = {
        rates,
        timestamp: Date.now(),
        source: 'api'
      };

      // LocalStorage에 저장 (백업용)
      saveExchangeRatesToStorage(rates);

      return rates;
    } else {
      throw new Error('Invalid exchange rate response');
    }
  } catch (error) {
    console.error('환율 정보를 가져오는데 실패했습니다:', error);

    // 1단계: LocalStorage에서 캐시된 환율 시도
    const storedRates = loadExchangeRatesFromStorage();
    if (storedRates) {
      console.log('LocalStorage에 저장된 환율 정보를 사용합니다.');
      exchangeRateCache = {
        rates: storedRates.rates,
        timestamp: storedRates.timestamp,
        source: 'localStorage'
      };
      return storedRates.rates;
    }

    // 2단계: 모든 캐시 실패 시 기본 환율 사용
    console.log('기본 환율을 사용합니다.');
    const defaultRates = getDefaultExchangeRates();
    exchangeRateCache = {
      rates: defaultRates,
      timestamp: Date.now(),
      source: 'default'
    };
    return defaultRates;
  }
};

// API 실패 시 사용할 기본 환율 (2025년 1월 기준 근사치)
const getDefaultExchangeRates = (): { [key: string]: number } => {
  return {
    USD: 0.00071, // 1원 = 0.00071달러 (약 1달러 = 1410원)
    JPY: 0.106,   // 1원 = 0.106엔 (약 1엔 = 9.4원)
    KRW: 1        // 기준 통화
  };
};

// LocalStorage에서 캐시된 환율 가져오기
const loadExchangeRatesFromStorage = (): CachedExchangeRate | null => {
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CachedExchangeRate;
      // 캐시가 24시간 이내인지 확인 (LocalStorage는 더 길게 유지)
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('LocalStorage에서 환율 정보를 불러오는데 실패했습니다:', error);
  }
  return null;
};

// LocalStorage에 환율 저장
const saveExchangeRatesToStorage = (rates: { [key: string]: number }): void => {
  try {
    const cacheData: CachedExchangeRate = {
      rates,
      timestamp: Date.now(),
      source: 'api'
    };
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('LocalStorage에 환율 정보를 저장하는데 실패했습니다:', error);
  }
};

// 현재 환율 정보의 출처 가져오기
export const getExchangeRateSource = (): 'api' | 'localStorage' | 'default' | null => {
  return exchangeRateCache?.source || null;
};

// 원화를 다른 통화로 변환
export const convertFromKRW = async (amount: number, targetCurrency: CurrencyCode): Promise<number> => {
  if (targetCurrency === 'KRW') return amount;

  const rates = await fetchExchangeRates();
  const rate = rates[targetCurrency];

  if (!rate) {
    throw new Error(`Exchange rate for ${targetCurrency} not found`);
  }

  return amount * rate;
};

// 다른 통화를 원화로 변환
export const convertToKRW = async (amount: number, fromCurrency: CurrencyCode): Promise<number> => {
  if (fromCurrency === 'KRW') return amount;

  const rates = await fetchExchangeRates();
  const rate = rates[fromCurrency];

  if (!rate) {
    throw new Error(`Exchange rate for ${fromCurrency} not found`);
  }

  return amount / rate;
};

// 통화 포맷팅
export const formatCurrency = (amount: number, currency: CurrencyCode): string => {
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);

  if (!currencyInfo) {
    return `${amount.toLocaleString()}`;
  }

  // 금액이 0일 때는 심볼을 앞에, 0이 아닐 때는 뒤에
  const isZero = amount === 0;

  switch (currency) {
    case 'KRW':
      return isZero ? '₩0' : `${Math.round(amount).toLocaleString()}₩`;
    case 'USD':
      return isZero ? '$0' : `${amount.toFixed(2)}$`;
    case 'JPY':
      return isZero ? '¥0' : `${Math.round(amount).toLocaleString()}¥`;
    default:
      return isZero ? `${currencyInfo.symbol}0` : `${amount.toLocaleString()}${currencyInfo.symbol}`;
  }
};

// 통계 분석용 통화 포맷팅 (심볼을 뒤에 배치)
export const formatCurrencyForStats = (amount: number, currency: CurrencyCode): string => {
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);

  if (!currencyInfo) {
    return `${amount.toLocaleString()}`;
  }

  // 금액이 0일 때는 심볼을 앞에, 0이 아닐 때는 뒤에
  const isZero = amount === 0;

  switch (currency) {
    case 'KRW':
      return isZero ? '₩0' : `${Math.round(amount).toLocaleString()}₩`;
    case 'USD':
      return isZero ? '$0' : `${amount.toFixed(2)}$`;
    case 'JPY':
      return isZero ? '¥0' : `${Math.round(amount).toLocaleString()}¥`;
    default:
      return isZero ? `${currencyInfo.symbol}0` : `${amount.toLocaleString()}${currencyInfo.symbol}`;
  }
};

// 통화 심볼 가져오기
export const getCurrencySymbol = (currency: CurrencyCode): string => {
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);
  return currencyInfo?.symbol || currency;
};

// 통화명 가져오기 (한국어)
export const getCurrencyNameKo = (currency: CurrencyCode): string => {
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);
  return currencyInfo?.nameKo || currency;
};