import React, { useState, useEffect, useContext } from 'react';
import type { CategoryBudget } from '../../types/database';
import { EXPENSE_CATEGORIES } from '../../types/transaction';
import { CurrencyContext } from '../../contexts/CurrencyContext';
import {
  fetchAllCategoryBudgets,
  addCategoryBudget,
  updateCategoryBudget,
  deleteCategoryBudget,
  subscribeToCategoryBudgets,
} from '../../services/categoryBudgetService';
import { supabase } from '../../lib/supabase';

type Currency = 'KRW' | 'USD' | 'JPY';

/**
 * CategoryBudgetManager 컴포넌트
 * 카테고리별 월별 예산을 설정하고 관리하는 컴포넌트
 */
const CategoryBudgetManager: React.FC = () => {
  const currencyContext = useContext(CurrencyContext);
  const currentCurrency = (currencyContext?.currentCurrency || 'KRW') as Currency;
  const exchangeRates = currencyContext?.exchangeRates;

  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

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

  // 사용자 인증 확인
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

  // 예산 데이터 로드
  useEffect(() => {
    loadBudgets();
  }, [user]);

  // 실시간 구독 설정
  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToCategoryBudgets(user.id, () => {
      loadBudgets();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const loadBudgets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await fetchAllCategoryBudgets();
      if (fetchError) throw fetchError;
      setBudgets(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load budgets:', err);
      setError('예산 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
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

    try {
      const amountInKrw = convertCurrency(amount, newBudget.currency, 'KRW');

      const { error: addError } = await addCategoryBudget({
        category: newBudget.category,
        budget_amount: amount,
        currency: newBudget.currency,
        budget_amount_in_krw: amountInKrw,
      });

      if (addError) throw addError;

      // 폼 초기화
      setNewBudget({
        category: '',
        amount: '',
        currency: currentCurrency,
      });
      setError(null);
    } catch (err) {
      console.error('Failed to add budget:', err);
      setError('예산 추가에 실패했습니다.');
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

    try {
      const amountInKrw = convertCurrency(
        amount,
        editingBudget.currency,
        'KRW'
      );

      const { error: updateError } = await updateCategoryBudget(budgetId, {
        budget_amount: amount,
        currency: editingBudget.currency,
        budget_amount_in_krw: amountInKrw,
      });

      if (updateError) throw updateError;

      setEditingId(null);
      setError(null);
    } catch (err) {
      console.error('Failed to update budget:', err);
      setError('예산 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('정말 이 예산을 삭제하시겠습니까?')) return;

    try {
      const { error: deleteError } = await deleteCategoryBudget(budgetId);
      if (deleteError) throw deleteError;
      setError(null);
    } catch (err) {
      console.error('Failed to delete budget:', err);
      setError('예산 삭제에 실패했습니다.');
    }
  };

  // 아직 예산이 설정되지 않은 카테고리 목록
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (category) => !budgets.some((b) => b.category === category)
  );

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 transition-colors duration-300">
        <div className="text-center text-gray-500 dark:text-gray-400">
          카테고리별 예산 기능은 로그인 후 사용할 수 있습니다.
        </div>
      </div>
    );
  }

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
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 새 예산 추가 폼 */}
      {availableCategories.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            새 예산 추가
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                카테고리
              </label>
              <select
                value={newBudget.category}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-300"
              >
                <option value="">선택하세요</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 금액 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                월 예산 금액
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

          <button
            onClick={handleAddBudget}
            className="mt-4 w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-300"
          >
            추가
          </button>
        </div>
      )}

      {/* 예산 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 transition-colors duration-300">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            설정된 예산 ({budgets.length})
          </h3>

          {budgets.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              설정된 예산이 없습니다. 위에서 새 예산을 추가해보세요.
            </p>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300"
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {budget.category}
                      </span>
                      {!budget.is_active && (
                        <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-xs rounded-full text-gray-600 dark:text-gray-300">
                          비활성
                        </span>
                      )}
                    </div>

                    {editingId === budget.id ? (
                      <div className="flex gap-2 mt-2">
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
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <select
                          value={editingBudget.currency}
                          onChange={(e) =>
                            setEditingBudget({
                              ...editingBudget,
                              currency: e.target.value as Currency,
                            })
                          }
                          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="KRW">KRW</option>
                          <option value="USD">USD</option>
                          <option value="JPY">JPY</option>
                        </select>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        월 예산:{' '}
                        {formatCurrency(
                          budget.budget_amount,
                          budget.currency as Currency
                        )}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingId === budget.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(budget.id)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(budget)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
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
    </div>
  );
};

export default CategoryBudgetManager;
