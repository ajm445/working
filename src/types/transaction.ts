import type { CurrencyCode } from './currency';

/**
 * 거래 내역 인터페이스
 *
 * 수입 또는 지출 거래의 전체 정보를 나타냅니다.
 */
export interface Transaction {
  /** 거래 고유 ID (UUID 또는 로컬 ID) */
  id: string;
  /** 거래 타입 (수입/지출) */
  type: 'income' | 'expense';
  /** 거래 금액 (원본 통화 기준) */
  amount: number;
  /** 거래 카테고리 (식비, 급여 등) */
  category: string;
  /** 거래 설명 */
  description: string;
  /** 거래 날짜 (한국어 형식 또는 ISO 형식) */
  date: string;
  /** 거래 통화 코드 (KRW, USD, JPY) */
  currency: CurrencyCode;
  /** 원화 기준 환산 금액 */
  amountInKRW: number;
}

/**
 * 거래 타입
 * - income: 수입
 * - expense: 지출
 */
export type TransactionType = 'income' | 'expense';

/**
 * 거래 폼 데이터 인터페이스
 *
 * 사용자 입력 폼에서 사용되는 거래 데이터 형식입니다.
 */
export interface TransactionFormData {
  /** 거래 금액 (문자열, 입력 폼용) */
  amount: string;
  /** 거래 카테고리 */
  category: string;
  /** 거래 설명 */
  description: string;
  /** 거래 타입 (수입/지출) */
  type: TransactionType;
  /** 거래 통화 코드 */
  currency: CurrencyCode;
  /** 사용자가 선택한 날짜 (YYYY-MM-DD 형식) */
  date: string;
}

/**
 * 지출 카테고리 목록
 * 일본 워킹홀리데이 관련 주요 지출 항목
 */
export const EXPENSE_CATEGORIES = [
  '식비',
  '숙박',
  '교통',
  '쇼핑',
  '의료',
  '통신',
  '기타'
] as const;

/**
 * 수입 카테고리 목록
 * 워킹홀리데이 기간 중 주요 수입원
 */
export const INCOME_CATEGORIES = [
  '급여',
  '용돈',
  '기타수입'
] as const;

/**
 * 지출 카테고리 타입
 */
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

/**
 * 수입 카테고리 타입
 */
export type IncomeCategory = typeof INCOME_CATEGORIES[number];

/**
 * 전체 거래 카테고리 타입 (수입 + 지출)
 */
export type TransactionCategory = ExpenseCategory | IncomeCategory;