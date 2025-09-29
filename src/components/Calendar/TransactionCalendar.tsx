import React, { useState, useMemo } from 'react';
import type { Transaction } from '../../types/transaction';
import type { CalendarDay as CalendarDayType } from '../../types/calendar';
import { generateCalendarMonth } from '../../utils/calendar';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import DayDetailModal from './DayDetailModal';

interface TransactionCalendarProps {
  transactions: Transaction[];
  onDateClick?: ((date?: Date) => void) | undefined;
}

const TransactionCalendar: React.FC<TransactionCalendarProps> = ({ transactions, onDateClick }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDay, setSelectedDay] = useState<CalendarDayType | null>(null);

  // 현재 표시 중인 달의 캘린더 데이터 생성
  const calendarData = useMemo(() => {
    return generateCalendarMonth(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      transactions
    );
  }, [currentDate, transactions]);

  const handlePrevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = (): void => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: CalendarDayType): void => {
    setSelectedDay(day);
  };

  const handleCloseModal = (): void => {
    setSelectedDay(null);
  };

  return (
    <div className="space-y-6">
      {/* 캘린더 헤더 */}
      <CalendarHeader
        year={calendarData.year}
        month={calendarData.month}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* 캘린더 그리드 */}
      <CalendarGrid
        calendarData={calendarData}
        onDayClick={handleDayClick}
      />

      {/* 캘린더 사용법 안내 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 mt-0.5">💡</div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">캘린더 사용법</p>
            <ul className="space-y-1 text-xs">
              <li>• 각 날짜를 클릭하면 해당 날의 상세 거래 내역을 볼 수 있습니다</li>
              <li>• 녹색 숫자는 수입, 빨간색 숫자는 지출을 나타냅니다</li>
              <li>• 상세 모달에서 "이 날짜에 거래 추가" 버튼으로 특정 날짜에 거래를 등록할 수 있습니다</li>
              <li>• 내역 추가하기로 새 거래를 등록하면 자동으로 캘린더에 표시됩니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 날짜 상세 모달 */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          onClose={handleCloseModal}
          onAddTransaction={onDateClick}
        />
      )}
    </div>
  );
};

export default TransactionCalendar;