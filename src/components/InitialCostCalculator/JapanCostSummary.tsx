import React from 'react';
import type { CurrencyCode } from '../../types/currency';
import type { JapanRegionInfo } from '../../types/japanCost';
import { CATEGORY_GROUPS } from '../../data/japanCostCategories';

interface JapanCostSummaryProps {
  totalCost: number;
  totalCostInKRW: number;
  totalCostInJPY: number;
  currency: CurrencyCode;
  regionInfo: JapanRegionInfo;
  itemCount: number;
  totalByGroup: { [groupType: string]: number };
}

const JapanCostSummary: React.FC<JapanCostSummaryProps> = ({
  totalCost,
  totalCostInKRW,
  totalCostInJPY,
  currency,
  regionInfo,
  itemCount,
  totalByGroup
}) => {
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

  const getGroupColor = (groupType: string): string => {
    const group = CATEGORY_GROUPS[groupType as keyof typeof CATEGORY_GROUPS];
    if (!group) return 'bg-gray-50 text-gray-700';

    const colorMap = {
      red: 'bg-red-50 text-red-700 border-red-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };

    return colorMap[group.color as keyof typeof colorMap] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{regionInfo.flag}</span>
          <div>
            <h2 className="text-xl font-bold">{regionInfo.nameKo} 워킹홀리데이</h2>
            <div className="text-indigo-100 text-sm">{regionInfo.nameJp}ワーキングホリデー</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-indigo-100 text-sm">총 {itemCount}개 항목</div>
          <div className="text-indigo-100 text-xs">{regionInfo.description}</div>
        </div>
      </div>

      {/* 총 비용 */}
      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <div className="text-center">
          <div className="text-indigo-100 text-sm mb-1">예상 초기 비용</div>
          <div className="text-3xl font-bold mb-2">
            {getCurrencySymbol(currency)}{formatNumber(totalCost)}
          </div>

          <div className="flex justify-center gap-4 text-sm text-indigo-100">
            {currency !== 'KRW' && (
              <div>₩{formatNumber(totalCostInKRW)}</div>
            )}
            {currency !== 'JPY' && (
              <div>¥{formatNumber(totalCostInJPY)}</div>
            )}
          </div>
        </div>
      </div>

      {/* 카테고리별 분류 */}
      {Object.keys(totalByGroup).length > 0 && (
        <div className="space-y-3">
          <div className="text-indigo-100 text-sm font-medium">카테고리별 분류</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(totalByGroup)
              .filter(([, amount]) => amount > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([groupType, amount]) => {
                const group = CATEGORY_GROUPS[groupType as keyof typeof CATEGORY_GROUPS];
                if (!group) return null;

                return (
                  <div
                    key={groupType}
                    className={`p-2 rounded border ${getGroupColor(groupType)} bg-white/90`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs">{group.icon}</span>
                      <span className="text-xs font-medium">{group.name}</span>
                    </div>
                    <div className="text-sm font-bold">
                      {getCurrencySymbol(currency)}{formatNumber(amount)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 도움말 */}
      <div className="mt-4 p-3 bg-white/10 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-yellow-300 mt-0.5">💡</span>
          <div className="text-xs text-indigo-100">
            <p className="font-medium mb-1">알려드립니다</p>
            <p>위 비용은 예상 금액이며, 개인의 생활 패턴, 환율 변동, 계절에 따라 달라질 수 있습니다.
            {regionInfo.code === 'tokyo' ? '도쿄는 높은 생활비를 감안하여' : '오사카는 도쿄 대비 저렴한 생활비로'}
            계산되었습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JapanCostSummary;