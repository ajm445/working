import { supabase } from '../lib/supabase';
import type {
  CategoryBudget,
  CategoryBudgetInsert,
  CategoryBudgetUpdate,
} from '../types/database';

/**
 * 모든 카테고리 예산 조회
 */
export const fetchAllCategoryBudgets = async (): Promise<{
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
      .order('category', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching category budgets:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 카테고리 예산 추가
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

    const { data, error } = await (supabase
      .from('category_budgets') as any)
      .insert({
        ...budget,
        user_id: user.id,
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
 * 카테고리 예산 삭제
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
