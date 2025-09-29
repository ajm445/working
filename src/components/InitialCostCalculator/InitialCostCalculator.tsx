import React, { useState, useMemo } from 'react';
import type { InitialCostItem, CountryDestination } from '../../types/initialCost';
import { INITIAL_COST_CATEGORIES, SUPPORTED_COUNTRIES } from '../../data/initialCostCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';
import CountrySelector from './CountrySelector';
import CostCategoryCard from './CostCategoryCard';
import CostSummary from './CostSummary';

const InitialCostCalculator: React.FC = () => {
  const { currentCurrency } = useCurrency();
  const { convertAmount } = useCurrencyConverter();
  const [selectedCountry, setSelectedCountry] = useState<CountryDestination>('australia');
  const [costItems, setCostItems] = useState<InitialCostItem[]>([]);

  const selectedCountryInfo = SUPPORTED_COUNTRIES.find(c => c.code === selectedCountry);

  const handleCostChange = (categoryId: string, amount: number): void => {
    setCostItems(prev => {
      const existingIndex = prev.findIndex(item => item.categoryId === categoryId);
      const newItem: InitialCostItem = {
        categoryId,
        amount,
        currency: currentCurrency,
        isEstimated: false
      };

      if (existingIndex >= 0) {
        if (amount === 0) {
          // Remove item if amount is 0
          return prev.filter(item => item.categoryId !== categoryId);
        }
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      } else if (amount > 0) {
        // Add new item
        return [...prev, newItem];
      }
      return prev;
    });
  };

  const totalCostInKRW = useMemo(() => {
    return costItems.reduce((total, item) => {
      const amountInKRW = convertAmount(item.amount, item.currency, 'KRW');
      return total + amountInKRW;
    }, 0);
  }, [costItems, convertAmount]);

  const totalCostInCurrentCurrency = useMemo(() => {
    return convertAmount(totalCostInKRW, 'KRW', currentCurrency);
  }, [totalCostInKRW, currentCurrency, convertAmount]);

  // Calculate total by category (for future use in detailed breakdown)
  const totalByCategory = useMemo(() => {
    const result: { [categoryId: string]: number } = {};
    costItems.forEach(item => {
      const amountInKRW = convertAmount(item.amount, item.currency, 'KRW');
      result[item.categoryId] = amountInKRW;
    });
    return result;
  }, [costItems, convertAmount]);

  // For now, we'll use this in console for debugging
  console.log('Total by category:', totalByCategory);

  const requiredCategories = INITIAL_COST_CATEGORIES.filter(cat => cat.isRequired);
  const optionalCategories = INITIAL_COST_CATEGORIES.filter(cat => !cat.isRequired);

  return (
    <div className="space-y-6">
      {/* Country Selection */}
      <CountrySelector
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        countries={SUPPORTED_COUNTRIES}
      />

      {/* Cost Summary */}
      <CostSummary
        totalCost={totalCostInCurrentCurrency}
        totalCostInKRW={totalCostInKRW}
        currency={currentCurrency}
        {...(selectedCountryInfo && { countryInfo: selectedCountryInfo })}
        itemCount={costItems.length}
      />

      {/* Required Categories */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-red-500">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900">필수 준비 비용</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredCategories.map(category => {
            const currentAmount = costItems.find(item => item.categoryId === category.id)?.amount || 0;
            return (
              <CostCategoryCard
                key={category.id}
                category={category}
                currentAmount={currentAmount}
                onAmountChange={(amount) => handleCostChange(category.id, amount)}
                currency={currentCurrency}
              />
            );
          })}
        </div>
      </div>

      {/* Optional Categories */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-blue-500">💡</span>
          <h2 className="text-xl font-bold text-gray-900">선택적 비용</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optionalCategories.map(category => {
            const currentAmount = costItems.find(item => item.categoryId === category.id)?.amount || 0;
            return (
              <CostCategoryCard
                key={category.id}
                category={category}
                currentAmount={currentAmount}
                onAmountChange={(amount) => handleCostChange(category.id, amount)}
                currency={currentCurrency}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InitialCostCalculator;