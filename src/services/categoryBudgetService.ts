import { supabase } from '../lib/supabase';
import type {
  CategoryBudget,
  CategoryBudgetInsert,
  CategoryBudgetUpdate,
} from '../types/database';

/**
 * 특정 년월의 카테고리 예산 조회
 */
export const fetchCategoryBudgetsByYearMonth = async (
  year: number,
  month: number
): Promise<{
  data: CategoryBudget[] | null;
  error: Error | null;
}> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('category_budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('year', year)
      .eq('month', month)
      .eq('is_active', true)
      .order('category', { ascending: true });

    console.log('🔍 Query filters:', { user_id: user.id, year, month, is_active: true });
    console.log('📦 Query result:', { data, error });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching category budgets:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 모든 카테고리 예산 조회 (현재 월 기준)
 * @deprecated Use fetchCategoryBudgetsByYearMonth instead
 */
export const fetchAllCategoryBudgets = async (): Promise<{
  data: CategoryBudget[] | null;
  error: Error | null;
}> => {
  const now = new Date();
  return fetchCategoryBudgetsByYearMonth(now.getFullYear(), now.getMonth() + 1);
};

/**
 * 카테고리 예산 추가 (같은 년월/카테고리의 기존 데이터가 있으면 먼저 삭제)
 */
export const addCategoryBudget = async (
  budget: Omit<CategoryBudgetInsert, 'user_id'>
): Promise<{
  data: CategoryBudget | null;
  error: Error | null;
}> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    // 먼저 같은 년월/카테고리의 기존 예산을 모두 삭제 (중복 방지)
    await supabase
      .from('category_budgets')
      .delete()
      .eq('user_id', user.id)
      .eq('category', budget.category)
      .eq('year', budget.year)
      .eq('month', budget.month);

    // 새 예산 추가 (is_active를 명시적으로 true로 설정)
    const { data, error } = await (supabase
      .from('category_budgets') as any)
      .insert({
        ...budget,
        user_id: user.id,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error adding category budget:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 카테고리 예산 수정
 */
export const updateCategoryBudget = async (
  id: string,
  updates: CategoryBudgetUpdate
): Promise<{
  data: CategoryBudget | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await (supabase
      .from('category_budgets') as any)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating category budget:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 카테고리 예산 삭제 (완전 삭제)
 */
export const deleteCategoryBudget = async (
  id: string
): Promise<{
  error: Error | null;
}> => {
  try {
    const { error } = await supabase
      .from('category_budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting category budget:', error);
    return { error: error as Error };
  }
};

/**
 * 카테고리 예산 활성화/비활성화 토글
 */
export const toggleCategoryBudgetActive = async (
  id: string,
  isActive: boolean
): Promise<{
  error: Error | null;
}> => {
  try {
    const { error } = await (supabase
      .from('category_budgets') as any)
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error toggling category budget active:', error);
    return { error: error as Error };
  }
};

/**
 * 전월 예산을 다음 월로 복사
 */
export const copyPreviousMonthBudgets = async (
  fromYear: number,
  fromMonth: number,
  toYear: number,
  toMonth: number
): Promise<{
  data: CategoryBudget[] | null;
  error: Error | null;
}> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    // 1. 전월 예산 조회
    const { data: previousBudgets, error: fetchError } = await fetchCategoryBudgetsByYearMonth(
      fromYear,
      fromMonth
    );

    if (fetchError) throw fetchError;
    if (!previousBudgets || previousBudgets.length === 0) {
      return { data: [], error: null };
    }

    // 2. 목표 월의 기존 예산 삭제
    await supabase
      .from('category_budgets')
      .delete()
      .eq('user_id', user.id)
      .eq('year', toYear)
      .eq('month', toMonth);

    // 3. 새로운 월로 복사
    const newBudgets = previousBudgets.map((budget) => ({
      user_id: user.id,
      category: budget.category,
      year: toYear,
      month: toMonth,
      budget_amount: budget.budget_amount,
      currency: budget.currency,
      budget_amount_in_krw: budget.budget_amount_in_krw,
      is_active: true,
    }));

    const { data, error } = await (supabase
      .from('category_budgets') as any)
      .insert(newBudgets)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error copying previous month budgets:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 카테고리 예산 실시간 구독
 */
export const subscribeToCategoryBudgets = (
  userId: string,
  callback: () => void
) => {
  return supabase
    .channel('category_budgets_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'category_budgets',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};
