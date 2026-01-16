const path = require('path');
const fs = require('fs');

function htmlEnvInjector(req, res, next) {
    // 1. 요청 경로 확인 (브라우저가 fetch('/src/pages/Main/Main.html') 하는 경로)
    // index.html 로딩도 대비하여 루트(/)와 Main.html을 모두 포함
    const isTarget = req.url.toLowerCase().includes('main.html') || req.url === '/';

    if (isTarget) {
        // 2. 실제 물리적 파일 경로 (Main.html 위치)
        const htmlPath = path.join(process.cwd(), 'src', 'pages', 'Main', 'Main.html');

        // 만약 루트(/) 요청이라면 index.html을 타겟팅
        const indexPath = path.join(process.cwd(), 'public', 'index.html');
        const targetPath = req.url === '/' ? indexPath : htmlPath;

        try {
            if (fs.existsSync(targetPath)) {
                let html = fs.readFileSync(targetPath, 'utf-8');

                // 3. API 키 가져오기
                const key = process.env.KAKAO_MAP_API_KEY_PROD || process.env.KAKAO_MAP_API_KEY_DEV || '';

                // 4. {{KAKAO_MAP_API_KEY}} 치환
                const renderedHtml = html.replace(/\{\{KAKAO_MAP_API_KEY\}\}/g, key);

                res.set('Content-Type', 'text/html');
                return res.send(renderedHtml);
            }
        } catch (err) {
            console.error('[HTML Injector] ❌ 에러 발생:', err);
        }
    }

    // 타겟이 아니거나 파일이 없으면 정적 파일 서버로 넘김
    next();
}

module.exports = htmlEnvInjector;