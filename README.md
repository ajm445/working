# React Webapp - 개인 재무 관리 애플리케이션

> React + TypeScript + Supabase 기반의 개인 재무 관리 웹 애플리케이션

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.75.1-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [환경 변수 설정](#환경-변수-설정)
- [개발](#개발)
- [빌드 및 배포](#빌드-및-배포)
- [프로젝트 구조](#프로젝트-구조)
- [라이선스](#라이선스)

## ✨ 주요 기능

### 인증 시스템
- **이메일/비밀번호 로그인** - Supabase Auth 기반 안전한 인증
- **Google OAuth 로그인** - 간편한 소셜 로그인
- **선택적 로그인** - 비로그인 사용자를 위한 임시 데이터 저장 (LocalStorage)
- **프로필 관리** - 사용자 정보 및 설정 관리

### 거래 내역 관리
- **거래 추가/수정/삭제** - 수입/지출 관리
- **다중 통화 지원** - KRW, USD, JPY 지원
- **실시간 환율 변환** - exchangerate-api.com 기반 자동 환율 적용
- **카테고리 관리** - 거래 유형별 분류
- **실시간 동기화** - Supabase Realtime으로 즉시 반영

### 대시보드 및 통계
- **월별 요약** - 수입/지출/순자산 한눈에 보기
- **통화별 통계** - 각 통화별 금액 및 원화 환산 금액
- **차트 시각화** - Recharts 기반 인터랙티브 차트
- **캘린더 뷰** - 거래 내역 일별 확인

### 사용자 경험
- **반응형 디자인** - 모바일/태블릿/데스크톱 최적화
- **다크 모드 지원** (향후 추가 예정)
- **빠른 로딩** - Vite 기반 최적화된 번들링
- **접근성** - ARIA 라벨 및 키보드 네비게이션

## 🛠 기술 스택

### Frontend
- **React 19.1.1** - UI 라이브러리
- **TypeScript 5.8.3** - 타입 안전성
- **Vite 7.1.7** - 빌드 도구
- **React Router 7.9.4** - 라우팅
- **Tailwind CSS 3.3.0** - 스타일링
- **Recharts 3.2.1** - 차트

### Backend & Database
- **Supabase** - 인증, 데이터베이스, 실시간 기능
- **PostgreSQL** - 데이터베이스 (Supabase 제공)
- **Row Level Security (RLS)** - 데이터 보안

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **TypeScript ESLint** - TypeScript 린팅

### 분석 및 모니터링
- **Google Analytics 4** - 사용자 행동 분석 및 성능 메트릭

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18.0.0 이상
- **npm** 9.0.0 이상
- **Supabase 계정** (무료 계정 가능)

### 설치

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd working
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env
   ```
   `.env` 파일을 열고 실제 값으로 변경:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_APP_ENV=development
   ```

   > **Google Analytics 설정 방법**은 [docs/google-analytics-setup.md](docs/google-analytics-setup.md)를 참고하세요.

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:5173` 접속

## 🔐 환경 변수 설정

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | `https://abcdefg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anon/Public Key | `eyJhbGc...` |
| `VITE_APP_ENV` | 앱 환경 | `development` / `production` |

### Supabase 설정 방법

1. [Supabase](https://supabase.com/) 로그인
2. 새 프로젝트 생성
3. **Settings** > **API**에서 다음 정보 복사:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 데이터베이스 스키마 설정

Supabase SQL Editor에서 다음 테이블 생성:

```sql
-- profiles 테이블 (사용자 프로필)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  provider_id TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- transactions 테이블 (거래 내역)
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('KRW', 'USD', 'JPY')),
  amount_in_krw NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 정책 설정
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);
```

## 💻 개발

### 사용 가능한 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린팅 (코드 검사)
npm run lint

# 린팅 및 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format

# 코드 포맷 검사
npm run format:check

# 타입 검사
npm run type-check

# 캐시 정리
npm run clean
```

### 개발 워크플로우

1. **새 기능 개발**
   ```bash
   git checkout -b feature/new-feature
   npm run dev
   ```

2. **코드 품질 확인**
   ```bash
   npm run lint
   npm run type-check
   npm run format:check
   ```

3. **빌드 테스트**
   ```bash
   npm run build
   npm run preview
   ```

## 📦 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과는 `dist/` 디렉토리에 생성됩니다.

### 배포

#### Vercel 배포

```bash
npm install -g vercel
vercel
```

#### Netlify 배포

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Render 배포

1. Render 대시보드에서 **New Static Site** 선택
2. GitHub 저장소 연결
3. 빌드 설정:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. 환경 변수 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_ENV=production`

### 환경별 환경 변수

- **개발**: `.env` (Git 무시됨)
- **프로덕션**: 배포 플랫폼의 환경 변수 설정 사용

## 📁 프로젝트 구조

```
working/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── Auth/           # 인증 관련 컴포넌트
│   │   ├── Dashboard/      # 대시보드
│   │   ├── Legal/          # 약관 및 정책
│   │   ├── TransactionForm/# 거래 입력 폼
│   │   └── ...
│   ├── contexts/           # React Context (상태 관리)
│   │   ├── AuthContext.tsx # 인증 상태
│   │   └── CurrencyContext.tsx # 환율 관리
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # 외부 라이브러리 설정
│   │   └── supabase.ts     # Supabase 클라이언트
│   ├── services/           # API 서비스
│   │   └── transactionService.ts
│   ├── types/              # TypeScript 타입 정의
│   │   └── database.ts     # Supabase DB 타입
│   ├── utils/              # 유틸리티 함수
│   │   ├── currency.ts     # 환율 변환
│   │   ├── calculations.ts # 계산 로직
│   │   └── dateUtils.ts    # 날짜 처리
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── MainApp.tsx         # 로그인 후 메인 화면
│   └── main.tsx            # 앱 진입점
├── docs/                   # 프로젝트 문서
│   ├── plan-list.md        # 개발 계획
│   ├── terms-of-service.md # 서비스 약관
│   └── privacy-policy.md   # 개인정보 처리방침
├── public/                 # 정적 파일
├── .env.example            # 환경 변수 템플릿
├── package.json            # 프로젝트 메타데이터
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 설정
└── tailwind.config.js      # Tailwind CSS 설정
```

## 🔧 주요 기능 설명

### 인증 시스템

- **Supabase Auth** 사용
- 이메일/비밀번호, Google OAuth 지원
- JWT 토큰 기반 세션 관리
- LocalStorage에 세션 저장
- 페이지 종료 시 자동 로그아웃 (보안)

### 거래 내역 관리

- CRUD 작업 (생성, 읽기, 수정, 삭제)
- 실시간 동기화 (Supabase Realtime)
- 다중 통화 지원 및 자동 환율 변환
- 날짜/카테고리별 필터링

### 환율 API

- [ExchangeRate-API](https://www.exchangerate-api.com/) 사용
- 1시간마다 자동 갱신
- API 실패 시 기본 환율 사용
- 환율 캐싱 (향후 LocalStorage 추가 예정)

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🤝 기여

이슈 제보 및 Pull Request를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ using React + Supabase**
