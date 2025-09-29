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
          bg: 'bg-green-100',
          text: 'text-green-600',
          amount: 'text-green-600'
        };
      case 'expense':
        return {
          bg: 'bg-red-100',
          text: 'text-red-600',
          amount: 'text-red-600'
        };
      case 'balance':
        return amount >= 0
          ? {
              bg: 'bg-blue-100',
              text: 'text-blue-600',
              amount: 'text-blue-600'
            }
          : {
              bg: 'bg-orange-100',
              text: 'text-orange-600',
              amount: 'text-orange-600'
            };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          amount: 'text-gray-600'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${colorClasses.bg} rounded-full flex items-center justify-center`}>
          <span className={`${colorClasses.text} text-xl`}>{icon}</span>
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses.amount}`}>
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