import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithLine } = useAuth();

  // 이미 로그인된 사용자는 메인 페이지로 리디렉션
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading('email');
    setError(null);

    try {
      const { error: signInError } = await signInWithEmail(email, password);

      if (signInError) {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        console.error('Email login error:', signInError);
        setLoading(null);
      }
      // 로그인 성공 시 AuthContext의 onAuthStateChange가 자동으로 리디렉션 처리
      // setLoading(null)을 호출하지 않음 - 리디렉션될 때까지 스피너 유지
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('예상치 못한 오류가 발생했습니다.');
      setLoading(null);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading('email');
    setError(null);

    if (!username.trim()) {
      setError('아이디를 입력해주세요.');
      setLoading(null);
      return;
    }

    const { error: signUpError } = await signUpWithEmail(email, password, username);

    if (signUpError) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error('Email signup error:', signUpError);
    } else {
      setError(null);
      // 회원가입 성공 메시지
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      setMode('signin');
    }

    setLoading(null);
  };

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

  const handleLineLogin = async (): Promise<void> => {
    setLoading('line');
    setError(null);

    const { error: signInError } = await signInWithLine();

    if (signInError) {
      setError('LINE 로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('LINE login error:', signInError);
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

        {/* 탭 전환 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              mode === 'signin'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* 이메일/비밀번호 로그인 폼 */}
        <form onSubmit={mode === 'signin' ? handleEmailLogin : handleEmailSignup} className="space-y-4 mb-6">
          {mode === 'signup' && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                아이디
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="사용할 아이디를 입력하세요"
                required={mode === 'signup'}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading === 'email'}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'email' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              mode === 'signin' ? '로그인' : '회원가입'
            )}
          </button>
        </form>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3">
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

          {/* LINE 로그인 */}
          <button
            onClick={() => void handleLineLogin()}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#06C755] rounded-lg font-medium text-white hover:bg-[#05B04A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'line' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
            )}
            <span>LINEで続ける</span>
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
