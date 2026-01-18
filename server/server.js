/**
 * DOTELINE 웹사이트 서버
 */
const express = require('express');
const path = require('path');
const { middleware: loggerMiddleware } = require('./middlewares/logger');

// ============================================
// 1. dotenv 설정 (최상단 배치)
// ============================================
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// ============================================
// 2. 환경 변수와 루트 디렉토리
// ============================================
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');

// 환경변수 로드 확인 (디버깅 - 개발 환경에서만)
if (process.env.NODE_ENV !== 'production') {
    console.log('========================================');
    console.log('환경변수 로드 확인:');
    console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('  PORT:', PORT);
    console.log('  KAKAO_MAP_API_KEY:', process.env.KAKAO_MAP_API_KEY ? 'OK' : 'MISSING');
    console.log('  EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY ? 'OK' : 'MISSING');
    console.log('  EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID ? 'OK' : 'MISSING');
    console.log('  EMAILJS_TEMPLATE_ID:', process.env.EMAILJS_TEMPLATE_ID ? 'OK' : 'MISSING');
    console.log('========================================');
}

// ============================================
// 3. 미들웨어 및 라우트 순서 (중요!)
// ============================================

// 로깅 미들웨어
app.use(loggerMiddleware);

// JSON, URL 인코딩 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// [핵심] 라우터 설정을 정적 파일 설정보다 '위'로 올립니다.
// 그래야 /src/pages/Main/Main.html 요청을 라우터가 먼저 낚아채서 키를 주입합니다.
const routes = require('./routes');
app.use('/', routes);

// [정적 파일] 라우터에서 처리되지 않은 나머지(이미지, CSS, JS 파일들)를 처리
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
    console.log('  DOTELINE 웹서버가 시작되었습니다!');
    console.log('========================================');
    console.log(`  🌐 접속 도메인: http://${process.env.DOMAIN || 'localhost'}`);
    console.log(`  🚀 실행 포트: ${PORT}`);
    console.log(`  📁 루트 디렉토리: ${ROOT_DIR}`);
    console.log(`  ⏰ 시작 시간: ${new Date().toLocaleString('ko-KR')}`);
    console.log('========================================\n');
});

module.exports = app;