# 워킹홀리데이 앱 - 다음 개발 단계 가이드

## 📋 현재 프로젝트 상태 (2025년 최신)

### ✅ 완료된 기능
- **기본 CRUD 기능**: 수입/지출 내역 추가, 조회, 삭제
- **실시간 계산**: 총 수입, 총 지출, 잔액 자동 계산 (다중 통화 지원)
- **카테고리 시스템**: 워킹홀리데이 특화 카테고리 분류
- **반응형 UI**: 데스크톱/모바일 최적화 디자인
- **TypeScript**: 체계적인 타입 안전성 및 인터페이스 구조
- **모던 스택**: React 19 + Vite 7 + Tailwind CSS 3.4
- **다중 통화 시스템**: KRW, USD, JPY 지원 + 실시간 환율 API 연동
- **컴포넌트 아키텍처**: 모듈화된 컴포넌트 구조 (Dashboard, TransactionForm, TransactionList)
- **상태 관리**: Context API (CurrencyContext, AppModeContext) + 커스텀 훅 (useCurrency, useCurrencyConversion, useCurrencyConverter)
- **유틸리티 시스템**: 계산, 환율 처리, 통화 포맷팅 함수 분리
- ✅ **이중 모드 시스템**: 가계부와 초기비용 계산기 전환 완료
- ✅ **워킹홀리데이 초기비용 계산기** (완전 구현):
  - 5개국 지원 (호주, 캐나다, 뉴질랜드, 영국, 일본)
  - 필수/선택적 비용 분류 (10개 카테고리)
  - 실시간 통화 변환 및 총계 계산
  - 카테고리별 예상 범위 표시
- ✅ **듀얼 모드 네비게이션**: 상단 탭을 통한 모드 전환

### 🔄 현재 개발 방향 (업데이트됨)
- **데이터 지속성**: 당분간 메모리 기반 유지 (LocalStorage는 추후 개발 예정)
- **환율 API**: 현재 시스템 재검토 필요 (API 제한 및 비용 고려)
- **통계 및 분석**: 핵심 개선 영역 (차트, 인사이트, 사용 패턴 분석)
- **초기비용 계산기 확장**: 더 많은 국가 및 세부 카테고리 추가
- **사용자 경험**: 기존 기능들의 고도화

---

## 🌏 Phase 2: 데이터 지속성 및 고급 기능 (다음 우선 기능)

### ✅ 완료된 Phase 2 작업들
- ✅ **초기 비용 계산기 구조 설계**: 모든 인터페이스 및 타입 정의 완료
- ✅ **초기 비용 카테고리 구현**: 10개 카테고리 (필수 4개, 선택적 6개) 완료
- ✅ **네비게이션 시스템**: 듀얼 모드 탭 네비게이션 완료
- ✅ **AppModeContext**: 모드 상태 관리 및 전환 애니메이션 완료
- ✅ **5개국 지원**: 호주, 캐나다, 뉴질랜드, 영국, 일본 데이터 완료
- ✅ **실시간 계산**: 통화 변환 및 총계 계산 시스템 완료

### 🔄 Phase 2-B: 초기비용 계산기 확장

#### 2-B.1 더 많은 국가 지원
```typescript
// 추가할 국가들
const ADDITIONAL_COUNTRIES = [
  'ireland',     // 아일랜드
  'germany',     // 독일
  'france',      // 프랑스
  'taiwan',      // 대만
  'singapore',   // 싱가포르
  'chile',       // 칠레
  'argentina',   // 아르헨티나
];
```

#### 2-B.2 세부 카테고리 확장
```typescript
// 기존 카테고리를 더 세분화
const EXPANDED_CATEGORIES = [
  // 기존: '생활용품' → 세분화
  '생활용품 - 의류',
  '생활용품 - 전자제품',
  '생활용품 - 침구류',

  // 기존: '여행경비' → 세분화
  '국내여행비',
  '관광지 입장료',
  '액티비티 비용',
];
```

### 우선순위 3: 사용자 경험 개선 (UI/UX 고도화)

