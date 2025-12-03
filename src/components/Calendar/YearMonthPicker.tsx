import React, { useState, useEffect } from 'react';
import { getKoreanMonthName } from '../../utils/calendar';

interface YearMonthPickerProps {
  isOpen: boolean;
  currentYear: number;
  currentMonth: number;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
}

const YearMonthPicker: React.FC<YearMonthPickerProps> = ({
  isOpen,
  currentYear,
  currentMonth,
  onClose,
  onSelect,
}) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // 고정 시작 년도: 2020년
  // 동적 종료 년도: 현재 년도 + 3년
  const START_YEAR = 2020;
  const today = new Date();
  const currentYearNow = today.getFullYear();
  const endYear = currentYearNow + 3;
  const years = Array.from({ length: endYear - START_YEAR + 1 }, (_, i) => START_YEAR + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  // 모달이 열릴 때마다 현재 연도/월로 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedYear(currentYear);
      setSelectedMonth(currentMonth);
    }
  }, [isOpen, currentYear, currentMonth]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return (): void => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = (): void => {
    onSelect(selectedYear, selectedMonth);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="picker-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h3
            id="picker-title"
            className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300"
          >
            📅 연도 및 월 선택
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 선택된 연도/월 표시 */}
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">선택된 날짜</p>
          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {selectedYear}년 {getKoreanMonthName(selectedMonth)}
          </p>
        </div>

        {/* 연도 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            연도
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`
                  px-3 py-2 rounded-lg font-medium transition-all touch-manipulation
                  ${
                    selectedYear === year
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : year === currentYear
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-900/60'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* 월 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            월
          </label>
          <div className="grid grid-cols-4 gap-2">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`
                  px-3 py-2 rounded-lg font-medium transition-all touch-manipulation
                  ${
                    selectedMonth === month
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : selectedYear === currentYear && month === currentMonth
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-900/60'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {month + 1}월
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 transition-colors touch-manipulation"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 dark:active:bg-indigo-700 transition-colors touch-manipulation"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearMonthPicker;
