import { useContext } from 'react';
import type { CurrencyContextType } from '../contexts/CurrencyContext';
import { CurrencyContext } from '../contexts/CurrencyContext';

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};