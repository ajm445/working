import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { WeekdayExpenseData } from '../../types/statistics';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrencyForStats } from '../../utils/currency';

interface WeekdayBarChartProps {
  data: WeekdayExpenseData[];
}

const WeekdayBarChart: React.FC<WeekdayBarChartProps> = ({ data }) => {
  const { currentCurrency, exchangeRates } = useCurrency();

  // 통화 변환 함수
  const convertAmount = (amountInKRW: number): number => {
    if (currentCurrency === 'KRW') return amountInKRW;
    if (!exchangeRates) return amountInKRW;
    const rate = exchangeRates[currentCurrency];
    return rate ? amountInKRW / rate : amountInKRW;
  };

  // 요일 순서 조정 (월~일)
  const weekdayOrder = ['월', '화', '수', '목', '금', '토', '일'];
  const sortedData = weekdayOrder
    .map(day => data.find(d => d.weekday === day))
    .filter((d): d is WeekdayExpenseData => d !== undefined);

  // 데이터를 선택된 통화로 변환
  const chartData = sortedData.map(item => ({
    ...item,
    averageExpense: convertAmount(item.averageExpense),
    totalExpense: convertAmount(item.totalExpense),
  }));

  // 커스텀 툴팁
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = sortedData.find(d => d.weekday === label);
      if (!data) return null;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}요일</p>
          <p className="text-sm text-gray-600">
            평균 지출: <span className="font-semibold">{formatCurrencyForStats(convertAmount(data.averageExpense), currentCurrency)}</span>
          </p>
          <p className="text-sm text-gray-600">
            총 지출: <span className="font-semibold">{formatCurrencyForStats(convertAmount(data.totalExpense), currentCurrency)}</span>
          </p>
          <p className="text-sm text-gray-600">
            거래 수: <span className="font-semibold">{data.transactionCount}건</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
        <p className="text-gray-500">표시할 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📅 요일별 평균 지출
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="weekday"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => {
              // 쉼표로 구분된 숫자만 표시 (단위 없음)
              return Math.round(value).toLocaleString();
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            iconType="rect"
          />
          <Bar
            dataKey="averageExpense"
            name="평균 지출"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* 인사이트 */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 생활 패턴 인사이트:</span>{' '}
          {(() => {
            const maxExpenseDay = sortedData.reduce((max, day) =>
              day.averageExpense > max.averageExpense ? day : max
            , sortedData[0] || { weekday: '없음', averageExpense: 0 });

            const minExpenseDay = sortedData.reduce((min, day) =>
              day.averageExpense < min.averageExpense && day.averageExpense > 0 ? day : min
            , sortedData[0] || { weekday: '없음', averageExpense: Infinity });

            return `${maxExpenseDay.weekday}요일에 가장 많이 지출하고, ${minExpenseDay.weekday}요일에 가장 적게 지출합니다.`;
          })()}
        </p>
      </div>
    </div>
  );
};

export default WeekdayBarChart;
