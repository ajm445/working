-- 고정지출 테이블 생성 SQL
-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요.

-- 1. recurring_expenses 테이블 생성
CREATE TABLE IF NOT EXISTS public.recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'KRW' CHECK (currency IN ('KRW', 'USD', 'JPY')),
  amount_in_krw NUMERIC(15, 2) NOT NULL CHECK (amount_in_krw >= 0),
  category TEXT NOT NULL DEFAULT '기타',
  is_active BOOLEAN NOT NULL DEFAULT true,
  day_of_month INTEGER NOT NULL DEFAULT 1 CHECK (day_of_month >= 1 AND day_of_month <= 31),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_user_id
  ON public.recurring_expenses(user_id);

CREATE INDEX IF NOT EXISTS idx_recurring_expenses_is_active
  ON public.recurring_expenses(is_active);

CREATE INDEX IF NOT EXISTS idx_recurring_expenses_user_active
  ON public.recurring_expenses(user_id, is_active);

-- 3. Row Level Security (RLS) 활성화
ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 생성
-- 사용자는 자신의 고정지출만 조회 가능
CREATE POLICY "Users can view their own recurring expenses"
  ON public.recurring_expenses
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 고정지출만 추가 가능
CREATE POLICY "Users can insert their own recurring expenses"
  ON public.recurring_expenses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 고정지출만 수정 가능
CREATE POLICY "Users can update their own recurring expenses"
  ON public.recurring_expenses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 고정지출만 삭제 가능
CREATE POLICY "Users can delete their own recurring expenses"
  ON public.recurring_expenses
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION public.update_recurring_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. updated_at 트리거 생성
DROP TRIGGER IF EXISTS trigger_recurring_expenses_updated_at ON public.recurring_expenses;

CREATE TRIGGER trigger_recurring_expenses_updated_at
  BEFORE UPDATE ON public.recurring_expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_recurring_expenses_updated_at();

-- 7. 기본 고정지출 카테고리 데이터 (선택사항)
-- 사용자가 회원가입할 때 기본 고정지출 템플릿을 제공하려면 아래 함수 사용

CREATE OR REPLACE FUNCTION public.create_default_recurring_expenses(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- 월세 기본 템플릿 (비활성 상태로 생성)
  INSERT INTO public.recurring_expenses (user_id, name, amount, currency, amount_in_krw, category, is_active, day_of_month, description)
  VALUES (
    p_user_id,
    '월세',
    0,
    'KRW',
    0,
    '주거',
    false,
    1,
    '매월 월세 지출'
  );

  -- 공과금 기본 템플릿 (비활성 상태로 생성)
  INSERT INTO public.recurring_expenses (user_id, name, amount, currency, amount_in_krw, category, is_active, day_of_month, description)
  VALUES (
    p_user_id,
    '공과금',
    0,
    'KRW',
    0,
    '공과금',
    false,
    5,
    '전기, 가스, 수도 등 공과금'
  );

  RAISE NOTICE 'Default recurring expenses created for user %', p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 신규 사용자에게 자동으로 기본 고정지출 생성하는 트리거 (선택사항)
-- profiles 테이블에 사용자가 추가될 때 자동으로 기본 고정지출 생성

CREATE OR REPLACE FUNCTION public.handle_new_user_recurring_expenses()
RETURNS TRIGGER AS $$
BEGIN
  -- 기본 고정지출 템플릿 생성
  PERFORM public.create_default_recurring_expenses(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_new_user_recurring_expenses ON public.profiles;

CREATE TRIGGER trigger_new_user_recurring_expenses
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_recurring_expenses();

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ recurring_expenses table created successfully!';
  RAISE NOTICE '✅ RLS policies configured!';
  RAISE NOTICE '✅ Automatic triggers set up!';
  RAISE NOTICE 'ℹ️  New users will automatically get default recurring expense templates (월세, 공과금)';
END $$;
