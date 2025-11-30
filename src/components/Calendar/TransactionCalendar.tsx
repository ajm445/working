import React, { useState, useMemo, useEffect } from 'react';
import type { Transaction } from '../../types/transaction';
import type { RecurringExpense } from '../../types/database';
import type { CalendarDay as CalendarDayType } from '../../types/calendar';
import { generateCalendarMonth } from '../../utils/calendar';
import { getKSTDate } from '../../utils/dateUtils';
import { useSwipe } from '../../hooks/useSwipe';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import DayDetailModal from './DayDetailModal';

interface TransactionCalendarProps {
  transactions: Transaction[];
  recurringExpenses?: RecurringExpense[];
  onDateClick?: ((date?: Date) => void) | undefined;
  onMonthChange?: ((year: number, month: number) => void) | undefined;
  onDeleteTransaction?: ((id: string) => void) | undefined;
  onEditTransaction?: ((transaction: Transaction) => void) | undefined;
}

const TransactionCalendar: React.FC<TransactionCalendarProps> = ({
  transactions,
  recurringExpenses = [],
  onDateClick,
  onMonthChange,
  onDeleteTransaction,
  onEditTransaction
}) => {
  const today = getKSTDate();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDay, setSelectedDay] = useState<CalendarDayType | null>(null);

  // 월 네비게이션 핸들러 (useSwipe 전에 선언)
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

  // 터치 제스처 지원 (모바일 최적화)
  const swipeHandlers = useSwipe(
    handleNextMonth,  // 왼쪽 스와이프 = 다음 달
    handlePrevMonth   // 오른쪽 스와이프 = 이전 달
  );

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

  const handleToday = (): void => {
    const newDate = getKSTDate();
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  const handleYearMonthSelect = (year: number, month: number): void => {
    const newDate = new Date(year, month, 1);
    setCurrentDate(newDate);
    onMonthChange?.(year, month);
  };

  const handleDayClick = (day: CalendarDayType): void => {
    // 모든 화면 크기에서 모달 열기
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
        onYearMonthSelect={handleYearMonthSelect}
      />

      {/* 캘린더 그리드 - 터치 제스처 지원 */}
      <div ref={swipeHandlers}>
        <CalendarGrid
          calendarData={calendarData}
          recurringExpenses={recurringExpenses}
          onDayClick={handleDayClick}
        />
      </div>

      {/* 캘린더 사용법 안내 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 transition-colors duration-300">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0">💡</div>
          <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 transition-colors duration-300 min-w-0">
            <p className="font-medium mb-1">캘린더 사용법</p>
            <ul className="space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs">
              <li className="hidden sm:block">• <span className="font-semibold">연도/월 빠른 이동:</span> 상단의 "예시: 2025년 11월"을 클릭하면 원하는 연도와 월로 바로 이동할 수 있습니다</li>
              <li className="hidden sm:block">• <span className="font-semibold">화살표 버튼:</span> 좌우 화살표로 이전/다음 달로 이동할 수 있습니다</li>
              <li>• <span className="font-semibold">모바일:</span> 캘린더를 좌우로 스와이프하여 월을 변경할 수 있습니다</li>
              <li>• 각 날짜를 클릭하면 해당 날의 상세 거래 내역을 볼 수 있습니다</li>
              <li className="hidden sm:block">• 녹색 숫자는 수입, 빨간색 숫자는 지출을 나타냅니다</li>
              <li className="hidden sm:block">• 상세 모달에서 "이 날짜에 내역 추가" 버튼으로 특정 날짜에 거래를 등록할 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 날짜 상세 모달 */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          recurringExpenses={recurringExpenses}
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