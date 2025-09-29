# 일본 워킹홀리데이 앱 - React 웹앱

## 📱 프로젝트 소개

일본 워킹홀리데이를 하는 사람들을 위한 전용 관리 웹앱입니다. 일본 현지 생활비 관리와 도쿄/오사카 지역별 초기비용 계산을 하나의 앱에서 제공합니다.

### 주요 기능
- ✅ **이중 모드 시스템**: 가계부와 일본 특화 초기비용 계산기 전환
- ✅ 수입/지출 내역 관리
- ✅ 카테고리별 분류 (식비, 숙박, 교통, 쇼핑 등)
- ✅ **🇯🇵 일본 워킹홀리데이 초기비용 계산기 (일본 특화 완료!)**
  - ✅ 도쿄/오사카 지역별 비용 차등 시스템
  - ✅ 16개 일본 특화 카테고리 (필수 8개 + 선택 8개)
  - ✅ 한국어-일본어 병기 표시
  - ✅ 7개 카테고리 그룹별 체계적 분류
  - ✅ JPY 기준 실시간 환율 연동
- ✅ 실시간 잔액 계산
- ✅ 반응형 디자인 (데스크톱/모바일 최적화)
- ✅ 직관적인 사용자 인터페이스
- ✅ 다중 통화 지원 (KRW, USD, JPY)
- ✅ 실시간 환율 정보 (1시간마다 자동 갱신)
- ✅ 통화별 금액 입력 및 원화 환산

## 🚀 현재 기술 스택과 버전

### 핵심 기술 스택
```json
{
  "react": "19.1.1",
  "typescript": "5.8.3",
  "tailwindcss": "3.4.17",
  "vite": "7.1.7",
  "node": ">=18.0.0"
}
```

### 현재 설치된 의존성
```bash
# 핵심 프레임워크
npm install react@19.1.1 react-dom@19.1.1

# TypeScript 설정
npm install -D typescript@5.8.3
npm install -D @types/react@19.1.13 @types/react-dom@19.1.9

# Tailwind CSS (최신 버전)
npm install -D tailwindcss@3.4.17 postcss@8.5.6 autoprefixer@10.4.21

# 빌드 도구
npm install -D vite@7.1.7 @vitejs/plugin-react@5.0.3
```

### 현재 사용 중인 유틸리티
```bash
# 유틸리티 (설치됨)
npm install clsx@2.0.0  # 조건부 CSS 클래스 관리
npm install axios@1.12.2  # HTTP 클라이언트 (환율 API 호출용)

# 앞으로 추가 고려 가능한 라이브러리
# 라우팅
npm install react-router-dom@latest

# 상태 관리
npm install @reduxjs/toolkit@latest react-redux@latest

# 폼 관리
npm install react-hook-form@latest

# UI 컴포넌트
npm install @headlessui/react@latest @heroicons/react@latest
```

### 개발 도구 (현재 설정됨)
```bash
# 코드 품질
npm install -D eslint@9.36.0 prettier@3.0.0
npm install -D typescript-eslint@8.44.1
npm install -D eslint-plugin-react-hooks@5.2.0
npm install -D eslint-plugin-react-refresh@0.4.21

# 향후 Git hooks 설정 고려
npm install -D husky@latest lint-staged@latest
```

## 📋 개발 규칙

### 1. TypeScript 규칙

#### 엄격한 타입 설정 (tsconfig.json)
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

#### 컴포넌트 타입 정의 규칙
```typescript
// ✅ 올바른 방식 - Props 인터페이스 정의
interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// ✅ React.FC 사용하여 컴포넌트 정의
export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size = 'md',
  disabled = false,
  onClick
}) => {
  return (
    <button
      className={getButtonClasses(variant, size)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ 금지사항
const BadButton = (props: any) => { }; // any 타입 금지
const BadButton2 = ({ ...props }) => { }; // 타입 없는 spread 금지
```

#### 커스텀 훅 타입 정의
```typescript
// ✅ 제네릭을 활용한 타입 안전한 훅
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url: string): UseApiState<T> & {
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  // 훅 로직 구현...

  return {
    ...state,
    refetch: () => fetchData()
  };
}
```

### 2. Tailwind CSS 규칙

