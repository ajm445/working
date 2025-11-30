import React, { memo } from 'react';
import { getKSTDateTime } from '../../utils/dateUtils';

// React.memo로 감싸서 props가 변경되지 않으면 재렌더링 방지
const CurrentTimeDisplay: React.FC = memo(() => {
  const currentTime = getKSTDateTime();

  // 오늘 날짜 포맷팅
  const formatTodayDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="mb-6 text-center">
      {/* 날짜만 표시 (모든 화면 크기) */}
      <div className="inline-flex px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors duration-300">
        <span className="text-base sm:text-lg font-semibold text-indigo-800 dark:text-indigo-300 transition-colors duration-300">
          {formatTodayDate(currentTime)}
        </span>
      </div>
    </div>
  );
});

// displayName 설정 (React DevTools에서 확인용)
CurrentTimeDisplay.displayName = 'CurrentTimeDisplay';

export default CurrentTimeDisplay;
