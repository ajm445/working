# Open Graph 이미지 제작 가이드

## 📐 이미지 사양

### 권장 크기
- **Open Graph (Facebook, LinkedIn)**: 1200 x 630px
- **Twitter Card**: 1200 x 630px (Large Image Summary)
- **파일 형식**: JPG 또는 PNG
- **최대 파일 크기**: 8MB 이하 (권장: 300KB 이하)
- **종횡비**: 1.91:1

### 안전 영역
- **중앙 핵심 콘텐츠 영역**: 1200 x 600px (상하 15px 여백)
- **텍스트 안전 영역**: 1000 x 500px (모바일에서도 잘림 없이 표시)

---

## 🎨 디자인 가이드라인

### 1. 배경색
```css
/* 권장 배경색 (프로젝트 테마) */
배경 1: #3b82f6 (파란색 - 메인 컬러)
배경 2: #f3f4f6 (연한 회색 - 깔끔한 느낌)
배경 3: gradient(#3b82f6 → #2563eb) - 그라데이션
```

### 2. 포함할 요소
- **제목**: "일본 워킹홀리데이 가계부" (크고 명확하게)
- **부제**: "Japan Working Holiday Budget Tracker"
- **주요 기능**:
  - 💰 수입/지출 관리
  - 💱 실시간 환율 변환
  - 📊 통계 분석
  - 🗾 도쿄/오사카 초기비용 계산
- **앱 스크린샷**: 대시보드 또는 캘린더 뷰 (선택사항)
- **로고/아이콘**: 일본 국기 또는 엔화 아이콘

### 3. 타이포그래피
- **제목 폰트**:
  - 한글: Pretendard, Noto Sans KR (굵게 700-900)
  - 영문: Inter, Roboto (굵게 700-900)
- **본문 폰트**:
  - 한글: Pretendard, Noto Sans KR (보통 400-600)
  - 영문: Inter, Roboto (보통 400-600)
- **제목 크기**: 72-96px
- **부제 크기**: 36-48px
- **본문 크기**: 24-32px

### 4. 색상 팔레트
```css
/* 프로젝트 메인 컬러 */
Primary: #3b82f6 (파란색)
Secondary: #10b981 (녹색 - 수입)
Accent: #ef4444 (빨간색 - 지출)
Background: #f3f4f6 (연한 회색)
Text: #1f2937 (진한 회색)
White: #ffffff
```

---

## 🛠️ 제작 도구