#### 클래스 작성 순서
```typescript
// ✅ 권장 순서: Position → Layout → Box Model → Typography → Visual → Misc
const Card: React.FC = () => (
  <div className="
    relative          // Position
    flex flex-col      // Layout
    p-6 m-4           // Box Model
    w-full max-w-sm   // Sizing  
    text-base font-semibold  // Typography
    bg-white text-gray-900   // Colors
    border border-gray-200   // Borders
    shadow-lg rounded-lg     // Effects
    hover:shadow-xl transition-all duration-200  // Interactive
  ">
    카드 내용
  </div>
);
```

#### 반응형 디자인 원칙
```typescript
// ✅ 모바일 우선 접근법
const ResponsiveGrid: React.FC = () => (
  <div className="
    grid grid-cols-1
    sm:grid-cols-2 
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-6
    gap-4 p-4
  ">
    {/* 콘텐츠 */}
  </div>
);

// ✅ 조건부 스타일링 with clsx
import clsx from 'clsx';

interface AlertProps {
  type: 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ type, children }) => (
  <div className={clsx(
    'p-4 rounded-lg font-medium',
    {
      'bg-green-100 text-green-800 border border-green-300': type === 'success',
      'bg-yellow-100 text-yellow-800 border border-yellow-300': type === 'warning',
      'bg-red-100 text-red-800 border border-red-300': type === 'error'
    }
  )}>
    {children}
  </div>
);
```

### 3. 파일 및 폴더 구조 규칙

#### 디렉토리 구조
```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── ui/              # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── index.ts     # 배럴 익스포트
│   ├── forms/           # 폼 관련 컴포넌트
│   └── layout/          # 레이아웃 컴포넌트
├── pages/               # 페이지 컴포넌트
│   ├── HomePage.tsx
│   └── AboutPage.tsx
├── hooks/               # 커스텀 훅
│   ├── useAuth.ts
│   └── useLocalStorage.ts
├── utils/               # 순수 함수 유틸리티
│   ├── formatters.ts
│   └── validators.ts
├── types/               # 타입 정의
│   ├── api.ts
│   └── common.ts
├── constants/           # 상수
│   ├── routes.ts
│   └── apiEndpoints.ts
├── store/               # 상태 관리
│   ├── slices/
│   └── index.ts
└── api/                 # API 관련
    ├── client.ts
    └── endpoints/
```

#### 파일 명명 규칙
```typescript
// 컴포넌트: PascalCase
Button.tsx
UserProfileCard.tsx

// 훅: camelCase with 'use' prefix
useAuth.ts
useLocalStorage.ts

// 유틸리티: camelCase
formatDate.ts
validateEmail.ts

// 타입: camelCase with 'Types' suffix
userTypes.ts
apiTypes.ts

// 상수: camelCase or UPPER_SNAKE_CASE
apiEndpoints.ts
APP_CONFIG.ts
```

### 4. 코드 스타일 규칙

#### ESLint 설정 (.eslintrc.json)
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": ["./tsconfig.json"]
  },
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### Prettier 설정 (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
```

## 🇯🇵 일본 워킹홀리데이 가계부 프로젝트 특징

### 현재 구현된 기능

#### 1. 수입/지출 관리 시스템 (업데이트됨)
```typescript
// src/types/transaction.ts
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: CurrencyCode;  // 추가: 다중 통화 지원
  amountInKRW: number;     // 추가: 원화 기준 금액
}

