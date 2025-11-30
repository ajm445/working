import React, { useMemo, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CategoryExpenseData } from '../../types/statistics';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrencyForStats } from '../../utils/currency';

interface CategoryPieChartProps {
  data: CategoryExpenseData[];
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const { currentCurrency, exchangeRates } = useCurrency();

  // 통화 변환 함수 - useCallback으로 메모이제이션
  const convertAmount = useCallback((amountInKRW: number): number => {
    if (currentCurrency === 'KRW') return amountInKRW;
    if (!exchangeRates) return amountInKRW;
    const rate = exchangeRates[currentCurrency];
    return rate ? amountInKRW * rate : amountInKRW;
  }, [currentCurrency, exchangeRates]);

  // 데이터를 선택된 통화로 변환 - useMemo로 메모이제이션
  const chartData = useMemo(() => data.map(item => ({
    ...item,
    amount: convertAmount(item.amount),
  })), [data, convertAmount]);

  // 커스텀 툴팁 - useMemo로 메모이제이션
  const CustomTooltip = useMemo(() => {
    const TooltipComponent: React.FC<{
      active?: boolean;
      payload?: Array<{ payload: CategoryExpenseData & { amount: number } }>;
    }> = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0]?.payload;
        if (!data) return null;

        return (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
            <p className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{data.category}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              금액: <span className="font-semibold">{formatCurrencyForStats(data.amount, currentCurrency)}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              비율: <span className="font-semibold">{data.percentage.toFixed(1)}%</span>
            </p>
          </div>
        );
      }
      return null;
    };
    return TooltipComponent;
  }, [currentCurrency]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 transition-colors duration-300">표시할 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow transition-colors duration-300">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-300">
        📊 카테고리별 지출 분포
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 카테고리별 상세 목록 */}
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{item.percentage.toFixed(1)}%</span>
              <span className="font-semibold text-gray-900">
                {formatCurrencyForStats(item.amount, currentCurrency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CategoryPieChart);
