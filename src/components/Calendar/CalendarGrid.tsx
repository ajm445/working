import React from 'react';
import type { CalendarMonth, CalendarDay as CalendarDayType } from '../../types/calendar';
import { getKoreanDayNames } from '../../utils/calendar';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  calendarData: CalendarMonth;
  onDayClick?: (day: CalendarDayType) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarData, onDayClick }) => {
  const dayNames = getKoreanDayNames();

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {dayNames.map((dayName, index) => (
          <div
            key={dayName}
            className={`
              py-3 text-center text-sm font-medium
              ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'}
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
              className="relative border-r border-b last:border-r-0 [&:nth-child(7n)]:border-r-0"
            >
              <CalendarDay
                day={day}
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