#### 3.1 고급 UI 컴포넌트
- **모달 창**: 삭제 확인, 설정 등
- **토스트 알림**: 성공/실패 메시지
- **로딩 상태**: 데이터 처리 중 표시
- **드래그 앤 드롭**: 카테고리 순서 변경

#### 3.2 필터링 및 검색
```typescript
// 구현할 기능들
interface FilterOptions {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchKeyword?: string;
}
```

---

## 📊 Phase 3: 고급 분석 및 인사이트 기능

### 3.1 차트 라이브러리 도입
```bash
# 권장 라이브러리
npm install recharts  # React 친화적인 차트 라이브러리
npm install @types/recharts -D

# 또는
npm install chart.js react-chartjs-2
```

### 3.2 구현할 통계 기능
- **월별 지출 트렌드**: 라인 차트
- **카테고리별 지출 분포**: 파이 차트
- **수입 vs 지출**: 바 차트
- **일일/주간/월간 요약**: 대시보드 카드

### 3.3 예산 관리 시스템
```typescript
interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly';
  startDate: string;
}
```

---

## 💱 Phase 4: 워킹홀리데이 특화 기능 확장

### 4.1 다중 통화 시스템 고도화 (기본 기능 완료됨)
```bash
# ✅ 이미 구현 완료
- KRW, USD, JPY 지원
- 실시간 환율 API 연동 (ExchangeRate-API.com)
- 1시간마다 자동 갱신
- 통화별 금액 입력 및 원화 환산

# 🔄 추가 구현 필요
- 더 많은 통화 지원 (EUR, AUD, CAD, GBP 등)
- 오프라인 모드를 위한 환율 캐싱
- 환율 히스토리 추적
- 수수료 계산기 (ATM, 환전소)
```

### 4.2 국가별 설정
```typescript
interface CountrySettings {
  country: string;
  currency: string;
  locale: string;
  commonCategories: string[];
  tipCalculator?: boolean;
  taxRate?: number;
}
```

### 4.3 여행 특화 기능
- **ATM 수수료 추적**
- **환전 기록 관리**
- **여행 기간별 예산 설정**
- **긴급 연락처 저장**

---

## 🌐 Phase 5: 고급 기능 및 최적화

### 5.1 PWA (Progressive Web App) 구현
```bash
# Vite PWA 플러그인 설치
npm install vite-plugin-pwa -D

# 기능
- 오프라인 사용 가능
- 홈 화면에 앱 추가
- 푸시 알림 (예산 초과 경고)
```

### 5.2 다국어 지원 (i18n)
```bash
npm install react-i18next i18next

# 지원 언어
- 한국어 (기본)
- 영어
- 일본어
- 중국어 간체
```

### 5.3 성능 최적화
- **가상화**: 많은 거래 내역 처리
- **메모이제이션**: 불필요한 재렌더링 방지
- **코드 분할**: 라우트별 번들 분리
- **이미지 최적화**: WebP 포맷 사용

---

## 🔧 즉시 시작 가능한 개발 작업 (업데이트된 우선순위)

### 🥇 Highest Priority (1주일 소요)

#### 1. 데이터 지속성 구현 💾
```bash
# LocalStorage 기반 데이터 저장 구현
npm install use-local-storage-state  # 선택사항

# 구현 순서
1. src/hooks/useLocalStorage.ts - 기본 LocalStorage 훅
2. src/contexts/PersistenceContext.tsx - 데이터 지속성 관리
3. 기존 상태 관리에 저장/로드 로직 통합
4. 데이터 마이그레이션 및 백업/복원 기능

# 저장할 데이터
- 가계부 거래 내역
- 초기비용 계산 결과
- 사용자 설정 (선호 통화, 테마 등)
- 환율 캐시 데이터
```

#### 2. 통계 및 차트 시스템 구축 📊
```bash
# Recharts 라이브러리 설치
npm install recharts @types/recharts

# 구현 순서
1. src/utils/statistics.ts - 통계 계산 로직
2. src/components/Charts/ - 차트 컴포넌트들
3. src/components/StatsDashboard/ - 통계 대시보드
4. 가계부 모드에 통계 섹션 추가

# 핵심 기능
- 월별 수입/지출 트렌드 (Line Chart)
- 카테고리별 지출 분포 (Pie Chart)
- 통화별 사용 패턴 (Bar Chart)
- 초기비용 vs 실제지출 비교 차트
```

