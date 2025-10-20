import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// 환경변수 검증
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check .env.local file.'
  );
}

// Supabase 클라이언트 생성
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 세션 자동 갱신
    autoRefreshToken: true,
    // 세션 지속성 (localStorage 사용)
    persistSession: true,
    // 이메일 확인 없이 로그인 허용
    detectSessionInUrl: true,
  },
});

// 개발 환경에서 Supabase 클라이언트 상태 로깅
if (import.meta.env.DEV) {
  console.log('✅ Supabase Client initialized');
  console.log('📍 URL:', supabaseUrl);
}
