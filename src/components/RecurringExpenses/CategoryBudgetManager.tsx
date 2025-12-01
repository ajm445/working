import React, { useState, useEffect, useContext } from 'react';
import type { CategoryBudget } from '../../types/database';
import { EXPENSE_CATEGORIES } from '../../types/transaction';
import { CurrencyContext } from '../../contexts/CurrencyContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchAllCategoryBudgets,
  addCategoryBudget,
  updateCategoryBudget,
  deleteCategoryBudget,
  subscribeToCategoryBudgets,
} from '../../services/categoryBudgetService';
import toast from 'react-hot-toast';

type Currency = 'KRW' | 'USD' | 'JPY';

interface CategoryBudgetManagerProps {
  budgets?: CategoryBudget[];
  onBudgetsChange?: (budgets: CategoryBudget[]) => void;
}

/**
 * CategoryBudgetManager 컴포넌트
 * 카테고리별 월별 예산을 설정하고 관리하는 컴포넌트
 */
const CategoryBudgetManager: React.FC<CategoryBudgetManagerProps> = ({
  budgets: externalBudgets,
  onBudgetsChange
}) => {
  const { user } = useAuth();
  const currencyContext = useContext(CurrencyContext);
  const currentCurrency = (currencyContext?.currentCurrency || 'KRW') as Currency;
  const exchangeRates = currencyContext?.exchangeRates;

  const [internalBudgets, setInternalBudgets] = useState<CategoryBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 내부 상태와 외부 props 동기화
  const budgets = externalBudgets !== undefined ? externalBudgets : internalBudgets;
  const setBudgets = (newBudgets: CategoryBudget[] | ((prev: CategoryBudget[]) => CategoryBudget[])) => {
    const updatedBudgets = typeof newBudgets === 'function' ? newBudgets(budgets) : newBudgets;
    if (onBudgetsChange) {
      onBudgetsChange(updatedBudgets);
    } else {
      setInternalBudgets(updatedBudgets);
    }
  };

  // 통화 포맷팅
  const formatCurrency = (amount: number, currency: Currency): string => {
    const currencyMap = {
      KRW: { symbol: '₩', decimals: 0 },
      USD: { symbol: '$', decimals: 2 },
      JPY: { symbol: '¥', decimals: 0 },
    };

    const { symbol, decimals } = currencyMap[currency];
    return `${symbol}${amount.toLocaleString('ko-KR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  // 통화 변환
  const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
    if (from === to) return amount;
    if (!exchangeRates) return amount;

    // from -> KRW -> to
    let krwAmount = amount;
    if (from !== 'KRW') {
      const fromRate = exchangeRates[from];
      if (!fromRate) return amount;
      krwAmount = amount * fromRate;
    }

    if (to === 'KRW') return krwAmount;

    const toRate = exchangeRates[to];
    if (!toRate) return amount;
    return krwAmount / toRate;
  };

  // KRW 금액을 현재 통화로 변환
  const convertFromKRW = (amountInKRW: number): number => {
    if (currentCurrency === 'KRW') return amountInKRW;
    if (!exchangeRates) return amountInKRW;
    const rate = exchangeRates[currentCurrency];
    return rate ? amountInKRW * rate : amountInKRW;
  };

  // 새 예산 입력 폼 상태
  const [newBudget, setNewBudget] = useState<{
    category: string;
    amount: string;
    currency: Currency;
  }>({
    category: '',
    amount: '',
    currency: currentCurrency,
  });

  // 수정 중인 예산 상태
  const [editingBudget, setEditingBudget] = useState<{
    amount: string;
    currency: Currency;
  }>({
    amount: '',
    currency: currentCurrency,
  });

  // 숫자 포맷팅 함수 (쉼표 추가)
  const formatNumberWithCommas = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    if (!numbers) return '';

    // 천 단위 구분 쉼표 추가
    return Number(numbers).toLocaleString('ko-KR');
  };

  // 쉼표 제거하여 숫자만 추출
  const removeCommas = (value: string): string => {
    return value.replace(/,/g, '');
  };

  // 예산 데이터 로드
  useEffect(() => {
    const loadBudgetsEffect = async (): Promise<void> => {
      // 외부에서 props로 전달받은 경우 로드하지 않음
      if (externalBudgets !== undefined) {
        console.log('📦 Using external budgets from props');
        setLoading(false);
        return;
      }

      // 비로그인 상태일 때도 로드하지 않음
      if (!user) {
        console.log('📦 Non-logged in mode - no budgets to load');
        setLoading(false);
        return;
      }

      // 로그인 상태이고 외부 props가 없을 때만 Supabase에서 로드
      console.log('📥 User logged in, loading category budgets from Supabase');
      setLoading(true);
      const { data, error: fetchError } = await fetchAllCategoryBudgets();

      if (fetchError) {
        console.error('Failed to load category budgets:', fetchError);
        setError('예산 정보를 불러오는데 실패했습니다.');
      } else if (data) {
        setBudgets(data);
        setError(null);
      }

      setLoading(false);
    };

    void loadBudgetsEffect();
  }, [user]);

  // 실시간 구독 설정
  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToCategoryBudgets(user.id, () => {
      void loadBudgetsQuietly();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const loadBudgetsQuietly = async (): Promise<void> => {
    if (!user) return;

    const { data } = await fetchAllCategoryBudgets();
    if (data) {
      setBudgets(data);
    }
  };

  const handleAddBudget = async () => {
    if (!newBudget.category || !newBudget.amount) {
      setError('카테고리와 금액을 모두 입력해주세요.');
      return;
    }

    const amount = parseFloat(removeCommas(newBudget.amount));
    if (isNaN(amount) || amount <= 0) {
      setError('올바른 금액을 입력해주세요.');
      return;
    }

    // 이미 존재하는 카테고리인지 확인
    if (budgets.some((b) => b.category === newBudget.category)) {
      setError('이미 해당 카테고리의 예산이 설정되어 있습니다.');
      return;
    }

    const amountInKrw = convertCurrency(amount, newBudget.currency, 'KRW');

    // 로그인 상태면 Supabase에 저장
    if (user) {
      try {
        const { error: addError } = await addCategoryBudget({
          category: newBudget.category,
          budget_amount: amount,
          currency: newBudget.currency,
          budget_amount_in_krw: amountInKrw,
        });

        if (addError) throw addError;

        // 데이터 새로고침
        await loadBudgetsQuietly();

        // 폼 초기화
        setNewBudget({
          category: '',
          amount: '',
          currency: currentCurrency,
        });
        setError(null);
        setShowAddModal(false);
        toast.success('예산이 추가되었습니다.');
      } catch (err) {
        console.error('Failed to add budget:', err);
        setError('예산 추가에 실패했습니다.');
      }
    } else {
      // 비로그인 상태면 로컬 메모리에만 저장
      const localBudget: CategoryBudget = {
        id: `local-${Date.now()}-${Math.random()}`,
        user_id: 'local',
        category: newBudget.category,
        budget_amount: amount,
        currency: newBudget.currency,
        budget_amount_in_krw: amountInKrw,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setBudgets([...budgets, localBudget]);

      // 폼 초기화
      setNewBudget({
        category: '',
        amount: '',
        currency: currentCurrency,
      });
      setError(null);
      setShowAddModal(false);
      toast.success('예산이 추가되었습니다.');
      toast('⚠️ 로그인하지 않아 데이터가 임시로만 저장됩니다.\n새로고침 시 데이터가 사라집니다.', {
        icon: '⚠️',
        duration: 4000,
      });
    }
  };

  const handleStartEdit = (budget: CategoryBudget) => {
    setEditingId(budget.id);
    setEditingBudget({
      amount: formatNumberWithCommas(budget.budget_amount.toString()),
      currency: budget.currency as Currency,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingBudget({ amount: '', currency: currentCurrency });
  };

  const handleSaveEdit = async (budgetId: string) => {
    const amount = parseFloat(removeCommas(editingBudget.amount));
    if (isNaN(amount) || amount <= 0) {
      setError('올바른 금액을 입력해주세요.');
      return;
    }

    const amountInKrw = convertCurrency(
      amount,
      editingBudget.currency,
      'KRW'
    );

    // 로그인 상태면 Supabase에 업데이트
    if (user && !budgetId.startsWith('local-')) {
      try {
        const { error: updateError } = await updateCategoryBudget(budgetId, {
          budget_amount: amount,
          currency: editingBudget.currency,
          budget_amount_in_krw: amountInKrw,
        });

        if (updateError) throw updateError;

        // 데이터 새로고침
        await loadBudgetsQuietly();

        setEditingId(null);
        setError(null);
        toast.success('예산이 수정되었습니다.');
      } catch (err) {
        console.error('Failed to update budget:', err);
        setError('예산 수정에 실패했습니다.');
      }
    } else {
      // 비로그인 상태거나 로컬 데이터면 로컬에서만 수정
      setBudgets(
        budgets.map((b) =>
          b.id === budgetId
            ? {
                ...b,
                budget_amount: amount,
                currency: editingBudget.currency,
                budget_amount_in_krw: amountInKrw,
                updated_at: new Date().toISOString(),
              }
            : b
        )
      );

      setEditingId(null);
      setError(null);
      toast.success('예산이 수정되었습니다.');
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('정말 이 예산을 삭제하시겠습니까?')) return;

    // 로그인 상태면 Supabase에서도 삭제
    if (user && !budgetId.startsWith('local-')) {
      try {
        const { error: deleteError } = await deleteCategoryBudget(budgetId);
        if (deleteError) throw deleteError;

        // 데이터 새로고침
        await loadBudgetsQuietly();

        setError(null);
        toast.success('예산이 삭제되었습니다.');
      } catch (err) {
        console.error('Failed to delete budget:', err);
        setError('예산 삭제에 실패했습니다.');
      }
    } else {
      // 비로그인 상태거나 로컬 데이터면 로컬에서만 삭제
      setBudgets(budgets.filter((b) => b.id !== budgetId));
      setError(null);
      toast.success('예산이 삭제되었습니다.');
    }
  };

  // 아직 예산이 설정되지 않은 카테고리 목록
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (category) => !budgets.some((b) => b.category === category)
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transition-colors duration-300">
        <div className="text-center text-gray-500 dark:text-gray-400">
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 카테고리 예산 설명 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
              카테고리 예산이란?
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              돈을 효율적으로 관리하기 위해 매월 각 카테고리별로 얼마나 지출할지 미리 계획할 수 있습니다.
              식비, 교통비, 쇼핑 등 카테고리별 예산을 설정하면 지출 현황을 한눈에 파악할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 예산 추가 버튼 */}
      {availableCategories.length > 0 && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              카테고리별 예산 목록
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              각 카테고리별 월별 예산 금액
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <span className="text-lg">+</span>
            <span>예산 추가</span>
          </button>
        </div>
      )}

      {/* 예산 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 transition-colors duration-300">
        <div className="p-4 sm:p-6">
          {availableCategories.length === 0 && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              설정된 예산 ({budgets.length})
            </h3>
          )}

          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                설정된 예산이 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                카테고리별 예산을 설정하여 지출을 효율적으로 관리해보세요
              </p>
              {availableCategories.length > 0 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                >
                  <span className="text-lg">+</span>
                  <span>첫 예산 추가하기</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md"
                >
                  {editingId === budget.id ? (
                    // 수정 모드
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {budget.category}
                        </span>
                        {!budget.is_active && (
                          <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-xs rounded-full text-gray-600 dark:text-gray-300">
                            비활성
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex gap-2 flex-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={editingBudget.amount}
                            onChange={(e) => {
                              const formatted = formatNumberWithCommas(e.target.value);
                              setEditingBudget({
                                ...editingBudget,
                                amount: formatted,
                              });
                            }}
                            className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="금액"
                          />
                          <select
                            value={editingBudget.currency}
                            onChange={(e) =>
                              setEditingBudget({
                                ...editingBudget,
                                currency: e.target.value as Currency,
                              })
                            }
                            className="w-24 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="KRW">KRW</option>
                            <option value="USD">USD</option>
                            <option value="JPY">JPY</option>
                          </select>
                        </div>

                        <div className="flex gap-2 sm:ml-auto">
                          <button
                            onClick={() => handleSaveEdit(budget.id)}
                            className="flex-1 sm:flex-none px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드 - 고정지출 카드 스타일
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                            {budget.category}
                          </h4>
                          {!budget.is_active && (
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-xs rounded-full text-gray-600 dark:text-gray-300">
                              비활성
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(
                              convertFromKRW(budget.budget_amount_in_krw),
                              currentCurrency
                            )}
                          </span>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(budget)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="수정"
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          title="삭제"
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 안내 메시지 */}
      {budgets.length > 0 && availableCategories.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            모든 카테고리에 대한 예산이 설정되었습니다.
          </p>
        </div>
      )}

      {/* 예산 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                새 예산 추가
              </h2>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* 카테고리 선택 - 버튼 그리드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    카테고리 {!newBudget.category && <span className="text-red-500 dark:text-red-400">*</span>}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setNewBudget({ ...newBudget, category })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          newBudget.category === category
                            ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md scale-105'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 금액 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      월 예산 금액 {!newBudget.amount && <span className="text-red-500 dark:text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={newBudget.amount}
                      onChange={(e) => {
                        const formatted = formatNumberWithCommas(e.target.value);
                        setNewBudget({ ...newBudget, amount: formatted });
                      }}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-300"
                    />
                  </div>

                  {/* 통화 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      통화
                    </label>
                    <select
                      value={newBudget.currency}
                      onChange={(e) =>
                        setNewBudget({
                          ...newBudget,
                          currency: e.target.value as Currency,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-300"
                    >
                      <option value="KRW">KRW (₩)</option>
                      <option value="USD">USD ($)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddBudget}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                    setNewBudget({
                      category: '',
                      amount: '',
                      currency: currentCurrency,
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-300"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryBudgetManager;
