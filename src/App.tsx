import React, { useState } from 'react';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AppModeProvider, useAppMode } from './contexts/AppModeContext';
import type { Transaction, TransactionFormData } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { InitialCostCalculator } from './components/InitialCostCalculator';
import { ModeNavigation } from './components/Navigation';

// Expense Tracker Component (기존 가계부 기능)
const ExpenseTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const addTransaction = (data: TransactionFormData & { amountInKRW: number }): void => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
      date: new Date().toLocaleDateString('ko-KR'),
      currency: data.currency,
      amountInKRW: data.amountInKRW,
    };

    setTransactions([newTransaction, ...transactions]);
    setShowAddForm(false);
  };

  const deleteTransaction = (id: string): void => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Dashboard */}
      <Dashboard transactions={transactions} />

      {/* Add Transaction Button */}
      <div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>➕</span>
          내역 추가하기
        </button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <TransactionForm
          onSubmit={addTransaction}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onDeleteTransaction={deleteTransaction}
      />
    </div>
  );
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { currentMode, isTransitioning } = useAppMode();

  const getPageTitle = (): { title: string; subtitle: string } => {
    switch (currentMode) {
      case 'initial-cost-calculator':
        return {
          title: '워킹홀리데이 초기비용 계산기',
          subtitle: '출발 전 필요한 준비 비용을 계산해보세요'
        };
      default:
        return {
          title: '워킹홀리데이 가계부',
          subtitle: '해외 생활비를 스마트하게 관리해보세요'
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">
                {currentMode === 'initial-cost-calculator' ? '✈️' : '💰'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
      </header>

      {/* Mode Navigation */}
      <ModeNavigation />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          {currentMode === 'expense-tracker' && <ExpenseTracker />}
          {currentMode === 'initial-cost-calculator' && <InitialCostCalculator />}
        </div>
      </main>
    </div>
  );
};

// Main App Component with Providers
const App: React.FC = () => {
  return (
    <AppModeProvider>
      <CurrencyProvider>
        <AppContent />
      </CurrencyProvider>
    </AppModeProvider>
  );
};

export default App;