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

/**
 * 작업 과정 페이지 (/work-process)
 */
router.get('/work-process', (req, res) => {
    sendInjectedHtml(res, path.join(ROOT_DIR, 'src', 'pages', 'WorkProcess', 'WorkProcess.html'));
});

// ============================================
// API 라우트
// ============================================

/**
 * 이메일 전송 API (서버 사이드 프록시)
 * 클라이언트에 EmailJS 키값을 노출하지 않고 서버에서 직접 전송
 */
router.post('/api/send-email', async (req, res) => {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
        return res.status(400).json({ success: false, error: '모든 필드를 입력해주세요.' });
    }

    const serviceID = (process.env.EMAILJS_SERVICE_ID || '').trim();
    const templateID = (process.env.EMAILJS_TEMPLATE_ID || '').trim();
    const publicKey = (process.env.EMAILJS_PUBLIC_KEY || '').trim();
    const privateKey = (process.env.EMAILJS_PRIVATE_KEY || '').trim();

    if (!serviceID || !templateID || !publicKey || !privateKey) {
        console.error('[Email API] EmailJS 환경변수가 설정되지 않았습니다.');
        return res.status(500).json({ success: false, error: '이메일 서비스가 설정되지 않았습니다.' });
    }

    try {
        const origin = process.env.BASE_URL || 'https://doteline.co.kr';
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': origin,
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                service_id: serviceID,
                template_id: templateID,
                user_id: publicKey,
                accessToken: privateKey,
                template_params: {
                    from_name: name,
                    from_phone: phone,
                    message: message,
                    to_email: 'phyun7007@gmail.com'
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`EmailJS 응답 오류: ${response.status} - ${errorText}`);
        }

        logEvent(req, '문의 메일 전송 성공');
        res.json({ success: true });
    } catch (error) {
        console.error('[Email API] 전송 실패:', error.message);
        logEvent(req, `문의 메일 전송 실패: ${error.message}`);
        res.status(500).json({ success: false, error: '이메일 전송에 실패했습니다.' });
    }
});

module.exports = router;