### 🥈 High Priority (3-5일 소요)

#### 1. 초기비용 계산기 고도화
```bash
# 기능 확장
1. 더 많은 국가 추가 (아일랜드, 독일, 프랑스 등)
2. 세부 카테고리 분할
3. 예상비용 vs 실제비용 비교 기능
4. 초기비용 결과 저장 및 관리

# UI/UX 개선
- 국가별 맞춤 팁 제공
- 비용 범위 시각화
- 저장된 계산 결과 히스토리
```

#### 2. 고급 필터링 및 검색 시스템
```bash
# 가계부 모드 향상
- 날짜 범위 필터 (달력 UI)
- 다중 카테고리 필터
- 금액 범위 검색
- 설명 키워드 검색
- 정렬 옵션 (날짜, 금액, 카테고리)

# 초기비용 계산기 필터링
- 국가별 필터
- 비용 유형 필터 (필수/선택적)
- 저장된 계산 결과 검색
```

### 🥉 Medium Priority (1-2주 소요)

#### 1. 예산 관리 시스템
```bash
# 예산 설정 및 추적
- 카테고리별 예산 설정 UI
- 예산 초과 알림 시스템
- 예산 vs 실제 지출 비교 차트
- 예산 달성률 표시
```

#### 2. 고급 필터링 및 검색
```bash
# 향상된 데이터 탐색
- 다중 조건 필터링 (날짜, 카테고리, 금액 범위)
- 자연어 검색 ("지난달 식비", "100달러 이상")
- 저장된 필터 프리셋
- 정렬 및 그룹화 옵션
```

---

## 📂 권장 개발 순서 (업데이트됨)

### Week 1: 데이터 지속성 구현 (Critical)
- [ ] useLocalStorage 훅 구현 및 기존 시스템 통합
- [ ] 거래 데이터 자동 저장/로드 시스템
- [ ] 초기비용 계산 결과 저장 시스템
- [ ] 환율 데이터 캐싱 시스템
- [ ] 데이터 백업/복원 기능 (JSON/CSV)
- [ ] 데이터 마이그레이션 및 무결성 검증

### Week 2: 통계 및 분석 시스템
- [ ] Recharts 라이브러리 통합
- [ ] 기본 통계 계산 로직 구현 (src/utils/statistics.ts)
- [ ] 월별 수입/지출 트렌드 차트
- [ ] 카테고리별 지출 분포 파이 차트
- [ ] 초기비용 vs 실제지출 비교 차트
- [ ] 통계 대시보드 페이지 구성

### Week 3: 초기비용 계산기 고도화
- [ ] 추가 국가 데이터 구축 (7개국 → 12개국)
- [ ] 세부 카테고리 확장 및 분류
- [ ] 초기비용 결과 저장 및 히스토리 관리
- [ ] 예상비용 vs 실제비용 비교 기능
- [ ] 국가별 맞춤 팁 및 정보 제공

### Week 4: 고급 사용자 경험 및 최적화
- [ ] 고급 필터링 및 검색 시스템 (양 모드 지원)
- [ ] 모달 및 토스트 알림 시스템
- [ ] 데이터 내보내기/가져오기 UI 개선
- [ ] 성능 최적화 (메모이제이션, 가상화)
- [ ] 접근성 (A11y) 향상 작업

---

## 🛠️ 개발 시 주의사항

### 코드 품질 유지
```bash
# 매 작업 후 실행
npm run lint          # ESLint 검사
npm run type-check     # TypeScript 검사
npm run format         # Prettier 포맷팅
```

### 테스트 고려사항
```bash
# 향후 테스트 도구 추가 권장
npm install -D vitest @testing-library/react @testing-library/jest-dom

# 테스트할 주요 기능
- LocalStorage 저장/로드
- 계산 로직
- 컴포넌트 렌더링
```

