import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AppModeProvider } from './contexts/AppModeContext';
import { LoginPage, AuthCallback } from './components/Auth';
import { TermsOfService, PrivacyPolicy } from './components/Legal';

// 기존 메인 앱 컴포넌트를 별도로 분리
import MainApp from './MainApp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
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
    </BrowserRouter>
  );
};

export default App;
