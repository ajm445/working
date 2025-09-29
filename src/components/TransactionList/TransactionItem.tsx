import React from 'react';
import type { Transaction } from '../../types/transaction';
import { formatCurrency } from '../../utils/currency';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const handleDelete = (): void => {
    if (window.confirm('이 내역을 삭제하시겠습니까?')) {
      onDelete(transaction.id);
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <span className={`${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '➕' : '➖'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{transaction.description}</p>
            <p className="text-sm text-gray-500">
              {transaction.category} • {transaction.date}
            </p>
            {transaction.currency !== 'KRW' && (
              <p className="text-xs text-gray-400">
                원화: {formatCurrency(transaction.amountInKRW, 'KRW')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <p className="text-xs text-gray-400">{transaction.currency}</p>
          </div>
          <button
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="삭제"
          >
            <span className="text-sm">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;