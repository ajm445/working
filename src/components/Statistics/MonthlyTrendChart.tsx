import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyTrendData } from '../../types/statistics';
import { CHART_COLORS } from '../../types/statistics';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrencyForStats } from '../../utils/currency';

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const { currentCurrency, exchangeRates } = useCurrency();

  // 통화 변환 함수
  const convertAmount = (amountInKRW: number): number => {
    if (currentCurrency === 'KRW') return amountInKRW;
    if (!exchangeRates) return amountInKRW;
    const rate = exchangeRates[currentCurrency];
    return rate ? amountInKRW / rate : amountInKRW;
  };

  // 데이터를 선택된 통화로 변환
  const chartData = data.map(item => ({
    ...item,
    income: convertAmount(item.income),
    expense: convertAmount(item.expense),
    balance: convertAmount(item.balance),
  }));

  // 커스텀 툴팁
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
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
        📈 월별 수입/지출 트렌드
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="monthLabel"
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
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="income"
            name="수입"
            stroke={CHART_COLORS.income}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="지출"
            stroke={CHART_COLORS.expense}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="순액"
            stroke={CHART_COLORS.balance}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
