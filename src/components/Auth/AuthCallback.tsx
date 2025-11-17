import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // 중복 실행 방지
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleOAuthCallback = async (): Promise<void> => {
      try {
        // URL에서 OAuth 관련 파라미터 확인
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);

        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        console.log('AuthCallback - URL contains:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasCode: !!code,
          hasError: !!errorParam,
        });

        // OAuth 관련 파라미터가 하나도 없으면 이미 로그인된 상태로 간주
        if (!accessToken && !refreshToken && !code && !errorParam) {
          console.log('No OAuth params found, checking existing session...');
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            console.log('Existing session found, redirecting to home');
            navigate('/', { replace: true });
          } else {
            console.log('No session found, redirecting to login');
            navigate('/login', { replace: true });
          }
          return;
        }

        // 에러 파라미터 확인
        if (errorParam) {
          const errorDescription = searchParams.get('error_description');
          console.error('OAuth error:', errorParam, errorDescription);
          setError(errorDescription || '로그인 중 오류가 발생했습니다.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        // Supabase가 세션을 설정할 때까지 잠시 대기
        console.log('Waiting for Supabase to process OAuth callback...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // 세션 확인 (Supabase가 자동으로 설정)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('세션을 가져오는 중 오류가 발생했습니다.');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        if (session) {
          // 세션이 있으면 메인 페이지로 이동
          console.log('OAuth login successful, user:', session.user.email);
          navigate('/', { replace: true });
        } else {
          // 세션이 없으면 로그인 페이지로
          console.warn('No session found after OAuth callback');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 1000);
        }
      } catch (err) {
        console.error('Unexpected error in OAuth callback:', err);
        setError('예상치 못한 오류가 발생했습니다.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    void handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">
          {error || '로그인 처리 중...'}
        </p>
        {error && (
          <p className="text-sm text-red-600 mt-2">
            잠시 후 로그인 페이지로 이동합니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
