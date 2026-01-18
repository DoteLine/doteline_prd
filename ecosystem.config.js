/**
 * PM2 설정 파일 (프로덕션 환경)
 *
 * PM2는 Node.js 프로세스 관리자로, 애플리케이션의 안정적인 운영을 돕습니다.
 * AWS, VPS, Docker 등 다양한 환경에서 사용 가능합니다.
 *
 * 사용법:
 *   개발 환경: pm2 start ecosystem.config.js --env development
 *   프로덕션: pm2 start ecosystem.config.js --env production
 */

module.exports = {
  apps: [{
    // 앱 이름
    name: 'doteline-web',

    // 실행할 메인 파일
    script: './app.js',

    // 인스턴스 개수 (CPU 코어 수에 맞춰 자동 설정, 단일 서버는 'max' 또는 숫자)
    instances: process.env.PM2_INSTANCES || 'max',

    // 실행 모드 (cluster: 멀티 프로세스, fork: 단일 프로세스)
    exec_mode: 'cluster',

    // 파일 변경 감지 (프로덕션에서는 false)
    watch: false,

    // 감시에서 제외할 경로
    ignore_watch: ['node_modules', 'logs', '.git'],

    // 최대 메모리 제한 (메모리 누수 방지)
    max_memory_restart: '1G',

    // 개발 환경 변수
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    },

    // 프로덕션 환경 변수
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },

    // 로그 설정 (절대 경로 사용)
    error_file: '/home/ubuntu/apps/doteline/logs/error.log',
    out_file: '/home/ubuntu/apps/doteline/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,

    // 자동 재시작 설정
    autorestart: true,

    // 최대 재시작 시도 횟수
    max_restarts: 10,

    // 최소 실행 시간 (이 시간 이전에 종료되면 불안정한 것으로 간주)
    min_uptime: '10s',

    // 크래시 후 재시작 지연 시간
    restart_delay: 4000,

    // 종료 시그널 대기 시간 (graceful shutdown)
    kill_timeout: 5000,

    // 프로세스 종료 시 SIGINT 대신 SIGTERM 사용
    listen_timeout: 3000,

    // 소스맵 지원
    source_map_support: true
  }]
};
