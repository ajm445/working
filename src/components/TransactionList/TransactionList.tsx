import React from 'react';
import type { Transaction } from '../../types/transaction';
import TransactionItem from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>📅</span>
          최근 내역
          <span className="text-sm font-normal text-gray-500">
            ({transactions.length}개)
          </span>
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4 text-4xl">📝</div>
            <p className="text-lg font-medium mb-2">아직 내역이 없습니다</p>
            <p className="text-sm">첫 내역을 추가해보세요!</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;