/**
 * 라우팅 설정 - 모든 라우트를 정의하고 관리
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { logEvent } = require('../middlewares/logger');

const ROOT_DIR = path.join(__dirname, '..', '..');

/**
 * 환경변수 맵핑 정의
 * HTML 템플릿의 {{VAR_NAME}} 패턴을 환경변수로 치환
 */
const ENV_MAPPINGS = {
    KAKAO_MAP_API_KEY: () => process.env.KAKAO_MAP_API_KEY || '',
    EMAILJS_PUBLIC_KEY: () => process.env.EMAILJS_PUBLIC_KEY || '',
    EMAILJS_SERVICE_ID: () => process.env.EMAILJS_SERVICE_ID || '',
    EMAILJS_TEMPLATE_ID: () => process.env.EMAILJS_TEMPLATE_ID || '',
    SITE_NAME: () => process.env.SITE_NAME || 'DOTELINE',
    SITE_DESCRIPTION: () => process.env.SITE_DESCRIPTION || '',
    SITE_KEYWORDS: () => process.env.SITE_KEYWORDS || '',
    BASE_URL: () => process.env.BASE_URL || '',
    DOMAIN: () => process.env.DOMAIN || 'localhost'
};

/**
 * HTML 파일을 읽어 환경변수를 주입하고 전송하는 공통 함수
 */
function sendInjectedHtml(res, filePath) {
    try {
        let html = fs.readFileSync(filePath, 'utf-8');

        Object.keys(ENV_MAPPINGS).forEach(key => {
            const val = ENV_MAPPINGS[key]();

            console.log(`[치환로그] ${key} -> ${val}`);

            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            html = html.replace(regex, val);
        });

        res.set('Content-Type', 'text/html');
        return res.send(html);
    } catch (err) {
        console.error('[Router] HTML 주입 에러:', err);
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

// ============================================
// API 라우트
// ============================================

/**
 * 이메일 전송 로그 기록 API
 */
router.post('/api/log/email', (req, res) => {
    const { status, error } = req.body;
    
    if (status === 'success') {
        logEvent(req, '문의 메일 전송 성공');
    } else {
        logEvent(req, `문의 메일 전송 실패: ${error || '알 수 없는 오류'}`);
    }
    
    res.json({ success: true });
});

module.exports = router;