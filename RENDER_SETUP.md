# Render 배포 설정 가이드

## Static Site로 생성한 경우:

1. **Build Command**: `npm install && npm run build`
2. **Publish Directory**: `dist`
3. **Auto-Deploy**: Yes (main 브랜치)

### Redirects/Rewrites 설정:
- **Source**: `/*`
- **Destination**: `/index.html`
- **Action**: Rewrite

---

## Web Service로 생성한 경우 (권장하지 않음):

1. **Start Command**: `npx serve -s dist -l $PORT`
2. **Build Command**: `npm install && npm run build`

하지만 **Static Site로 다시 생성하는 것을 권장**합니다.

---

## 문제 해결 체크리스트:

- [ ] Render 서비스 타입이 "Static Site"인지 확인
- [ ] Build Command가 `npm install && npm run build`인지 확인
- [ ] Publish Directory가 `dist`인지 확인
- [ ] Redirects/Rewrites 규칙이 추가되었는지 확인
- [ ] render.yaml 파일이 커밋되었는지 확인
- [ ] dist/_redirects 파일이 있는지 확인

---

## 테스트:

배포 후 다음 URL에 직접 접근해보세요:
- https://your-app.onrender.com/terms
- https://your-app.onrender.com/privacy

404가 아닌 해당 페이지가 나와야 합니다.
