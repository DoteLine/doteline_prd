# DOTELINE 운영 배포 및 유지보수 가이드

> Ubuntu 22.04 + Nginx + Node.js(PM2/Docker) 환경 기준

---

## 목차

1. [권장 디렉토리 구조](#1-권장-디렉토리-구조)
2. [서버 초기 설정](#2-서버-초기-설정)
3. [프로젝트 배포](#3-프로젝트-배포)
4. [환경 변수 설정 (.env)](#4-환경-변수-설정-env)
5. [Nginx 설정](#5-nginx-설정)
6. [PM2를 이용한 배포](#6-pm2를-이용한-배포)
7. [Docker를 이용한 배포](#7-docker를-이용한-배포)
8. [SSL 인증서 설정 (Let's Encrypt)](#8-ssl-인증서-설정-lets-encrypt)
9. [유지보수 가이드](#9-유지보수-가이드)
10. [트러블슈팅](#10-트러블슈팅)

---

## 1. 권장 디렉토리 구조

```
/home/ubuntu/                    # 사용자 홈 디렉토리
├── apps/                        # 애플리케이션 루트
│   └── doteline/                # DOTELINE 프로젝트
│       ├── current/             # 현재 운영 중인 코드 (심볼릭 링크)
│       ├── releases/            # 배포 버전별 보관
│       │   ├── 20260118_v1.0.0/
│       │   └── 20260120_v1.0.1/
│       ├── shared/              # 공유 파일 (버전 간 유지)
│       │   ├── .env             # 환경 변수 파일 ⭐
│       │   └── logs/            # 로그 파일
│       └── backups/             # 백업 파일
│
└── scripts/                     # 배포/유지보수 스크립트
    ├── deploy.sh
    └── backup.sh
```

### 핵심 포인트

| 항목 | 경로 | 설명 |
|------|------|------|
| **프로젝트 루트** | `/home/ubuntu/apps/doteline/current` | 실제 서비스 코드 |
| **.env 파일** | `/home/ubuntu/apps/doteline/shared/.env` | WinSCP로 여기에 업로드 |
| **로그 파일** | `/home/ubuntu/apps/doteline/shared/logs/` | PM2/앱 로그 저장 |
| **Nginx 설정** | `/etc/nginx/sites-available/doteline` | 웹서버 설정 |

---

## 2. 서버 초기 설정

### 2.1 시스템 업데이트

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Node.js 20 LTS 설치

```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js 설치
sudo apt install -y nodejs

# 버전 확인
node -v  # v20.x.x
npm -v   # 10.x.x
```

### 2.3 PM2 설치 (전역)

```bash
sudo npm install -g pm2
```

### 2.4 Nginx 설치

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2.5 방화벽 설정

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2.6 디렉토리 구조 생성

```bash
mkdir -p ~/apps/doteline/{releases,shared/logs,backups}
mkdir -p ~/scripts
```

---

## 3. 프로젝트 배포

### 3.1 소스 코드 업로드

**방법 1: Git 사용 (권장)**

```bash
cd ~/apps/doteline/releases
git clone https://github.com/your-repo/doteline.git 20260118_v1.0.0
```

**방법 2: WinSCP/SCP 사용**

```bash
# 로컬에서 서버로 업로드
scp -r ./doteline_prd ubuntu@your-server-ip:~/apps/doteline/releases/20260118_v1.0.0
```

### 3.2 심볼릭 링크 설정

```bash
# 기존 링크 제거 (있을 경우)
rm -f ~/apps/doteline/current

# 새 버전으로 심볼릭 링크 생성
ln -s ~/apps/doteline/releases/20260118_v1.0.0 ~/apps/doteline/current
```

### 3.3 의존성 설치

```bash
cd ~/apps/doteline/current
npm ci --only=production
```

### 3.4 공유 디렉토리 연결

```bash
# .env 파일 심볼릭 링크
ln -sf ~/apps/doteline/shared/.env ~/apps/doteline/current/.env

# logs 디렉토리 심볼릭 링크
rm -rf ~/apps/doteline/current/logs
ln -sf ~/apps/doteline/shared/logs ~/apps/doteline/current/logs
```

---

## 4. 환경 변수 설정 (.env)

### 4.1 .env 파일 위치

```
/home/ubuntu/apps/doteline/shared/.env
```

### 4.2 WinSCP로 .env 업로드

1. WinSCP 접속
2. 원격 경로: `/home/ubuntu/apps/doteline/shared/`
3. 로컬의 `.env` 파일을 해당 경로에 업로드

### 4.3 운영 환경 .env 예시

```bash
# ============================================
# DOTELINE 환경 변수 설정 (운영 서버)
# ============================================

# 서버 설정
PORT=3000
NODE_ENV=production

# 도메인 설정
DOMAIN=doteline.co.kr
BASE_URL=https://doteline.co.kr

# 카카오 맵 API (개발/운영 분리)
# NODE_ENV=production일 때 KAKAO_MAP_API_KEY_PROD 사용
# NODE_ENV=development일 때 KAKAO_MAP_API_KEY_DEV 사용
KAKAO_MAP_API_KEY_DEV=개발용_카카오_API_키
KAKAO_MAP_API_KEY_PROD=운영용_카카오_API_키

# EmailJS 설정
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_SERVICE_ID=doteline
EMAILJS_TEMPLATE_ID=basic_template

# SEO 설정
SITE_NAME=DOTELINE
SITE_DESCRIPTION=프리미엄 LED 드라이버 칩 솔루션 - 도트라인
SITE_KEYWORDS=LED,드라이버칩,디스플레이,도트라인,DOTELINE,LED솔루션
```

### 4.4 카카오 API 키 분리 동작 원리

```
NODE_ENV=development → KAKAO_MAP_API_KEY_DEV 사용 (localhost)
NODE_ENV=production  → KAKAO_MAP_API_KEY_PROD 사용 (운영 서버)
```

카카오 개발자 콘솔에서:
- **개발용 앱**: 플랫폼에 `http://localhost:3000` 등록
- **운영용 앱**: 플랫폼에 `https://doteline.co.kr` 등록

---

## 5. Nginx 설정

### 5.1 설정 파일 생성

```bash
sudo nano /etc/nginx/sites-available/doteline
```

### 5.2 Nginx 설정 내용

```nginx
# HTTP → HTTPS 리다이렉트
server {
    listen 80;
    listen [::]:80;
    server_name doteline.co.kr www.doteline.co.kr;

    # Let's Encrypt 인증용 (SSL 발급 전 필요)
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # 나머지는 HTTPS로 리다이렉트
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 메인 서버
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name doteline.co.kr www.doteline.co.kr;

    # SSL 인증서 (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/doteline.co.kr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/doteline.co.kr/privkey.pem;

    # SSL 설정 최적화
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # 정적 파일 캐싱
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 7d;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Node.js 앱으로 프록시
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 타임아웃 설정
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 로그
    access_log /var/log/nginx/doteline_access.log;
    error_log /var/log/nginx/doteline_error.log;
}
```

### 5.3 설정 활성화

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/doteline /etc/nginx/sites-enabled/

# 기본 설정 제거 (선택)
sudo rm /etc/nginx/sites-enabled/default

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl reload nginx
```

---

## 6. PM2를 이용한 배포

### 6.1 애플리케이션 시작

```bash
cd ~/apps/doteline/current

# 프로덕션 모드로 시작
pm2 start ecosystem.config.js --env production
```

### 6.2 PM2 기본 명령어

```bash
# 상태 확인
pm2 status

# 로그 확인
pm2 logs doteline-web

# 재시작
pm2 restart doteline-web

# 중지
pm2 stop doteline-web

# 삭제
pm2 delete doteline-web

# 모니터링
pm2 monit
```

### 6.3 시스템 재부팅 시 자동 시작

```bash
# PM2 시작 스크립트 생성
pm2 startup

# 현재 프로세스 상태 저장
pm2 save
```

### 6.4 무중단 재배포

```bash
# 코드 업데이트 후
pm2 reload doteline-web
```

---

## 7. Docker를 이용한 배포

### 7.1 Docker 설치

```bash
# Docker 설치
curl -fsSL https://get.docker.com | sudo sh

# 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# Docker Compose 설치
sudo apt install -y docker-compose-plugin

# 재로그인 후 확인
docker --version
docker compose version
```

### 7.2 Docker 이미지 빌드

```bash
cd ~/apps/doteline/current

# 이미지 빌드
docker build -t doteline-web:latest .
```

### 7.3 Docker Compose로 실행

```bash
# .env 파일이 있는 디렉토리에서 실행
cd ~/apps/doteline/current

# 백그라운드 실행
docker compose up -d

# 상태 확인
docker compose ps

# 로그 확인
docker compose logs -f

# 중지
docker compose down
```

### 7.4 Docker 기본 명령어

```bash
# 컨테이너 상태 확인
docker ps

# 컨테이너 로그
docker logs -f doteline-web

# 컨테이너 재시작
docker restart doteline-web

# 컨테이너 내부 접속
docker exec -it doteline-web sh

# 이미지 목록
docker images

# 사용하지 않는 리소스 정리
docker system prune -a
```

### 7.5 Docker + Nginx 구성도

```
인터넷 → Nginx (80/443) → Docker Container (3000) → Node.js App
```

---

## 8. SSL 인증서 설정 (Let's Encrypt)

### 8.1 Certbot 설치

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8.2 SSL 인증서 발급

```bash
# Nginx 설정에서 SSL 부분을 임시로 주석 처리 후 실행
sudo certbot --nginx -d doteline.co.kr -d www.doteline.co.kr
```

### 8.3 자동 갱신 설정

```bash
# 갱신 테스트
sudo certbot renew --dry-run

# Cron으로 자동 갱신 (이미 설정되어 있음)
sudo systemctl status certbot.timer
```

---

## 9. 유지보수 가이드

### 9.1 배포 체크리스트

1. [ ] 로컬에서 테스트 완료
2. [ ] 소스 코드 업로드 또는 git pull
3. [ ] `npm ci --only=production` 실행
4. [ ] `.env` 파일 확인 (운영 설정)
5. [ ] PM2 reload 또는 Docker 재시작
6. [ ] 서비스 정상 작동 확인

### 9.2 로그 확인

```bash
# PM2 로그
pm2 logs doteline-web --lines 100

# Nginx 로그
sudo tail -f /var/log/nginx/doteline_access.log
sudo tail -f /var/log/nginx/doteline_error.log

# 앱 로그
tail -f ~/apps/doteline/shared/logs/out.log
tail -f ~/apps/doteline/shared/logs/error.log
```

### 9.3 서버 리소스 모니터링

```bash
# CPU, 메모리 사용량
htop

# 디스크 사용량
df -h

# PM2 모니터링
pm2 monit
```

### 9.4 백업 스크립트 예시

```bash
#!/bin/bash
# ~/scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/apps/doteline/backups

# 소스 코드 백업
tar -czf $BACKUP_DIR/code_$DATE.tar.gz ~/apps/doteline/current

# .env 백업
cp ~/apps/doteline/shared/.env $BACKUP_DIR/env_$DATE.bak

# 30일 이상 된 백업 삭제
find $BACKUP_DIR -type f -mtime +30 -delete

echo "백업 완료: $DATE"
```

### 9.5 빠른 배포 스크립트 예시

```bash
#!/bin/bash
# ~/scripts/deploy.sh

set -e

APP_DIR=~/apps/doteline
RELEASE_DIR=$APP_DIR/releases/$(date +%Y%m%d_%H%M%S)

echo "=== DOTELINE 배포 시작 ==="

# 1. 새 릴리즈 디렉토리 생성 & Git pull
mkdir -p $RELEASE_DIR
cd $RELEASE_DIR
git clone --depth 1 https://github.com/your-repo/doteline.git .

# 2. 의존성 설치
npm ci --only=production

# 3. 공유 파일 연결
ln -sf $APP_DIR/shared/.env .env
rm -rf logs && ln -sf $APP_DIR/shared/logs logs

# 4. 심볼릭 링크 업데이트
rm -f $APP_DIR/current
ln -s $RELEASE_DIR $APP_DIR/current

# 5. PM2 reload
pm2 reload ecosystem.config.js --env production

# 6. 오래된 릴리즈 정리 (최근 5개만 유지)
ls -dt $APP_DIR/releases/*/ | tail -n +6 | xargs rm -rf

echo "=== 배포 완료 ==="
```

---

## 10. 트러블슈팅

### 10.1 포트 3000 이미 사용 중

```bash
# 포트 사용 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>
```

### 10.2 Nginx 502 Bad Gateway

1. Node.js 앱이 실행 중인지 확인
   ```bash
   pm2 status
   # 또는
   docker ps
   ```

2. 포트 확인
   ```bash
   curl http://localhost:3000
   ```

3. Nginx 에러 로그 확인
   ```bash
   sudo tail -f /var/log/nginx/doteline_error.log
   ```

### 10.3 카카오 맵 API 오류

1. `.env` 파일에서 `NODE_ENV` 확인
2. 해당 환경의 카카오 키 확인
3. 카카오 개발자 콘솔에서 도메인 등록 확인

### 10.4 PM2 메모리 문제

```bash
# 메모리 사용량 확인
pm2 monit

# 앱 재시작
pm2 restart doteline-web

# 로그 정리
pm2 flush
```

### 10.5 디스크 용량 부족

```bash
# 디스크 사용량 확인
df -h

# Docker 정리
docker system prune -a

# 로그 파일 정리
sudo truncate -s 0 /var/log/nginx/*.log
pm2 flush

# 오래된 릴리즈 삭제
ls -dt ~/apps/doteline/releases/*/ | tail -n +3 | xargs rm -rf
```

---

## 빠른 참조

| 작업 | 명령어 |
|------|--------|
| PM2 상태 | `pm2 status` |
| PM2 재시작 | `pm2 reload doteline-web` |
| PM2 로그 | `pm2 logs doteline-web` |
| Docker 상태 | `docker compose ps` |
| Docker 재시작 | `docker compose restart` |
| Nginx 재시작 | `sudo systemctl reload nginx` |
| Nginx 테스트 | `sudo nginx -t` |
| SSL 갱신 | `sudo certbot renew` |

---

**문서 작성일:** 2026-01-18
**Node.js 버전:** 20.x LTS
**서버 OS:** Ubuntu 22.04 LTS
