export type CurrencyCode = 'KRW' | 'USD' | 'JPY';

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  nameKo: string;
}

export interface ExchangeRate {
  baseCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  rate: number;
  lastUpdated: string;
}

export interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

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

export const DEFAULT_CURRENCY: CurrencyCode = 'KRW';