### 성능 모니터링
```bash
# React DevTools Profiler 활용
- 렌더링 성능 확인
- 메모리 누수 체크
- Bundle 크기 모니터링
```

---

## 📚 참고 자료

### 추천 학습 자료
- [React Hooks 공식 문서](https://react.dev/reference/react)
- [LocalStorage 모범 사례](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Recharts 문서](https://recharts.org/en-US/)
- [PWA 가이드](https://web.dev/progressive-web-apps/)

### 유용한 도구들
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) (상태 관리 도입 시)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

---

## 🎯 마일스톤 요약

| Phase | 기간 | 주요 기능 | 난이도 | 상태 |
|-------|------|-----------|--------|---------|
| Phase 1 | ✅ 완료 | 기본 CRUD, 다중 통화, 컴포넌트 구조 | ⭐⭐⭐ | ✅ Done |
| Phase 2 | ✅ 완료 | 초기비용 계산기, 듀얼모드 네비게이션 | ⭐⭐⭐⭐ | ✅ Done |
| Phase 3 | 1-2주 | 데이터 지속성, 통계/차트 시스템 | ⭐⭐⭐ | 🔥 Priority |
| Phase 4 | 2-3주 | 고급 필터링, 계산기 확장 | ⭐⭐⭐⭐ | 🔄 Next |
| Phase 5 | 3-4주 | PWA, i18n, 성능 최적화 | ⭐⭐⭐⭐⭐ | 📋 Planned |

---

## 🔍 중요 변경사항 요약

### ✅ 완료된 기능들 (업데이트됨)
- **다중 통화 시스템**: KRW, USD, JPY 지원 + 실시간 환율
- **컴포넌트 아키텍처**: 모듈화된 구조 (Dashboard, TransactionForm, TransactionList, InitialCostCalculator)
- **Context API**: CurrencyContext, AppModeContext 및 커스텀 훅
- **타입 시스템**: 체계적 TypeScript 인터페이스
- ✅ **워킹홀리데이 초기비용 계산기**: 5개국 지원, 10개 카테고리 완전 구현
- ✅ **듀얼 모드 시스템**: 가계부 ↔️ 비용 계산기 간 완전 전환 가능
- ✅ **통합 네비게이션**: 모드별 헤더 및 탭 시스템 완료

### 🔥 다음 최우선 작업 (업데이트된 로드맵)
1. **데이터 지속성 구현** - LocalStorage 기반 데이터 저장
2. **통계 및 차트 시스템** - Recharts를 활용한 데이터 시각화
3. **초기비용 계산기 확장** - 더 많은 국가 및 세부 기능
4. **고급 필터링 시스템** - 양 모드에서 데이터 탐색 개선

### ⚠️ 기술적 고려사항 (업데이트)
- **데이터 지속성**: 현재 메모리 기반에서 LocalStorage 구현이 최우선 과제
- **환율 API 최적화**: 현재 시스템의 비용 효율성 및 캐싱 전략 개선 필요
- **성능 최적화**: 차트 렌더링 최적화 및 대용량 데이터 처리 준비
- **사용자 경험**: 두 모드 간 일관된 경험 유지 및 통계 정보 직관화
- **확장성**: 더 많은 국가 및 카테고리 추가를 위한 데이터 구조 확장

### 🎉 Phase 2 달성 성과
- ✅ **완전한 이중 모드 시스템**: 가계부와 초기비용 계산기가 하나의 앱에서 완벽히 동작
- ✅ **5개국 초기비용 데이터**: 실제 워킹홀리데이 준비자들이 사용 가능한 현실적 데이터
- ✅ **실시간 통화 변환**: 모든 계산이 실시간으로 사용자 선호 통화로 표시
- ✅ **체계적인 아키텍처**: 향후 기능 확장이 용이한 모듈화된 구조

---

*이 문서는 2025년 현재 프로젝트 상태를 반영하여 업데이트되었습니다. Phase 2 (이중 모드 시스템)가 완료되어 이제 데이터 지속성과 고급 기능 구현에 집중할 수 있습니다.*