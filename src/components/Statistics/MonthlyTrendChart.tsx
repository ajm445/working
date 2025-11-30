import React, { useMemo, useCallback } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyTrendData } from '../../types/statistics';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrencyForStats } from '../../utils/currency';

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
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
    income: convertAmount(item.income),
    expense: convertAmount(item.expense),
    balance: convertAmount(item.balance),
  })), [data, convertAmount]);

  // 커스텀 툴팁 - useMemo로 메모이제이션
  const CustomTooltip = useMemo(() => {
    const TooltipComponent: React.FC<{
      active?: boolean;
      payload?: Array<{ value: number; dataKey: string; color: string }>;
      label?: string;
    }> = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
            <p className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{label}</p>
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey === 'income' && '수입: '}
                {entry.dataKey === 'expense' && '지출: '}
                {entry.dataKey === 'balance' && '순액: '}
                <span className="font-semibold">
                  {formatCurrencyForStats(entry.value, currentCurrency)}
                </span>
              </p>
            ))}
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

  // 통계 요약 계산
  const summary = useMemo(() => {
    const totalIncome = chartData.reduce((sum, month) => sum + month.income, 0);
    const totalExpense = chartData.reduce((sum, month) => sum + month.expense, 0);
    const totalBalance = totalIncome - totalExpense;
    const avgIncome = chartData.length > 0 ? totalIncome / chartData.length : 0;
    const avgExpense = chartData.length > 0 ? totalExpense / chartData.length : 0;

    return { totalIncome, totalExpense, totalBalance, avgIncome, avgExpense };
  }, [chartData]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-xl">📈</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
              월별 수입/지출 트렌드
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
              최근 {chartData.length}개월간의 재정 흐름
            </p>
          </div>
        </div>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 sm:p-3 border border-green-200 dark:border-green-800 transition-colors duration-300">
          <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium mb-1">평균 수입</p>
          <p className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-300 truncate">
            {formatCurrencyForStats(summary.avgIncome, currentCurrency)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 sm:p-3 border border-red-200 dark:border-red-800 transition-colors duration-300">
          <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-medium mb-1">평균 지출</p>
          <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-300 truncate">
            {formatCurrencyForStats(summary.avgExpense, currentCurrency)}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3 border border-blue-200 dark:border-blue-800 transition-colors duration-300">
          <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">순 저축</p>
          <p className={`text-xs sm:text-sm font-bold truncate ${
            summary.totalBalance >= 0
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-red-700 dark:text-red-300'
          }`}>
            {formatCurrencyForStats(summary.totalBalance, currentCurrency)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm transition-colors duration-300">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="incomeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="expenseAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" opacity={0.3} />
            <XAxis
              dataKey="monthLabel"
              stroke="#9ca3af"
              style={{ fontSize: '12px', fontWeight: '500' }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px', fontWeight: '500' }}
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => {
                return Math.round(value).toLocaleString();
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Legend
              wrapperStyle={{ fontSize: '14px', fontWeight: '600', paddingTop: '16px' }}
              iconType="rect"
            />
            {/* 수입 영역 */}
            <Area
              type="monotone"
              dataKey="income"
              name="수입"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#incomeAreaGradient)"
              animationDuration={1200}
            />
            {/* 지출 영역 */}
            <Area
              type="monotone"
              dataKey="expense"
              name="지출"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="url(#expenseAreaGradient)"
              animationDuration={1200}
            />
            {/* 순액 라인 (점선) */}
            <Line
              type="monotone"
              dataKey="balance"
              name="순액"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1200}
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 인사이트 */}
      {chartData.length > 0 && (
        <div className="mt-4 relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border border-blue-200 dark:border-blue-700 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-20"></div>
          <div className="relative flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-base">💡</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1 transition-colors duration-300">
                재정 흐름 인사이트
              </p>
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 transition-colors duration-300">
                {summary.totalBalance >= 0 ? (
                  <>
                    최근 {chartData.length}개월간 총{' '}
                    <span className="font-bold text-green-700 dark:text-green-400">
                      {formatCurrencyForStats(summary.totalBalance, currentCurrency)}
                    </span>
                    를 저축했습니다. 훌륭합니다! 🎉
                  </>
                ) : (
                  <>
                    최근 {chartData.length}개월간 총{' '}
                    <span className="font-bold text-red-700 dark:text-red-400">
                      {formatCurrencyForStats(Math.abs(summary.totalBalance), currentCurrency)}
                    </span>
                    의 적자가 발생했습니다. 지출을 줄여보세요.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MonthlyTrendChart);
