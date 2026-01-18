#!/bin/bash
# ============================================
# DOTELINE 로그 확인 스크립트
#
# 사용법:
#   ./logs.sh           # PM2 로그 (실시간)
#   ./logs.sh --nginx   # Nginx 로그
#   ./logs.sh --error   # 에러 로그만
#   ./logs.sh --lines 50 # 최근 50줄만
# ============================================

APP_NAME="doteline-web"
LINES=100

# 옵션 파싱
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --nginx) NGINX=1 ;;
        --error) ERROR=1 ;;
        --lines) LINES="$2"; shift ;;
        -h|--help)
            echo "사용법: ./logs.sh [옵션]"
            echo ""
            echo "옵션:"
            echo "  --nginx     Nginx 로그 보기"
            echo "  --error     에러 로그만 보기"
            echo "  --lines N   최근 N줄만 보기 (기본: 100)"
            echo "  -h, --help  도움말 표시"
            exit 0
            ;;
        *) echo "알 수 없는 옵션: $1"; exit 1 ;;
    esac
    shift
done

if [ -n "$NGINX" ]; then
    echo "=== Nginx 접속 로그 (최근 $LINES줄) ==="
    sudo tail -n "$LINES" /var/log/nginx/doteline_access.log
    echo ""
    echo "=== Nginx 에러 로그 (최근 $LINES줄) ==="
    sudo tail -n "$LINES" /var/log/nginx/doteline_error.log
elif [ -n "$ERROR" ]; then
    echo "=== PM2 에러 로그 (최근 $LINES줄) ==="
    pm2 logs "$APP_NAME" --err --lines "$LINES" --nostream
else
    echo "=== PM2 로그 (실시간) ==="
    echo "종료하려면 Ctrl+C"
    echo ""
    pm2 logs "$APP_NAME" --lines "$LINES"
fi
