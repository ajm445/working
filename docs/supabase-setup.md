# Supabase 데이터베이스 설정 가이드

## 📌 문서 정보

- **작성일**: 2025-10-08
- **목적**: 일본 워킹홀리데이 가계부 앱에 Supabase 데이터베이스 및 소셜 로그인 구현
- **대상**: Google 및 Kakao 소셜 로그인 기반 사용자 인증 시스템

---

## 🎯 프로젝트 목표

1. **Supabase PostgreSQL** 데이터베이스 구축
2. **Google OAuth** 로그인 구현
3. **Kakao OAuth** 로그인 구현
4. **사용자 프로필 관리** 테이블 설계
5. **Row Level Security (RLS)** 보안 정책 적용
6. **프론트엔드 인증 시스템** 구현

---

## 📋 전체 작업 단계

### **Phase 1: Supabase 기반 준비** ⚠️ 개발자 직접 작업

#### **Step 1-1: Supabase 프로젝트 생성**

1. **Supabase 회원가입 및 프로젝트 생성**
   ```
   URL: https://supabase.com
   ```

2. **프로젝트 생성 정보**
   - **Project Name**: `japan-working-holiday-app`
   - **Database Password**: 안전한 비밀번호 생성 (반드시 저장!)
   - **Region**: `Northeast Asia (Seoul)` - 한국 서버 선택
   - **Pricing Plan**: Free (베타 테스트용)

3. **프로젝트 생성 후 저장할 정보**
   ```
   ✅ Project URL: https://xxxxx.supabase.co
   ✅ API URL: https://xxxxx.supabase.co/rest/v1
   ✅ anon public key: eyJhbGc...
   ✅ service_role secret: eyJhbGc... (보안 주의!)
   ```

4. **정보 저장 위치**
   - 프로젝트 루트에 `.env.local` 파일 생성 (gitignore에 추가)
   - 개인 비밀번호 관리자에 백업

---

#### **Step 1-2: Google OAuth 설정**

1. **Google Cloud Console 접속**
   ```
   URL: https://console.cloud.google.com
   ```

2. **프로젝트 생성**
   - 프로젝트 이름: `Japan Working Holiday App`
   - 위치: 조직 없음

3. **OAuth 동의 화면 설정**
   ```
   경로: API 및 서비스 > OAuth 동의 화면

   설정 내용:
   - User Type: 외부 (External)
   - 앱 이름: 일본 워킹홀리데이 가계부
   - 사용자 지원 이메일: [개발자 이메일]
   - 승인된 도메인: supabase.co
   - 개발자 연락처: [개발자 이메일]
   ```

4. **OAuth 2.0 클라이언트 ID 생성**
   ```
   경로: API 및 서비스 > 사용자 인증 정보 > 사용자 인증 정보 만들기

   설정 내용:
   - 애플리케이션 유형: 웹 애플리케이션
   - 이름: Japan WH App - Web Client

   승인된 자바스크립트 원본:
   - http://localhost:5173
   - https://[your-domain].com (배포 후)

   승인된 리디렉션 URI:
   - https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```

5. **저장할 정보**
   ```
   ✅ Client ID: xxxxxxxxxx.apps.googleusercontent.com
   ✅ Client Secret: GOCSPX-xxxxxxxxxxxx
   ```

---

#### **Step 1-3: Kakao OAuth 설정**

1. **Kakao Developers 접속**
   ```
   URL: https://developers.kakao.com
   ```

2. **애플리케이션 추가**
   ```
   경로: 내 애플리케이션 > 애플리케이션 추가하기

   설정 내용:
   - 앱 이름: 일본워홀가계부
   - 사업자명: [개인 또는 사업자명]
   ```

