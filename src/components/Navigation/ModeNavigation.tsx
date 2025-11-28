import React from 'react';
import { useAppMode } from '../../contexts/AppModeContext';
import { useAnalyticsEvent } from '../../hooks/useAnalyticsEvent';
import type { AppMode } from '../../contexts/AppModeContext';

const ModeNavigation: React.FC = () => {
  const { currentMode, setCurrentMode, isTransitioning } = useAppMode();
  const { trackModeSwitch } = useAnalyticsEvent();

  const modes: { key: AppMode; label: string; icon: string; description: string }[] = [
    {
      key: 'expense-tracker',
      label: '가계부',
      icon: '📊',
      description: '일상 수입/지출 관리'
    },
    {
      key: 'recurring-expenses',
      label: '고정지출',
      icon: '📅',
      description: '월세, 공과금 등 관리'
    },
    {
      key: 'initial-cost-calculator',
      label: '초기비용 계산',
      icon: '✈️',
      description: '워킹홀리데이 준비 비용'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex">
          {modes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => {
                setCurrentMode(mode.key);
                const eventName =
                  mode.key === 'expense-tracker' ? 'budget' :
                  mode.key === 'recurring-expenses' ? 'recurring-expenses' :
                  'initial-cost';
                trackModeSwitch(eventName);
              }}
              disabled={isTransitioning}
              className={`flex-1 px-6 py-4 text-center transition-all duration-200 border-b-2 ${
                currentMode === mode.key
                  ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{mode.icon}</span>
                  <span className="font-medium">{mode.label}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block transition-colors duration-300">
                  {mode.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeNavigation;