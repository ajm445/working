import React, { useState, useEffect } from 'react';
import type { SavingsGoalFormData } from '../../types/savingsGoal';
import type { CurrencyCode } from '../../types/currency';
import { SAVINGS_GOAL_CATEGORIES as CATEGORIES } from '../../types/savingsGoal';

interface SavingsGoalFormProps {
  /** 수정할 저축 목표 (수정 모드인 경우) */
  initialData?: SavingsGoalFormData;
  /** 현재 선택된 통화 */
  currentCurrency: CurrencyCode;
  /** 환율 정보 */
  exchangeRates: Record<CurrencyCode, number> | null;
  /** 폼 제출 시 호출되는 콜백 */
  onSubmit: (data: SavingsGoalFormData) => void;
  /** 폼 취소 시 호출되는 콜백 */
  onCancel: () => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({
  initialData,
  currentCurrency,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<SavingsGoalFormData>(
    initialData || {
      name: '',
      target_amount: '',
      current_amount: '0',
      currency: currentCurrency,
      deadline: '',
      category: '',
      description: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 현재 통화 변경 시 폼 데이터 업데이트
  useEffect(() => {
    if (!initialData) {
      setFormData(prev => ({ ...prev, currency: currentCurrency }));
    }
  }, [currentCurrency, initialData]);

  /**
   * 폼 필드 변경 핸들러
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * 폼 유효성 검사
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '목표 이름을 입력해주세요.';
    }

    const targetAmount = parseFloat(formData.target_amount);
    if (!formData.target_amount || isNaN(targetAmount) || targetAmount <= 0) {
      newErrors.target_amount = '목표 금액을 입력해주세요.';
    }

    const currentAmount = parseFloat(formData.current_amount);
    if (formData.current_amount && (isNaN(currentAmount) || currentAmount < 0)) {
      newErrors.current_amount = '현재 금액은 0 이상이어야 합니다.';
    }

    if (formData.deadline) {
      const deadline = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadline < today) {
        newErrors.deadline = '목표 기한은 오늘 이후여야 합니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {initialData ? '저축 목표 수정' : '새 저축 목표'}
          </h2>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 목표 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              목표 이름 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="예: 여행 자금, 비상금 등"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
                errors.name
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* 목표 금액 & 현재 금액 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                목표 금액 *
              </label>
              <input
                type="number"
                id="target_amount"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
                  errors.target_amount
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.target_amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.target_amount}</p>
              )}
            </div>

            <div>
              <label htmlFor="current_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                현재 금액
              </label>
              <input
                type="number"
                id="current_amount"
                name="current_amount"
                value={formData.current_amount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
                  errors.current_amount
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.current_amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.current_amount}</p>
              )}
            </div>
          </div>

          {/* 통화 & 목표 기한 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                통화
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
              >
                <option value="KRW">KRW (원)</option>
                <option value="USD">USD ($)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                목표 기한
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
                  errors.deadline
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>
              )}
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              카테고리
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
            >
              <option value="">선택 안 함</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="목표에 대한 추가 설명을 입력하세요."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-300"
            >
              {initialData ? '수정하기' : '추가하기'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-300"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingsGoalForm;
