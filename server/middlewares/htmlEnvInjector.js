/**
 * HTML 환경변수 주입 미들웨어
 *
 * HTML 파일 내의 {{ENV_VAR}} 패턴을 환경변수 값으로 치환합니다.
 * 라우터에서 처리하지 않는 HTML 파일 요청을 처리합니다.
 */
const path = require('path');
const fs = require('fs');

/**
 * 환경변수 맵핑 정의
 * 카카오 맵 API 키는 NODE_ENV에 따라 개발용/운영용이 자동 선택됩니다.
 */
const ENV_MAPPINGS = {
    KAKAO_MAP_API_KEY: () => {
        const isProduction = process.env.NODE_ENV === 'production';
        return isProduction
            ? (process.env.KAKAO_MAP_API_KEY_PROD || '')
            : (process.env.KAKAO_MAP_API_KEY_DEV || '');
    },
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
 * HTML 내 환경변수 치환 함수
 */
function injectEnvVars(html) {
    Object.keys(ENV_MAPPINGS).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        html = html.replace(regex, ENV_MAPPINGS[key]());
    });
    return html;
}

function htmlEnvInjector(req, res, next) {
    // HTML 파일 요청 확인
    const isHtmlRequest = req.url.toLowerCase().endsWith('.html') || req.url === '/';

    if (isHtmlRequest) {
        let targetPath;

        if (req.url === '/') {
            targetPath = path.join(process.cwd(), 'public', 'index.html');
        } else {
            targetPath = path.join(process.cwd(), req.url);
        }

        try {
            if (fs.existsSync(targetPath)) {
                let html = fs.readFileSync(targetPath, 'utf-8');
                const renderedHtml = injectEnvVars(html);

                res.set('Content-Type', 'text/html');
                return res.send(renderedHtml);
            }
        } catch (err) {
            console.error('[HTML Injector] 에러 발생:', err);
        }
    }

    next();
}

module.exports = htmlEnvInjector;