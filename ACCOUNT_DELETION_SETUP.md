# 회원 탈퇴 시 Auth 사용자 자동 삭제 설정 가이드

## 문제 상황
현재 회원 탈퇴 시 `profiles` 테이블의 `is_active`가 `false`로 설정되지만, Supabase Auth의 사용자 정보는 삭제되지 않고 그대로 유지됩니다.

## 해결 방법
Database Trigger를 사용하여 프로필이 비활성화될 때 자동으로 Auth 사용자를 삭제합니다.

---

## 설정 단계

### 1. Supabase Dashboard 접속
1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 해당 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭

### 2. SQL 실행
1. **New Query** 버튼 클릭
2. `supabase-delete-user-trigger.sql` 파일의 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭 (또는 `Ctrl + Enter`)

### 3. 실행 결과 확인
성공적으로 실행되면 다음과 같은 메시지가 표시됩니다:
```
NOTICE: ✅ Trigger created successfully! Auth users will be automatically deleted when profiles are deactivated.
```

---

## 작동 방식

### Trigger 동작 흐름
```
사용자가 회원 탈퇴 버튼 클릭
    ↓
프론트엔드: deleteAccount() 호출
    ↓
1. transactions 테이블에서 거래 내역 삭제
    ↓
2. profiles 테이블에서 is_active = false 업데이트
    ↓
3. Database Trigger 자동 실행 🔥
    ↓
4. auth.users에서 사용자 삭제
    ↓
5. 자동 로그아웃
```

### SQL 함수 설명

**함수:** `delete_auth_user_on_deactivate()`
- `is_active`가 `true`에서 `false`로 변경될 때만 실행됩니다.
- `auth.users` 테이블에서 해당 사용자를 삭제합니다.
- `SECURITY DEFINER`로 설정되어 관리자 권한으로 실행됩니다.

**트리거:** `trigger_delete_auth_user_on_deactivate`
- `profiles` 테이블의 `UPDATE` 이벤트 발생 시 실행됩니다.
- `AFTER UPDATE`로 설정되어 프로필 업데이트가 완료된 후 실행됩니다.

---

## 보안 고려사항

### SECURITY DEFINER
- 이 함수는 `SECURITY DEFINER`로 설정되어 있어 함수를 생성한 사용자(보통 postgres)의 권한으로 실행됩니다.
- 이는 `auth.users` 테이블에 접근하기 위해 필요합니다.
- 일반 사용자는 `auth.users` 테이블을 직접 삭제할 수 없으므로 안전합니다.

### 권한 관리
```sql
GRANT EXECUTE ON FUNCTION public.delete_auth_user_on_deactivate() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_auth_user_on_deactivate() TO service_role;
```
- `authenticated`: 로그인한 사용자
- `service_role`: 서비스 역할 (백엔드 작업용)

---

## 테스트 방법

### 1. 테스트 계정 생성
1. 애플리케이션에서 Google 로그인으로 테스트 계정 생성
2. Supabase Dashboard → Authentication → Users에서 사용자 확인

### 2. 회원 탈퇴 실행
1. 애플리케이션에서 로그인
2. "계정 관리" → "회원 탈퇴" 탭
3. "회원탈퇴" 입력 후 탈퇴 진행

### 3. 결과 확인
1. Supabase Dashboard → Authentication → Users
2. 해당 사용자가 목록에서 완전히 삭제되었는지 확인
3. Database → profiles 테이블에서 `is_active = false` 확인

---

## 문제 해결

### Trigger가 실행되지 않는 경우

#### 1. 권한 확인
```sql
SELECT routine_name, grantee, privilege_type
FROM information_schema.routine_privileges
WHERE routine_name = 'delete_auth_user_on_deactivate';
```

#### 2. Trigger 존재 확인
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trigger_delete_auth_user_on_deactivate';
```

#### 3. 함수 재생성
Trigger를 삭제하고 다시 생성:
```sql
DROP TRIGGER IF EXISTS trigger_delete_auth_user_on_deactivate ON public.profiles;
DROP FUNCTION IF EXISTS public.delete_auth_user_on_deactivate();

-- 그 다음 supabase-delete-user-trigger.sql 다시 실행
```

### Auth 사용자는 삭제되었지만 Profile이 남아있는 경우
이는 정상입니다. `is_active = false`로 설정된 프로필은 비활성화된 상태로 유지됩니다.

만약 프로필도 완전히 삭제하고 싶다면:
```sql
-- 프로필도 삭제하는 버전 (선택사항)
CREATE OR REPLACE FUNCTION public.delete_auth_user_on_deactivate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = false AND OLD.is_active = true THEN
    -- auth.users에서 삭제
    DELETE FROM auth.users WHERE id = NEW.id;

    -- profiles에서도 삭제 (CASCADE로 인해 transactions도 자동 삭제됨)
    DELETE FROM public.profiles WHERE id = NEW.id;

    RAISE NOTICE 'User % completely deleted', NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 대안: Edge Function 사용

더 복잡한 로직이 필요한 경우 Supabase Edge Function을 사용할 수 있습니다:

```typescript
// supabase/functions/delete-user/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { userId } = await req.json()

  // 거래 내역 삭제
  await supabaseClient.from('transactions').delete().eq('user_id', userId)

  // 프로필 비활성화
  await supabaseClient.from('profiles').update({ is_active: false }).eq('id', userId)

  // Auth 사용자 삭제
  await supabaseClient.auth.admin.deleteUser(userId)

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

하지만 Database Trigger가 더 간단하고 자동화되어 있으므로 권장합니다.

---

## 참고 자료
- [Supabase Triggers 문서](https://supabase.com/docs/guides/database/postgres/triggers)
- [Supabase Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser)
- [PostgreSQL SECURITY DEFINER](https://www.postgresql.org/docs/current/sql-createfunction.html)
