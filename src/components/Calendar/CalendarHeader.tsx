import React, { useState } from 'react';
import { getKoreanMonthName } from '../../utils/calendar';
import YearMonthPicker from './YearMonthPicker';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onYearMonthSelect?: (year: number, month: number) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
  onYearMonthSelect,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleYearMonthSelect = (selectedYear: number, selectedMonth: number): void => {
    onYearMonthSelect?.(selectedYear, selectedMonth);
  };

  return (
    <>
    <div className="flex items-center justify-between mb-6">
      {/* 월 네비게이션 */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="이전 달"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setShowPicker(true)}
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="연도 및 월 선택"
        >
          {year}년 {getKoreanMonthName(month)}
        </button>

        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="다음 달"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 오늘 버튼 */}
      <button
        onClick={onToday}
        className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
      >
        오늘
      </button>
    </div>

    {/* 연도/월 선택 모달 */}
    <YearMonthPicker
      isOpen={showPicker}
      currentYear={year}
      currentMonth={month}
      onClose={() => setShowPicker(false)}
      onSelect={handleYearMonthSelect}
    />
    </>
  );
};

export default CalendarHeader;