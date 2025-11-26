import React from 'react';
import type { Transaction } from '../../types/transaction';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction?: ((transaction: Transaction) => void) | undefined;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
  onEditTransaction
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
          <span>📅</span>
          최근 내역
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 transition-colors duration-300">
            ({transactions.length}개)
          </span>
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <div className="mb-4 text-4xl">📝</div>
            <p className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">아직 내역이 없습니다</p>
            <p className="text-sm">첫 내역을 추가해보세요!</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDeleteTransaction}
              onEdit={onEditTransaction}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;