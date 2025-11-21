# SSR/SSG 고려사항 - Next.js 마이그레이션 검토

## 📊 현재 상태 분석

### 현재 기술 스택
- **프레임워크**: React 19.1.1 (SPA)
- **빌드 도구**: Vite 7.1.7
- **렌더링 방식**: Client-Side Rendering (CSR)
- **배포 타입**: Static Site

### 현재 SEO 제한사항
1. **검색 엔진 크롤링**: JavaScript 실행 후에만 콘텐츠 인덱싱
2. **초기 로딩 속도**: 큰 번들 크기 시 First Contentful Paint 지연
3. **소셜 미리보기**: Open Graph 태그는 있지만, 동적 콘텐츠 미리보기 제한
4. **메타 태그 동적 변경**: 클라이언트에서만 가능

---

## 🔄 SSR/SSG 옵션 비교

### 1. CSR (현재 상태)
**장점**:
- 개발 속도 빠름
- 빌드 간단
- 인터랙션 풍부

**단점**:
- SEO 제한적
- 초기 로딩 느림
- 소셜 공유 미리보기 제한

### 2. SSR (Server-Side Rendering)
**장점**:
- 완벽한 SEO
- 빠른 First Contentful Paint
- 동적 메타 태그

**단점**:
- 서버 필요 (비용 증가)
- 복잡한 배포
- TTFB (Time To First Byte) 증가 가능

### 3. SSG (Static Site Generation)
**장점**:
- 완벽한 SEO
- 가장 빠른 로딩 속도
- CDN 배포 가능 (저렴)

**단점**:
- 빌드 시간 증가
- 동적 데이터 제한
- 재빌드 필요

### 4. ISR (Incremental Static Regeneration)
**장점**:
- SSG + 동적 업데이트
- SEO 최적화
- 빌드 시간 단축

**단점**:
- Next.js 전용
- 복잡한 설정

---

## 🚀 Next.js 마이그레이션 고려사항

### 왜 Next.js인가?
- **React 19 지원**: 최신 React 기능 사용 가능
- **하이브리드 렌더링**: SSR, SSG, ISR, CSR 혼합 사용
- **App Router**: 최신 라우팅 시스템 (React Server Components)
- **이미지 최적화**: next/image로 자동 최적화
- **API Routes**: 백엔드 API 구축 가능
- **Supabase 호환**: 완벽한 통합 지원

### 마이그레이션 시 고려사항

#### 1. 프로젝트 특성 분석
- **가계부 앱**: 개인 데이터 중심 (SEO 우선순위 낮음)
- **인증 필요**: 로그인 후 사용 (공개 페이지 적음)
- **실시간 업데이트**: Supabase Realtime 사용

**결론**: SSR 필요성 낮음, SSG도 제한적

#### 2. SEO 우선순위
- **랜딩 페이지**: SEO 중요 (SSG 적합)
- **로그인 페이지**: SEO 중요도 중간
- **대시보드/가계부**: SEO 불필요 (CSR 적합)
- **약관/개인정보**: SEO 중요도 중간 (SSG 적합)

**권장**: 하이브리드 렌더링 (공개 페이지만 SSG, 나머지 CSR)

#### 3. 개발 복잡도
- **현재 Vite**: 빠른 개발 서버, 간단한 설정
- **Next.js**: 더 많은 설정, 학습 곡선
- **코드 변경**: 라우팅, 데이터 페칭 방식 변경 필요

**예상 작업량**: 1-2주 (전체 마이그레이션 시)

#### 4. 배포 및 호스팅
- **현재 (Vite)**: Netlify, Vercel (무료), Render (무료)
- **Next.js**: Vercel (최적화), Netlify, Render (모두 지원)

**비용**: 거의 동일 (Vercel은 Next.js에 최적화)

---

## 🎯 권장 전략

### 옵션 A: 현재 상태 유지 + SEO 최적화 (권장)
**이유**:
- 가계부 앱은 로그인 후 사용 (SEO 우선순위 낮음)
- 메타 태그 최적화로 충분
- 빠른 개발 속도 유지

**추가 작업**:
1. ✅ **메타 태그 최적화** (완료)
2. ✅ **sitemap.xml** (완료)
3. ✅ **robots.txt** (완료)
4. **Prerendering 서비스** (선택사항):
   - Prerender.io
   - Rendertron
   - Netlify Prerendering (유료)

