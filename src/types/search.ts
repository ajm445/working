import type { TransactionType } from './transaction';

/**
 * 거래 검색 필터 인터페이스
 *
 * 사용자가 설정할 수 있는 모든 검색/필터 조건을 정의합니다.
 */
export interface TransactionSearchFilter {
  /** 검색어 (설명 또는 카테고리 텍스트 검색) */
  searchText?: string;
  /** 거래 타입 필터 (수입/지출/전체) */
  type?: TransactionType | 'all';
  /** 카테고리 필터 (다중 선택 가능) */
  categories?: string[];
  /** 시작 날짜 (YYYY-MM-DD 형식) */
  startDate?: string;
  /** 종료 날짜 (YYYY-MM-DD 형식) */
  endDate?: string;
  /** 최소 금액 (KRW 기준) */
  minAmount?: number;
  /** 최대 금액 (KRW 기준) */
  maxAmount?: number;
}

/**
 * 검색 필터의 초기값
 */
export const initialSearchFilter: TransactionSearchFilter = {
  searchText: '',
  type: 'all',
  categories: [],
  startDate: '',
  endDate: ''
};

/**
 * 검색 결과 통계 인터페이스
 */
export interface SearchResultStats {
  /** 검색 결과 총 개수 */
  totalCount: number;
  /** 검색 결과 중 수입 건수 */
  incomeCount: number;
  /** 검색 결과 중 지출 건수 */
  expenseCount: number;
  /** 검색 결과 총 수입 금액 (KRW 기준) */
  totalIncome: number;
  /** 검색 결과 총 지출 금액 (KRW 기준) */
  totalExpense: number;
  /** 검색 결과 순액 */
  netBalance: number;
}
