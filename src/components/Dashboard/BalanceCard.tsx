import React from 'react';
import { formatCurrency } from '../../utils/currency';
import { useCurrencyConversion } from '../../hooks/useCurrencyConversion';

interface BalanceCardProps {
  title: string;
  amount: number;
  icon: string;
  type: 'income' | 'expense' | 'balance';
}

const BalanceCard: React.FC<BalanceCardProps> = ({ title, amount, icon, type }) => {
  const { convertedAmount, currency, isConverting } = useCurrencyConversion(amount);

  const getColorClasses = (): { bg: string; text: string; amount: string } => {
    switch (type) {
      case 'income':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-600 dark:text-green-400',
          amount: 'text-green-600 dark:text-green-400'
        };
      case 'expense':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-600 dark:text-red-400',
          amount: 'text-red-600 dark:text-red-400'
        };
      case 'balance':
        return amount >= 0
          ? {
              bg: 'bg-blue-100 dark:bg-blue-900/30',
              text: 'text-blue-600 dark:text-blue-400',
              amount: 'text-blue-600 dark:text-blue-400'
            }
          : {
              bg: 'bg-orange-100 dark:bg-orange-900/30',
              text: 'text-orange-600 dark:text-orange-400',
              amount: 'text-orange-600 dark:text-orange-400'
            };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-600 dark:text-gray-300',
          amount: 'text-gray-600 dark:text-gray-300'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${colorClasses.bg} rounded-full flex items-center justify-center transition-colors duration-300`}>
          <span className={`${colorClasses.text} text-xl transition-colors duration-300`}>{icon}</span>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses.amount} transition-colors duration-300`}>
            {isConverting ? (
              <span className="animate-pulse">변환 중...</span>
            ) : (
              formatCurrency(convertedAmount, currency)
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;