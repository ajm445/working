import React, { useState } from 'react';
import type { TransactionFormData } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, SUPPORTED_CURRENCIES } from '../../types';
import { convertToKRW, getCurrencySymbol } from '../../utils/currency';
import { useCurrency } from '../../hooks/useCurrency';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData & { amountInKRW: number }) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel }) => {
  const { currentCurrency } = useCurrency();
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    category: '',
    description: '',
    type: 'expense',
    currency: currentCurrency,
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.description) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    try {
      const amount = parseFloat(formData.amount);
      const amountInKRW = await convertToKRW(amount, formData.currency);

      onSubmit({
        ...formData,
        amountInKRW,
      });

      // 폼 초기화
      setFormData({
        amount: '',
        category: '',
        description: '',
        type: 'expense',
        currency: currentCurrency,
      });
    } catch (error) {
      console.error('환율 변환 실패:', error);
      alert('환율 변환 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // 타입이 변경되면 카테고리 초기화
      ...(field === 'type' && { category: '' }),
    }));
  };

  const categories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const currencySymbol = getCurrencySymbol(formData.currency);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">새 내역 추가</h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* 구분 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">구분</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('type', 'income')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                }`}
              >
                수입
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('type', 'expense')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-red-100 text-red-800 border-2 border-red-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                }`}
              >
                지출
              </button>
            </div>
          </div>

          {/* 통화 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">통화</label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {SUPPORTED_CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.nameKo} ({currency.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* 금액 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              금액 ({currencySymbol})
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">카테고리 선택</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="간단한 설명"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            추가하기
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;