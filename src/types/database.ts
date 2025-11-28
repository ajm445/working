// Supabase Database Types
// 이 파일은 Supabase CLI로 자동 생성할 수도 있습니다:
// npx supabase gen types typescript --project-id [PROJECT_ID] > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          provider: 'google' | 'line' | 'email' | null;
          provider_id: string | null;
          settings: Json;
          is_active: boolean;
          last_sign_in_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          provider?: 'google' | 'line' | 'email' | null;
          provider_id?: string | null;
          settings?: Json;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          provider?: 'google' | 'line' | 'email' | null;
          provider_id?: string | null;
          settings?: Json;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // 거래 내역 테이블
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'income' | 'expense';
          amount: number;
          category: string;
          description: string;
          date: string;
          currency: 'KRW' | 'USD' | 'JPY';
          amount_in_krw: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'income' | 'expense';
          amount: number;
          category: string;
          description: string;
          date: string;
          currency: 'KRW' | 'USD' | 'JPY';
          amount_in_krw: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'income' | 'expense';
          amount?: number;
          category?: string;
          description?: string;
          date?: string;
          currency?: 'KRW' | 'USD' | 'JPY';
          amount_in_krw?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      japan_cost_items: {
        Row: Record<string, never>;
        Insert: Record<string, never>;
        Update: Record<string, never>;
      };
      // 고정지출 테이블
      recurring_expenses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          currency: 'KRW' | 'USD' | 'JPY';
          amount_in_krw: number;
          category: string;
          is_active: boolean;
          day_of_month: number; // 1-31, 매월 지출 날짜
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          currency?: 'KRW' | 'USD' | 'JPY';
          amount_in_krw: number;
          category?: string;
          is_active?: boolean;
          day_of_month?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          currency?: 'KRW' | 'USD' | 'JPY';
          amount_in_krw?: number;
          category?: string;
          is_active?: boolean;
          day_of_month?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// 편의성을 위한 타입 별칭
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export type RecurringExpense = Database['public']['Tables']['recurring_expenses']['Row'];
export type RecurringExpenseInsert = Database['public']['Tables']['recurring_expenses']['Insert'];
export type RecurringExpenseUpdate = Database['public']['Tables']['recurring_expenses']['Update'];

// 사용자 설정 타입
export interface UserSettings {
  defaultCurrency: 'KRW' | 'USD' | 'JPY';
  theme: 'light' | 'dark';
  language: 'ko' | 'en' | 'ja';
  notifications: {
    email: boolean;
    push: boolean;
  };
  privacy: {
    shareStatistics: boolean;
  };
}