**비용**: $0 (무료)
**작업 시간**: 1일 (완료)

### 옵션 B: Next.js 부분 마이그레이션
**적용 페이지**:
- 랜딩 페이지 (SSG)
- 로그인 페이지 (SSG)
- 약관/개인정보 (SSG)

**유지 페이지** (CSR):
- 대시보드 (로그인 후)
- 가계부 관리
- 통계 분석

**비용**: $0 (Vercel 무료 플랜)
**작업 시간**: 1주

### 옵션 C: Next.js 완전 마이그레이션
**장점**:
- 완벽한 SEO
- 최신 React 기능 활용
- 향후 확장성

**단점**:
- 많은 개발 시간
- 복잡한 설정
- 현재 프로젝트에는 과도

**비용**: $0 (Vercel 무료 플랜)
**작업 시간**: 2주

---

## 📋 마이그레이션 체크리스트 (옵션 B/C 선택 시)

### 1단계: 프로젝트 설정
- [ ] Next.js 13+ 설치
- [ ] App Router 설정
- [ ] TypeScript 설정
- [ ] Tailwind CSS 설정

### 2단계: 라우팅 변환
- [ ] `src/App.tsx` → `app/layout.tsx`
- [ ] 페이지 컴포넌트를 `app/` 폴더로 이동
- [ ] React Router → Next.js Router 변환

### 3단계: 데이터 페칭
- [ ] Supabase 클라이언트 설정 (SSR 호환)
- [ ] Server Components vs Client Components 분리
- [ ] API Routes 생성 (필요 시)

### 4단계: 메타 태그
- [ ] Metadata API 사용
- [ ] 동적 메타 태그 생성

### 5단계: 최적화
- [ ] next/image로 이미지 최적화
- [ ] next/font로 폰트 최적화
- [ ] Code Splitting 확인

### 6단계: 배포
- [ ] Vercel 또는 Netlify 배포
- [ ] 환경 변수 설정
- [ ] 도메인 연결

---

## 🔧 Next.js 마이그레이션 예시

### 현재 (Vite + React Router)
```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Next.js (App Router)
```typescript
// app/layout.tsx
export const metadata = {
  title: '일본 워킹홀리데이 가계부',
  description: '...',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

// app/page.tsx (SSG)
export default function HomePage() {
  return <MainApp />;
}

// app/login/page.tsx (SSG)
export default function LoginPage() {
  return <LoginPageComponent />;
}

// app/dashboard/page.tsx (CSR)
'use client'; // Client Component
export default function DashboardPage() {
  return <Dashboard />;
}
```

---

## 💡 결론 및 권장사항

### 현재 프로젝트 상황
- **타입**: 개인용 가계부 앱 (로그인 필요)
- **SEO 중요도**: 낮음 (대부분 로그인 후 사용)
- **개발 속도**: 중요 (빠른 기능 추가 필요)

### 최종 권장사항: **옵션 A (현재 상태 유지)**

**이유**:
1. 가계부 앱은 로그인 후 사용 → SEO 불필요
2. 메타 태그 최적화로 충분
3. 빠른 개발 속도 유지
4. Vite의 빠른 HMR 유지

**추가 개선사항**:
- ✅ 메타 태그 최적화 완료
- ✅ sitemap.xml 완료
- ✅ robots.txt 완료
- [ ] 랜딩 페이지 별도 제작 (선택사항, 마케팅 필요 시)
- [ ] 프리렌더링 서비스 고려 (유료, 필요 시)

### 향후 Next.js 마이그레이션 시점
다음 경우에 고려:
1. **공개 콘텐츠 증가**: 블로그, 가이드 등 추가 시
2. **마케팅 필요**: 검색 유입 중요해질 때
3. **SSR 필요 기능**: 동적 소셜 미리보기 등
4. **팀 확장**: 더 많은 개발자 합류 시

---

## 📚 참고 자료

- Next.js 공식 문서: https://nextjs.org/docs
- React 19 + Next.js: https://nextjs.org/blog/react-19
- Supabase + Next.js: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Vite vs Next.js: https://vitejs.dev/guide/comparisons
- SEO Best Practices: https://developers.google.com/search/docs

---

**현재 권장**: 옵션 A (현재 상태 유지 + SEO 최적화)
**마이그레이션 필요 시**: 옵션 B (부분 마이그레이션) 고려
