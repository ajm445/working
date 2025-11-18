import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import { useAppMode } from './contexts/AppModeContext';
import type { Transaction, TransactionFormData } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { InitialCostCalculator } from './components/InitialCostCalculator';
import { ModeNavigation } from './components/Navigation';
import { formatInputDateToKorean, formatDateForInput } from './utils/dateUtils';
import * as transactionService from './services/transactionService';

// Expense Tracker Component (기존 가계부 기능)
const ExpenseTracker: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'summary' | 'calendar' | 'statistics'>('summary');
  const [preselectedDate, setPreselectedDate] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // 거래 내역 로드
  useEffect(() => {
    const loadTransactions = async (): Promise<void> => {
      // 로그인 안 된 상태면 빈 배열로 시작 (로컬 메모리만 사용)
      if (!user) {
        setLoading(false);
        return;
      }

      // 로그인 상태면 Supabase에서 로드
      setLoading(true);
      const { data, error } = await transactionService.fetchTransactions();

      if (error) {
        console.error('Failed to load transactions:', error);
      } else if (data) {
        setTransactions(data);
      }

      setLoading(false);
    };

    void loadTransactions();
  }, [user]);

  // 실시간 구독 설정
  useEffect(() => {
    if (!user) return;

    const subscription = transactionService.subscribeToTransactions(
      user.id,
      (payload) => {
        console.log('Real-time update:', payload);

        // INSERT 이벤트
        if (payload.eventType === 'INSERT' && payload.new) {
          const newTransaction = transactionService.mapSupabaseToLocal(
            payload.new
          );
          setTransactions((prev) => [newTransaction, ...prev]);
        }

        // UPDATE 이벤트
        if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedTransaction = transactionService.mapSupabaseToLocal(
            payload.new
          );
          setTransactions((prev) =>
            prev.map((t) =>
              t.id === updatedTransaction.id ? updatedTransaction : t
            )
          );
        }

        // DELETE 이벤트
        if (payload.eventType === 'DELETE' && payload.old) {
          setTransactions((prev) =>
            prev.filter((t) => t.id !== payload.old.id)
          );
        }
      }
    );

    return (): void => {
      subscription.unsubscribe();
    };
  }, [user]);

  // 폼이 생성되거나 날짜가 변경될 때 자동으로 스크롤
  useEffect((): void => {
    if ((showAddForm || editingTransaction) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAddForm, preselectedDate, editingTransaction]);

  const addTransaction = async (
    data: TransactionFormData & { amountInKRW: number }
  ): Promise<void> => {
    const newTransaction = {
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
      date: formatInputDateToKorean(data.date),
      currency: data.currency,
      amountInKRW: data.amountInKRW,
    };

    // 로그인 상태면 Supabase에 저장
    if (user) {
      const { data: addedTransaction, error } =
        await transactionService.addTransaction(newTransaction, user.id);

      if (error) {
        console.error('Failed to add transaction:', error);
        toast.error('거래 내역 추가에 실패했습니다.');
      } else if (addedTransaction) {
        // 실시간 구독으로 자동 업데이트되므로 수동으로 추가하지 않음
        toast.success('거래 내역이 추가되었습니다.');
        setShowAddForm(false);
        setPreselectedDate(null);
      }
    } else {
      // 비로그인 상태면 로컬 메모리에만 저장
      const localTransaction: Transaction = {
        id: `local-${Date.now()}-${Math.random()}`, // 임시 로컬 ID
        ...newTransaction,
      };

      setTransactions((prev) => [localTransaction, ...prev]);
      setShowAddForm(false);
      setPreselectedDate(null);

      // 알림: 로그인하지 않으면 데이터가 저장되지 않음
      toast('⚠️ 로그인하지 않아 데이터가 임시로만 저장됩니다.\n새로고침 시 데이터가 사라집니다.', {
        icon: '⚠️',
        duration: 4000,
      });
    }
  };

  const handleAddTransactionWithDate = (date?: Date): void => {
    if (date) {
      const dateString = formatDateForInput(date);
      setPreselectedDate(dateString);
    }
    setShowAddForm(true);
  };

  const updateTransaction = async (
    id: string,
    data: TransactionFormData & { amountInKRW: number }
  ): Promise<void> => {
    const updatedData = {
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
      date: formatInputDateToKorean(data.date),
      currency: data.currency,
      amountInKRW: data.amountInKRW,
    };

    // 로그인 상태면 Supabase에 업데이트
    if (user && !id.startsWith('local-')) {
      const { data: updatedTransaction, error } =
        await transactionService.updateTransaction(id, updatedData);

      if (error) {
        console.error('Failed to update transaction:', error);
        toast.error('거래 내역 수정에 실패했습니다.');
      } else if (updatedTransaction) {
        // 실시간 구독으로 자동 업데이트되므로 수동으로 수정하지 않음
        toast.success('거래 내역이 수정되었습니다.');
        setEditingTransaction(null);
      }
    } else {
      // 비로그인 상태거나 로컬 데이터면 로컬에서만 수정
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...updatedData } : t
        )
      );
      setEditingTransaction(null);
      toast.success('거래 내역이 수정되었습니다.');
    }
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    // 로그인 상태면 Supabase에서 삭제
    if (user && !id.startsWith('local-')) {
      const { error } = await transactionService.deleteTransaction(id);

      if (error) {
        console.error('Failed to delete transaction:', error);
        toast.error('거래 내역 삭제에 실패했습니다.');
      } else {
        toast.success('거래 내역이 삭제되었습니다.');
      }
      // 실시간 구독으로 자동 업데이트되므로 수동으로 제거하지 않음
    } else {
      // 비로그인 상태거나 로컬 데이터면 로컬에서만 삭제
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success('거래 내역이 삭제되었습니다.');
    }
  };

  const handleEditTransaction = (transaction: Transaction): void => {
    setEditingTransaction(transaction);
    setShowAddForm(false); // 추가 폼이 열려있으면 닫기
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">거래 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 비로그인 상태 안내 */}
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                임시 모드로 사용 중입니다
              </h3>
              <p className="text-sm text-yellow-800 mb-2">
                현재 로그인하지 않아 입력한 데이터가 저장되지 않습니다.
                새로고침하면 모든 데이터가 사라집니다.
              </p>
              <p className="text-sm text-yellow-800">
                💡 <strong>로그인</strong>하여 데이터를 안전하게 저장하세요!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard - 뷰 모드 상태를 내부에서 관리 */}
      <Dashboard
        transactions={transactions}
        onViewModeChange={setViewMode}
        currentViewMode={viewMode}
        onCalendarDateClick={handleAddTransactionWithDate}
        onDeleteTransaction={deleteTransaction}
        onEditTransaction={handleEditTransaction}
      />

      {/* Add Transaction Button - 캘린더 및 통계 분석 탭에서는 숨김 */}
      {viewMode === 'summary' && (
        <div>
          <button
            onClick={() => handleAddTransactionWithDate()}
            className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>➕</span>
            내역 추가하기
          </button>
        </div>
      )}

      {/* Add/Edit Transaction Form */}
      {(showAddForm || editingTransaction) && (
        <div ref={formRef}>
          <TransactionForm
            onSubmit={addTransaction}
            onCancel={() => {
              setShowAddForm(false);
              setPreselectedDate(null);
              setEditingTransaction(null);
            }}
            initialDate={preselectedDate ?? undefined}
            editingTransaction={editingTransaction}
            onUpdate={updateTransaction}
          />
        </div>
      )}

      {/* Transaction List - 요약 보기일 때만 표시 */}
      {viewMode === 'summary' && (
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={handleEditTransaction}
        />
      )}
    </div>
  );
};

// Main App Content Component
const MainApp: React.FC = () => {
  const navigate = useNavigate();
  const { currentMode, isTransitioning } = useAppMode();
  const { user, profile, signOut } = useAuth();

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

  const handleSignOut = async (): Promise<void> => {
    await signOut();
  };

  const handleGoToLogin = (): void => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">
                  {currentMode === 'initial-cost-calculator' ? '✈️' : '💰'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 text-sm">{subtitle}</p>
              </div>
            </div>

            {/* 사용자 프로필 또는 로그인 버튼 */}
            <div className="flex items-center gap-3">
              {user ? (
                // 로그인된 상태
                <>
                  {profile?.avatar_url && (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.display_name || profile?.email}
                    </p>
                    <button
                      onClick={() => void handleSignOut()}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                // 로그인 안 된 상태
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-sm text-gray-600 mr-2">
                    로그인하여 데이터를 저장하세요
                  </div>
                  <button
                    onClick={handleGoToLogin}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                  >
                    로그인 / 회원가입
                  </button>
                </div>
              )}
            </div>
          </div>
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

export default MainApp;
