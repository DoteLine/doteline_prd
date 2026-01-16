/**
 * 로깅 미들웨어
 * 메인페이지 접속 시 사용자 IP와 접속 정보를 날짜별 파일에 로깅
 */

const fs = require('fs');
const path = require('path');

// 로그 디렉토리 경로
const LOG_DIR = path.join(__dirname, '..', '..', 'logs');

// 마지막 로그 정리 시간 추적 (하루에 한 번만 실행)
let lastCleanupDate = null;

/**
 * logs 디렉토리가 없으면 생성
 */
function ensureLogDirectory() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

/**
 * 30일 이상 된 로그 파일 삭제 (운영 환경에서만 실행)
 * 매일 자정에 자동으로 정리
 */
function cleanOldLogs() {
    // 개발 환경에서는 실행하지 않음
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    try {
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000); // 30일 = 밀리초

        // logs 디렉토리의 모든 파일 읽기
        const files = fs.readdirSync(LOG_DIR);

        files.forEach(file => {
            const filePath = path.join(LOG_DIR, file);
            const stats = fs.statSync(filePath);

            // 파일이 30일 이상 되었으면 삭제
            if (stats.isFile() && stats.mtimeMs < thirtyDaysAgo) {
                fs.unlinkSync(filePath);
                console.log(`[로그 정리] 오래된 로그 파일 삭제: ${file}`);
            }
        });
    } catch (error) {
        console.error('로그 파일 정리 실패:', error.message);
    }
}

/**
 * 현재 날짜로 로그 파일명 생성
 * @returns {string} 로그 파일 경로 (예: logs/2026-01-10.log)
 */
function getLogFilePath() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const filename = `${year}-${month}-${day}.log`;
    return path.join(LOG_DIR, filename);
}

/**
 * 클라이언트 IP 주소 가져오기
 * 프록시 환경(카페24 등)을 고려하여 실제 IP를 추출
 * @param {Object} req - Express request 객체
 * @returns {string} 클라이언트 IP 주소
 */
function getClientIP(req) {
    // X-Forwarded-For 헤더 확인 (프록시/로드밸런서 환경)
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        // 여러 IP가 있을 경우 첫 번째가 실제 클라이언트 IP
        return forwarded.split(',')[0].trim();
    }

    // X-Real-IP 헤더 확인
    if (req.headers['x-real-ip']) {
        return req.headers['x-real-ip'];
    }

    // 기본 IP 주소
    return req.ip || req.connection.remoteAddress || '알 수 없음';
}

/**
 * 로그를 파일에 기록
 * @param {string} logMessage - 로그 메시지
 */
function writeLogToFile(logMessage) {
    try {
        ensureLogDirectory();
        const logFilePath = getLogFilePath();
        fs.appendFileSync(logFilePath, logMessage + '\n', 'utf8');
    } catch (error) {
        console.error('로그 파일 작성 실패:', error.message);
    }
}

/**
 * 요청 로깅 미들웨어
 * 메인페이지('/') 접속 시에만 로그 출력 및 파일 저장
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @param {Function} next - 다음 미들웨어로 이동
 */
function logger(req, res, next) {
    const method = req.method;
    const url = req.url;

    // GET 요청이면서 메인페이지('/') 접속인 경우에만 로그 출력
    if (method === 'GET' && url === '/') {
        const now = new Date();
        const timestamp = now.toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const clientIP = getClientIP(req);
        const userAgent = req.headers['user-agent'] || '알 수 없음';

        // 한 줄 형식의 로그 메시지
        const logMessage = `[${timestamp}] 메인페이지 접속 | IP: ${clientIP} | User-Agent: ${userAgent}`;

        // 콘솔 출력
        console.log(logMessage);

        // 파일에 저장
        writeLogToFile(logMessage);

        // 하루에 한 번만 오래된 로그 파일 정리 (운영 환경에서만)
        const today = now.toDateString();
        if (lastCleanupDate !== today) {
            lastCleanupDate = today;
            cleanOldLogs();
        }
    }

    // 정적 파일 및 기타 요청은 로그 출력 안 함
    next();
}

module.exports = logger;