3. **앱 키 확인**
   ```
   경로: 내 애플리케이션 > [생성한 앱] > 앱 키

   ✅ REST API 키: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ✅ JavaScript 키: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **플랫폼 설정**
   ```
   경로: 내 애플리케이션 > 플랫폼 > Web 플랫폼 등록

   사이트 도메인:
   - http://localhost:5173
   - https://[your-domain].com (배포 후)
   ```

5. **Redirect URI 등록**
   ```
   경로: 내 애플리케이션 > 제품 설정 > 카카오 로그인

   Redirect URI 등록:
   - https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback

   설정:
   ✅ 카카오 로그인 활성화: ON
   ✅ OpenID Connect 활성화: ON (권장)
   ```

6. **동의 항목 설정**
   ```
   경로: 내 애플리케이션 > 제품 설정 > 카카오 로그인 > 동의 항목

   필수 동의:
   - 닉네임 (필수)
   - 프로필 사진 (선택)
   - 카카오계정(이메일) (필수)
   ```

7. **Client Secret 설정 (보안 강화)**
   ```
   경로: 내 애플리케이션 > 제품 설정 > 카카오 로그인 > 보안

   ✅ Client Secret 코드 생성
   ✅ 상태: 사용함으로 변경
   ```

8. **저장할 정보**
   ```
   ✅ REST API Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ✅ Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

#### **Step 1-4: Supabase에 프로바이더 연결**

1. **Google 프로바이더 설정**
   ```
   경로: Supabase Dashboard > Authentication > Providers > Google

   설정:
   ✅ Enable Sign in with Google: ON
   ✅ Client ID: [Google에서 복사한 Client ID]
   ✅ Client Secret: [Google에서 복사한 Client Secret]
   ✅ Authorized Client IDs: (비워둠)
   ```

2. **Kakao 프로바이더 설정**
   ```
   경로: Supabase Dashboard > Authentication > Providers > Kakao

   설정:
   ✅ Enable Sign in with Kakao: ON
   ✅ Client ID (REST API Key): [Kakao REST API 키]
   ✅ Client Secret: [Kakao Client Secret]
   ```

3. **이메일 설정 (선택사항)**
   ```
   경로: Supabase Dashboard > Authentication > Providers > Email

   설정:
   ✅ Enable Email provider: ON
   ✅ Confirm email: OFF (개발 단계)
   ```

---

### **Phase 2: 데이터베이스 스키마 설계** ✅ SQL 스크립트 실행

#### **Step 2-1: Supabase 기본 인증 구조 이해**

Supabase는 다음 테이블을 **자동으로 생성**합니다 (직접 수정 불가):

```sql
-- auth.users 테이블 (Supabase 내장, 자동 관리)
-- 이 테이블은 직접 수정할 수 없으며, Supabase Auth API를 통해서만 관리됨
auth.users (
  id UUID PRIMARY KEY,                    -- 사용자 고유 ID
  email TEXT,                             -- 이메일 주소
  encrypted_password TEXT,                -- 암호화된 비밀번호
  email_confirmed_at TIMESTAMP,           -- 이메일 인증 시각
  created_at TIMESTAMP,                   -- 생성 시각
  updated_at TIMESTAMP,                   -- 수정 시각
  last_sign_in_at TIMESTAMP,              -- 마지막 로그인 시각

  -- 소셜 로그인 메타데이터
  raw_app_meta_data JSONB,                -- 제공자 정보 (provider: google/kakao)
  raw_user_meta_data JSONB                -- 프로필 데이터 (이름, 사진 등)
)
```

**raw_user_meta_data 예시 (Google 로그인):**
```json
{
  "iss": "https://accounts.google.com",
  "sub": "1234567890",
  "name": "홍길동",
  "email": "user@gmail.com",
  "picture": "https://lh3.googleusercontent.com/...",
  "email_verified": true
}
```

**raw_user_meta_data 예시 (Kakao 로그인):**
```json
{
  "provider_id": "1234567890",
  "nickname": "홍길동",
  "profile_image": "http://k.kakaocdn.net/...",
  "email": "user@kakao.com"
}
```

---

