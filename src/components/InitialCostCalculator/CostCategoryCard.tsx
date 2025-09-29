import React, { useState } from 'react';
import type { InitialCostCategory, CurrencyCode } from '../../types/initialCost';
import { SUPPORTED_CURRENCIES } from '../../types/currency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';

interface CostCategoryCardProps {
  category: InitialCostCategory;
  currentAmount: number;
  onAmountChange: (amount: number) => void;
  currency: CurrencyCode;
}

const CostCategoryCard: React.FC<CostCategoryCardProps> = ({
  category,
  currentAmount,
  onAmountChange,
  currency
}) => {
  const [inputValue, setInputValue] = useState<string>(currentAmount > 0 ? currentAmount.toString() : '');
  const { convertAmount } = useCurrencyConverter();

  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || '';

  const handleInputChange = (value: string): void => {
    setInputValue(value);
    const numericValue = parseFloat(value) || 0;
    onAmountChange(numericValue);
  };

  const estimatedRangeInCurrentCurrency = {
    min: convertAmount(category.estimatedRange.min, category.estimatedRange.currency, currency),
    max: convertAmount(category.estimatedRange.max, category.estimatedRange.currency, currency)
  };

  const formatAmount = (amount: number): string => {
    if (currency === 'KRW') {
      return Math.round(amount).toLocaleString();
    }
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 border-2 transition-all duration-200 ${
      currentAmount > 0 ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            {category.isRequired && (
              <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                필수
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{category.description}</p>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          예상 금액
        </label>
        <div className="relative">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2 text-sm text-gray-500">
            {currencySymbol}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <div className="flex justify-between">
          <span>예상 범위:</span>
          <span>
            {currencySymbol}{formatAmount(estimatedRangeInCurrentCurrency.min)} ~ {currencySymbol}{formatAmount(estimatedRangeInCurrentCurrency.max)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CostCategoryCard;