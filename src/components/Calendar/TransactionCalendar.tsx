import React, { useState, useMemo, useEffect } from 'react';
import type { Transaction } from '../../types/transaction';
import type { CalendarDay as CalendarDayType } from '../../types/calendar';
import { generateCalendarMonth } from '../../utils/calendar';
import { getKSTDate } from '../../utils/dateUtils';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import DayDetailModal from './DayDetailModal';

interface TransactionCalendarProps {
  transactions: Transaction[];
  onDateClick?: ((date?: Date) => void) | undefined;
  onMonthChange?: ((year: number, month: number) => void) | undefined;
  onDeleteTransaction?: ((id: string) => void) | undefined;
  onEditTransaction?: ((transaction: Transaction) => void) | undefined;
}

const TransactionCalendar: React.FC<TransactionCalendarProps> = ({
  transactions,
  onDateClick,
  onMonthChange,
  onDeleteTransaction,
  onEditTransaction
}) => {
  const today = getKSTDate();
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

  // 컴포넌트가 마운트될 때 현재 월을 부모에게 알림
  useEffect(() => {
    onMonthChange?.(currentDate.getFullYear(), currentDate.getMonth());
  }, [onMonthChange]); // eslint-disable-line react-hooks/exhaustive-deps

  // transactions가 변경될 때 selectedDay 업데이트 (거래 추가/삭제/수정 시)
  useEffect(() => {
    if (selectedDay) {
      // calendarData의 모든 week를 순회하여 같은 날짜의 업데이트된 데이터 찾기
      let updatedDay: CalendarDayType | undefined;
      for (const week of calendarData.weeks) {
        updatedDay = week.days.find(
          (day) => day.date.getTime() === selectedDay.date.getTime()
        );
        if (updatedDay) break;
      }

      // 거래 내역 수가 변경되었을 때만 업데이트 (무한 루프 방지)
      if (updatedDay && updatedDay.transactions.length !== selectedDay.transactions.length) {
        setSelectedDay(updatedDay);
      }
    }
  }, [transactions, calendarData, selectedDay]);

  const handlePrevMonth = (): void => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  const handleNextMonth = (): void => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  const handleToday = (): void => {
    const newDate = getKSTDate();
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
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
              <li>• 상세 모달에서 "이 날짜에 내역 추가" 버튼으로 특정 날짜에 거래를 등록할 수 있습니다</li>
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
          onDeleteTransaction={onDeleteTransaction}
          onEditTransaction={onEditTransaction}
        />
      )}
    </div>
  );
};

export default TransactionCalendar;