export interface TransactionFormData {
  amount: string;
  category: string;
  description: string;
  type: TransactionType;
  currency: CurrencyCode;
}
```

#### 2. 지출 카테고리 (워킹홀리데이 특화)
- 🍽️ **식비**: 현지 음식 및 식료품
- 🏠 **숙박**: 호텔, 게스트하우스, 에어비앤비
- 🚌 **교통**: 대중교통, 항공료, 렌터카
- 🛍️ **쇼핑**: 생필품, 기념품, 의류
- 🏥 **의료**: 병원비, 약값, 여행자보험
- 📱 **통신**: 로밍, 현지 SIM, 와이파이
- 🎯 **기타**: 관광, 액티비티, 기타 비용

#### 3. 수입 카테고리
- 💼 **급여**: 현지 아르바이트 수입
- 💸 **용돈**: 본국에서 송금받은 돈
- 💰 **기타수입**: 부가 수입원

### UI/UX 특징
- **반응형 디자인**: 모바일 우선으로 설계
- **직관적인 인터페이스**: 아이콘과 색상으로 구분
- **실시간 계산**: 수입, 지출, 잔액 즉시 업데이트
- **한국어 지원**: 일본 워킹홀리데이 참가자를 위한 한국어 UI
- **🇯🇵 일본어 병기**: 모든 일본 관련 내용에 일본어 병기 표시
- **지역 특화**: 도쿄와 오사카의 지역별 비용 차이 반영

## ⚡ 개발 워크플로우

### 1. 프로젝트 설정 (현재 상태)

#### 현재 프로젝트 구조 (일본 특화 업데이트)
```bash
src/
├── App.tsx                   # 메인 애플리케이션 컴포넌트 (이중 모드 지원)
├── main.tsx                 # React 앱 진입점
├── index.css                # Tailwind CSS 및 글로벌 스타일
├── components/              # 재사용 가능한 컴포넌트
│   ├── ui/                  # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   └── index.ts
│   ├── Dashboard/           # 대시보드 컴포넌트 (가계부 모드)
│   │   ├── Dashboard.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── CurrencySelector.tsx
│   │   └── index.ts
│   ├── TransactionForm/     # 거래 추가 폼
│   │   ├── TransactionForm.tsx
│   │   └── index.ts
│   ├── TransactionList/     # 거래 목록
│   │   ├── TransactionList.tsx
│   │   ├── TransactionItem.tsx
│   │   └── index.ts
│   ├── InitialCostCalculator/ # 일본 특화 초기비용 계산기
│   │   ├── InitialCostCalculator.tsx      # 메인 계산기 (일본 특화)
│   │   ├── JapanRegionSelector.tsx        # 도쿄/오사카 지역 선택
│   │   ├── JapanCostCategoryCard.tsx      # 일본 특화 카테고리 카드
│   │   ├── JapanCostSummary.tsx           # 일본 특화 요약 정보
│   │   ├── CostCategoryCard.tsx           # 기존 범용 카드 (미사용)
│   │   ├── CostSummary.tsx                # 기존 범용 요약 (미사용)
│   │   ├── CountrySelector.tsx            # 기존 국가 선택 (미사용)
│   │   └── index.ts
│   └── Navigation/          # 네비게이션 컴포넌트
│       ├── ModeNavigation.tsx
│       └── index.ts
├── contexts/                # React Context
│   ├── CurrencyContext.tsx  # 통화 상태 관리
│   └── AppModeContext.tsx   # 앱 모드 상태 관리
├── hooks/                   # 커스텀 훅
│   ├── useCurrency.ts
│   └── useCurrencyConversion.ts  # 환율 변환 훅
├── utils/                   # 유틸리티 함수
│   ├── calculations.ts      # 계산 관련 함수
│   └── currency.ts          # 환율 API 호출
├── types/                   # TypeScript 타입 정의
│   ├── index.ts            # 타입 배럴 익스포트
│   ├── common.ts           # 공통 타입
│   ├── currency.ts         # 통화 관련 타입
│   ├── transaction.ts      # 거래 관련 타입
│   ├── initialCost.ts      # 기존 범용 초기비용 타입
│   └── japanCost.ts        # 🇯🇵 일본 특화 초기비용 타입
├── data/                   # 정적 데이터
│   ├── initialCostCategories.ts  # 기존 범용 카테고리 (미사용)
│   └── japanCostCategories.ts    # 🇯🇵 일본 특화 카테고리 데이터
└── constants/              # 상수
    └── routes.ts           # 라우트 상수
```

#### 현재 설정된 파일들
```bash
# 설정 파일
├── tailwind.config.js   # Tailwind CSS 설정 (3.4.17)
├── postcss.config.js    # PostCSS 설정
├── vite.config.ts       # Vite 번들러 설정
├── tsconfig.json        # TypeScript 설정
├── eslint.config.js     # ESLint 설정
└── .prettierrc          # Prettier 설정
```

### 2. 일일 개발 워크플로우

#### 개발 시작 전 체크리스트
```bash
# 1. 최신 코드 동기화 (Git 설정 후)
git pull origin main

# 2. 의존성 업데이트 확인
npm outdated

# 3. 개발 서버 실행
npm run dev  # http://localhost:3000에서 실행

# 4. 타입 검사 실행 (별도 터미널)
npm run type-check

# 5. 린트 검사
npm run lint

