#!/bin/bash
# ============================================
# DOTELINE 서버 상태 확인 스크립트
#
# 사용법: ./status.sh
# ============================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=========================================="
echo -e "${BLUE}DOTELINE 서버 상태 확인${NC}"
echo "시간: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 1. PM2 상태
echo ""
echo -e "${BLUE}[1] PM2 앱 상태${NC}"
echo "------------------------------------------"
pm2 status

# 2. Nginx 상태
echo ""
echo -e "${BLUE}[2] Nginx 상태${NC}"
echo "------------------------------------------"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}Nginx: 실행 중${NC}"
else
    echo -e "${RED}Nginx: 중지됨${NC}"
fi

# 3. 포트 확인
echo ""
echo -e "${BLUE}[3] 포트 사용 현황${NC}"
echo "------------------------------------------"
echo "포트 80 (HTTP):"
sudo lsof -i :80 2>/dev/null | head -3 || echo "  사용하지 않음"
echo ""
echo "포트 443 (HTTPS):"
sudo lsof -i :443 2>/dev/null | head -3 || echo "  사용하지 않음"
echo ""
echo "포트 3000 (Node.js):"
sudo lsof -i :3000 2>/dev/null | head -3 || echo "  사용하지 않음"

# 4. 디스크 사용량
echo ""
echo -e "${BLUE}[4] 디스크 사용량${NC}"
echo "------------------------------------------"
df -h / | tail -1 | awk '{print "사용: " $3 " / " $2 " (" $5 " 사용됨)"}'

# 5. 메모리 사용량
echo ""
echo -e "${BLUE}[5] 메모리 사용량${NC}"
echo "------------------------------------------"
free -h | grep Mem | awk '{print "사용: " $3 " / " $2}'

# 6. 헬스 체크
echo ""
echo -e "${BLUE}[6] 헬스 체크${NC}"
echo "------------------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}localhost:3000 - OK (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}localhost:3000 - FAIL (HTTP $HTTP_CODE)${NC}"
fi

# 7. 최근 에러 로그
echo ""
echo -e "${BLUE}[7] 최근 에러 로그 (PM2)${NC}"
echo "------------------------------------------"
if [ -f "/home/ubuntu/apps/doteline/logs/error.log" ]; then
    ERRORS=$(tail -5 /home/ubuntu/apps/doteline/logs/error.log 2>/dev/null)
    if [ -n "$ERRORS" ]; then
        echo "$ERRORS"
    else
        echo -e "${GREEN}에러 없음${NC}"
    fi
else
    echo "로그 파일 없음"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}상태 확인 완료${NC}"
echo "=========================================="
