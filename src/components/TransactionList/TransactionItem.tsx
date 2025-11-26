import React from 'react';
import type { Transaction } from '../../types/transaction';
import { formatCurrency } from '../../utils/currency';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit?: ((transaction: Transaction) => void) | undefined;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete, onEdit }) => {
  const handleDelete = (): void => {
    if (window.confirm('이 내역을 삭제하시겠습니까?')) {
      onDelete(transaction.id);
    }
  };

  const handleEdit = (): void => {
    onEdit?.(transaction);
  };

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
            transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            <span className={`transition-colors duration-300 ${
              transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '➕' : '➖'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{transaction.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              {transaction.category} • {transaction.date}
            </p>
            {transaction.currency !== 'KRW' && (
              <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">
                원화: {formatCurrency(transaction.amountInKRW, 'KRW')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`font-semibold transition-colors duration-300 ${
              transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">{transaction.currency}</p>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={handleEdit}
                className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                aria-label={`${transaction.description} 거래 내역 수정`}
                title="수정"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button
              onClick={handleDelete}
              className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
              aria-label={`${transaction.description} 거래 내역 삭제`}
              title="삭제"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;