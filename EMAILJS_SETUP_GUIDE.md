# 📧 문의하기 기능 EmailJS 설정 가이드 (환경변수 방식)

이 가이드는 헤더의 "문의하기" 버튼이 정상적으로 작동하도록 EmailJS를 환경변수 방식으로 설정하는 방법을 안내합니다.

---

## 🎯 개요

- **기능**: 헤더 오른쪽의 "문의하기" 배지 버튼 (모바일: 햄버거 메뉴 내)
- **동작**: 데스크톱에서는 드롭다운, 모바일에서는 모달로 표시
- **입력 필드**: 이름, 전화번호, 문의 내용 (최대 100자)
- **이메일 수신**: `phyun7007@gmail.com`
- **무료 서비스**: EmailJS (월 200개 이메일 무료)
- **보안**: 환경변수(.env)로 관리, 운영 배포 안전

---

## 📋 설정 단계

### 1단계: EmailJS 계정 생성

1. [EmailJS 웹사이트](https://www.emailjs.com/)에 접속
2. **Sign Up** 클릭하여 무료 계정 생성
3. 이메일 인증 완료

---

### 2단계: Email Service 추가

1. EmailJS 대시보드에서 **Email Services** 메뉴 클릭
2. **Add New Service** 버튼 클릭
3. Gmail 선택 (또는 원하는 이메일 서비스)
4. Gmail 계정(`phyun7007@gmail.com`)으로 로그인 및 권한 부여
5. Service Name 입력 (예: `doteline_contact`)
6. **Create Service** 클릭
7. **Service ID** 복사 (예: `service_abc123`)

---

### 3단계: Email Template 생성

1. EmailJS 대시보드에서 **Email Templates** 메뉴 클릭
2. **Create New Template** 버튼 클릭
3. 아래 템플릿 설정 입력:

#### Template 설정:

**Template Name**: `Contact Form Template`

**Subject (제목)**:
```
[도트라인 문의] {{from_name}}님의 문의
```

**Content (본문)**:
```html
안녕하세요,

도트라인 웹사이트를 통해 새로운 문의가 접수되었습니다.

====================================
고객 정보
====================================
이름: {{from_name}}
전화번호: {{from_phone}}

====================================
문의 내용
====================================
{{message}}

====================================

이 이메일은 도트라인 웹사이트(doteline.co.kr)의 문의하기 폼을 통해 자동 생성되었습니다.
```

4. **Save** 클릭
5. **Template ID** 복사 (예: `template_xyz789`)

**중요**: Template Parameters에 다음 변수들이 있는지 확인:
- `from_name`
- `from_phone`
- `message`
- `to_email`

---

### 4단계: Public Key 확인

1. EmailJS 대시보드에서 **Account** 메뉴 클릭
2. **API Keys** 섹션에서 **Public Key** 복사
3. **현재 설정된 Public Key**: `N3fYWeog38GMxACR4`

---

### 5단계: .env 파일에 환경변수 설정 ⭐

**파일 위치**: `D:\doteline_web\.env`

다음 값들을 입력하세요:

```env
# EmailJS 설정
EMAILJS_PUBLIC_KEY=N3fYWeog38GMxACR4
EMAILJS_SERVICE_ID=service_abc123      # 2단계에서 복사한 Service ID로 변경
EMAILJS_TEMPLATE_ID=template_xyz789    # 3단계에서 복사한 Template ID로 변경
```

**주의사항**:
- 따옴표 없이 입력
- 값 사이에 공백 없이 입력
- .env 파일은 절대 Git에 커밋하지 말 것 (.gitignore에 추가됨)

---

### 6단계: 서버 재시작

환경변수를 수정했으므로 서버를 재시작해야 합니다:

```bash
# 기존 서버 중지 (Ctrl + C)
# 서버 재시작
npm start
```

또는 PM2를 사용하는 경우:
```bash
pm2 restart doteline
```

---

## ✅ 작동 원리

### 환경변수 주입 시스템

1. **서버 시작 시**: `server/server.js`에서 `.env` 파일 로드
2. **HTML 요청 시**: `server/routes/index.js`에서 HTML 파일을 읽고 환경변수 치환
3. **플레이스홀더**: `{{EMAILJS_PUBLIC_KEY}}` → 실제 값으로 대체
4. **브라우저**: `window.EMAILJS_CONFIG`로 접근 가능
5. **전송**: `Header.js`에서 `window.EMAILJS_CONFIG` 사용

### 코드 구조

**HTML 파일** (자동 처리됨):
```html
<script>
  window.EMAILJS_CONFIG = {
    PUBLIC_KEY: '{{EMAILJS_PUBLIC_KEY}}',      // 서버가 자동으로 치환
    SERVICE_ID: '{{EMAILJS_SERVICE_ID}}',      // 서버가 자동으로 치환
    TEMPLATE_ID: '{{EMAILJS_TEMPLATE_ID}}'     // 서버가 자동으로 치환
  };
</script>
```

**Header.js** (이미 설정됨):
```javascript
async function sendEmailViaEmailJS(name, phone, message) {
  const SERVICE_ID = window.EMAILJS_CONFIG?.SERVICE_ID;
  const TEMPLATE_ID = window.EMAILJS_CONFIG?.TEMPLATE_ID;
  const PUBLIC_KEY = window.EMAILJS_CONFIG?.PUBLIC_KEY;
  // ... 이메일 전송 로직
}
```

---

## ✅ 테스트

1. 서버 실행 확인:
   ```bash
   npm start
   ```

2. 브라우저에서 웹사이트 열기: `http://localhost:8001` 또는 `http://doteline.co.kr`

3. 브라우저 개발자 도구(F12) → Console에서 확인:
   ```javascript
   console.log(window.EMAILJS_CONFIG);
   // 출력: {PUBLIC_KEY: "N3fYWeog38GMxACR4", SERVICE_ID: "service_...", TEMPLATE_ID: "template_..."}
   ```

4. 헤더의 "문의하기" 버튼 클릭

5. 폼 작성:
   - 이름: `테스트`
   - 전화번호: `010-1234-5678`
   - 문의 내용: `테스트 문의입니다.`

6. "전송하기" 버튼 클릭

7. "문의가 성공적으로 전송되었습니다!" 메시지 확인

8. `phyun7007@gmail.com` 이메일 수신 확인

---

## 🔧 트러블슈팅

### 1. "EmailJS 환경변수가 설정되지 않았습니다" 오류

**원인**: .env 파일이 제대로 로드되지 않음

**해결방법**:
1. `.env` 파일 위치 확인: `D:\doteline_web\.env`
2. 환경변수가 올바르게 입력되었는지 확인
3. 서버 재시작: `npm start`
4. 브라우저 콘솔에서 확인: `console.log(window.EMAILJS_CONFIG)`

### 2. "전송 중 오류가 발생했습니다" 오류

**원인**: EmailJS Service ID 또는 Template ID가 잘못됨

**해결방법**:
1. EmailJS 대시보드에서 Service ID와 Template ID 재확인
2. `.env` 파일에 올바른 값 입력
3. 서버 재시작

### 3. 이메일이 수신되지 않음

**원인**: Template 설정 또는 변수명 오류

**해결방법**:
1. Gmail 스팸함 확인
2. EmailJS 대시보드 → **Logs** 메뉴에서 전송 기록 확인
3. Template Parameters 확인: `from_name`, `from_phone`, `message`
4. Template의 `to_email` 설정 확인

### 4. 플레이스홀더가 그대로 표시됨

**예**: `{{EMAILJS_PUBLIC_KEY}}`가 그대로 보임

**원인**: 서버 라우팅 문제

**해결방법**:
1. `server/routes/index.js`에서 해당 페이지 라우트가 `sendInjectedHtml`을 사용하는지 확인
2. 직접 정적 파일로 접근하지 않았는지 확인 (서버를 통해 접근해야 함)

### 5. 무료 한도 초과

**EmailJS 무료 플랜**: 월 200개 이메일

**해결방법**:
- EmailJS 대시보드에서 유료 플랜 업그레이드
- 또는 다른 서비스로 변경 (하단 참고)

---

## 🔒 보안 고려사항

### 환경변수 방식의 장점
✅ API 키가 코드에 하드코딩되지 않음
✅ Git에 커밋되지 않음 (.gitignore 처리)
✅ 개발/운영 환경별로 다른 키 사용 가능
✅ 외주 프로젝트 인수인계 시 안전

### Public Key vs Private Key
- **Public Key**: 클라이언트에 노출되어도 안전 (읽기 전용)
- **Service ID**: 공개 가능
- **Template ID**: 공개 가능
- **Private Key**: ⚠️ 절대 클라이언트에 노출하면 안 됨 (서버에서만 사용)

### .env 파일 보안
```bash
# .gitignore 확인 (이미 추가됨)
.env
.env.local
.env.production
```

---

## 📚 추가 정보

### EmailJS 무료 플랜 제한
- 월 200개 이메일
- 2개의 Email Service
- 무제한 Email Template
- Email 필터링 기능
- 기본 통계

### 대체 서비스
EmailJS 대신 사용할 수 있는 무료 서비스:
1. **Formspree** (https://formspree.io/) - 월 50개 폼 제출 무료
2. **Web3Forms** (https://web3forms.com/) - 월 250개 폼 제출 무료
3. **FormSubmit** (https://formsubmit.co/) - 무제한 무료
4. **SendGrid** (https://sendgrid.com/) - 월 100개 이메일 무료

---

## 📞 문의

설정 중 문제가 발생하면:
1. EmailJS 공식 문서: https://www.emailjs.com/docs/
2. EmailJS Support: support@emailjs.com
3. Node.js dotenv 문서: https://www.npmjs.com/package/dotenv

---

## 🎉 완료!

모든 설정이 완료되었습니다. 이제 "문의하기" 기능이 정상적으로 작동합니다! 🚀

**설정 완료 체크리스트**:
- ✅ EmailJS 계정 생성
- ✅ Email Service 생성 (Service ID 확보)
- ✅ Email Template 생성 (Template ID 확보)
- ✅ .env 파일에 환경변수 입력
- ✅ 서버 재시작
- ✅ 테스트 이메일 전송 확인
