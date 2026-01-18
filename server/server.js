/**
 * DOTELINE 웹사이트 서버
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const { middleware: loggerMiddleware } = require('./middlewares/logger');

// ============================================
// 1. dotenv 설정 (주입식/설정파일 방식)
// ============================================
const dotenv = require('dotenv');

// 현재 파일(server.js) 위치를 기준으로 상위 폴더의 .env를 명확히 지칭합니다.
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const app = express();

// ============================================
// 2. 환경 변수 로드 확인 (디버깅용 로그)
// ============================================
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');

console.log('========================================');
console.log('  [환경변수 로드 상태 확인]');
console.log('  설정파일 경로:', envPath);
console.log('  EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY || '❌ 로드 실패');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('========================================');

// ============================================
// 3. 미들웨어 및 라우트 순서
// ============================================

// 로깅 미들웨어
app.use(loggerMiddleware);

// JSON 및 URL 인코딩 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** * [핵심] 정적 파일 설정보다 라우터를 위에 배치합니다.
 * routes/index.js에서 HTML 내 {{변수}}를 환경변수로 치환해줍니다.
 */
const routes = require('./routes');
app.use('/', routes);

// 정적 파일 서비스 (CSS, JS, 이미지 등)
app.use('/src', express.static(path.join(ROOT_DIR, 'src')));
app.use('/resources', express.static(path.join(ROOT_DIR, 'resources')));
app.use(express.static(path.join(ROOT_DIR, 'public')));

// ============================================
// 4. 에러 핸들링
// ============================================
app.use((err, req, res, next) => {
    console.error('서버 에러:', err.stack);
    res.status(200).sendFile(path.join(ROOT_DIR, 'src', 'pages', 'Error', 'Error500.html'));
});

// ============================================
// 5. 서버 시작
// ============================================
app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('  DOTELINE 웹서버가 정상 가동 중입니다.');
    console.log('========================================');
    console.log(`  🌐 도메인: http://${process.env.DOMAIN || 'localhost'}`);
    console.log(`  🚀 포트: ${PORT}`);
    console.log(`  📁 경로: ${ROOT_DIR}`);
    console.log(`  ⏰ 시간: ${new Date().toLocaleString('ko-KR')}`);
    console.log('========================================\n');
});

module.exports = app;