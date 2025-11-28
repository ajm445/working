/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type AppMode = 'expense-tracker' | 'initial-cost-calculator' | 'recurring-expenses';

interface AppModeContextType {
  currentMode: AppMode;
  setCurrentMode: (mode: AppMode) => void;
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

interface AppModeProviderProps {
  children: ReactNode;
}

export const AppModeProvider: React.FC<AppModeProviderProps> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<AppMode>('expense-tracker');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeChange = (mode: AppMode): void => {
    if (mode !== currentMode) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMode(mode);
        setIsTransitioning(false);
      }, 150); // Short transition delay
    }
  };

  const value: AppModeContextType = {
    currentMode,
    setCurrentMode: handleModeChange,
    isTransitioning,
    setIsTransitioning,
  };

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = (): AppModeContextType => {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within AppModeProvider');
  }
  return context;
};