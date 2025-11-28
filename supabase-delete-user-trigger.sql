-- Supabase Database Trigger for Auto-Deleting Auth Users on Account Deactivation
-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요.

-- 1. 사용자 삭제를 위한 함수 생성
CREATE OR REPLACE FUNCTION public.delete_auth_user_on_deactivate()
RETURNS TRIGGER AS $$
BEGIN
  -- 프로필이 비활성화되면 (is_active = false)
  IF NEW.is_active = false AND OLD.is_active = true THEN
    -- auth.users에서 해당 사용자 삭제
    DELETE FROM auth.users WHERE id = NEW.id;

    -- 로그 기록 (선택사항)
    RAISE NOTICE 'User % has been deleted from auth.users', NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 트리거 생성
DROP TRIGGER IF EXISTS trigger_delete_auth_user_on_deactivate ON public.profiles;

CREATE TRIGGER trigger_delete_auth_user_on_deactivate
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_auth_user_on_deactivate();

-- 3. 함수에 필요한 권한 부여
GRANT EXECUTE ON FUNCTION public.delete_auth_user_on_deactivate() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_auth_user_on_deactivate() TO service_role;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger created successfully! Auth users will be automatically deleted when profiles are deactivated.';
END $$;