# 6. 코드 포맷팅 확인
npm run format:check
```

### 2. 일본 워킹홀리데이 가계부 향후 개발 계획

#### Phase 1: 기본 기능 강화 (완료)
- ✅ 수입/지출 추가 및 관리
- ✅ 카테고리별 분류
- ✅ 실시간 잔액 계산
- ✅ 반응형 UI 디자인
- ✅ 다중 통화 지원 (KRW, USD, JPY)
- ✅ 실시간 환율 정보 및 자동 갱신
- ✅ 컴포넌트 분리 및 모듈화
- ✅ TypeScript 타입 정의 체계화
- ✅ **이중 모드 시스템**: 가계부와 초기비용 계산기
- ✅ **워킹홀리데이 초기비용 계산기**
  - ✅ 국가별 초기비용 카테고리 (호주, 캐나다, 뉴질랜드, 영국, 일본)
  - ✅ 필수/선택적 비용 분류 시스템
  - ✅ 실시간 통화 변환 및 계산
  - ✅ 카테고리별 예상 범위 표시
- ✅ **앱 모드 전환 시스템**
  - ✅ AppModeContext를 통한 상태 관리
  - ✅ 부드러운 전환 애니메이션
  - ✅ 모드별 헤더 및 네비게이션

#### Phase 2: 데이터 지속성 (예정)
- 🔲 LocalStorage를 이용한 데이터 저장
- 🔲 데이터 내보내기/가져오기 (JSON/CSV)
- 🔲 브라우저 간 동기화 고려

#### Phase 3: 고급 기능 (예정)
- 🔲 월별/주별 통계 차트
- 🔲 예산 설정 및 알림
- 🔲 환율 정보 연동
- 🔲 다국어 지원 (영어, 일본어)

#### Phase 4: 백엔드 연동 (향후)
- 🔲 사용자 인증 시스템
- 🔲 클라우드 데이터 저장
- 🔲 다중 디바이스 동기화

#### 코드 작성 규칙
```typescript
// 1. 컴포넌트 작성 시 타입 우선 정의
interface ComponentProps {
  // Props 정의
}

// 2. 컴포넌트 구현
export const Component: React.FC<ComponentProps> = ({ ... }) => {
  // 상태 및 로직
  // JSX 반환
};

// 3. 스타일 클래스는 별도 함수로 분리 (복잡한 경우)
const getComponentClasses = (variant: string) => {
  return clsx(
    'base-classes',
    {
      'variant-classes': variant === 'primary'
    }
  );
};
```

### 3. Git 워크플로우

#### 브랜치 전략
```bash
# 기능 개발
git checkout -b feature/component-name
git checkout -b feature/user-authentication

# 버그 수정
git checkout -b fix/bug-description
git checkout -b fix/button-styling-issue

# 핫픽스
git checkout -b hotfix/critical-bug
```

#### 커밋 메시지 규칙
```bash
# 형식: type(scope): description

# 타입
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 수정 (포맷팅, 세미콜론 등)
refactor: 코드 리팩토링
test: 테스트 코드 추가/수정
chore: 빌드 프로세스 또는 보조 도구 수정

# 예시
feat(auth): 사용자 로그인 기능 구현
fix(button): hover 상태 스타일 수정
docs(readme): 설치 가이드 업데이트
```

#### Pre-commit Hook 설정
```bash
# Husky 설치 및 설정
npm install -D husky@8.0.3 lint-staged@13.2.3
npx husky install

# Pre-commit hook 생성
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json에 추가
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "src/**/*.{json,css,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### 4. 빌드 및 배포

#### package.json 스크립트
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules/.vite",
    "analyze": "npm run build && npx vite-bundle-analyzer"
  }
}
```

#### 빌드 프로세스
```bash
# 1. 타입 검사
npm run type-check

# 2. 린트 검사
npm run lint

# 3. 프로덕션 빌드
npm run build

# 4. 빌드 결과 미리보기
npm run preview
```

## ⚠️ 특별 주의사항

### 1. 성능 최적화

#### React 최적화 규칙
```typescript
// ✅ React.memo 사용 (props가 자주 변경되지 않는 컴포넌트)
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* 복잡한 렌더링 로직 */}</div>;
});

// ✅ useCallback 사용 (자식 컴포넌트에 전달되는 함수)
const ParentComponent: React.FC = () => {
  const handleClick = useCallback((id: string) => {
    // 클릭 처리 로직
  }, []);

  return <ChildComponent onClick={handleClick} />;
};

