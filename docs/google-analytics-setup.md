# Google Analytics 4 설정 가이드

## 📊 개요

이 프로젝트는 Google Analytics 4 (GA4)를 사용하여 사용자 행동 분석 및 성능 메트릭을 수집합니다.

## 🚀 Google Analytics 4 설정 방법

### 1. Google Analytics 계정 생성

1. [Google Analytics](https://analytics.google.com/) 접속
2. "측정 시작" 클릭
3. 계정 이름 입력 (예: "워킹홀리데이 가계부")
4. 데이터 공유 설정 선택 후 "다음"

### 2. 속성 (Property) 생성

1. 속성 이름 입력 (예: "Working Holiday Budget App")
2. 시간대 선택: "대한민국"
3. 통화 선택: "대한민국 원 (KRW)"
4. "다음" 클릭

### 3. 비즈니스 정보 입력

1. 업종: "기타"
2. 비즈니스 규모: 적절한 옵션 선택
3. Google Analytics 사용 목적 선택
4. "만들기" 클릭

### 4. 데이터 스트림 설정

1. "웹" 선택
2. 웹사이트 URL 입력
   - 개발: `http://localhost:5173`
   - 프로덕션: 실제 배포 URL (예: `https://your-app.vercel.app`)
3. 스트림 이름 입력 (예: "Web App")
4. "스트림 만들기" 클릭

### 5. Measurement ID 확인

1. 데이터 스트림 생성 후 표시되는 **측정 ID (Measurement ID)** 복사
2. 형식: `G-XXXXXXXXXX`

## 🔧 프로젝트에 Google Analytics 연동

### 1. 환경 변수 설정

`.env` 파일에 Measurement ID를 추가합니다:

```bash
# .env.example 파일을 .env로 복사
cp .env.example .env

# .env 파일 편집
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # 실제 Measurement ID로 교체
```

### 2. 배포 환경 설정

#### Vercel
1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
2. `VITE_GA_MEASUREMENT_ID` 추가
3. Value: `G-XXXXXXXXXX`
4. Production/Preview/Development 환경 선택
5. "Save" 클릭

#### Netlify
1. Netlify 대시보드 > Site Settings > Environment Variables
2. "Add a variable" 클릭
3. Key: `VITE_GA_MEASUREMENT_ID`
4. Value: `G-XXXXXXXXXX`
5. "Create variable" 클릭

#### Render
1. Render 대시보드 > 프로젝트 > Environment
2. "Add Environment Variable" 클릭
3. Key: `VITE_GA_MEASUREMENT_ID`
4. Value: `G-XXXXXXXXXX`
5. "Save Changes" 클릭

## 📈 추적되는 이벤트

### 거래 관련 이벤트
- **add_transaction**: 거래 추가 (수입/지출, 통화, 금액)
- **delete_transaction**: 거래 삭제

### 네비게이션 이벤트
- **view_summary**: 요약 보기
- **view_calendar**: 캘린더 보기
- **view_statistics**: 통계 보기
- **switch_mode**: 앱 모드 전환 (가계부 ↔ 초기비용 계산기)

### 통화 관련 이벤트
- **change_currency**: 통화 변경 (KRW/USD/JPY)
- **refresh_exchange_rate**: 환율 수동 갱신

### 인증 관련 이벤트
- **login**: 로그인 성공
- **login_attempt**: 로그인 시도 (실패 포함)
- **logout**: 로그아웃
- **signup**: 회원가입

### 캘린더 관련 이벤트
- **navigate_month**: 월 네비게이션 (이전/다음/오늘)
- **select_date**: 날짜 선택
- **view_day_detail**: 일일 상세 정보 모달 열기

### 통계 관련 이벤트
- **change_period**: 통계 기간 변경 (1개월/3개월/6개월/1년/전체)
- **view_chart**: 차트 조회 (월별/카테고리/요일별)

### 초기비용 계산기 이벤트
- **calculate_cost**: 초기비용 계산
- **change_region**: 지역 변경 (도쿄/오사카)

## 🔍 Google Analytics 대시보드 확인

### 실시간 데이터 확인
1. Google Analytics > 보고서 > 실시간
2. 현재 활성 사용자 및 이벤트 확인

### 이벤트 보고서
1. Google Analytics > 보고서 > 참여도 > 이벤트
2. 이벤트 이름별 발생 횟수 및 사용자 수 확인

### 맞춤 보고서 생성
1. Google Analytics > 탐색 > 새 탐색 만들기
2. "자유 형식" 선택
3. 측정기준: 이벤트 이름, 이벤트 매개변수
4. 측정항목: 이벤트 수, 사용자 수, 세션 수

## 🛠 디버깅 모드

개발 환경에서는 자동으로 디버그 모드가 활성화됩니다.

### 브라우저 콘솔에서 확인
```javascript
// 초기화 확인
✅ Google Analytics 초기화 완료: G-XXXXXXXXXX

// 이벤트 추적 확인
📊 GA 이벤트: {
  category: "Transaction",
  action: "add_transaction",
  label: "expense_KRW",
  value: 10000,
  transaction_type: "expense",
  currency: "KRW"
}

// 페이지뷰 확인
📄 GA 페이지뷰: { page_path: "/", title: "워킹홀리데이 가계부" }
```

### Chrome 확장 프로그램
[Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) 설치하여 더 상세한 디버깅 가능

## ⚙️ 고급 설정

### 사용자 속성 설정
```typescript
import { useAnalyticsEvent } from './hooks/useAnalyticsEvent';

const { setUser } = useAnalyticsEvent();

// 로그인 시 사용자 ID 설정
setUser(user.id, {
  subscription_plan: 'free',
  user_role: 'standard',
});
```

### 커스텀 이벤트 추가
```typescript
import { useAnalytics } from './contexts/AnalyticsContext';

const { trackEvent } = useAnalytics();

trackEvent({
  category: 'CustomFeature',
  action: 'custom_action',
  label: 'custom_label',
  value: 100,
  custom_param: 'custom_value',
});
```

## 📊 권장 대시보드 구성

### 1. 사용자 참여 대시보드
- 일일 활성 사용자 (DAU)
- 월간 활성 사용자 (MAU)
- 평균 세션 시간
- 이탈률

### 2. 거래 활동 대시보드
- 일일 거래 추가 건수
- 수입 vs 지출 비율
- 평균 거래 금액
- 통화별 거래 분포

### 3. 기능 사용 대시보드
- 뷰 모드 전환 빈도
- 캘린더 vs 요약 vs 통계 사용 비율
- 가계부 vs 초기비용 계산기 사용 비율
- 통화 변경 빈도

## 🔒 개인정보 보호

### GDPR 준수
- Google Analytics는 IP 익명화 자동 적용 (GA4 기본 설정)
- 개인 식별 정보(PII) 전송 금지
- 사용자 ID는 해시된 값 사용 권장

### 쿠키 정책
- Google Analytics는 쿠키를 사용하여 사용자 추적
- 개인정보처리방침에 명시 필요
- EU 사용자 대상 시 쿠키 동의 팝업 구현 권장

## 📝 문제 해결

### 이벤트가 수집되지 않는 경우
1. `.env` 파일에 `VITE_GA_MEASUREMENT_ID`가 올바르게 설정되었는지 확인
2. 개발 서버 재시작 (`npm run dev`)
3. 브라우저 콘솔에서 "✅ Google Analytics 초기화 완료" 메시지 확인
4. 브라우저 확장 프로그램(광고 차단기)이 GA를 차단하지 않는지 확인

### 실시간 데이터가 표시되지 않는 경우
- Google Analytics 실시간 보고서는 최대 60초 지연 가능
- 브라우저 시크릿 모드에서 테스트해보기
- 개발 환경 테스트 모드가 활성화되어 있는지 확인

### 프로덕션 배포 시 주의사항
- 환경 변수가 배포 플랫폼에 올바르게 설정되었는지 확인
- 빌드 시 환경 변수가 포함되는지 확인 (`npm run build`)
- 프로덕션 빌드에서는 디버그 로그가 표시되지 않음

## 🔗 참고 자료

- [Google Analytics 4 공식 문서](https://support.google.com/analytics/answer/10089681)
- [React-GA4 GitHub](https://github.com/codler/react-ga4)
- [GA4 이벤트 측정 가이드](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 맞춤 측정기준 및 측정항목](https://support.google.com/analytics/answer/10075209)

---

## ✅ 체크리스트

프로젝트에 Google Analytics를 성공적으로 연동하려면:

- [ ] Google Analytics 4 계정 생성
- [ ] 웹 데이터 스트림 설정
- [ ] Measurement ID 확인
- [ ] `.env` 파일에 `VITE_GA_MEASUREMENT_ID` 추가
- [ ] 배포 환경에 환경 변수 설정
- [ ] 개발 서버 재시작 및 테스트
- [ ] Google Analytics 실시간 보고서에서 이벤트 확인
- [ ] 개인정보처리방침에 Google Analytics 사용 명시
