/**
 * 라우팅 설정 - 모든 라우트를 정의하고 관리
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const ROOT_DIR = path.join(__dirname, '..', '..');

/**
 * HTML 파일을 읽어 환경변수를 주입하고 전송하는 공통 함수
 */
function sendInjectedHtml(res, filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('파일을 찾을 수 없습니다.');
        }

        let html = fs.readFileSync(filePath, 'utf-8');

        // 카카오 맵 API 키 (PROD 우선, 없으면 DEV)
        const kakaoKey = process.env.KAKAO_MAP_API_KEY_PROD || process.env.KAKAO_MAP_API_KEY_DEV || '';

        // EmailJS 환경변수
        const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY || '';
        const emailjsServiceId = process.env.EMAILJS_SERVICE_ID || '';
        const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID || '';

        // 환경변수 치환
        let renderedHtml = html.replace(/\{\{KAKAO_MAP_API_KEY\}\}/g, kakaoKey);
        renderedHtml = renderedHtml.replace(/\{\{EMAILJS_PUBLIC_KEY\}\}/g, emailjsPublicKey);
        renderedHtml = renderedHtml.replace(/\{\{EMAILJS_SERVICE_ID\}\}/g, emailjsServiceId);
        renderedHtml = renderedHtml.replace(/\{\{EMAILJS_TEMPLATE_ID\}\}/g, emailjsTemplateId);

        res.set('Content-Type', 'text/html');
        return res.send(renderedHtml);
    } catch (err) {
        console.error('[Router] ❌ HTML 주입 에러:', err);
        return res.status(500).send('서버 오류 발생');
    }
}

// ============================================
// 페이지 라우트 (가장 먼저 매칭됨)
// ============================================

// 1. 메인 페이지 진입점
router.get('/', (req, res) => {
    sendInjectedHtml(res, path.join(ROOT_DIR, 'public', 'index.html'));
});

// 2. 🔥 가장 중요한 부분: Main.html 요청을 정적 파일 서버보다 먼저 가로챔
router.get('/src/pages/Main/Main.html', (req, res) => {
    sendInjectedHtml(res, path.join(ROOT_DIR, 'src', 'pages', 'Main', 'Main.html'));
});

// 3. 기타 페이지들
router.get('/info', (req, res) => {
    sendInjectedHtml(res, path.join(ROOT_DIR, 'src', 'pages', 'CompanyInfo', 'CompanyInfo.html'));
});

router.get('/product', (req, res) => {
    sendInjectedHtml(res, path.join(ROOT_DIR, 'src', 'pages', 'Products', 'Products.html'));
});

/**
 * 제품 상세 페이지(productDetail)
 * Query String으로 제품 id전달 /ProductDetail?id=1
 */
router.get('/productDetail', (req, res) => {
    sendInjectedHtml(res, path.join(ROOT_DIR, 'src', 'pages', 'Products', 'ProductDetail.html'));
});

/**
 * 솔루션 소개 페이지 (/solution)
 */
router.get('/solution', (req, res) => {
    sendInjectedHtml(res, path.join(ROOT_DIR, 'src', 'pages', 'Solutions', 'SolutionsMain.html'));
});

module.exports = router;