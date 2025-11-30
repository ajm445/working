import React from 'react';
import type { CalendarMonth, CalendarDay as CalendarDayType } from '../../types/calendar';
import type { RecurringExpense } from '../../types/database';
import { getKoreanDayNames } from '../../utils/calendar';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  calendarData: CalendarMonth;
  recurringExpenses?: RecurringExpense[];
  onDayClick?: (day: CalendarDayType) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarData, recurringExpenses = [], onDayClick }) => {
  const dayNames = getKoreanDayNames();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden transition-colors duration-300">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 transition-colors duration-300">
        {dayNames.map((dayName, index) => (
          <div
            key={dayName}
            className={`
              py-2 md:py-3 text-center text-xs md:text-sm font-medium transition-colors duration-300
              ${index === 0 ? 'text-red-500 dark:text-red-400' : index === 6 ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
            `}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7">
        {calendarData.weeks.map((week, weekIndex) =>
          week.days.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className="relative border-r border-b dark:border-gray-600 last:border-r-0 [&:nth-child(7n)]:border-r-0 transition-colors duration-300"
            >
              <CalendarDay
                day={day}
                recurringExpenses={recurringExpenses}
                onDayClick={onDayClick}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarGrid;