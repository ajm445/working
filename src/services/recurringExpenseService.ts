import { supabase } from '../lib/supabase';
import type { RecurringExpense, RecurringExpenseInsert, RecurringExpenseUpdate } from '../types/database';

/**
 * 모든 활성화된 고정지출 조회
 */
export const fetchRecurringExpenses = async (): Promise<{
  data: RecurringExpense[] | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('recurring_expenses')
      .select('*')
      .eq('is_active', true)
      .order('day_of_month', { ascending: true });

    if (error) {
      console.error('Error fetching recurring expenses:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RecurringExpense[], error: null };
  } catch (error) {
    console.error('Unexpected error fetching recurring expenses:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 모든 고정지출 조회 (비활성 포함)
 */
export const fetchAllRecurringExpenses = async (): Promise<{
  data: RecurringExpense[] | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('recurring_expenses')
      .select('*')
      .order('is_active', { ascending: false })
      .order('day_of_month', { ascending: true });

    if (error) {
      console.error('Error fetching all recurring expenses:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RecurringExpense[], error: null };
  } catch (error) {
    console.error('Unexpected error fetching all recurring expenses:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 새 고정지출 추가
 */
export const addRecurringExpense = async (
  recurringExpense: Omit<RecurringExpenseInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  userId: string
): Promise<{ data: RecurringExpense | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('recurring_expenses')
      // @ts-expect-error - Supabase type inference issue
      .insert({
        ...recurringExpense,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding recurring expense:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RecurringExpense, error: null };
  } catch (error) {
    console.error('Unexpected error adding recurring expense:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 고정지출 수정
 */
export const updateRecurringExpense = async (
  id: string,
  updates: RecurringExpenseUpdate
): Promise<{ data: RecurringExpense | null; error: Error | null }> => {
  try {
    const { data, error} = await supabase
      .from('recurring_expenses')
      // @ts-expect-error - Supabase type inference issue
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recurring expense:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RecurringExpense, error: null };
  } catch (error) {
    console.error('Unexpected error updating recurring expense:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 고정지출 삭제
 */
export const deleteRecurringExpense = async (
  id: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('recurring_expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recurring expense:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error deleting recurring expense:', error);
    return { error: error as Error };
  }
};

/**
 * 고정지출 활성화/비활성화 토글
 */
export const toggleRecurringExpenseActive = async (
  id: string,
  isActive: boolean
): Promise<{ data: RecurringExpense | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('recurring_expenses')
      // @ts-expect-error - Supabase type inference issue
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling recurring expense:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RecurringExpense, error: null };
  } catch (error) {
    console.error('Unexpected error toggling recurring expense:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 고정지출 실시간 구독
 */
export const subscribeToRecurringExpenses = (
  userId: string,
  callback: (payload: any) => void
): { unsubscribe: () => void } => {
  const channel = supabase
    .channel('recurring_expenses_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'recurring_expenses',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return {
    unsubscribe: () => {
      void supabase.removeChannel(channel);
    },
  };
};

/**
 * 월별 총 고정지출 계산
 */
export const calculateMonthlyTotal = (expenses: RecurringExpense[]): number => {
  return expenses
    .filter(expense => expense.is_active)
    .reduce((total, expense) => total + expense.amount_in_krw, 0);
};

/**
 * 기본 고정지출 템플릿 생성 (수동 호출용)
 */
export const createDefaultRecurringExpenses = async (
  userId: string
): Promise<{ error: Error | null }> => {
  try {
    // @ts-expect-error - Supabase RPC type inference issue
    const { error } = await supabase.rpc('create_default_recurring_expenses', {
      p_user_id: userId,
    });

    if (error) {
      console.error('Error creating default recurring expenses:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error creating default recurring expenses:', error);
    return { error: error as Error };
  }
};
