#!/bin/bash
# ============================================
# DOTELINE 배포 스크립트 (No-Docker)
#
# 사용법:
#   ./deploy.sh           # 일반 배포
#   ./deploy.sh --restart # 전체 재시작
# ============================================

set -e  # 에러 발생 시 즉시 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 변수 설정
APP_NAME="doteline-web"
APP_DIR="/home/ubuntu/apps/doteline"
CURRENT_DIR="$APP_DIR/current"
LOG_DIR="$APP_DIR/logs"

# 함수: 로그 출력
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 함수: 구분선
print_separator() {
    echo "=========================================="
}

# 시작
print_separator
echo -e "${GREEN}DOTELINE 배포 시작${NC}"
echo "시간: $(date '+%Y-%m-%d %H:%M:%S')"
print_separator

# 1. 디렉토리 이동
log_info "프로젝트 디렉토리로 이동..."
if [ ! -d "$CURRENT_DIR" ]; then
    log_error "프로젝트 디렉토리가 없습니다: $CURRENT_DIR"
    exit 1
fi
cd "$CURRENT_DIR"
log_success "디렉토리 이동 완료"

# 2. Git pull (Git 저장소인 경우)
if [ -d ".git" ]; then
    log_info "최신 코드 가져오기 (git pull)..."
    git pull origin main
    log_success "코드 업데이트 완료"
else
    log_warning "Git 저장소가 아닙니다. 코드 업데이트 스킵"
fi

# 3. 패키지 설치 (package-lock.json이 변경된 경우만)
log_info "패키지 설치 중..."
npm ci --only=production --silent
log_success "패키지 설치 완료"

# 4. logs 디렉토리 확인
if [ ! -L "$CURRENT_DIR/logs" ]; then
    log_info "logs 디렉토리 연결..."
    rm -rf "$CURRENT_DIR/logs" 2>/dev/null || true
    ln -sf "$LOG_DIR" "$CURRENT_DIR/logs"
    log_success "logs 디렉토리 연결 완료"
fi

# 5. PM2 상태 확인 및 재시작
log_info "서비스 재시작 중..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    if [ "$1" == "--restart" ]; then
        log_info "전체 재시작 모드..."
        pm2 restart "$APP_NAME"
    else
        log_info "무중단 재시작 (reload)..."
        pm2 reload "$APP_NAME"
    fi
else
    log_info "신규 서비스 시작..."
    pm2 start ecosystem.config.js --env production
fi
log_success "서비스 재시작 완료"

# 6. PM2 상태 저장
log_info "PM2 상태 저장..."
pm2 save --silent
log_success "상태 저장 완료"

# 7. 상태 확인
print_separator
echo -e "${GREEN}배포 완료!${NC}"
echo "시간: $(date '+%Y-%m-%d %H:%M:%S')"
print_separator

# PM2 상태 출력
echo ""
log_info "현재 서비스 상태:"
pm2 status

# 헬스 체크
echo ""
log_info "헬스 체크..."
sleep 2
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    log_success "서비스 정상 동작 중 (HTTP 200)"
else
    log_warning "헬스 체크 실패 - 로그를 확인하세요: pm2 logs $APP_NAME"
fi

print_separator
