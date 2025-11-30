import React, { useState } from 'react';
import type { CurrencyCode } from '../../types/currency';
import { SUPPORTED_CURRENCIES } from '../../types/currency';
import { useCurrency } from '../../hooks/useCurrency';

const CurrencySelector: React.FC = () => {
  const { currentCurrency, setCurrentCurrency, isLoadingRates, lastUpdated, refreshExchangeRates } = useCurrency();
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [showRefreshTooltip, setShowRefreshTooltip] = useState(false);

  const handleCurrencyChange = (currency: CurrencyCode): void => {
    setCurrentCurrency(currency);
  };

  const handleRefresh = (): void => {
    refreshExchangeRates();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 mb-6 transition-colors duration-300">
      {/* 모바일: 세로 레이아웃, 데스크톱: 가로 레이아웃 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* 통화 선택 영역 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              기본 표시 통화
            </label>
            <div className="relative">
              <button
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="환율 정보"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              {showInfoTooltip && (
                <div className="absolute left-0 top-6 z-10 w-56 sm:w-64 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg">
                  <p>실제 환율과 다소 차이가 있을 수 있습니다.</p>
                  <p className="mt-1 text-gray-300 dark:text-gray-400">환율은 1시간마다 자동 업데이트됩니다.</p>
                  <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"></div>
                </div>
              )}
            </div>
          </div>
          {/* 통화 버튼들 - 모바일에서 반응형 */}
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_CURRENCIES.map(currency => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                  currentCurrency === currency.code
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-300 dark:border-indigo-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500'
                }`}
              >
                {currency.symbol} {currency.nameKo}
              </button>
            ))}
          </div>
        </div>

        {/* 업데이트 시간 및 새로고침 버튼 */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="hidden sm:inline">{lastUpdated}</span>
              <span className="sm:hidden">{lastUpdated.replace('업데이트: ', '')}</span>
            </div>
          )}
          <div className="relative">
            <button
              onClick={handleRefresh}
              onMouseEnter={() => setShowRefreshTooltip(true)}
              onMouseLeave={() => setShowRefreshTooltip(false)}
              disabled={isLoadingRates}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm rounded-lg transition-colors touch-manipulation ${
                isLoadingRates
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500'
              }`}
              aria-label={isLoadingRates ? '환율 정보 업데이트 중' : '최신 환율 정보 가져오기'}
            >
              {isLoadingRates ? '⏳' : '🔄'}
            </button>
            {showRefreshTooltip && !isLoadingRates && (
              <div className="absolute right-0 top-12 z-10 w-48 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                <p>최신 환율 정보 가져오기</p>
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;