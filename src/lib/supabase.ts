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
    // 세션 지속성 활성화
    persistSession: true,
    // 세션 저장 위치: sessionStorage (탭 종료 시 자동 삭제)
    // - 탭 새로고침: 세션 유지 ✅
    // - 탭 전환: 세션 유지 ✅
    // - 탭 종료: 세션 자동 삭제 (자동 로그아웃) ✅
    // - 브라우저 종료: 모든 탭 닫힘 → 세션 자동 삭제 ✅
    storage: window.sessionStorage,
    // OAuth 콜백 URL에서 세션 감지
    detectSessionInUrl: true,
    // 세션 저장 키
    storageKey: 'supabase.auth.token',
  },
});

// 개발 환경에서 Supabase 클라이언트 상태 로깅
if (import.meta.env.DEV) {
  console.log('✅ Supabase Client initialized');
  console.log('📍 URL:', supabaseUrl);
}
