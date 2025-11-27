import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { TransactionFormData, Transaction } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, SUPPORTED_CURRENCIES } from '../../types';
import { convertToKRW, getCurrencySymbol } from '../../utils/currency';
import { useCurrency } from '../../hooks/useCurrency';
import {
  getTodayDateString,
  isValidDate,
  isFutureDate,
  isTooOldDate,
  formatInputDateToKorean,
  formatDateForInput
} from '../../utils/dateUtils';

/**
 * TransactionForm 컴포넌트의 Props 정의
 */
interface TransactionFormProps {
  /** 폼 제출 시 호출되는 콜백 함수 */
  onSubmit: (data: TransactionFormData & { amountInKRW: number }) => void;
  /** 취소 버튼 클릭 시 호출되는 콜백 함수 */
  onCancel: () => void;
  /** 초기 날짜 설정 (YYYY-MM-DD 형식, 선택사항) */
  initialDate?: string | undefined;
  /** 수정할 거래 내역 (편집 모드에서 사용) */
  editingTransaction?: Transaction | null;
  /** 거래 수정 시 호출되는 콜백 함수 (편집 모드에서 사용) */
  onUpdate?: ((id: string, data: TransactionFormData & { amountInKRW: number }) => void) | undefined;
}

/**
 * 거래 내역 추가/수정 폼 컴포넌트
 *
 * 사용자가 수입 또는 지출 거래를 추가하거나 수정할 수 있는 폼을 제공합니다.
 * 다중 통화 지원, 날짜 검증, 환율 변환 기능을 포함합니다.
 *
 * @component
 * @example
 * ```tsx
 * <TransactionForm
 *   onSubmit={handleAddTransaction}
 *   onCancel={handleCancel}
 *   initialDate="2025-11-20"
 * />
 * ```
 */
const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialDate,
  editingTransaction,
  onUpdate
}) => {
  const { currentCurrency } = useCurrency();
  const isEditMode = !!editingTransaction;

  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    category: '',
    description: '',
    type: 'expense',
    currency: currentCurrency,
    date: initialDate || getTodayDateString(), // 초기 날짜가 제공되면 사용, 아니면 오늘 날짜
  });

  // editingTransaction이 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        description: editingTransaction.description,
        type: editingTransaction.type,
        currency: editingTransaction.currency,
        date: formatDateForInput(new Date(editingTransaction.date)),
      });
    }
  }, [editingTransaction]);

  // initialDate가 변경될 때 폼 데이터 업데이트 (편집 모드가 아닐 때만)
  useEffect(() => {
    if (initialDate && !editingTransaction) {
      setFormData(prev => ({
        ...prev,
        date: initialDate,
      }));
    }
  }, [initialDate, editingTransaction]);

  /**
   * 폼 제출 핸들러
   *
   * 입력 데이터의 유효성을 검증하고, 환율 변환 후 부모 컴포넌트에 전달합니다.
   * 편집 모드인 경우 onUpdate를, 추가 모드인 경우 onSubmit 콜백을 호출합니다.
   *
   * @param e - 폼 제출 이벤트
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log('🟡 TransactionForm handleSubmit called');

    // 필수 필드 검증
    if (!formData.amount || !formData.category || !formData.description || !formData.date) {
      toast.error('모든 필드를 입력해 주세요.');
      return;
    }

    // 날짜 유효성 검증
    if (!isValidDate(formData.date)) {
      toast.error('올바른 날짜를 입력해 주세요.');
      return;
    }

    if (isFutureDate(formData.date)) {
      toast.error('미래 날짜는 선택할 수 없습니다.');
      return;
    }

    if (isTooOldDate(formData.date)) {
      toast.error('너무 오래된 날짜입니다. 최근 10년 이내의 날짜를 선택해 주세요.');
      return;
    }

    try {
      const amount = parseFloat(formData.amount);
      const amountInKRW = await convertToKRW(amount, formData.currency);

      if (isEditMode && editingTransaction && onUpdate) {
        // 수정 모드
        console.log('🟡 Calling onUpdate');
        onUpdate(editingTransaction.id, {
          ...formData,
          amountInKRW,
        });
      } else {
        // 추가 모드
        console.log('🟡 Calling onSubmit with data:', { ...formData, amountInKRW });
        onSubmit({
          ...formData,
          amountInKRW,
        });

        // 폼 초기화 (날짜는 오늘로 리셋)
        setFormData({
          amount: '',
          category: '',
          description: '',
          type: 'expense',
          currency: currentCurrency,
          date: getTodayDateString(),
        });
      }
    } catch (error) {
      console.error('환율 변환 실패:', error);
      toast.error('환율 변환 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  /**
   * 폼 입력 필드 변경 핸들러
   *
   * 폼 데이터를 업데이트하며, 거래 타입 변경 시 카테고리를 자동으로 초기화합니다.
   *
   * @param field - 변경할 필드명
   * @param value - 새로운 값
   */
  const handleInputChange = (field: keyof TransactionFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // 타입이 변경되면 카테고리 초기화
      ...(field === 'type' && { category: '' }),
    }));
  };

  /**
   * 금액 입력 핸들러 (쉼표 포맷팅)
   *
   * 입력된 숫자에 천 단위 쉼표를 자동으로 추가합니다.
   *
   * @param value - 입력된 금액 문자열
   */
  const handleAmountChange = (value: string): void => {
    // 숫자와 소수점만 허용
    const numericValue = value.replace(/[^\d.]/g, '');

    // 소수점이 두 개 이상인 경우 방지
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return;
    }

    // 소수점 이하 자릿수 제한 (2자리)
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      amount: numericValue,
    }));
  };

  /**
   * 금액을 쉼표가 포함된 형식으로 표시
   *
   * @param value - 원본 금액 문자열
   * @returns 쉼표가 포함된 금액 문자열
   */
  const formatAmountDisplay = (value?: string): string => {
    if (!value) return '';

    const parts = value.split('.');
    const integerPart = parts[0] ?? '';
    const decimalPart = parts[1];

    // 천 단위 쉼표 추가
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart !== undefined && decimalPart !== ''
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  const categories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const currencySymbol = getCurrencySymbol(formData.currency);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
        {isEditMode ? '내역 수정' : '새 내역 추가'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* 구분 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">구분</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('type', 'income')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-2 border-green-300 dark:border-green-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                }`}
              >
                수입
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('type', 'expense')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-2 border-red-300 dark:border-red-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                }`}
              >
                지출
              </button>
            </div>
          </div>

          {/* 통화 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">통화</label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            >
              {SUPPORTED_CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.nameKo} ({currency.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* 금액 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              금액 ({currencySymbol})
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={formatAmountDisplay(formData.amount)}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              placeholder="0.00"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">카테고리</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            >
              <option value="">카테고리 선택</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 날짜 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">날짜</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              max={getTodayDateString()} // 오늘 이후 날짜 선택 방지
            />
            {formData.date && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                선택된 날짜: {formatInputDateToKorean(formData.date)}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">설명</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              placeholder="간단한 설명"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            {isEditMode ? '수정하기' : '추가하기'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;