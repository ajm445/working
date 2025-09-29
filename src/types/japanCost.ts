import type { CurrencyCode } from './currency';

export type JapanRegion = 'tokyo' | 'osaka';

export type JapanCostCategoryType =
  | 'pre-departure'  // 출국 전 준비
  | 'settlement'     // 입국 후 정착
  | 'housing'        // 주거
  | 'transportation' // 교통
  | 'education'      // 교육
  | 'lifestyle'      // 생활
  | 'emergency';     // 비상

export interface JapanRegionCostRange {
  min: number;
  max: number;
  currency: CurrencyCode;
}

export interface JapanCostCategory {
  id: string;
  name: string;
  nameJp: string;
  icon: string;
  description: string;
  descriptionJp: string;
  isRequired: boolean;
  category: JapanCostCategoryType;
  estimatedRange: {
    tokyo: JapanRegionCostRange;
    osaka: JapanRegionCostRange;
  };
}

export interface JapanCostItem {
  categoryId: string;
  amount: number;
  currency: CurrencyCode;
  region: JapanRegion;
  description?: string;
  isEstimated: boolean;
}

export interface JapanRegionInfo {
  code: JapanRegion;
  name: string;
  nameKo: string;
  nameJp: string;
  flag: string;
  description: string;
  descriptionJp: string;
  currency: CurrencyCode;
  averageRent: {
    shareHouse: { min: number; max: number };
    oneRoom: { min: number; max: number };
  };
  averageWage: {
    partTime: { min: number; max: number };    // 시급
    fullTime: { min: number; max: number };    // 월급
  };
}

export interface JapanCostCalculation {
  items: JapanCostItem[];
  totalByCategory: { [categoryId: string]: number };
  totalByGroup: { [groupType: string]: number };
  grandTotal: number;
  targetCurrency: CurrencyCode;
  region: JapanRegion;
  createdAt: string;
}

export interface JapanCategoryGroup {
  name: string;
  nameJp: string;
  icon: string;
  description: string;
  color: string;
}