import React from 'react';
import type { CurrencyCode, CountryInfo } from '../../types/initialCost';
import { SUPPORTED_CURRENCIES } from '../../types/currency';

interface CostSummaryProps {
  totalCost: number;
  totalCostInKRW: number;
  currency: CurrencyCode;
  countryInfo?: CountryInfo;
  itemCount: number;
}

const CostSummary: React.FC<CostSummaryProps> = ({
  totalCost,
  totalCostInKRW,
  currency,
  countryInfo,
  itemCount
}) => {
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);
  const currencySymbol = currencyInfo?.symbol || '';
  const currencyName = currencyInfo?.nameKo || '';

  const formatAmount = (amount: number, targetCurrency: CurrencyCode): string => {
    if (targetCurrency === 'KRW') {
      return Math.round(amount).toLocaleString();
    }
    return amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <h2 className="text-xl font-bold">예상 초기 비용</h2>
        </div>
        {countryInfo && (
          <div className="flex items-center gap-2 text-white/80">
            <span className="text-lg">{countryInfo.flag}</span>
            <span className="text-sm">{countryInfo.nameKo}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-white/80 text-sm mb-1">총 예상 비용</div>
          <div className="text-3xl font-bold mb-2">
            {currencySymbol}{formatAmount(totalCost, currency)}
          </div>
          <div className="text-white/80 text-sm">
            {currencyName} 기준
          </div>
        </div>

        {currency !== 'KRW' && (
          <div>
            <div className="text-white/80 text-sm mb-1">원화 환산</div>
            <div className="text-2xl font-bold mb-2">
              ₩{formatAmount(totalCostInKRW, 'KRW')}
            </div>
            <div className="text-white/80 text-sm">
              한국 원 기준
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex justify-between items-center text-sm text-white/80">
          <span>입력된 항목</span>
          <span>{itemCount}개 카테고리</span>
        </div>
      </div>

      {totalCost > 0 && (
        <div className="mt-4 p-4 bg-white/10 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-white/80 mt-0.5">💡</span>
            <div className="text-sm text-white/90">
              <p className="font-medium mb-1">준비 팁</p>
              <p>실제 출국 시에는 예상 비용의 10-20% 여유분을 추가로 준비하는 것이 좋습니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostSummary;