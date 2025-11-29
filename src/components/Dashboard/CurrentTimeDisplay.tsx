import React, { useState, useEffect, memo } from 'react';
import { getKSTDateTime } from '../../utils/dateUtils';

interface CurrentTimeDisplayProps {
  updateInterval?: number; // 밀리초 단위, 기본값 1000 (1초)
}

// React.memo로 감싸서 props가 변경되지 않으면 재렌더링 방지
const CurrentTimeDisplay: React.FC<CurrentTimeDisplayProps> = memo(({ updateInterval = 1000 }) => {
  const [currentTime, setCurrentTime] = useState(getKSTDateTime());

  useEffect((): (() => void) => {
    // 초기화 시 즉시 시간 업데이트
    setCurrentTime(getKSTDateTime());

    const timer = setInterval(() => {
      setCurrentTime(getKSTDateTime());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval]);

  // 오늘 날짜 포맷팅
  const formatTodayDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 현재 시간 포맷팅 (am/pm)
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  return (
    <div className="mb-6 text-center">
      <div className="inline-flex items-center gap-4 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors duration-300">
        <span className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 transition-colors duration-300">
          오늘: {formatTodayDate(currentTime)}
        </span>
        <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
});

// displayName 설정 (React DevTools에서 확인용)
CurrentTimeDisplay.displayName = 'CurrentTimeDisplay';

export default CurrentTimeDisplay;
