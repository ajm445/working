import React from 'react';
import type { Transaction } from '../../types/transaction';
import { calculateTotalIncome, calculateTotalExpense, calculateBalance } from '../../utils/calculations';
import BalanceCard from './BalanceCard';
import CurrencySelector from './CurrencySelector';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  const balance = calculateBalance(transactions);

  return (
    <div>
      <CurrencySelector />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BalanceCard
          title="총 수입"
          amount={totalIncome}
          icon="📈"
          type="income"
        />

        <BalanceCard
          title="총 지출"
          amount={totalExpense}
          icon="📉"
          type="expense"
        />

        <BalanceCard
          title="잔액"
          amount={balance}
          icon="💳"
          type="balance"
        />
      </div>
    </div>
  );
};

export default Dashboard;