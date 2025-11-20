/**
 * 지원되는 통화 코드
 * - KRW: 한국 원화
 * - USD: 미국 달러
 * - JPY: 일본 엔화
 */
export type CurrencyCode = 'KRW' | 'USD' | 'JPY';

/**
 * 통화 정보 인터페이스
 */
export interface Currency {
  /** 통화 코드 (ISO 4217) */
  code: CurrencyCode;
  /** 영문 통화 이름 */
  name: string;
  /** 통화 심볼 (₩, $, ¥) */
  symbol: string;
  /** 한글 통화 이름 */
  nameKo: string;
}

/**
 * 환율 정보 인터페이스
 */
export interface ExchangeRate {
  /** 기준 통화 코드 */
  baseCurrency: CurrencyCode;
  /** 대상 통화 코드 */
  targetCurrency: CurrencyCode;
  /** 환율 (1 기준 통화 = rate 대상 통화) */
  rate: number;
  /** 마지막 업데이트 시각 (ISO 8601 형식) */
  lastUpdated: string;
}

/**
 * 환율 API 응답 인터페이스
 *
 * ExchangeRate-API.com의 응답 형식을 나타냅니다.
 */
export interface ExchangeRateResponse {
  /** API 호출 성공 여부 */
  success: boolean;
  /** Unix 타임스탬프 */
  timestamp: number;
  /** 기준 통화 코드 */
  base: string;
  /** 환율 기준 날짜 */
  date: string;
  /** 통화별 환율 맵 */
  rates: {
    [key: string]: number;
  };
}

/**
 * 지원되는 통화 목록
 *
 * 일본 워킹홀리데이 앱에서 지원하는 3개 통화 (KRW, USD, JPY)
 */
export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'KRW',
    name: 'Korean Won',
    symbol: '₩',
    nameKo: '원'
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    nameKo: '달러'
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    nameKo: '엔'
  }
];

/**
 * 기본 통화 (한국 원화)
 */
export const DEFAULT_CURRENCY: CurrencyCode = 'KRW';