#### **Step 2-2: 사용자 프로필 테이블 생성 (public.profiles)**

**실행 위치:** Supabase Dashboard > SQL Editor > New Query

```sql
-- ============================================
-- 사용자 프로필 테이블 생성
-- ============================================
-- auth.users와 1:1 관계를 가지는 확장 프로필 테이블
-- 사용자의 앱 설정, 선호도, 추가 정보를 저장

CREATE TABLE public.profiles (
  -- auth.users.id와 1:1 관계 (외래키)
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 기본 정보
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,                     -- 앱에서 표시될 이름
  avatar_url TEXT,                       -- 프로필 사진 URL

  -- 소셜 로그인 제공자 정보
  provider TEXT CHECK (provider IN ('google', 'kakao', 'email')),
  provider_id TEXT,                      -- 제공자별 고유 ID (sub, provider_id 등)

  -- 앱 설정 (기존 CurrencyContext, AppModeContext 데이터 저장)
  settings JSONB DEFAULT '{
    "defaultCurrency": "KRW",
    "theme": "light",
    "language": "ko",
    "notifications": {
      "email": true,
      "push": false
    },
    "privacy": {
      "shareStatistics": false
    }
  }'::jsonb,

  -- 사용자 상태
  is_active BOOLEAN DEFAULT true,        -- 계정 활성화 상태
  last_sign_in_at TIMESTAMP WITH TIME ZONE,

  -- 메타데이터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 제약조건
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================
-- 인덱스 생성 (쿼리 성능 최적화)
-- ============================================
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_provider ON public.profiles(provider);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

-- ============================================
-- 코멘트 추가 (테이블 문서화)
-- ============================================
COMMENT ON TABLE public.profiles IS '사용자 프로필 및 앱 설정 정보';
COMMENT ON COLUMN public.profiles.id IS 'auth.users.id 외래키';
COMMENT ON COLUMN public.profiles.settings IS '사용자별 앱 설정 (통화, 테마, 언어 등)';
COMMENT ON COLUMN public.profiles.provider IS '로그인 제공자 (google, kakao, email)';
```

---

#### **Step 2-3: updated_at 자동 업데이트 트리거**

```sql
-- ============================================
-- updated_at 자동 갱신 함수
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- profiles 테이블에 트리거 적용
-- ============================================
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

---

#### **Step 2-4: 신규 사용자 자동 프로필 생성 트리거**

```sql
-- ============================================
-- 신규 사용자 프로필 자동 생성 함수
-- ============================================
-- auth.users에 새 레코드가 생성되면 자동으로 profiles 테이블에도 레코드 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_provider TEXT;
  user_name TEXT;
  user_avatar TEXT;
  user_provider_id TEXT;
BEGIN
  -- 제공자 정보 추출
  user_provider := COALESCE(
    NEW.raw_app_meta_data->>'provider',
    'email'
  );

  -- 사용자 이름 추출 (제공자별로 다른 필드 사용)
  CASE user_provider
    WHEN 'google' THEN
      user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        SPLIT_PART(NEW.email, '@', 1)
      );
      user_avatar := NEW.raw_user_meta_data->>'picture';
      user_provider_id := NEW.raw_user_meta_data->>'sub';

    WHEN 'kakao' THEN
      user_name := COALESCE(
        NEW.raw_user_meta_data->>'nickname',
        SPLIT_PART(NEW.email, '@', 1)
      );
      user_avatar := NEW.raw_user_meta_data->>'profile_image';
      user_provider_id := NEW.raw_user_meta_data->>'provider_id';

    ELSE
      user_name := SPLIT_PART(NEW.email, '@', 1);
      user_avatar := NULL;
      user_provider_id := NULL;
  END CASE;

  -- profiles 테이블에 레코드 삽입
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    provider,
    provider_id,
    last_sign_in_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_avatar,
    user_provider,
    user_provider_id,
    NEW.last_sign_in_at
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 오류 발생 시 로그 남기고 계속 진행 (사용자 생성 자체는 성공)
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- auth.users INSERT 트리거 설정
-- ============================================
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