// ✅ useMemo 사용 (비용이 큰 계산)
const ComponentWithExpensiveCalculation: React.FC<Props> = ({ data }) => {
  const expensiveValue = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  return <div>{expensiveValue}</div>;
};
```

### 2. 접근성 (Accessibility)

#### 필수 접근성 규칙
```typescript
// ✅ 의미있는 HTML 요소 사용
const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    type="button"
    aria-label={props.ariaLabel}
    disabled={props.disabled}
    {...props}
  >
    {children}
  </button>
);

// ✅ 폼 요소에 라벨 연결
const InputField: React.FC<InputProps> = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium">
      {label}
    </label>
    <input
      id={id}
      className="mt-1 block w-full rounded-md border-gray-300"
      {...props}
    />
  </div>
);

// ✅ 키보드 네비게이션 지원
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-50"
    >
      {children}
    </div>
  );
};
```

### 3. 보안 고려사항

#### XSS 방지
```typescript
// ✅ 사용자 입력 검증
const UserContent: React.FC<{ content: string }> = ({ content }) => {
  // React는 기본적으로 XSS를 방지하지만, dangerouslySetInnerHTML 사용 시 주의
  const sanitizedContent = DOMPurify.sanitize(content);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  );
};

// ❌ 위험한 사용법
const DangerousComponent = ({ userInput }) => (
  <div dangerouslySetInnerHTML={{ __html: userInput }} /> // XSS 위험
);
```

#### 환경변수 관리
```typescript
// ✅ 클라이언트 노출용 환경변수 (VITE_ 접두사)
const API_URL = import.meta.env.VITE_API_URL;
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

// ❌ 민감한 정보는 클라이언트에 노출하지 않음
// const SECRET_KEY = import.meta.env.SECRET_KEY; // 위험!
```

### 4. 타입 안전성 보장

#### 런타임 타입 검증
```typescript
// ✅ API 응답 타입 검증
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0).max(150)
});

type User = z.infer<typeof UserSchema>;

const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  // 런타임에서 타입 검증
  return UserSchema.parse(data);
};
```

### 5. 번들 크기 최적화

#### 코드 분할
```typescript
// ✅ 동적 임포트를 사용한 코드 분할
const LazyComponent = React.lazy(() => import('./ExpensiveComponent'));

const App: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);

// ✅ 라이브러리 선택적 임포트
import { debounce } from 'lodash/debounce'; // 전체 lodash 대신 개별 함수만
```

### 6. 워킹홀리데이 가계부 트러블슈팅

#### 자주 발생하는 문제들
```bash
# 1. TypeScript 컴파일 오류
npm run type-check
# 타입 정의 재설치 (React 19 호환)
npm install -D @types/react@19.1.13 @types/react-dom@19.1.9

# 2. Tailwind CSS 스타일 미적용 문제 해결됨
# ✅ Tailwind CSS 3.4.17로 업그레이드
# ✅ ES Module 방식으로 설정 변경
# ✅ PostCSS 설정 개선

# 3. 의존성 충돌 해결
rm -rf node_modules package-lock.json
npm install

# 4. Vite 캐시 문제
rm -rf node_modules/.vite
npm run dev

# 5. 개발 서버 포트 충돌
# 자동으로 다음 포트를 찾아 실행됨 (3000 -> 3001 -> 3002 ...)

# 6. 가계부 데이터 초기화 (개발 시)
# 브라우저 개발자 도구 > Application > Local Storage > 해당 도메인 삭제
```

#### 프로젝트별 주의사항 (업데이트됨)
```typescript
// ✅ Transaction 인터페이스는 src/types/transaction.ts로 분리 완료
// ✅ 통화 관련 타입은 src/types/currency.ts로 분리 완료

// ✅ 현재는 메모리 기반 상태 관리 + Context API
// Phase 2에서 LocalStorage 지원 예정

// ✅ 환율 정보는 실시간 API 연동 (1시간마다 자동 갱신)
// ExchangeRate-API.com 사용 (현재 무료 플랜 적용)

// ✅ 한국어 UI 기본 설정
// 향후 다국어 지원 시 i18n 라이브러리 도입 고려

