import React from 'react';
import type { CurrencyCode } from '../../types/currency';
import { SUPPORTED_CURRENCIES } from '../../types/currency';
import { useCurrency } from '../../hooks/useCurrency';

const CurrencySelector: React.FC = () => {
  const { currentCurrency, setCurrentCurrency, isLoadingRates, lastUpdated, refreshExchangeRates } = useCurrency();

  const handleCurrencyChange = (currency: CurrencyCode): void => {
    setCurrentCurrency(currency);
  };

  const handleRefresh = (): void => {
    refreshExchangeRates();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기본 표시 통화
            </label>
            <div className="flex gap-2">
              {SUPPORTED_CURRENCIES.map(currency => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentCurrency === currency.code
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {currency.symbol} {currency.nameKo}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              최근 업데이트: {lastUpdated}
            </p>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoadingRates}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              isLoadingRates
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="환율 정보 새로고침"
          >
            {isLoadingRates ? '⏳' : '🔄'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;