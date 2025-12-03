import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit2, Trash2, Power, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { CurrencyContext } from '../../contexts/CurrencyContext';
import type { RecurringExpense, CategoryBudget } from '../../types/database';
import * as recurringExpenseService from '../../services/recurringExpenseService';
import RecurringExpenseForm from './RecurringExpenseForm';
import CategoryBudgetManager from './CategoryBudgetManager';

interface RecurringExpenseManagerProps {
  expenses?: RecurringExpense[];
  onExpensesChange?: (expenses: RecurringExpense[]) => void;
  budgets?: CategoryBudget[];
  onBudgetsChange?: (budgets: CategoryBudget[]) => void;
}

type SubTab = 'recurring' | 'budget';

const RecurringExpenseManager: React.FC<RecurringExpenseManagerProps> = ({
  expenses: externalExpenses,
  onExpensesChange,
  budgets: externalBudgets,
  onBudgetsChange
}) => {
  const { user } = useAuth();
  const currencyContext = useContext(CurrencyContext);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('recurring');

  const currentCurrency = (currencyContext?.currentCurrency || 'KRW') as 'KRW' | 'USD' | 'JPY';
  const exchangeRates = currencyContext?.exchangeRates;
  const isLoadingRates = currencyContext?.isLoadingRates || false;

  const formatCurrency = (amount: number, currency: 'KRW' | 'USD' | 'JPY'): string => {
    const currencyMap = {
      KRW: { locale: 'ko-KR', currency: 'KRW' },
      USD: { locale: 'en-US', currency: 'USD' },
      JPY: { locale: 'ja-JP', currency: 'JPY' },
    };

    const { locale, currency: curr } = currencyMap[currency];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
    }).format(amount);
  };

  // 통화 변환 함수
  const convertAmount = (amountInKRW: number, targetCurrency: 'KRW' | 'USD' | 'JPY'): number => {
    if (targetCurrency === 'KRW') return amountInKRW;
    if (!exchangeRates) return amountInKRW;
    const rate = exchangeRates[targetCurrency];
    return rate ? amountInKRW * rate : amountInKRW;
  };
  const [internalExpenses, setInternalExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);

  // 내부 상태와 외부 props 동기화
  const expenses = externalExpenses !== undefined ? externalExpenses : internalExpenses;
  const setExpenses = (newExpenses: RecurringExpense[] | ((prev: RecurringExpense[]) => RecurringExpense[])) => {
    const updatedExpenses = typeof newExpenses === 'function' ? newExpenses(expenses) : newExpenses;
    if (onExpensesChange) {
      onExpensesChange(updatedExpenses);
    } else {
      setInternalExpenses(updatedExpenses);
    }
  };

  // 고정지출 로드
  useEffect(() => {
    const loadExpenses = async (): Promise<void> => {
      // 비로그인 상태일 때는 외부에서 props로 관리하므로 로드하지 않음
      if (!user) {
        console.log('📦 Non-logged in mode - using external expenses from props');
        setLoading(false);
        return;
      }

      // 로그인 상태면 Supabase에서 로드
      console.log('📥 User logged in, loading recurring expenses');
      setLoading(true);
      const { data, error } = await recurringExpenseService.fetchAllRecurringExpenses();

      if (error) {
        console.error('Failed to load recurring expenses:', error);
        toast.error('고정지출을 불러오는데 실패했습니다.');
      } else if (data) {
        setExpenses(data);
      }

      setLoading(false);
    };

    void loadExpenses();
  }, [user]);

  // 실시간 구독
  useEffect(() => {
    if (!user) return;

    const subscription = recurringExpenseService.subscribeToRecurringExpenses(
      user.id,
      () => {
        void loadExpensesQuietly();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const loadExpensesQuietly = async (): Promise<void> => {
    if (!user) return;

    const { data } = await recurringExpenseService.fetchAllRecurringExpenses();
    if (data) {
      setExpenses(data);
    }
  };

  // 고정지출 삭제
  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('이 고정지출을 삭제하시겠습니까?')) return;

    // 로그인 상태면 Supabase에서도 삭제
    if (user && !id.startsWith('local-')) {
      const { error } = await recurringExpenseService.deleteRecurringExpense(id);

      if (error) {
        toast.error('삭제에 실패했습니다.');
        return;
      }
    }

    // UI 업데이트
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success('고정지출이 삭제되었습니다.');
  };

  // 활성화/비활성화 토글
  const handleToggleActive = async (expense: RecurringExpense): Promise<void> => {
    const newStatus = !expense.is_active;

    // 로그인 상태면 Supabase에도 업데이트
    if (user && !expense.id.startsWith('local-')) {
      const { error } = await recurringExpenseService.toggleRecurringExpenseActive(
        expense.id,
        newStatus
      );

      if (error) {
        toast.error('상태 변경에 실패했습니다.');
        return;
      }
    }

    // UI 업데이트
    setExpenses(
      expenses.map(e =>
        e.id === expense.id ? { ...e, is_active: newStatus } : e
      )
    );
    toast.success(newStatus ? '활성화되었습니다.' : '비활성화되었습니다.');
  };

  // 수정 시작
  const handleEdit = (expense: RecurringExpense): void => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  // 폼 닫기
  const handleCloseForm = (): void => {
    setShowForm(false);
    setEditingExpense(null);
  };

  // 폼 제출 성공
  const handleFormSuccess = (): void => {
    handleCloseForm();
    if (user) {
      void loadExpensesQuietly();
    }
  };

  // 고정지출 추가 (로컬)
  const handleAddExpense = (expense: RecurringExpense): void => {
    setExpenses([expense, ...expenses]);
  };

  // 고정지출 수정 (로컬)
  const handleUpdateExpense = (updatedExpense: RecurringExpense): void => {
    setExpenses(
      expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e)
    );
  };

  // 월별 총액 계산 (현재 선택된 통화 기준, 이번 달 전체 예상 금액 - 미래 포함)
  const calculateMonthlyTotalInCurrentCurrency = (): number => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return expenses
      .filter(expense => {
        if (!expense.is_active) return false;

        // 이번 달의 고정지출 발생일
        const dayOfMonth = expense.day_of_month;
        const expenseDate = new Date(currentYear, currentMonth, dayOfMonth);

        // 고정지출 생성일
        const createdDate = new Date(expense.created_at);

        // 이번 달의 마지막 날 확인
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // 생성일 이후이고, 이번 달에 유효한 날짜인 경우 포함 (미래 날짜도 포함)
        return expenseDate >= createdDate && dayOfMonth <= lastDayOfMonth;
      })
      .reduce((total, expense) => {
        // 각 expense의 원화 금액을 현재 통화로 변환
        const amountInKRW = expense.amount_in_krw;

        if (currentCurrency === 'KRW') {
          return total + amountInKRW;
        }

        // 환율 정보가 없으면 원화 그대로 표시
        if (!exchangeRates || !exchangeRates[currentCurrency]) {
          console.warn(`환율 정보가 없어 원화로 표시합니다: ${currentCurrency}`);
          return total + amountInKRW;
        }

        // KRW를 현재 통화로 변환 (1원 * rate = 해당 통화 금액)
        const rate = exchangeRates[currentCurrency];
        return total + (amountInKRW * rate);
      }, 0);
  };

  const monthlyTotal = calculateMonthlyTotalInCurrentCurrency();

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          고정지출 관리
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          매월 반복되는 지출과 카테고리별 예산을 관리하세요
        </p>
      </div>

      {/* 서브탭 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveSubTab('recurring')}
            className={`
              px-4 py-3 font-medium transition-colors
              ${activeSubTab === 'recurring'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar size={18} />
              <span>고정지출</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSubTab('budget')}
            className={`
              px-4 py-3 font-medium transition-colors border-l dark:border-gray-700
              ${activeSubTab === 'budget'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>💰</span>
              <span>카테고리 예산</span>
            </div>
          </button>
        </div>
      </div>

      {/* 고정지출 탭 내용 */}
      {activeSubTab === 'recurring' && (
        <>
          {/* 고정지출 설명 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  고정지출이란?
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  매월 정해진 날짜에 반복적으로 발생하는 지출을 관리합니다.
                  월세, 공과금, 구독료 등을 등록하면 매달 자동으로 지출 내역을 생성하여 예산 관리를 더욱 편리하게 할 수 있습니다.
                  (고정지출을 추가한 날짜부터 적용됩니다.)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                고정지출 목록
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                매월 반복되는 지출 항목
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
            >
              <Plus size={20} />
              <span>고정지출 추가</span>
            </button>
          </div>
        </>
      )}

      {/* 고정지출 탭 - 월별 총액 */}
      {activeSubTab === 'recurring' && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">월별 총 고정지출</p>
          {isLoadingRates && currentCurrency !== 'KRW' ? (
            <p className="text-3xl font-bold mt-2 animate-pulse">환율 불러오는 중...</p>
          ) : (
            <p className="text-3xl font-bold mt-2">{formatCurrency(monthlyTotal, currentCurrency)}</p>
          )}
          {!exchangeRates && currentCurrency !== 'KRW' && !isLoadingRates && (
            <p className="text-xs opacity-75 mt-2">⚠️ 환율 정보를 불러오지 못해 원화로 표시됩니다</p>
          )}
        </div>
      )}

      {/* 고정지출 목록 */}
      {activeSubTab === 'recurring' && (
        <>
      {expenses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            등록된 고정지출이 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            월세, 공과금 등 정기적으로 지출되는 항목을 추가해보세요
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <Plus size={20} />
            <span>첫 고정지출 추가하기</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map(expense => (
            <div
              key={expense.id}
              className={`bg-white dark:bg-gray-800 rounded-lg p-4 transition-all ${
                expense.is_active
                  ? 'border-l-4 border-indigo-500 dark:border-indigo-400'
                  : 'opacity-60 border-l-4 border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {expense.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {expense.category}
                    </span>
                    {!expense.is_active && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        비활성
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      매월 {expense.day_of_month}일
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(convertAmount(expense.amount_in_krw, currentCurrency), currentCurrency)}
                    </span>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {expense.description}
                    </p>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(expense)}
                    className={`p-2 rounded-lg transition-colors ${
                      expense.is_active
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={expense.is_active ? '비활성화' : '활성화'}
                  >
                    <Power size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="수정"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => void handleDelete(expense.id)}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    title="삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}

      {/* 카테고리 예산 탭 내용 */}
      {activeSubTab === 'budget' && (
        <CategoryBudgetManager
          {...(!user && externalBudgets !== undefined && { budgets: externalBudgets })}
          {...(!user && onBudgetsChange !== undefined && { onBudgetsChange: onBudgetsChange })}
        />
      )}

      {/* 고정지출 추가/수정 폼 모달 */}
      {showForm && (
        <RecurringExpenseForm
          expense={editingExpense}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
          onAdd={handleAddExpense}
          onUpdate={handleUpdateExpense}
        />
      )}
    </div>
  );
};

export default RecurringExpenseManager;