// ⚠️ 환율 API 제한사항
// - 무료 플랜: 월 1500회 요청 제한
// - 현재 1시간마다 자동 갱신 (월 720회 사용)
// - 향후 유료 플랜 검토 필요
```

---

## 📚 추가 참고 자료

### 현재 프로젝트 관련
- [React 19 공식 문서](https://react.dev/)
- [TypeScript 5.8 공식 문서](https://www.typescriptlang.org/)
- [Tailwind CSS 3.4 공식 문서](https://tailwindcss.com/)
- [Vite 7.x 공식 문서](https://vitejs.dev/)

### 향후 확장 시 참고
- [React Router 공식 문서](https://reactrouter.com/) - 페이지 라우팅
- [Chart.js](https://www.chartjs.org/) - 통계 차트 구현
- [React Hook Form](https://react-hook-form.com/) - 폼 관리
- [Zustand](https://github.com/pmndrs/zustand) - 가벼운 상태 관리

### 워킹홀리데이 특화 기능 참고
- [ExchangeRate API](https://exchangerate-api.com/) - 환율 정보 (현재 사용 중)
- [React i18next](https://react.i18next.com/) - 다국어 지원 (향후 고려)
- [date-fns](https://date-fns.org/) - 날짜 처리 (향후 고려)

---

## 🌟 새로 추가된 주요 기능 (일본 특화 완료!)

### 1. 이중 모드 시스템 (✅ 완료)
- **가계부 모드**: 기존 수입/지출 관리 기능
- **일본 워킹홀리데이 초기비용 계산기**: 일본 특화 준비 비용 계산
- **모드 전환**: 상단 탭을 통한 직관적인 전환
- **상태 관리**: AppModeContext를 통한 전역 모드 상태 관리

### 2. 일본 워킹홀리데이 초기비용 계산기 (NEW! 일본 특화 완료)
- **🇯🇵 일본 전용 특화**: 도쿄/오사카 지역별 비용 차등화
- **16개 일본 특화 카테고리**:
  - **필수 8개**: 항공료, 비자, 보험, 초기숙박비, 재류카드, 주민등록, 국민건강보험, 휴대폰개통
  - **선택 8개**: 아파트보증금, 가구/생활용품, 자전거구입, 일본어학교, 교재/학습용품, 교통카드충전, 비상금, 겨울옷구입
- **7개 카테고리 그룹**: 출국전준비, 입국후정착, 주거, 교통, 교육, 생활, 비상
- **지역별 비용 차등**: 도쿄 vs 오사카 예상 범위 자동 조정
- **한일 병기 표시**: 모든 카테고리에 한국어-일본어 동시 표시
- **실시간 JPY 환율**: KRW↔JPY 실시간 변환 및 계산
- **빠른 입력**: 최소/평균/최대 비용 원클릭 입력

### 3. 다중 통화 시스템 (확장)
- **지원 통화**: 한국 원화(KRW), 미국 달러(USD), 일본 엔(JPY)
- **실시간 환율**: ExchangeRate-API.com 연동으로 1시간마다 자동 갱신
- **통화 변환**: 각 거래/비용의 금액을 원화 기준으로 자동 환산하여 저장
- **통화 선택기**: 대시보드에서 표시 통화 실시간 변경 가능
- **유연한 변환**: useCurrencyConverter 훅으로 임의 통화 간 변환

### 4. 향상된 컴포넌트 아키텍처
- **모듈화된 구조**: Dashboard, TransactionForm, InitialCostCalculator 등 기능별 분리
- **Context API**: CurrencyContext, AppModeContext를 통한 전역 상태 관리
- **커스텀 훅**: useCurrency, useCurrencyConversion, useCurrencyConverter로 로직 재사용성 향상
- **타입 안전성**: 체계화된 TypeScript 인터페이스 및 타입 정의

### 5. 개선된 사용자 인터페이스
- **실시간 잔액/총계**: 선택된 통화에 따른 즉시 계산 및 표시
- **환율 정보**: 마지막 업데이트 시간과 함께 현재 환율 표시
- **반응형 디자인**: 모든 새 컴포넌트가 모바일 친화적 설계
- **직관적 UX**: 통화 변경 및 모드 전환 시 부드러운 애니메이션 효과
- **일관된 디자인**: 두 모드 모두 동일한 디자인 시스템 사용

## 🎯 프로젝트 현재 상태 요약

### ✅ 완료된 작업
1. **기본 프로젝트 설정**: React 19 + TypeScript + Tailwind CSS
2. **워킹홀리데이 가계부 UI**: 수입/지출 관리 인터페이스
3. **반응형 디자인**: 데스크톱과 모바일 최적화
4. **개발 환경 설정**: ESLint, Prettier, 최신 버전 호환성
5. **다중 통화 시스템**: KRW, USD, JPY 지원 및 실시간 환율 연동
6. **컴포넌트 아키텍처**: 모듈화된 컴포넌트 구조 및 Context API
7. **타입 시스템**: 체계적인 TypeScript 타입 정의 및 관리
8. **이중 모드 시스템**: 가계부와 초기비용 계산기 전환
9. **일본 워킹홀리데이 초기비용 계산기 (일본 특화 완료)**:
   - 🇯🇵 일본 전용으로 특화 (기존 5개국 → 일본 집중)
   - 16개 일본 특화 카테고리 (필수 8개 + 선택 8개)
   - 도쿄/오사카 지역별 비용 차등 시스템
   - 한국어-일본어 병기 표시
   - 7개 카테고리 그룹별 체계적 분류
   - JPY 기준 실시간 환율 연동
10. **앱 모드 관리**: AppModeContext를 통한 전역 상태 관리
11. **향상된 통화 변환**: useCurrencyConverter 훅을 통한 유연한 변환

### 🔄 진행 중인 작업
- 현재 모든 기본 기능 구현 완료
- 사용자가 직접 서버 실행하여 테스트 가능한 상태

### 📝 향후 개발 권장사항
1. **일본 특화 기능 확장**:
   - 더 많은 일본 지역 추가 (후쿠오카, 삿포로, 나고야 등)
   - 계절별 비용 변화 반영 (겨울/여름 차이)
   - 일본어 능력 레벨별 어학원 비용 차등화
   - 일본 현지 아르바이트 정보 및 예상 수입 계산기
2. **데이터 지속성**: LocalStorage 구현으로 브라우저 새로고침 시에도 데이터 유지
3. **통계 및 분석**: 월별/주별 지출 분석 차트 및 카테고리별 통계
4. **사용자 경험 개선**:
   - 일본 워킹홀리데이 체크리스트 기능
   - 비용 절약 팁 및 가이드 제공
   - 예산 대비 실제 비용 추적 기능
5. **다국어 지원**: 완전한 일본어 인터페이스 추가
6. **성능 최적화**: React.memo, useMemo, useCallback을 활용한 렌더링 최적화
7. **접근성 향상**: ARIA 라벨, 키보드 네비게이션 등 웹 접근성 표준 준수
8. **Git 저장소 초기화**: 버전 관리 시작 및 브랜치 전략 수립

---

## 🤖 Claude CLI 작업 규약

### 1. 서버 실행 및 관리

#### 개발 서버 실행 규칙
```bash
# ❌ Claude가 하지 않는 작업
npm run dev     # 개발자가 직접 실행
npm start       # 개발자가 직접 실행