### 1. 온라인 디자인 도구 (무료)
- **Canva** (https://www.canva.com/)
  - 템플릿: "Social Media" → "Facebook Post" 1200x630 선택
  - 요소 추가: 텍스트, 아이콘, 도형 등
  - 다운로드: PNG 또는 JPG

- **Figma** (https://www.figma.com/)
  - 새 프레임: 1200 x 630px
  - 디자인 후 Export → PNG/JPG

- **Adobe Express** (무료 버전)
  - 템플릿 선택 후 커스터마이징

### 2. 로컬 디자인 도구
- **Photoshop** (유료)
- **GIMP** (무료 대안)
- **Affinity Designer** (유료, 저렴)

### 3. 스크린샷 도구
- **Chrome DevTools**: F12 → Device Toolbar (Ctrl+Shift+M) → 스크린샷
- **Responsively App**: 반응형 스크린샷 도구
- **Windows**: Win + Shift + S
- **Mac**: Cmd + Shift + 4

---

## 📝 디자인 템플릿 예시

### 템플릿 1: 심플 & 모던
```
┌────────────────────────────────────────────────┐
│                                                │
│     일본 워킹홀리데이 가계부                      │
│     Japan Working Holiday Budget Tracker       │
│                                                │
│     💰 수입/지출 관리                           │
│     💱 실시간 환율 변환 (KRW/USD/JPY)            │
│     📊 통계 분석                                │
│     🗾 도쿄/오사카 초기비용 계산                  │
│                                                │
│     [앱 스크린샷 또는 아이콘]                     │
│                                                │
└────────────────────────────────────────────────┘
```

### 템플릿 2: 스크린샷 중심
```
┌────────────────────────────────────────────────┐
│  [앱 스크린샷 - 대시보드 또는 캘린더]           │
│                                                │
│  일본 워킹홀리데이 가계부                        │
│  실시간 환율 변환 | 통계 분석 | 초기비용 계산     │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🚀 제작 단계

### 1단계: Canva에서 빠르게 만들기 (추천)
1. Canva 로그인 (무료 계정)
2. "디자인 만들기" → "사용자 지정 크기" → 1200 x 630px
3. 배경색 설정: #3b82f6 또는 그라데이션
4. 텍스트 추가:
   - 제목: "일본 워킹홀리데이 가계부" (72px, 굵게, 흰색)
   - 부제: "Japan Working Holiday Budget Tracker" (36px, 보통, 흰색 80%)
   - 기능: 아이콘과 함께 나열 (28px, 흰색)
5. 아이콘 추가: 💰 💱 📊 🗾 (Canva의 "요소" → "이모지")
6. (선택) 앱 스크린샷 추가: "업로드" → 이미지 끌어다 놓기
7. 다운로드: PNG (권장) 또는 JPG

### 2단계: 파일 저장
- 파일명: `og-image.jpg` 또는 `og-image.png`
- 저장 위치: `public/og-image.jpg`

### 3단계: 최적화 (선택사항)
- **TinyPNG** (https://tinypng.com/): 파일 크기 압축 (무료)
- **ImageOptim** (Mac): 로컬 이미지 최적화
- **Squoosh** (https://squoosh.app/): 브라우저에서 압축

---

## ✅ 이미지 테스트

### 1. Open Graph 테스트
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
  - URL 입력 → "디버그" 클릭
  - 이미지 미리보기 확인

- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
  - URL 입력 → 미리보기 확인

### 2. Twitter Card 테스트
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
  - URL 입력 → "Preview card" 클릭

### 3. 일반 미리보기 테스트
- **Open Graph Check**: https://opengraphcheck.com/
- **Meta Tags**: https://metatags.io/

---

## 📋 체크리스트

완료 후 확인사항:
- [ ] 이미지 크기: 1200 x 630px
- [ ] 파일 크기: 300KB 이하
- [ ] 파일 위치: `public/og-image.jpg` 또는 `public/og-image.png`
- [ ] `index.html`의 OG 이미지 URL 업데이트:
  ```html
  <meta property="og:image" content="https://your-domain.com/og-image.jpg" />
  <meta name="twitter:image" content="https://your-domain.com/og-image.jpg" />
  ```
- [ ] 배포 후 Facebook Debugger로 테스트
- [ ] 배포 후 Twitter Card Validator로 테스트

---

## 💡 팁

1. **배포 전 로컬 테스트**
   - 로컬에서 `public/og-image.jpg` 파일 확인
   - `http://localhost:5173/og-image.jpg`로 접근 가능 확인

2. **캐시 문제 해결**
   - Facebook/Twitter 캐시: 디버거에서 "Fetch new information" 클릭
   - 브라우저 캐시: Ctrl+Shift+R (강제 새로고침)

3. **다국어 이미지**
   - 한국어 버전: `og-image-ko.jpg`
   - 영어 버전: `og-image-en.jpg`
   - 일본어 버전: `og-image-ja.jpg` (향후)

4. **A/B 테스트**
   - 여러 디자인 만들어보고 가장 클릭율 높은 것 선택
   - 색상, 레이아웃, 텍스트 크기 등 실험

---

## 📚 참고 자료

- Open Graph 프로토콜: https://ogp.me/
- Twitter Card 문서: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- 이미지 최적화 가이드: https://web.dev/fast/#optimize-your-images
- OG 이미지 모범 사례: https://www.opengraph.xyz/

---

**제작 후 이미지를 `public/og-image.jpg`에 저장하고, `index.html`의 URL을 실제 도메인으로 업데이트하세요!**
