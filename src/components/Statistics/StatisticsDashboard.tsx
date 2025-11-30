import React, { useState, useMemo } from 'react';
import type { Transaction } from '../../types/transaction';
import type { RecurringExpense } from '../../types/database';
import type { StatisticsPeriod } from '../../types/statistics';
import { generateStatistics } from '../../utils/statistics';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrencyForStats } from '../../utils/currency';
import CategoryPieChart from './CategoryPieChart';

interface StatisticsDashboardProps {
  transactions: Transaction[];
  recurringExpenses?: RecurringExpense[];
}

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ transactions, recurringExpenses = [] }) => {
  const [period, setPeriod] = useState<StatisticsPeriod>('1month');
  const { currentCurrency, exchangeRates } = useCurrency();

  // 통계 데이터 생성
  const statistics = useMemo(() => {
    return generateStatistics(transactions, recurringExpenses, period);
  }, [transactions, recurringExpenses, period]);

  // 통화 변환 함수
  const convertAmount = (amountInKRW: number): number => {
    if (currentCurrency === 'KRW') return amountInKRW;
    if (!exchangeRates) return amountInKRW;
    const rate = exchangeRates[currentCurrency];
    return rate ? amountInKRW * rate : amountInKRW;
  };

  const { summary } = statistics;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 헤더 및 기간 선택 - 모바일 개선 */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">📊 통계 분석</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              거래 내역을 다양한 관점에서 분석합니다
            </p>
          </div>

          {/* 기간 선택 버튼 - 모바일 개선 */}
          <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
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
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                  period === option.value
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 요약 카드 - 모바일 간격 개선 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 총 수입 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 p-4 sm:p-6 rounded-lg shadow transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300 transition-colors duration-300">총 수입</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2 transition-colors duration-300">
                {formatCurrencyForStats(convertAmount(summary.totalIncome), currentCurrency)}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 transition-colors duration-300">
            일평균 {formatCurrencyForStats(convertAmount(summary.averageDailyIncome), currentCurrency)}
          </p>
        </div>

        {/* 총 지출 */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/40 p-4 sm:p-6 rounded-lg shadow transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300 transition-colors duration-300">총 지출</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-2 transition-colors duration-300">
                {formatCurrencyForStats(convertAmount(summary.totalExpense), currentCurrency)}
              </p>
            </div>
            <div className="text-4xl">💸</div>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 transition-colors duration-300">
            일평균 {formatCurrencyForStats(convertAmount(summary.averageDailyExpense), currentCurrency)}
          </p>
        </div>

        {/* 순액 */}
        <div className={`bg-gradient-to-br p-4 sm:p-6 rounded-lg shadow transition-colors duration-300 ${
          summary.totalBalance >= 0
            ? 'from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40'
            : 'from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/40'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium transition-colors duration-300 ${
                summary.totalBalance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'
              }`}>
                순액
              </p>
              <p className={`text-2xl font-bold mt-2 transition-colors duration-300 ${
                summary.totalBalance >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-orange-900 dark:text-orange-100'
              }`}>
                {formatCurrencyForStats(convertAmount(summary.totalBalance), currentCurrency)}
              </p>
            </div>
            <div className="text-4xl">
              {summary.totalBalance >= 0 ? '📈' : '📉'}
            </div>
          </div>
          <p className={`text-xs mt-2 transition-colors duration-300 ${
            summary.totalBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
          }`}>
            {summary.totalBalance >= 0 ? '수입이 지출보다 많습니다' : '지출이 수입보다 많습니다'}
          </p>
        </div>

        {/* 거래 수 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 p-4 sm:p-6 rounded-lg shadow transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300 transition-colors duration-300">총 거래</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2 transition-colors duration-300">
                {summary.transactionCount}건
              </p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 transition-colors duration-300">
            {summary.mostExpensiveCategory} 카테고리가 가장 많음
          </p>
        </div>
      </div>

      {/* 카테고리별 지출 분포 */}
      <CategoryPieChart data={statistics.categoryExpense} />

      {/* 추가 인사이트 - 모바일 간격 개선 */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          💡 주요 인사이트
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
              가장 많이 지출한 카테고리
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {summary.mostExpensiveCategory}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
              {formatCurrencyForStats(convertAmount(summary.mostExpensiveCategoryAmount), currentCurrency)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
              가장 많이 지출한 날
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {summary.highestExpenseDay !== '없음'
                ? new Date(summary.highestExpenseDay).toLocaleDateString('ko-KR')
                : '없음'
              }
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
              {formatCurrencyForStats(convertAmount(summary.highestExpenseAmount), currentCurrency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
