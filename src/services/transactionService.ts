import { supabase } from '../lib/supabase';
import type { TransactionInsert, TransactionUpdate, Transaction as DBTransaction } from '../types/database';
import type { Transaction as LocalTransaction } from '../types/transaction';

// Supabase Transaction을 Local Transaction으로 변환
export const mapSupabaseToLocal = (dbTransaction: DBTransaction): LocalTransaction => {
  return {
    id: dbTransaction.id,
    type: dbTransaction.type,
    amount: Number(dbTransaction.amount),
    category: dbTransaction.category,
    description: dbTransaction.description,
    date: dbTransaction.date,
    currency: dbTransaction.currency,
    amountInKRW: Number(dbTransaction.amount_in_krw),
  };
};

// Local Transaction을 Supabase Insert 형식으로 변환
const mapLocalToSupabase = (
  localTransaction: Omit<LocalTransaction, 'id'>,
  userId: string
): TransactionInsert => {
  return {
    user_id: userId,
    type: localTransaction.type,
    amount: localTransaction.amount,
    category: localTransaction.category,
    description: localTransaction.description,
    date: localTransaction.date,
    currency: localTransaction.currency,
    amount_in_krw: localTransaction.amountInKRW,
  };
};

/**
 * 모든 거래 내역 조회 (최신순)
 */
export const fetchTransactions = async (): Promise<{
  data: LocalTransaction[] | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const transactions = data?.map(mapSupabaseToLocal) ?? [];
    return { data: transactions, error: null };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 거래 내역 추가
 */
export const addTransaction = async (
  transaction: Omit<LocalTransaction, 'id'>,
  userId: string
): Promise<{
  data: LocalTransaction | null;
  error: Error | null;
}> => {
  try {
    const insertData: TransactionInsert = mapLocalToSupabase(transaction, userId);

    const { data, error } = await supabase
      .from('transactions')
      .insert([insertData] as never)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return { data: mapSupabaseToLocal(data as DBTransaction), error: null };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 거래 내역 수정
 */
export const updateTransaction = async (
  id: string,
  updates: Partial<Omit<LocalTransaction, 'id'>>
): Promise<{
  data: LocalTransaction | null;
  error: Error | null;
}> => {
  try {
    const updateData: TransactionUpdate = {};

    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.currency !== undefined) updateData.currency = updates.currency;
    if (updates.amountInKRW !== undefined)
      updateData.amount_in_krw = updates.amountInKRW;

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return { data: mapSupabaseToLocal(data as DBTransaction), error: null };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * 거래 내역 삭제
 */
export const deleteTransaction = async (
  id: string
): Promise<{
  error: Error | null;
}> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { error: error as Error };
  }
};

/**
 * 실시간 구독 페이로드 타입
 */
interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: DBTransaction;
  old: { id: string };
}

/**
 * 실시간 거래 내역 구독
 */
export const subscribeToTransactions = (
  userId: string,
  callback: (payload: RealtimePayload) => void
): { unsubscribe: () => void } => {
  const subscription = supabase
    .channel('transactions-changes')
    .on(
      'postgres_changes' as never,
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`,
      } as never,
      callback as never
    )
    .subscribe();

  return subscription;
};