---

#### **Step 2-5: 로그인 시 last_sign_in_at 업데이트 트리거**

```sql
-- ============================================
-- 로그인 시각 업데이트 함수
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER AS $$
BEGIN
  -- auth.users의 last_sign_in_at이 변경되면 profiles도 업데이트
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    UPDATE public.profiles
    SET last_sign_in_at = NEW.last_sign_in_at
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- auth.users UPDATE 트리거 설정
-- ============================================
CREATE TRIGGER on_auth_user_login
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_login();
```

---

### **Phase 3: Row Level Security (RLS) 보안 정책** ✅ SQL 스크립트 실행

#### **Step 3-1: RLS 활성화 및 기본 정책**

```sql
-- ============================================
-- Row Level Security (RLS) 활성화
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 정책 1: 사용자는 자신의 프로필만 조회 가능
-- ============================================
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- ============================================
-- 정책 2: 사용자는 자신의 프로필만 수정 가능
-- ============================================
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- 정책 3: 프로필 삽입은 트리거를 통해서만 가능
-- ============================================
-- 일반 사용자는 INSERT 불가, 서비스 역할(트리거)만 가능
CREATE POLICY "Enable insert for authenticated users during signup"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- 정책 4: 사용자는 자신의 프로필 삭제 가능 (계정 탈퇴)
-- ============================================
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);
```

---

#### **Step 3-2: 관리자용 정책 (선택사항)**

```sql
-- ============================================
-- 관리자 역할 확인 함수
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (raw_app_meta_data->>'role') = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 정책 5: 관리자는 모든 프로필 조회 가능
-- ============================================
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());
```

---

### **Phase 4: 프론트엔드 설정** ✅ 코드 작업

#### **Step 4-1: 패키지 설치**

```bash
# Supabase JavaScript 클라이언트 설치
npm install @supabase/supabase-js

# TypeScript 타입 (이미 설치되어 있음)
# npm install -D typescript
```

---

#### **Step 4-2: 환경변수 설정**

**파일 생성:** `D:\working\.env.local`

```env
# Supabase 설정
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 개발 환경 설정 (선택)
VITE_APP_ENV=development
```

**주의사항:**
- `.env.local` 파일은 `.gitignore`에 추가되어야 함
- Vite는 `VITE_` 접두사가 있는 환경변수만 클라이언트에 노출
- `service_role` 키는 절대 프론트엔드에 포함하지 말 것

**파일 확인:** `D:\working\.gitignore`에 다음 추가
```gitignore
# 환경변수
.env
.env.local
.env.production
```

---

#### **Step 4-3: Supabase 클라이언트 초기화**

**파일 생성:** `src/lib/supabase.ts`

```typescript
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
```

---

#### **Step 4-4: TypeScript 데이터베이스 타입 정의**

**파일 생성:** `src/types/database.ts`

```typescript
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
          display_name: string | null;
          avatar_url: string | null;
          provider: 'google' | 'kakao' | 'email' | null;
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
          display_name?: string | null;
          avatar_url?: string | null;
          provider?: 'google' | 'kakao' | 'email' | null;
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
          display_name?: string | null;
          avatar_url?: string | null;
          provider?: 'google' | 'kakao' | 'email' | null;
          provider_id?: string | null;
          settings?: Json;
          is_active?: boolean;
          last_sign_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // 나중에 추가될 테이블들
      transactions: {
        Row: Record<string, never>;
        Insert: Record<string, never>;
        Update: Record<string, never>;
      };
      japan_cost_items: {
        Row: Record<string, never>;
        Insert: Record<string, never>;
        Update: Record<string, never>;
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
```

---

#### **Step 4-5: 인증 Context 구현**

