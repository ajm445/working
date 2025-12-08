import { supabase } from '../lib/supabase';
import type {
  SavingsGoalInsert,
  SavingsGoalUpdate,
  SavingsGoal as DBSavingsGoal
} from '../types/database';
import type { SavingsGoal } from '../types/savingsGoal';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Supabase SavingsGoal을 Local SavingsGoal로 변환
export const mapSupabaseToLocal = (dbGoal: DBSavingsGoal): SavingsGoal => {
  return {
    id: dbGoal.id,
    user_id: dbGoal.user_id,
    name: dbGoal.name,
    target_amount: Number(dbGoal.target_amount),
    current_amount: Number(dbGoal.current_amount),
    currency: dbGoal.currency,
    target_amount_in_krw: Number(dbGoal.target_amount_in_krw),
    current_amount_in_krw: Number(dbGoal.current_amount_in_krw),
    deadline: dbGoal.deadline,
    category: dbGoal.category as SavingsGoal['category'],
    description: dbGoal.description,
    is_completed: dbGoal.is_completed,
    created_at: dbGoal.created_at,
    updated_at: dbGoal.updated_at,
  };
};

// Local SavingsGoal을 Supabase Insert 형식으로 변환
const mapLocalToSupabase = (
  localGoal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>,
  userId: string
): SavingsGoalInsert => {
  return {
    user_id: userId,
    name: localGoal.name,
    target_amount: localGoal.target_amount,
    current_amount: localGoal.current_amount,
    currency: localGoal.currency,
    target_amount_in_krw: localGoal.target_amount_in_krw,
    current_amount_in_krw: localGoal.current_amount_in_krw,
    deadline: localGoal.deadline,
    category: localGoal.category,
    description: localGoal.description,
    is_completed: localGoal.is_completed,
  };
};

/**
 * 모든 저축 목표 조회 (최신순)
 */
export const fetchSavingsGoals = async (): Promise<{
  data: SavingsGoal[] | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const goals = data?.map(mapSupabaseToLocal) ?? [];
    return { data: goals, error: null };
  } catch (error) {
    console.error('Error fetching savings goals:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 활성 저축 목표만 조회 (완료되지 않은 목표)
 */
export const fetchActiveSavingsGoals = async (): Promise<{
  data: SavingsGoal[] | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('is_completed', false)
      .order('deadline', { ascending: true, nullsFirst: false });

    if (error) throw error;

    const goals = data?.map(mapSupabaseToLocal) ?? [];
    return { data: goals, error: null };
  } catch (error) {
    console.error('Error fetching active savings goals:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 특정 저축 목표 조회
 */
export const fetchSavingsGoalById = async (
  id: string
): Promise<{
  data: SavingsGoal | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return { data: mapSupabaseToLocal(data as DBSavingsGoal), error: null };
  } catch (error) {
    console.error('Error fetching savings goal:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 저축 목표 추가
 */
export const addSavingsGoal = async (
  goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at'>,
  userId: string
): Promise<{
  data: SavingsGoal | null;
  error: Error | null;
}> => {
  try {
    const insertData: SavingsGoalInsert = mapLocalToSupabase(goal, userId);

    const { data, error } = await supabase
      .from('savings_goals')
      // @ts-expect-error - Supabase type inference issue, will be fixed with CLI generated types
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return { data: mapSupabaseToLocal(data as DBSavingsGoal), error: null };
  } catch (error) {
    console.error('Error adding savings goal:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 저축 목표 수정
 */
export const updateSavingsGoal = async (
  id: string,
  updates: Partial<Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{
  data: SavingsGoal | null;
  error: Error | null;
}> => {
  try {
    const updateData: SavingsGoalUpdate = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.target_amount !== undefined)
      updateData.target_amount = updates.target_amount;
    if (updates.current_amount !== undefined)
      updateData.current_amount = updates.current_amount;
    if (updates.currency !== undefined) updateData.currency = updates.currency;
    if (updates.target_amount_in_krw !== undefined)
      updateData.target_amount_in_krw = updates.target_amount_in_krw;
    if (updates.current_amount_in_krw !== undefined)
      updateData.current_amount_in_krw = updates.current_amount_in_krw;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.is_completed !== undefined)
      updateData.is_completed = updates.is_completed;

    const { data, error } = await supabase
      .from('savings_goals')
      // @ts-expect-error - Supabase type inference issue, will be fixed with CLI generated types
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return { data: mapSupabaseToLocal(data as DBSavingsGoal), error: null };
  } catch (error) {
    console.error('Error updating savings goal:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 저축 목표 삭제
 */
export const deleteSavingsGoal = async (
  id: string
): Promise<{
  error: Error | null;
}> => {
  try {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    return { error: error as Error };
  }
};

/**
 * 저축 목표 완료 처리
 */
export const completeSavingsGoal = async (
  id: string
): Promise<{
  data: SavingsGoal | null;
  error: Error | null;
}> => {
  return updateSavingsGoal(id, { is_completed: true });
};

/**
 * 저축 금액 업데이트 (추가/차감)
 */
export const updateSavingsAmount = async (
  id: string,
  amountChange: number,
  amountChangeInKRW: number
): Promise<{
  data: SavingsGoal | null;
  error: Error | null;
}> => {
  try {
    // 먼저 현재 저축 목표 조회
    const { data: currentGoal, error: fetchError } = await fetchSavingsGoalById(id);

    if (fetchError || !currentGoal) {
      throw fetchError || new Error('Failed to fetch savings goal');
    }

    // 새로운 금액 계산
    const newCurrentAmount = currentGoal.current_amount + amountChange;
    const newCurrentAmountInKRW = currentGoal.current_amount_in_krw + amountChangeInKRW;

    // 목표 금액에 도달했는지 확인
    const isCompleted = newCurrentAmount >= currentGoal.target_amount;

    // 업데이트 실행
    return updateSavingsGoal(id, {
      current_amount: Math.max(0, newCurrentAmount), // 음수 방지
      current_amount_in_krw: Math.max(0, newCurrentAmountInKRW), // 음수 방지
      is_completed: isCompleted
    });
  } catch (error) {
    console.error('Error updating savings amount:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 실시간 저축 목표 구독
 */
export const subscribeToSavingsGoals = (
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<DBSavingsGoal>) => void
): { unsubscribe: () => void } => {
  const subscription = supabase
    .channel('savings-goals-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'savings_goals',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
};
