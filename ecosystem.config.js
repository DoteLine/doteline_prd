/**
 * PM2 설정 파일 (카페24 호스팅용)
 *
 * 카페24에서 Node.js 애플리케이션을 PM2로 실행하기 위한 설정입니다.
 * PM2는 Node.js 프로세스 관리자로, 애플리케이션의 안정적인 운영을 돕습니다.
 */

module.exports = {
  apps: [{
    // 앱 이름
    name: 'doteline-web',

    // 실행할 메인 파일 (카페24 기본 파일명: web.js)
    script: './web.js',

    // 인스턴스 개수 (1로 설정 - 카페24 환경에 맞춤)
    instances: 1,

    // 실행 모드 (fork 모드 사용)
    exec_mode: 'fork',

    // 파일 변경 감지 (프로덕션에서는 false)
    watch: false,

    // 최대 메모리 제한 (512MB - 카페24 자이언트 플랜)
    max_memory_restart: '512M',

    // 환경 변수 설정
    env: {
      NODE_ENV: 'production',
      PORT: 8001
    },

    // 로그 설정
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

    // 자동 재시작 설정
    autorestart: true,

    // 최대 재시작 시도 횟수
    max_restarts: 10,

    // 재시작 간격 (밀리초)
    min_uptime: '10s',

    // 크래시 후 재시작 지연 시간
    restart_delay: 4000
  }]
};