# ✅ Claude가 수행하는 작업
npm run build   # 빌드 검증
npm run lint    # 코드 품질 검사
npm run type-check  # 타입 검사
```

#### 포트 관리 규칙
- **3000 포트**: 개발자가 직접 관리
- **Claude의 역할**: 포트 충돌 시 종료만 지원
- **서버 실행**: 개발자 책임, Claude는 빌드/검증만

### 2. 코드 작업 흐름

#### Claude의 작업 범위
```typescript
// ✅ Claude가 수행하는 작업
1. 코드 작성 및 수정
2. 타입 정의 및 인터페이스 설계
3. 컴포넌트 구조 설계
4. 빌드 오류 수정
5. 린트/타입 검사 오류 해결
6. 파일 구조 개선
7. 코드 리팩터링

// ❌ Claude가 수행하지 않는 작업
1. 개발 서버 장시간 실행
2. 실시간 디버깅
3. 브라우저 테스트
4. 사용자 인터페이스 테스트
```

#### 작업 완료 후 확인 절차
```bash
# Claude가 수행하는 최종 검증
1. npm run type-check  # 타입 오류 확인
2. npm run lint        # 코드 품질 검사
3. npm run build       # 프로덕션 빌드 테스트

# 개발자가 수행하는 테스트
1. npm run dev         # 개발 서버 실행
2. 브라우저에서 기능 테스트
3. 사용자 인터페이스 검증
```

### 3. 파일 수정 및 생성 규칙

#### 코드 수정 시 원칙
```typescript
// ✅ 권장 작업 방식
1. 기존 파일 구조 분석
2. 타입 정의 우선 작성
3. 컴포넌트 분리 및 모듈화
4. 에러 처리 및 검증
5. 빌드 테스트

