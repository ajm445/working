import axios from 'axios';
import type { ExchangeRateResponse, CurrencyCode } from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../types/currency';

// 환율 API - ExchangeRate API (무료)
const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/KRW';

// 환율 캐시 (1시간 유지)
interface CachedExchangeRate {
  rates: { [key: string]: number };
  timestamp: number;
}

let exchangeRateCache: CachedExchangeRate | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

export const fetchExchangeRates = async (): Promise<{ [key: string]: number }> => {
  // 캐시 확인
  if (exchangeRateCache && Date.now() - exchangeRateCache.timestamp < CACHE_DURATION) {
    return exchangeRateCache.rates;
  }

  try {
    const response = await axios.get<ExchangeRateResponse>(EXCHANGE_RATE_API_URL, {
      timeout: 10000 // 10초 타임아웃
    });

    if (response.data && response.data.rates) {
      const rates = response.data.rates;

      // 캐시 업데이트
      exchangeRateCache = {
        rates,
        timestamp: Date.now()
      };

      return rates;
    } else {
      throw new Error('Invalid exchange rate response');
    }
  } catch (error) {
    console.error('환율 정보를 가져오는데 실패했습니다:', error);

    // API 실패 시 기본 환율 사용 (근사치)
    return getDefaultExchangeRates();
  }
};

// API 실패 시 사용할 기본 환율 (2024년 기준 근사치)
const getDefaultExchangeRates = (): { [key: string]: number } => {
  return {
    USD: 0.00076, // 1원 = 0.00076달러 (약 1달러 = 1320원)
    JPY: 0.11,    // 1원 = 0.11엔 (약 1엔 = 9원)
    KRW: 1        // 기준 통화
  };
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

  // 각 통화별 포맷팅
  switch (currency) {
    case 'KRW':
      return `₩${Math.round(amount).toLocaleString()}`;
    case 'USD':
      return `$${amount.toFixed(2)}`;
    case 'JPY':
      return `¥${Math.round(amount).toLocaleString()}`;
    default:
      return `${currencyInfo.symbol}${amount.toLocaleString()}`;
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