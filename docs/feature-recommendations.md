# 가계부 앱 추천 기능 목록

> 현재 구현된 기능을 분석하여 추가하면 좋을 기능들을 우선순위별로 정리한 문서입니다.

**문서 작성일**: 2025-12-03
**분석 대상**: Personal Finance Management Application v1.0

---

## 📋 목차

1. [현재 구현 현황](#현재-구현-현황)
2. [우선순위별 추천 기능](#우선순위별-추천-기능)
3. [즉시 구현 가능한 개선 사항](#즉시-구현-가능한-개선-사항)
4. [구현 로드맵 제안](#구현-로드맵-제안)

---

## 현재 구현 현황

### ✅ 구현된 핵심 기능

#### 거래 관리
- ✅ CRUD 기본 작업 (생성, 조회, 수정, 삭제)
- ✅ 수입/지출 구분
- ✅ 다중 통화 지원 (KRW, USD, JPY)
- ✅ 실시간 환율 변환
- ✅ 카테고리 시스템 (지출 11개, 수입 3개)

#### 인증 및 사용자 관리
- ✅ 이메일/비밀번호 인증
- ✅ Google OAuth
- ✅ 게스트 모드 (LocalStorage)
- ✅ 프로필 관리
- ✅ 계정 삭제

#### 고정지출 관리
- ✅ 월간 반복 지출 자동 추적
- ✅ 특정 날짜 설정 (1-31일)
- ✅ 생성일 기준 로직
- ✅ 활성/비활성 토글
- ✅ 다중 통화 지원
- ✅ 통계 자동 연동

#### 예산 관리
- ✅ 월별 독립 예산 설정
- ✅ 예산 히스토리 조회
- ✅ 전월 복사 기능
- ✅ 실시간 사용률 표시
- ✅ 초과 시 시각적 경고

#### 대시보드 및 뷰
- ✅ 요약 뷰 (월간 수입/지출/잔액)
- ✅ 캘린더 뷰 (일별 거래 요약)
- ✅ 고정지출 관리 뷰
- ✅ 통계 분석 뷰

#### 통계 및 분석
- ✅ 기간별 분석 (월별, 1/3/6/12개월, 전체)
- ✅ 카테고리별 지출 분포 (파이 차트)
- ✅ 총 수입/지출/잔액 with 일평균
- ✅ 최다 지출 카테고리/날짜 인사이트
- ✅ 거래 수 통계
- ⚠️ 요일별 지출 패턴 (데이터만 생성, UI 없음)
- ⚠️ 월별 트렌드 (데이터만 생성, UI 없음)

#### UI/UX
- ✅ 다크 모드
- ✅ 반응형 디자인 (모바일 우선)
- ✅ 터치 제스처 (캘린더 스와이프)
- ✅ 토스트 알림
- ✅ 확인 다이얼로그
- ✅ 로딩 상태 표시
- ✅ 빈 상태 메시지

#### 추가 기능
- ✅ 초기 비용 계산기
- ✅ 이용약관 & 개인정보처리방침
- ✅ Google Analytics 통합
- ✅ 테마 토글

---

## 우선순위별 추천 기능

### 🔥 높은 우선순위 (즉시 추가 권장)

#### 1. 요일별/월별 트렌드 차트 시각화
**현재 상태**: 데이터 계산 로직 완료, UI 컴포넌트만 없음
**작업량**: 30분 - 1시간
**이점**:
- 이미 `statistics.ts`에 `generateWeekdayExpense()`, `generateMonthlyTrend()` 구현됨
- UI만 추가하면 바로 사용 가능
- 사용자에게 유용한 지출 패턴 인사이트 제공

**구현 내용**:
- 요일별 지출 바 차트 컴포넌트
- 월별 추세 라인 차트 컴포넌트
- StatisticsDashboard에 통합

#### 2. 거래 내역 검색 및 필터링
**현재 상태**: 최근 7개 거래만 표시, 검색 불가
**작업량**: 2-3시간
**이점**:
- 거래가 많아질수록 필수 기능
- 특정 거래 찾기 편리
- 카테고리별, 날짜별 분석 용이

**구현 내용**:
- 텍스트 검색 (설명, 카테고리)
- 날짜 범위 필터
- 카테고리 다중 선택 필터
- 금액 범위 필터
- 수입/지출 타입 필터
- 검색 결과 하이라이트

#### 3. 데이터 내보내기 (CSV/Excel)
**현재 상태**: 없음
**작업량**: 2-3시간
**이점**:
- 세무 신고 자료로 활용
- 외부 도구로 추가 분석 가능
- 데이터 백업

**구현 내용**:
- CSV 다운로드 기능
- 월별/기간별 선택 내보내기
- 모든 거래 내보내기
- 카테고리별 집계 내보내기
- 파일명 자동 생성 (예: `가계부_2025년12월.csv`)

#### 4. 저축 목표 관리
**현재 상태**: 없음
**작업량**: 4-6시간
**이점**:
- 사용자 동기부여
- 재무 목표 달성 가시화
- 앱 사용 지속성 증가

**구현 내용**:
- 목표 생성/수정/삭제
- 목표별 진행률 표시 (프로그레스 바)
- 목표 달성 알림
- 목표 카테고리 (여행, 비상금, 대형구매 등)
- 목표 기한 설정
- 대시보드에 목표 요약 카드 추가

**데이터베이스 스키마**:
```sql
CREATE TABLE savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'KRW',
  target_amount_in_krw NUMERIC NOT NULL,
  current_amount_in_krw NUMERIC DEFAULT 0,
  deadline DATE,
  category TEXT,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 💡 중간 우선순위 (유용한 기능)

#### 5. 고정 수입 관리
**현재 상태**: 고정지출만 지원
**작업량**: 2-3시간
**이점**:
- 고정지출과 대칭성
- 월급, 임대료 수입 등 자동 반영
- 예산 계획 정확도 향상

**구현 내용**:
- `recurring_income` 테이블 추가 (스키마는 `recurring_expenses`와 유사)
- 고정수입 CRUD UI
- 통계 계산에 자동 포함
- 캘린더에 "고정수입" 배지 표시

#### 6. 지출 예측 및 인사이트
**현재 상태**: 기본 통계만 제공
**작업량**: 6-8시간
**이점**:
- 사전 경고로 과소비 방지
- 패턴 기반 예측으로 예산 계획 지원
- 사용자 참여도 증가

**구현 내용**:
- 이번 달 예상 지출 계산 (과거 평균 기반)
- 전월 대비 증감률 표시
- 카테고리별 평소보다 많이 지출한 경우 알림
- "이 속도면 예산 초과 예상" 경고
- AI/ML 패턴 분석 (선택 사항)

#### 7. 알림 및 리마인더
**현재 상태**: 시각적 경고만 있음 (예산 초과)
**작업량**: 4-6시간
**이점**:
- 고정지출 납부 잊지 않음
- 예산 관리 효율성 증가
- 사용자 재방문 유도

**구현 내용**:
- 고정지출 납부일 X일 전 알림
- 예산 사용률 80%, 90%, 100% 도달 시 알림
- 월초 예산 리셋 알림
- 브라우저 Push Notification (PWA 필요) 또는 이메일
- 알림 설정 페이지 (켜기/끄기, 알림 시간)

**데이터베이스**:
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  type TEXT, -- 'budget_alert', 'recurring_due', 'goal_achieved'
  title TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 8. 영수증 사진 첨부
**현재 상태**: 없음
**작업량**: 4-6시간
**이점**:
- 증빙 자료 보관
- 분쟁 시 증거 자료
- 비용 정산 편리

**구현 내용**:
- Supabase Storage 활용
- 거래별 이미지 업로드 (1-3장)
- 이미지 썸네일 표시
- 이미지 뷰어 모달
- 이미지 삭제

**Supabase Storage 설정**:
- Bucket: `receipts`
- 경로: `{user_id}/{transaction_id}/{file_name}`
- RLS 정책 적용

#### 9. 분할 거래 (Split Transaction)
**현재 상태**: 한 거래 = 한 카테고리
**작업량**: 6-8시간
**이점**:
- 더 정확한 카테고리 분류
- 예: 마트에서 식료품 + 생활용품 구매

**구현 내용**:
- 거래 추가 시 "분할" 옵션
- 여러 카테고리에 금액 배분 UI
- 합계 금액 자동 검증
- 분할 거래 표시 (배지 또는 아이콘)
- 통계에서 각 카테고리로 분산 집계

**데이터 모델 변경**:
```typescript
// Option 1: 별도 테이블
CREATE TABLE transaction_splits (
  id UUID PRIMARY KEY,
  transaction_id UUID REFERENCES transactions,
  category TEXT,
  amount NUMERIC,
  amount_in_krw NUMERIC
);

// Option 2: JSON 필드 추가
transactions.splits: {
  category: string;
  amount: number;
  amountInKRW: number;
}[]
```

#### 10. 계좌 관리
**현재 상태**: 계좌 구분 없음
**작업량**: 8-10시간
**이점**:
- 계좌별 잔액 추적
- 현금 vs 카드 구분
- 이체 거래 기록

**구현 내용**:
- 계좌 생성/수정/삭제 (현금, 체크카드, 신용카드, 은행 계좌)
- 거래 시 계좌 선택
- 계좌 이체 거래 타입 추가
- 계좌별 잔액 대시보드
- 계좌별 필터링

**데이터베이스**:
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  type TEXT, -- 'cash', 'debit_card', 'credit_card', 'bank'
  initial_balance NUMERIC DEFAULT 0,
  current_balance NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'KRW',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- transactions 테이블에 account_id 추가
ALTER TABLE transactions ADD COLUMN account_id UUID REFERENCES accounts;
```

---

### 🚀 장기 목표 (큰 작업 필요)

#### 11. PWA 및 오프라인 모드
**작업량**: 10-15시간
**이점**:
- 인터넷 없이도 사용 가능
- 홈 화면에 앱 추가
- 네이티브 앱 느낌

**구현 내용**:
- Service Worker 등록
- Manifest 파일 생성
- 오프라인 데이터 캐싱 (IndexedDB)
- 백그라운드 동기화
- Push Notification API

#### 12. 가계부 공유 (가족 모드)
**작업량**: 20-30시간
**이점**:
- 가족 구성원과 예산 공유
- 공동 재무 관리

**구현 내용**:
- 가계부 초대 시스템
- 권한 관리 (Owner, Editor, Viewer)
- 공유 거래 및 예산
- 멤버별 개인 거래
- 합산 통계

#### 13. 은행 연동 (Open Banking)
**작업량**: 40-60시간
**이점**:
- 실제 계좌 연동
- 자동 거래 내역 가져오기
- 수동 입력 부담 감소

**구현 내용**:
- 오픈뱅킹 API 연동
- 계좌 인증 플로우
- 자동 거래 동기화
- 중복 거래 감지
- 카테고리 자동 분류 (ML)

**참고**: 한국의 경우 금융결제원 오픈뱅킹 API 필요

#### 14. 다국어 지원 (i18n)
**작업량**: 15-20시간
**이점**:
- 글로벌 사용자 확보
- 영어, 일본어 등 지원

**구현 내용**:
- react-i18next 설치
- 모든 하드코딩 텍스트를 번역 키로 변경
- 언어 선택 UI
- 날짜/통화 형식 현지화

---

## 즉시 구현 가능한 개선 사항

### A. 요일별 지출 차트 추가
**작업 시간**: 30분
**파일**: `src/components/Statistics/WeekdayBarChart.tsx` (신규)

```typescript
// statistics.weekdayExpense 데이터 활용
// 간단한 CSS 바 차트 또는 recharts 라이브러리
// StatisticsDashboard.tsx에 컴포넌트 추가
```

### B. 월별 추세 차트 추가
**작업 시간**: 30분
**파일**: `src/components/Statistics/MonthlyTrendChart.tsx` (신규)

```typescript
// statistics.monthlyTrend 데이터 활용
// 라인 차트로 수입/지출 추세 표시
// recharts 또는 chart.js 활용
```

### C. 거래 내역 전체 보기 페이지
**작업 시간**: 1시간
**파일**: `src/components/TransactionList/TransactionListFull.tsx` (신규)

**현재 문제**:
- Dashboard에서 최근 7개만 표시
- 과거 거래 보기 불편

**해결 방안**:
- "전체 보기" 버튼 추가
- 페이지네이션 또는 무한 스크롤
- 날짜별 그룹핑

### D. 간단한 검색 기능
**작업 시간**: 1시간
**파일**: `src/components/TransactionList/TransactionSearch.tsx` (신규)

```typescript
// 설명(description) 텍스트 검색
// 카테고리 필터 드롭다운
// 날짜 범위 선택
```

### E. CSV 내보내기 버튼
**작업 시간**: 1-2시간
**파일**: `src/utils/exportCSV.ts` (신규)

```typescript
export const exportToCSV = (transactions: Transaction[], filename: string) => {
  const headers = ['날짜', '유형', '카테고리', '금액', '통화', '설명'];
  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? '수입' : '지출',
    t.category,
    t.amount,
    t.currency,
    t.description
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
```

### F. 거래 내역 페이지네이션
**작업 시간**: 2시간
**파일**: `src/components/TransactionList/TransactionList.tsx` 수정

**현재**: 모든 거래 한 번에 로드
**개선**:
- 한 페이지당 20-50개씩 표시
- 이전/다음 버튼
- 성능 최적화

---

## 구현 로드맵 제안

### Phase 1: Quick Wins (1-2주)
빠르게 구현하여 사용자 가치를 즉시 제공

1. ✅ 요일별 지출 차트
2. ✅ 월별 추세 차트
3. ✅ 거래 전체 보기 페이지
4. ✅ 간단한 검색 기능
5. ✅ CSV 내보내기

### Phase 2: Core Features (2-4주)
핵심 가치를 높이는 기능

6. ✅ 저축 목표 관리
7. ✅ 고정 수입 지원
8. ✅ 고급 검색 및 필터
9. ✅ 거래 내역 페이지네이션

### Phase 3: Enhanced UX (4-6주)
사용자 경험 향상

10. ✅ 알림 및 리마인더
11. ✅ 지출 예측 및 인사이트
12. ✅ 영수증 사진 첨부
13. ✅ 분할 거래

### Phase 4: Advanced Features (6-12주)
고급 기능 및 확장성

14. ✅ 계좌 관리
15. ✅ PWA 및 오프라인 모드
16. ✅ 다국어 지원
17. ✅ 가계부 공유 (가족 모드)

### Phase 5: Integration (12주+)
외부 시스템 연동

18. ✅ 은행 연동 (Open Banking)
19. ✅ AI 카테고리 자동 분류
20. ✅ 네이티브 앱 (React Native 포팅)

---

## 기술적 고려 사항

### 성능 최적화
- **페이지네이션**: 거래 내역 로드 최적화
- **가상 스크롤**: 긴 리스트 렌더링 최적화
- **Memoization**: 복잡한 계산 캐싱 강화
- **Lazy Loading**: 차트 컴포넌트 지연 로딩

### 데이터베이스
- **인덱스 추가**: `transactions(user_id, date)`, `transactions(user_id, category)`
- **Date 타입 변경**: TEXT → TIMESTAMPTZ 마이그레이션 고려
- **Materialized Views**: 복잡한 통계 쿼리 최적화

### 보안 강화
- **2FA (이중 인증)**: Supabase Auth 2FA 활성화
- **세션 타임아웃**: 장시간 미사용 시 자동 로그아웃
- **로그인 히스토리**: 의심스러운 활동 감지
- **데이터 암호화**: Sensitive 정보 암호화

### 모바일 경험
- **PWA Manifest**: 홈 화면 추가 지원
- **Service Worker**: 오프라인 모드
- **Push Notifications**: 예산 알림, 고정지출 리마인더
- **생체 인증**: Face ID, Touch ID (PWA Credential Management API)

---

## 결론

현재 가계부 앱은 **핵심 기능이 탄탄하게 구현**되어 있으며, 확장할 수 있는 좋은 기반을 갖추고 있습니다.

### 추천 우선순위 TOP 5
1. **요일별/월별 차트** - 이미 데이터가 준비되어 있어 즉시 구현 가능
2. **거래 검색/필터** - 데이터가 많아질수록 필수
3. **CSV 내보내기** - 사용자 요구가 많은 기능
4. **저축 목표** - 사용자 참여도 증가
5. **고정 수입 지원** - 고정지출과 대칭성 완성

이 문서는 향후 개발 방향을 설정하는 가이드로 활용하시면 됩니다.

---

**문서 업데이트**: 필요에 따라 이 문서를 업데이트하며, 구현 완료된 기능은 체크 표시 추가
