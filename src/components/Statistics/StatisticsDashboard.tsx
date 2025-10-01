import React, { useState, useMemo } from 'react';
import type { Transaction } from '../../types/transaction';
import type { StatisticsPeriod } from '../../types/statistics';
import { generateStatistics } from '../../utils/statistics';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrency } from '../../utils/currency';
import MonthlyTrendChart from './MonthlyTrendChart';
import CategoryPieChart from './CategoryPieChart';
import WeekdayBarChart from './WeekdayBarChart';

interface StatisticsDashboardProps {
  transactions: Transaction[];
}

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ transactions }) => {
  const [period, setPeriod] = useState<StatisticsPeriod>('6months');
  const { currentCurrency, exchangeRates } = useCurrency();

  // 통계 데이터 생성
  const statistics = useMemo(() => {
    return generateStatistics(transactions, period);
  }, [transactions, period]);

  // 통화 변환 함수
  const convertAmount = (amountInKRW: number): number => {
    if (currentCurrency === 'KRW') return amountInKRW;
    if (!exchangeRates) return amountInKRW;
    const rate = exchangeRates[currentCurrency];
    return rate ? amountInKRW / rate : amountInKRW;
  };

  const { summary } = statistics;

  return (
    <div className="space-y-6">
      {/* 헤더 및 기간 선택 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📊 통계 분석</h2>
            <p className="text-sm text-gray-500 mt-1">
              거래 내역을 다양한 관점에서 분석합니다
            </p>
          </div>

          {/* 기간 선택 버튼 */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: '1month' as StatisticsPeriod, label: '1개월' },
              { value: '3months' as StatisticsPeriod, label: '3개월' },
              { value: '6months' as StatisticsPeriod, label: '6개월' },
              { value: '1year' as StatisticsPeriod, label: '1년' },
              { value: 'all' as StatisticsPeriod, label: '전체' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 총 수입 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">총 수입</p>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {formatCurrency(convertAmount(summary.totalIncome), currentCurrency)}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            일평균 {formatCurrency(convertAmount(summary.averageDailyIncome), currentCurrency)}
          </p>
        </div>

        {/* 총 지출 */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">총 지출</p>
              <p className="text-2xl font-bold text-red-900 mt-2">
                {formatCurrency(convertAmount(summary.totalExpense), currentCurrency)}
              </p>
            </div>
            <div className="text-4xl">💸</div>
          </div>
          <p className="text-xs text-red-600 mt-2">
            일평균 {formatCurrency(convertAmount(summary.averageDailyExpense), currentCurrency)}
          </p>
        </div>

        {/* 순액 */}
        <div className={`bg-gradient-to-br p-6 rounded-lg shadow ${
          summary.totalBalance >= 0
            ? 'from-blue-50 to-blue-100'
            : 'from-orange-50 to-orange-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                summary.totalBalance >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                순액
              </p>
              <p className={`text-2xl font-bold mt-2 ${
                summary.totalBalance >= 0 ? 'text-blue-900' : 'text-orange-900'
              }`}>
                {formatCurrency(convertAmount(summary.totalBalance), currentCurrency)}
              </p>
            </div>
            <div className="text-4xl">
              {summary.totalBalance >= 0 ? '📈' : '📉'}
            </div>
          </div>
          <p className={`text-xs mt-2 ${
            summary.totalBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            {summary.totalBalance >= 0 ? '수입이 지출보다 많습니다' : '지출이 수입보다 많습니다'}
          </p>
        </div>

        {/* 거래 수 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">총 거래</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">
                {summary.transactionCount}건
              </p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
          <p className="text-xs text-purple-600 mt-2">
            {summary.mostExpensiveCategory} 카테고리가 가장 많음
          </p>
        </div>
      </div>

      {/* 차트들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendChart data={statistics.monthlyTrend} />
        <CategoryPieChart data={statistics.categoryExpense} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <WeekdayBarChart data={statistics.weekdayExpense} />
      </div>

      {/* 추가 인사이트 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💡 주요 인사이트
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">
              가장 많이 지출한 카테고리
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {summary.mostExpensiveCategory}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(convertAmount(summary.mostExpensiveCategoryAmount), currentCurrency)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">
              가장 많이 지출한 날
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {summary.highestExpenseDay !== '없음'
                ? new Date(summary.highestExpenseDay).toLocaleDateString('ko-KR')
                : '없음'
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(convertAmount(summary.highestExpenseAmount), currentCurrency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
