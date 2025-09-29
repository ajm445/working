import React, { useState, useMemo } from 'react';
import type { JapanCostItem, JapanRegion } from '../../types/japanCost';
import { JAPAN_COST_CATEGORIES, JAPAN_REGIONS, CATEGORY_GROUPS } from '../../data/japanCostCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';
import JapanRegionSelector from './JapanRegionSelector';
import JapanCostCategoryCard from './JapanCostCategoryCard';
import JapanCostSummary from './JapanCostSummary';

const InitialCostCalculator: React.FC = () => {
  const { currentCurrency } = useCurrency();
  const { convertAmount } = useCurrencyConverter();
  const [selectedRegion, setSelectedRegion] = useState<JapanRegion>('tokyo');
  const [costItems, setCostItems] = useState<JapanCostItem[]>([]);

  const selectedRegionInfo = JAPAN_REGIONS.find(r => r.code === selectedRegion);

  const handleCostChange = (categoryId: string, amount: number): void => {
    setCostItems(prev => {
      const existingIndex = prev.findIndex(item => item.categoryId === categoryId);
      const newItem: JapanCostItem = {
        categoryId,
        amount,
        currency: currentCurrency,
        region: selectedRegion,
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

  const totalCostInJPY = useMemo(() => {
    return convertAmount(totalCostInKRW, 'KRW', 'JPY');
  }, [totalCostInKRW, convertAmount]);

  // Calculate total by category group
  const totalByGroup = useMemo(() => {
    const result: { [groupType: string]: number } = {};
    costItems.forEach(item => {
      const category = JAPAN_COST_CATEGORIES.find(cat => cat.id === item.categoryId);
      if (category) {
        const amountInCurrentCurrency = convertAmount(item.amount, item.currency, currentCurrency);
        result[category.category] = (result[category.category] || 0) + amountInCurrentCurrency;
      }
    });
    return result;
  }, [costItems, convertAmount, currentCurrency]);

  // Group categories by type
  const categoriesByGroup = useMemo(() => {
    const groups: { [key: string]: typeof JAPAN_COST_CATEGORIES } = {};
    JAPAN_COST_CATEGORIES.forEach(category => {
      if (!groups[category.category]) {
        groups[category.category] = [];
      }
      groups[category.category]!.push(category);
    });
    return groups;
  }, []);

  const requiredCategories = JAPAN_COST_CATEGORIES.filter(cat => cat.isRequired);

  return (
    <div className="space-y-6">
      {/* Region Selection */}
      <JapanRegionSelector
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        regions={JAPAN_REGIONS}
      />

      {/* Cost Summary */}
      {selectedRegionInfo && (
        <JapanCostSummary
          totalCost={totalCostInCurrentCurrency}
          totalCostInKRW={totalCostInKRW}
          totalCostInJPY={totalCostInJPY}
          currency={currentCurrency}
          regionInfo={selectedRegionInfo}
          itemCount={costItems.length}
          totalByGroup={totalByGroup}
        />
      )}

      {/* Required Categories */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-red-500">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900">필수 준비 비용</h2>
          <span className="text-sm text-gray-500">必須準備費用</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredCategories.map(category => {
            const currentAmount = costItems.find(item => item.categoryId === category.id)?.amount || 0;
            return (
              <JapanCostCategoryCard
                key={category.id}
                category={category}
                currentAmount={currentAmount}
                onAmountChange={(amount) => handleCostChange(category.id, amount)}
                currency={currentCurrency}
                region={selectedRegion}
              />
            );
          })}
        </div>
      </div>

      {/* Optional Categories by Group */}
      {Object.entries(categoriesByGroup)
        .filter(([groupType]) => groupType !== 'pre-departure' && groupType !== 'settlement')
        .map(([groupType, categories]) => {
            const group = CATEGORY_GROUPS[groupType as keyof typeof CATEGORY_GROUPS];
          if (!group) return null;

          return (
            <div key={groupType} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-500">{group.icon}</span>
                <h2 className="text-xl font-bold text-gray-900">{group.name}</h2>
                <span className="text-sm text-gray-500">{group.nameJp}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">선택사항</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{group.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => {
                  const currentAmount = costItems.find(item => item.categoryId === category.id)?.amount || 0;
                  return (
                    <JapanCostCategoryCard
                      key={category.id}
                      category={category}
                      currentAmount={currentAmount}
                      onAmountChange={(amount) => handleCostChange(category.id, amount)}
                      currency={currentCurrency}
                      region={selectedRegion}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default InitialCostCalculator;