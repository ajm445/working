import React, { useState } from 'react';
import type { JapanCostCategory, JapanRegion } from '../../types/japanCost';
import type { CurrencyCode } from '../../types/currency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';

interface JapanCostCategoryCardProps {
  category: JapanCostCategory;
  currentAmount: number;
  onAmountChange: (amount: number) => void;
  currency: CurrencyCode;
  region: JapanRegion;
}

const JapanCostCategoryCard: React.FC<JapanCostCategoryCardProps> = ({
  category,
  currentAmount,
  onAmountChange,
  currency,
  region
}) => {
  const { convertAmount } = useCurrencyConverter();
  const [inputValue, setInputValue] = useState(currentAmount.toString());

  const regionRange = category.estimatedRange[region];

  // 예상 범위를 현재 선택된 통화로 변환
  const convertedMin = convertAmount(regionRange.min, regionRange.currency, currency);
  const convertedMax = convertAmount(regionRange.max, regionRange.currency, currency);

  const handleInputChange = (value: string): void => {
    setInputValue(value);
    const numericValue = parseFloat(value) || 0;
    onAmountChange(numericValue);
  };

  const handleSuggestionClick = (amount: number): void => {
    const convertedAmount = convertAmount(amount, regionRange.currency, currency);
    setInputValue(convertedAmount.toString());
    onAmountChange(convertedAmount);
  };

  const getCurrencySymbol = (curr: CurrencyCode): string => {
    switch (curr) {
      case 'KRW': return '₩';
      case 'JPY': return '¥';
      case 'USD': return '$';
      default: return '';
    }
  };

  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString();
  };

  const getCategoryColor = (): string => {
    return category.isRequired ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50';
  };

  const getIconBackground = (): string => {
    return category.isRequired ? 'bg-red-100' : 'bg-blue-100';
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getCategoryColor()}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${getIconBackground()} flex items-center justify-center text-lg`}>
          {category.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{category.name}</h3>
            {category.isRequired && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">필수</span>
            )}
          </div>
          <div className="text-xs text-gray-500 mb-1">{category.nameJp}</div>
          <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
        </div>
      </div>

      {/* 예상 범위 표시 */}
      <div className="mb-3 p-3 bg-white rounded-lg">
        <div className="text-xs text-gray-500 mb-1">
          {region === 'tokyo' ? '도쿄' : '오사카'} 예상 범위
        </div>
        <div className="text-sm font-medium text-gray-700">
          {getCurrencySymbol(currency)}{formatNumber(convertedMin)} ~ {getCurrencySymbol(currency)}{formatNumber(convertedMax)}
        </div>

        {/* 빠른 입력 버튼 */}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleSuggestionClick(regionRange.min)}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            최소
          </button>
          <button
            type="button"
            onClick={() => handleSuggestionClick((regionRange.min + regionRange.max) / 2)}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            평균
          </button>
          <button
            type="button"
            onClick={() => handleSuggestionClick(regionRange.max)}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            최대
          </button>
        </div>
      </div>

      {/* 금액 입력 */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{getCurrencySymbol(currency)}</span>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="0"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* 현재 입력된 금액을 다른 통화로 표시 */}
      {currentAmount > 0 && currency !== 'JPY' && (
        <div className="mt-2 text-xs text-gray-500">
          = ¥{formatNumber(convertAmount(currentAmount, currency, 'JPY'))}
        </div>
      )}
      {currentAmount > 0 && currency !== 'KRW' && (
        <div className="mt-1 text-xs text-gray-500">
          = ₩{formatNumber(convertAmount(currentAmount, currency, 'KRW'))}
        </div>
      )}
    </div>
  );
};

export default JapanCostCategoryCard;