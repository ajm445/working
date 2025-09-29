import type { CurrencyCode } from './currency';

export type { CurrencyCode };

export interface InitialCostCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  isRequired: boolean;
  estimatedRange: {
    min: number;
    max: number;
    currency: CurrencyCode;
  };
}

export interface InitialCostItem {
  categoryId: string;
  amount: number;
  currency: CurrencyCode;
  description?: string;
  isEstimated: boolean;
}

export interface InitialCostCalculation {
  items: InitialCostItem[];
  totalByCategory: { [categoryId: string]: number };
  grandTotal: number;
  targetCurrency: CurrencyCode;
  createdAt: string;
  countryDestination: string;
}

export type CountryDestination = 'australia' | 'canada' | 'newzealand' | 'uk' | 'japan';

export interface CountryInfo {
  code: CountryDestination;
  name: string;
  nameKo: string;
  currency: CurrencyCode;
  flag: string;
}