// ✅ 파일 생성 우선순위
1. 타입 정의 (types/)
2. 유틸리티 함수 (utils/)
3. 커스텀 훅 (hooks/)
4. 컴포넌트 (components/)
5. 컨텍스트 (contexts/)
```

#### 코드 품질 보장
```bash
# Claude가 자동으로 확인하는 항목
✅ TypeScript 타입 안전성
✅ ESLint 규칙 준수
✅ 일관된 코드 스타일
✅ 컴포넌트 분리 원칙
✅ 성능 최적화 고려

# 개발자가 확인해야 하는 항목
🔲 실제 동작 테스트
🔲 사용자 경험 검증
🔲 브라우저 호환성
🔲 반응형 디자인
🔲 접근성 테스트
```

### 4. 커뮤니케이션 규칙

#### 작업 완료 시 제공 정보
```markdown
## 완료된 작업
- 구체적인 수정 내용
- 새로 생성된 파일 목록
- 개선된 기능 설명

## 확인 사항
- 빌드 성공 여부
- 타입 검사 통과 여부
- 린트 오류 해결 여부

## 개발자 액션 필요
- 개발 서버 실행 방법
- 테스트해야 할 기능
- 추가로 고려할 사항
```

#### 오류 발생 시 대응
```bash
# Claude가 처리하는 오류
✅ TypeScript 컴파일 오류
✅ ESLint 규칙 위반
✅ 빌드 실패 오류
✅ 패키지 의존성 문제

# 개발자가 처리해야 하는 오류
🔲 런타임 에러
🔲 브라우저 호환성 문제
🔲 사용자 인터페이스 버그
🔲 성능 이슈
```

### 5. 프로젝트 상태 관리

#### 작업 전 확인사항
```bash
# Claude가 확인하는 항목
1. 현재 프로젝트 구조 파악
2. package.json 의존성 확인
3. 설정 파일들 상태 점검
4. 기존 코드 스타일 분석
```

#### 작업 후 정리
```bash
# Claude가 수행하는 정리 작업
1. 사용하지 않는 import 제거
2. 코드 포맷팅 적용
3. 타입 정의 최적화
4. 파일 구조 정리

# 개발자가 수행해야 하는 정리
1. Git 커밋 및 푸시
2. 브라우저 캐시 정리
3. 로컬 스토리지 데이터 확인
4. 실제 사용 시나리오 테스트
```

### 6. 특별 주의사항

#### 서버 관리 관련
```bash
# ⚠️ 중요: Claude는 서버를 장시간 실행하지 않음
- 개발 서버는 개발자가 직접 관리
- 포트 충돌 시에만 종료 지원
- 실시간 개발 환경은 개발자 책임

# ✅ Claude의 역할
- 코드 작성 및 수정
- 빌드 검증
- 품질 검사
- 구조 개선
```

#### 데이터 관리 관련
```bash
# ⚠️ 개발 데이터 손실 방지
- LocalStorage 데이터는 개발자가 백업
- 중요한 테스트 데이터는 별도 저장
- 코드 수정 시 기존 데이터 호환성 고려
```

---

---

## 🔧 **프로젝트 폴더명 변경 안내**

**중요**: 프로젝트 폴더명이 `working`에서 `woring`으로 변경되었습니다.

```bash
# 기존 경로
D:\working

# 새로운 경로
D:\woring
```

**변경 방법**:
1. 현재 `D:\working` 폴더를 `D:\woring`으로 폴더명 변경
2. VS Code에서 새로운 경로로 프로젝트 다시 열기
3. 터미널에서 `cd D:\woring`로 이동 후 `npm run dev` 실행

---

*이 문서는 일본 워킹홀리데이 가계부 React 웹앱 프로젝트의 개발 가이드입니다. Claude CLI와 개발자 간의 효율적인 협업을 위한 규약을 포함하고 있으며, 프로젝트 진행에 따라 업데이트됩니다.*