import React, { useState } from 'react';
import type { TransactionSearchFilter } from '../../types/search';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../types/transaction';
import { initialSearchFilter } from '../../types/search';
import { isFilterActive } from '../../utils/searchUtils';

interface TransactionSearchProps {
  /** 현재 필터 상태 */
  filter: TransactionSearchFilter;
  /** 필터 변경 시 호출되는 콜백 함수 */
  onFilterChange: (filter: TransactionSearchFilter) => void;
  /** 검색 결과 개수 */
  resultCount?: number;
}

/**
 * 거래 내역 검색 및 필터링 컴포넌트
 *
 * 텍스트 검색, 날짜 범위, 카테고리, 금액 범위 등 다양한 필터를 제공합니다.
 *
 * @component
 */
const TransactionSearch: React.FC<TransactionSearchProps> = ({
  filter,
  onFilterChange,
  resultCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(filter.categories || [])
  );

  /**
   * 검색어 변경 핸들러
   */
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onFilterChange({
      ...filter,
      searchText: e.target.value
    });
  };

  /**
   * 거래 타입 변경 핸들러
   */
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value as 'all' | 'income' | 'expense';
    onFilterChange({
      ...filter,
      type: value
    });
  };

  /**
   * 카테고리 토글 핸들러
   */
  const handleCategoryToggle = (category: string): void => {
    const newSelected = new Set(selectedCategories);

    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }

    setSelectedCategories(newSelected);
    onFilterChange({
      ...filter,
      categories: Array.from(newSelected)
    });
  };

  /**
   * 날짜 범위 변경 핸들러
   */
  const handleDateChange = (field: 'startDate' | 'endDate', value: string): void => {
    onFilterChange({
      ...filter,
      [field]: value
    });
  };

  /**
   * 금액 범위 변경 핸들러
   */
  const handleAmountChange = (field: 'minAmount' | 'maxAmount', value: string): void => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onFilterChange({
      ...filter,
      [field]: numValue
    });
  };


  /**
   * 필터 초기화 핸들러
   */
  const handleResetFilter = (): void => {
    setSelectedCategories(new Set());
    onFilterChange(initialSearchFilter);
  };

  const filterActive = isFilterActive(filter);
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 transition-colors duration-300">
      <div className="p-4 sm:p-6">
        {/* 기본 검색 */}
        <div className="space-y-4">
          {/* 검색어 입력 */}
          <div>
            <label htmlFor="search-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 검색
            </label>
            <input
              id="search-text"
              type="text"
              value={filter.searchText || ''}
              onChange={handleSearchTextChange}
              placeholder="설명 또는 카테고리 검색..."
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
            />
          </div>

          {/* 거래 타입 선택 - 버튼 그룹 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              거래 타입
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange({ target: { value: 'all' } } as React.ChangeEvent<HTMLSelectElement>)}
                className={`
                  px-4 py-2.5 rounded-lg font-medium transition-all duration-200 border
                  ${filter.type === 'all' || !filter.type
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
              >
                전체
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange({ target: { value: 'income' } } as React.ChangeEvent<HTMLSelectElement>)}
                className={`
                  px-4 py-2.5 rounded-lg font-medium transition-all duration-200 border
                  ${filter.type === 'income'
                    ? 'bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
              >
                수입
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange({ target: { value: 'expense' } } as React.ChangeEvent<HTMLSelectElement>)}
                className={`
                  px-4 py-2.5 rounded-lg font-medium transition-all duration-200 border
                  ${filter.type === 'expense'
                    ? 'bg-red-600 dark:bg-red-500 text-white border-red-600 dark:border-red-500 shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
              >
                지출
              </button>
            </div>
          </div>

          {/* 고급 필터 토글 버튼 */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors duration-300"
          >
            <span>고급 필터</span>
            <span className="text-xl">{showAdvanced ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* 고급 필터 */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* 날짜 범위 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📅 기간
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    value={filter.startDate || ''}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">시작일</p>
                </div>
                <div>
                  <input
                    type="date"
                    value={filter.endDate || ''}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">종료일</p>
                </div>
              </div>
            </div>

            {/* 금액 범위 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                💰 금액 범위 (원화 기준)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={filter.minAmount || ''}
                    onChange={(e) => handleAmountChange('minAmount', e.target.value)}
                    placeholder="최소 금액"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={filter.maxAmount || ''}
                    onChange={(e) => handleAmountChange('maxAmount', e.target.value)}
                    placeholder="최대 금액"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                  />
                </div>
              </div>
            </div>

            {/* 카테고리 다중 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🏷️ 카테고리 ({selectedCategories.size}개 선택)
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                        ${selectedCategories.has(category)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 필터 액션 버튼 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {resultCount !== undefined && (
              <span>
                검색 결과: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{resultCount}건</span>
              </span>
            )}
          </div>

          {filterActive && (
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-300"
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionSearch;