**파일 생성:** `src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';

interface AuthContextType {
  // 인증 상태
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;

  // 인증 메서드
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithKakao: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;

  // 프로필 메서드
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 프로필 데이터 가져오기
  const fetchProfile = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  // 초기 세션 확인
  useEffect(() => {
    // 현재 세션 가져오기
    const initializeAuth = async (): Promise<void> => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    void initializeAuth();

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // 클린업
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Google 로그인
  const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    return { error };
  };

  // Kakao 로그인
  const signInWithKakao = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  // 로그아웃
  const signOut = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
    return { error };
  };

  // 프로필 업데이트
  const updateProfile = async (
    updates: Partial<Profile>
  ): Promise<{ error: Error | null }> => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // 로컬 상태 업데이트
      await fetchProfile(user.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // 프로필 새로고침
  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signInWithGoogle,
    signInWithKakao,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

#### **Step 4-6: 로그인 페이지 컴포넌트**

**파일 생성:** `src/components/Auth/LoginPage.tsx`

```typescript
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithKakao } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async (): Promise<void> => {
    setLoading('google');
    setError(null);

    const { error: signInError } = await signInWithGoogle();

    if (signInError) {
      setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('Google login error:', signInError);
    }

    setLoading(null);
  };

  const handleKakaoLogin = async (): Promise<void> => {
    setLoading('kakao');
    setError(null);

    const { error: signInError } = await signInWithKakao();

    if (signInError) {
      setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('Kakao login error:', signInError);
    }

    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✈️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            일본 워킹홀리데이 가계부
          </h1>
          <p className="text-gray-600">
            소셜 계정으로 간편하게 시작하세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-4">
          {/* Google 로그인 */}
          <button
            onClick={() => void handleGoogleLogin()}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'google' ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>Google로 계속하기</span>
          </button>

          {/* Kakao 로그인 */}
          <button
            onClick={() => void handleKakaoLogin()}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#FEE500] rounded-lg font-medium text-[#000000] hover:bg-[#FDD835] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'kakao' ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.58 2 11c0 2.89 1.953 5.416 4.859 6.816-.206.748-.756 2.76-.868 3.197-.132.514.188.508.396.369.166-.111 2.63-1.745 3.045-2.029C10.23 19.783 11.1 20 12 20c5.523 0 10-3.58 10-8s-4.477-8-10-8z" />
              </svg>
            )}
            <span>카카오로 계속하기</span>
          </button>
        </div>

        {/* 약관 동의 */}
        <p className="mt-6 text-xs text-center text-gray-500">
          로그인하면{' '}
          <a href="#" className="text-indigo-600 hover:underline">
            서비스 약관
          </a>
          과{' '}
          <a href="#" className="text-indigo-600 hover:underline">
            개인정보 처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
