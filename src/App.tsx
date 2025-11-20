import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AppModeProvider } from './contexts/AppModeContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { LoginPage, AuthCallback } from './components/Auth';
import { TermsOfService, PrivacyPolicy } from './components/Legal';

// 기존 메인 앱 컴포넌트를 별도로 분리
import MainApp from './MainApp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AnalyticsProvider>
        <AuthProvider>
          {/* Toast 알림 컴포넌트 */}
          <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            // 기본 옵션
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
            },
            // 성공 메시지
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            // 에러 메시지
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
            // 경고 메시지
            loading: {
              duration: Infinity,
            },
          }}
        />

        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* 약관 페이지 */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* 메인 앱 - 로그인 없이도 접근 가능 */}
          <Route
            path="/*"
            element={
              <CurrencyProvider>
                <AppModeProvider>
                  <MainApp />
                </AppModeProvider>
              </CurrencyProvider>
            }
          />

          {/* 기본 리디렉션 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AuthProvider>
      </AnalyticsProvider>
    </BrowserRouter>
  );
};

export default App;