```

---

#### **Step 4-7: 인증 콜백 페이지**

**파일 생성:** `src/components/Auth/AuthCallback.tsx`

```typescript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL 해시에서 액세스 토큰 확인
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
      // 인증 성공 - 메인 페이지로 리디렉션
      navigate('/', { replace: true });
    } else {
      // 인증 실패 - 로그인 페이지로 리디렉션
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
```

---

#### **Step 4-8: 보호된 라우트 컴포넌트**

**파일 생성:** `src/components/Auth/ProtectedRoute.tsx`

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않음 - 로그인 페이지로 리디렉션
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 인증됨 - 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
```

---

#### **Step 4-9: 배럴 익스포트**

**파일 생성:** `src/components/Auth/index.ts`

```typescript
export { default as LoginPage } from './LoginPage';
export { default as AuthCallback } from './AuthCallback';
export { default as ProtectedRoute } from './ProtectedRoute';
```

---

### **Phase 5: 라우팅 및 앱 통합** ✅ 코드 작업

#### **Step 5-1: React Router 설치**

```bash
npm install react-router-dom
npm install -D @types/react-router-dom
```

---

#### **Step 5-2: App.tsx 수정**

**파일 수정:** `src/App.tsx`

```typescript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AppModeProvider } from './contexts/AppModeContext';
import { LoginPage, AuthCallback, ProtectedRoute } from './components/Auth';

// 기존 메인 앱 컴포넌트를 별도로 분리
import MainApp from './MainApp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* 보호된 라우트 */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <CurrencyProvider>
                  <AppModeProvider>
                    <MainApp />
                  </AppModeProvider>
                </CurrencyProvider>
              </ProtectedRoute>
            }
          />

          {/* 기본 리디렉션 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
```

---

#### **Step 5-3: MainApp 컴포넌트 생성**

**파일 생성:** `src/MainApp.tsx`

기존 `App.tsx`의 ExpenseTracker와 AppContent 로직을 이곳으로 이동:

```typescript
// 기존 App.tsx의 내용 (ExpenseTracker, AppContent)을 여기로 복사
// import 문과 컴포넌트 정의는 동일하게 유지
// 단, 최상위 App 컴포넌트는 제거하고 AppContent만 export

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useAppMode } from './contexts/AppModeContext';
import type { Transaction, TransactionFormData } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { InitialCostCalculator } from './components/InitialCostCalculator';
import { ModeNavigation } from './components/Navigation';
import { formatInputDateToKorean, formatDateForInput } from './utils/dateUtils';

// ExpenseTracker 컴포넌트 (기존과 동일)
const ExpenseTracker: React.FC = () => {
  // ... 기존 코드 유지
};

// MainApp 컴포넌트 (기존 AppContent)
const MainApp: React.FC = () => {
  const { currentMode, isTransitioning } = useAppMode();
  const { profile, signOut } = useAuth();

  const getPageTitle = (): { title: string; subtitle: string } => {
    switch (currentMode) {
      case 'initial-cost-calculator':
        return {
          title: '워킹홀리데이 초기비용 계산기',
          subtitle: '출발 전 필요한 준비 비용을 계산해보세요'
        };
      default:
        return {
          title: '워킹홀리데이 가계부',
          subtitle: '해외 생활비를 스마트하게 관리해보세요'
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  const handleSignOut = async (): Promise<void> => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">
                  {currentMode === 'initial-cost-calculator' ? '✈️' : '💰'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 text-sm">{subtitle}</p>
              </div>
            </div>

            {/* 사용자 프로필 */}
            <div className="flex items-center gap-3">
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.display_name || profile?.email}
                </p>
                <button
                  onClick={() => void handleSignOut()}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Navigation */}
      <ModeNavigation />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          {currentMode === 'expense-tracker' && <ExpenseTracker />}
          {currentMode === 'initial-cost-calculator' && <InitialCostCalculator />}
        </div>
      </main>
    </div>
  );
};

export default MainApp;
```

---

### **Phase 6: 테스트 및 배포 준비** 🧪 개발자 작업

#### **Step 6-1: 로컬 테스트**

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
# 1. http://localhost:5173 접속
# 2. /login 페이지로 자동 리디렉션 확인
# 3. Google 로그인 버튼 클릭 → OAuth 플로우 테스트
# 4. Kakao 로그인 버튼 클릭 → OAuth 플로우 테스트
# 5. 로그인 후 대시보드 접근 확인
# 6. 로그아웃 → 다시 /login으로 리디렉션 확인
```

#### **Step 6-2: Supabase Dashboard에서 확인**

```
1. Authentication > Users 탭
   - 새로 가입한 사용자 확인
   - 프로바이더 정보 확인 (google/kakao)

2. Table Editor > profiles 테이블
   - 자동 생성된 프로필 확인
   - display_name, avatar_url 등 데이터 확인

3. Logs > Auth Logs
   - 로그인/로그아웃 이벤트 확인
   - 오류 로그 확인
```

---

## 📚 참고 자료

### **Supabase 공식 문서**
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [OAuth Providers](https://supabase.com/docs/guides/auth/social-login)

### **OAuth 설정 가이드**
- [Google OAuth 설정](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Kakao OAuth 설정](https://supabase.com/docs/guides/auth/social-login/auth-kakao)

### **TypeScript 타입 생성**
```bash
# Supabase CLI 설치
npm install -D supabase

# 타입 자동 생성
npx supabase gen types typescript --project-id [PROJECT_ID] --schema public > src/types/database.ts
```

---

## ✅ 완료 체크리스트

### **Phase 1: Supabase 설정**
- [ ] Supabase 프로젝트 생성
- [ ] Google OAuth 설정 완료
- [ ] Kakao OAuth 설정 완료
- [ ] Supabase에 프로바이더 연결
- [ ] 환경변수 파일 생성 (.env.local)

### **Phase 2: 데이터베이스**
- [ ] profiles 테이블 생성
- [ ] 인덱스 생성
- [ ] updated_at 트리거 생성
- [ ] handle_new_user 트리거 생성
- [ ] handle_user_login 트리거 생성

### **Phase 3: 보안**
- [ ] RLS 활성화
- [ ] SELECT 정책 생성
- [ ] UPDATE 정책 생성
- [ ] INSERT 정책 생성
- [ ] DELETE 정책 생성

### **Phase 4: 프론트엔드**
- [ ] @supabase/supabase-js 설치
- [ ] react-router-dom 설치
- [ ] Supabase 클라이언트 초기화
- [ ] Database 타입 정의
- [ ] AuthContext 구현
- [ ] LoginPage 컴포넌트
- [ ] AuthCallback 컴포넌트
- [ ] ProtectedRoute 컴포넌트
- [ ] App.tsx 라우팅 설정
- [ ] MainApp.tsx 분리

### **Phase 5: 테스트**
- [ ] 로컬 개발 서버 실행
- [ ] Google 로그인 테스트
- [ ] Kakao 로그인 테스트
- [ ] 프로필 자동 생성 확인
- [ ] 로그아웃 테스트
- [ ] RLS 정책 동작 확인

---

## 🚨 트러블슈팅

### **문제 1: Google 로그인 리디렉션 오류**
```
Error: redirect_uri_mismatch
```
**해결책:**
- Google Cloud Console > OAuth 클라이언트 ID > 승인된 리디렉션 URI 확인
- Supabase Project URL이 정확히 입력되었는지 확인
- 형식: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

### **문제 2: Kakao 로그인 실패**
```
Error: KOE006 (redirect_uri mismatch)
```
**해결책:**
- Kakao Developers > 제품 설정 > 카카오 로그인 > Redirect URI 확인
- Supabase Project URL과 일치하는지 확인

### **문제 3: 프로필 자동 생성 안됨**
```
profiles 테이블에 레코드가 생성되지 않음
```
**해결책:**
- Supabase Dashboard > Database > Triggers 확인
- `on_auth_user_created` 트리거 존재 여부 확인
- Logs 탭에서 오류 메시지 확인

### **문제 4: RLS 정책으로 인한 접근 거부**
```
Error: new row violates row-level security policy
```
**해결책:**
- RLS 정책이 올바르게 설정되었는지 확인
- `auth.uid()`가 제대로 동작하는지 확인
- 개발 단계에서는 일시적으로 RLS 비활성화 후 테스트

---

## 📝 다음 단계

이 문서의 모든 단계를 완료한 후:

1. **가계부 데이터 테이블 설계** (`transactions` 테이블)
2. **일본 초기비용 데이터 테이블 설계** (`japan_cost_items` 테이블)
3. **환율 캐싱 테이블 설계** (`exchange_rates` 테이블)
4. **데이터 CRUD 작업 구현**
5. **실시간 동기화 구현** (Supabase Realtime)

---

*이 문서는 Supabase 인증 시스템 구현을 위한 완전한 가이드입니다. 각 단계를 순서대로 진행하면 프로덕션 레벨의 인증 시스템을 구축할 수 있습니다.*
