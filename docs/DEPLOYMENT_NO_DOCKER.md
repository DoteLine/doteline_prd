# DOTELINE 배포 가이드 (No-Docker 버전)

> Ubuntu 22.04 + Nginx + Node.js + PM2 환경 기준
> **초보자를 위한 상세 설명 포함**

---

## 목차

1. [시작하기 전에](#1-시작하기-전에)
2. [서버 접속 방법](#2-서버-접속-방법)
3. [서버 초기 설정](#3-서버-초기-설정)
4. [Node.js 설치](#4-nodejs-설치)
5. [PM2 설치 및 설정](#5-pm2-설치-및-설정)
6. [Nginx 설치 및 설정](#6-nginx-설치-및-설정)
7. [프로젝트 배포](#7-프로젝트-배포)
8. [환경 변수 설정](#8-환경-변수-설정)
9. [서비스 시작](#9-서비스-시작)
10. [SSL 인증서 설정](#10-ssl-인증서-설정-다음주-예정)
11. [Jenkins 연동 (자동 배포)](#11-jenkins-연동-자동-배포)
12. [유지보수 가이드](#12-유지보수-가이드)
13. [문제 해결 (트러블슈팅)](#13-문제-해결-트러블슈팅)
14. [자주 사용하는 명령어](#14-자주-사용하는-명령어)

---

## 1. 시작하기 전에

### 1.1 필요한 것들

| 항목 | 설명 |
|------|------|
| **서버** | Ubuntu 22.04 LTS가 설치된 VPS (카페24, AWS, Vultr 등) |
| **도메인** | doteline.co.kr (이미 구매 완료) |
| **SSH 클라이언트** | PuTTY (Windows) 또는 터미널 (Mac/Linux) |
| **FTP 클라이언트** | WinSCP 또는 FileZilla (파일 업로드용) |

### 1.2 용어 설명 (초보자용)

| 용어 | 쉬운 설명 |
|------|-----------|
| **SSH** | 원격으로 서버에 접속하는 방법 (카카오톡으로 친구랑 대화하듯, 서버랑 대화) |
| **Nginx** | 사용자의 요청을 받아서 Node.js에 전달해주는 역할 (호텔 프론트 데스크 같은 것) |
| **PM2** | Node.js 앱이 꺼지면 자동으로 다시 켜주는 프로그램 (자동 부활 시스템) |
| **포트** | 서버의 문 번호 (80=정문, 443=보안문, 3000=직원 출입구) |
| **sudo** | 관리자 권한으로 실행 (아이폰의 Face ID 같은 것) |

### 1.3 최종 구성도

```
사용자 브라우저
     ↓
[인터넷]
     ↓
[Nginx - 포트 80/443] ← 외부 접속 담당
     ↓
[Node.js - 포트 3000] ← 실제 웹서버 (PM2가 관리)
```

---

## 2. 서버 접속 방법

### 2.1 Windows에서 접속 (PuTTY 사용)

1. **PuTTY 다운로드**: https://www.putty.org 에서 다운로드
2. **PuTTY 실행**
3. **접속 정보 입력**:
   - Host Name: `서버IP주소` 또는 `doteline.co.kr`
   - Port: `22`
   - Connection type: `SSH`
4. **Open 클릭**
5. **로그인**:
   ```
   login as: ubuntu
   Password: (비밀번호 입력 - 화면에 안 보여도 입력되고 있음)
   ```

### 2.2 Mac/Linux에서 접속

```bash
# 터미널 열고 아래 명령어 입력
ssh ubuntu@서버IP주소

# 비밀번호 입력 (화면에 안 보여도 입력되고 있음)
```

### 2.3 접속 성공 화면

```
Welcome to Ubuntu 22.04 LTS
ubuntu@server:~$
```

> **팁**: `ubuntu@server:~$` 이 보이면 접속 성공!

---

## 3. 서버 초기 설정

### 3.1 시스템 업데이트 (필수!)

서버에 접속한 후, 가장 먼저 시스템을 최신 상태로 업데이트합니다.

```bash
# 패키지 목록 업데이트 + 설치된 프로그램 업그레이드
sudo apt update && sudo apt upgrade -y
```

**설명**:
- `sudo`: 관리자 권한으로 실행
- `apt update`: "어떤 프로그램이 있는지 목록 새로고침"
- `apt upgrade -y`: "업데이트 있으면 다 설치해 (-y는 '다 예스')"

> **예상 시간**: 1~3분 (인터넷 속도에 따라 다름)

### 3.2 디렉토리 구조 만들기

앱을 저장할 폴더를 만듭니다.

```bash
# 앱 저장 폴더 생성
mkdir -p /home/ubuntu/apps/doteline

# 로그 저장 폴더 생성
mkdir -p /home/ubuntu/apps/doteline/logs

# 공유 파일 폴더 생성 (환경변수 파일 등)
mkdir -p /home/ubuntu/apps/doteline/shared

# 권한 설정 (현재 유저가 이 폴더를 마음대로 쓸 수 있게)
sudo chown -R ubuntu:ubuntu /home/ubuntu/apps
```

**최종 폴더 구조**:
```
/home/ubuntu/apps/doteline/
├── current/        ← 실제 코드가 들어갈 곳 (나중에 생성)
├── logs/           ← 로그 파일 저장
└── shared/         ← .env 파일 저장
```

### 3.3 방화벽 설정

서버에 접속할 수 있는 포트를 열어줍니다.

```bash
# SSH 포트 (원격 접속용)
sudo ufw allow 22/tcp

# HTTP 포트 (웹 접속)
sudo ufw allow 80/tcp

# HTTPS 포트 (보안 웹 접속)
sudo ufw allow 443/tcp

# Jenkins 포트 (선택사항 - 자동 배포용)
sudo ufw allow 8082/tcp

# 방화벽 활성화
sudo ufw enable
```

> **주의**: `ufw enable` 입력 후 "Command may disrupt existing SSH connections. Proceed with operation (y|n)?" 라고 물어보면 **y** 입력

```bash
# 방화벽 상태 확인
sudo ufw status
```

**정상 출력 예시**:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## 4. Node.js 설치

### 4.1 Node.js 20 LTS 설치

```bash
# NodeSource 저장소 추가 (Node.js 공식 설치 스크립트)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js 설치
sudo apt install -y nodejs
```

**설명**:
- `curl`: 인터넷에서 파일 다운로드
- `setup_20.x`: Node.js 20 버전 (LTS = 장기 지원 버전)

### 4.2 설치 확인

```bash
# Node.js 버전 확인
node -v
# 출력: v20.x.x (예: v20.10.0)

# npm 버전 확인
npm -v
# 출력: 10.x.x (예: 10.2.3)
```

> **성공 기준**: `v20.` 으로 시작하면 OK!

---

## 5. PM2 설치 및 설정

### 5.1 PM2란?

PM2는 Node.js 앱을 관리하는 프로그램입니다:
- 앱이 죽으면 **자동 재시작**
- 서버 재부팅 시 **자동 실행**
- **로그 관리**
- **모니터링** (CPU, 메모리 사용량)

### 5.2 PM2 설치

```bash
# PM2 전역 설치 (-g = 어디서든 사용 가능)
sudo npm install -g pm2

# 설치 확인
pm2 --version
# 출력: 5.x.x
```

### 5.3 PM2 자동 시작 설정

서버가 재부팅되어도 앱이 자동으로 실행되게 설정합니다.

```bash
# PM2 시작 스크립트 생성
pm2 startup
```

**출력 예시**:
```
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

> **중요**: 출력된 `sudo env PATH=...` 명령어를 **그대로 복사해서 실행**해야 합니다!

```bash
# 위에서 출력된 명령어 실행 (예시)
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

---

## 6. Nginx 설치 및 설정

### 6.1 Nginx 설치

```bash
# Nginx 설치
sudo apt install -y nginx

# Nginx 시작
sudo systemctl start nginx

# 서버 재부팅 시 자동 시작 설정
sudo systemctl enable nginx
```

### 6.2 Nginx 동작 확인

```bash
# Nginx 상태 확인
sudo systemctl status nginx
```

**정상 출력**:
```
● nginx.service - A high performance web server
   Active: active (running) ← 이게 보이면 성공!
```

> **팁**: 브라우저에서 `http://서버IP주소` 접속 시 "Welcome to nginx!" 페이지가 보이면 성공!

### 6.3 Nginx 설정 파일 생성

DOTELINE 전용 설정 파일을 만듭니다.

```bash
# 설정 파일 생성 (nano 에디터 사용)
sudo nano /etc/nginx/sites-available/doteline
```

> **nano 에디터 사용법**:
> - 내용 입력 후 저장: `Ctrl + O` → `Enter`
> - 종료: `Ctrl + X`

### 6.4 Nginx 설정 내용 (HTTP만 - SSL 설정 전)

아래 내용을 복사해서 붙여넣기:

```nginx
# ============================================
# DOTELINE Nginx 설정 (SSL 적용 전)
# ============================================

server {
    listen 80;
    listen [::]:80;
    server_name doteline.co.kr www.doteline.co.kr;

    # Let's Encrypt SSL 인증용 (나중에 필요)
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Node.js 앱으로 프록시
    location / {
        proxy_pass http://localhost:3000;
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

    # 정적 파일 처리 (이미지, CSS, JS 등)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        proxy_pass http://localhost:3000;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 압축 (페이지 로딩 속도 향상)
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # 로그 파일 위치
    access_log /var/log/nginx/doteline_access.log;
    error_log /var/log/nginx/doteline_error.log;
}
```

### 6.5 설정 적용

```bash
# 기본 설정 제거 (선택사항)
sudo rm -f /etc/nginx/sites-enabled/default

# 우리 설정 활성화 (심볼릭 링크 생성)
sudo ln -sf /etc/nginx/sites-available/doteline /etc/nginx/sites-enabled/

# 설정 문법 검사 (오타 확인)
sudo nginx -t
```

**정상 출력**:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

> **에러가 나면**: 설정 파일 내용을 다시 확인하세요!

```bash
# Nginx 재시작
sudo systemctl reload nginx
```

---

## 7. 프로젝트 배포

### 7.1 방법 1: WinSCP로 파일 업로드 (초보자 권장)

1. **WinSCP 다운로드**: https://winscp.net 에서 다운로드
2. **WinSCP 실행 후 접속**:
   - 파일 프로토콜: `SFTP`
   - 호스트 이름: `서버IP주소`
   - 포트: `22`
   - 사용자 이름: `ubuntu`
   - 비밀번호: (서버 비밀번호)
3. **파일 업로드**:
   - 왼쪽(로컬): 프로젝트 폴더 선택
   - 오른쪽(서버): `/home/ubuntu/apps/doteline/current` 폴더로 이동
   - 모든 파일 드래그 앤 드롭

> **주의**: `node_modules` 폴더는 업로드하지 마세요! (서버에서 설치)

### 7.2 방법 2: Git으로 배포 (권장, SSH 사용)

```bash
# 1. SSH 키 확인 및 GitHub 등록
cat ~/.ssh/id_rsa.pub
# 출력된 내용을 GitHub Settings -> SSH and GPG keys에 등록

# 2. SSH 연결 테스트 (Hi YimJunsu! 가 나오면 성공)
ssh -T git@github.com

# 3. 프로젝트 폴더로 이동 (이미 폴더가 있다면 생략)
cd /home/ubuntu/apps/doteline

# 4. 소유권 변경 (중요: root로 되어있을 경우 doteline으로 변경)
sudo chown -R doteline:doteline /home/ubuntu/apps/doteline

# 5. 최신 내용 가져오기
cd /home/ubuntu/apps/doteline/current
git pull origin main


> **Git 설치 안 되어 있다면**:
> ```bash
> sudo apt install -y git
> ```

### 7.3 의존성 설치

```bash
# 프로젝트 폴더로 이동
cd /home/ubuntu/apps/doteline/current

# 패키지 설치 (프로덕션 전용)
npm ci --only=production
```

**설명**:
- `npm ci`: package-lock.json 기준으로 정확한 버전 설치 (더 안정적)
- `--only=production`: 개발용 패키지 제외 (서버 용량 절약)

> **예상 시간**: 1~5분

### 7.4 logs 폴더 연결

```bash
# 기존 logs 폴더 삭제 (있으면)
rm -rf /home/ubuntu/apps/doteline/current/logs

# 공유 logs 폴더 연결
ln -sf /home/ubuntu/apps/doteline/logs /home/ubuntu/apps/doteline/current/logs
```

---

## 8. 환경 변수 설정

### 8.1 .env 파일이란?

`.env` 파일은 비밀번호, API 키 같은 민감한 정보를 저장하는 파일입니다.
**절대 Git에 올리면 안 됩니다!**

### 8.2 .env 파일 생성

```bash
# nano 에디터로 .env 파일 생성
nano /home/ubuntu/apps/doteline/shared/.env
```

### 8.3 .env 파일 내용

아래 내용을 복사해서 붙여넣고, 실제 값으로 수정하세요:

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

# 카카오 맵 API
# (카카오 개발자 콘솔에서 발급받은 키)
KAKAO_MAP_API_KEY_DEV=개발용_카카오_API_키
KAKAO_MAP_API_KEY_PROD=운영용_카카오_API_키

# EmailJS 설정
# (EmailJS 대시보드에서 확인)
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_SERVICE_ID=doteline
EMAILJS_TEMPLATE_ID=basic_template

# SEO 설정
SITE_NAME=DOTELINE
SITE_DESCRIPTION=프리미엄 LED 드라이버 칩 솔루션 - 도트라인
SITE_KEYWORDS=LED,드라이버칩,디스플레이,도트라인,DOTELINE,LED솔루션
```

저장: `Ctrl + O` → `Enter` → 종료: `Ctrl + X`

### 8.4 .env 파일 연결

```bash
# .env 파일을 프로젝트 폴더에 연결
ln -sf /home/ubuntu/apps/doteline/shared/.env /home/ubuntu/apps/doteline/current/.env
```

---

## 9. 서비스 시작

### 9.1 PM2로 앱 시작

```bash
# 프로젝트 폴더로 이동
cd /home/ubuntu/apps/doteline/current

# PM2로 앱 시작 (우리가 실제로 성공한 명령어)
# --name 뒤의 이름은 PM2 목록에서 구분하기 위한 별명입니다.
pm2 start app.js --name "doteline-web"
```

**정상 출력**:
```
┌─────┬───────────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name          │ mode        │ status  │ cpu     │ memory   │
├─────┼───────────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ doteline-web  │ cluster     │ online  │ 0%      │ 50.0mb   │
└─────┴───────────────┴─────────────┴─────────┴─────────┴──────────┘
```

> **status가 online이면 성공!**

### 9.2 앱 동작 확인

```bash
# 로컬에서 앱 접속 테스트
curl http://localhost:3000
```

HTML 코드가 출력되면 성공!

### 9.3 PM2 상태 저장 (중요!)

서버 재부팅 시에도 앱이 자동 실행되게 현재 상태를 저장합니다.

```bash
pm2 save
```

### 9.4 브라우저에서 확인

웹 브라우저에서 접속:
- `http://서버IP주소`
- 또는 `http://doteline.co.kr`

> **주의**: DNS 설정이 완료되어야 도메인으로 접속 가능

---

## 10. SSL 인증서 설정 (다음주 예정)

SSL 인증서를 설정하면 `https://` 로 접속할 수 있습니다.

### 10.1 Certbot 설치

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 10.2 SSL 인증서 발급

```bash
# Certbot 실행 (자동으로 Nginx 설정도 변경해줌)
sudo certbot --nginx -d doteline.co.kr -d www.doteline.co.kr
```

**진행 과정**:
1. 이메일 입력
2. 약관 동의 (Y)
3. 뉴스레터 구독 여부 (N)
4. HTTP → HTTPS 리다이렉트 설정 (2번 선택 권장)

### 10.3 자동 갱신 확인

Let's Encrypt 인증서는 90일마다 갱신 필요. Certbot이 자동으로 해줌.

```bash
# 자동 갱신 테스트
sudo certbot renew --dry-run
```

### 10.4 SSL 적용 후 Nginx 설정 (자동 변경됨)

Certbot이 자동으로 `/etc/nginx/sites-available/doteline` 파일을 수정합니다.

---

## 11. Jenkins 연동 (자동 배포)

### 11.1 Jenkins 권한 설정

Jenkins가 앱을 배포할 수 있게 권한을 설정합니다.

```bash
# jenkins 사용자를 ubuntu 그룹에 추가
sudo usermod -aG ubuntu jenkins

# PM2 명령어를 jenkins가 사용할 수 있게 설정
sudo visudo
```

visudo 에디터에서 아래 줄 추가:
```
jenkins ALL=(ubuntu) NOPASSWD: /usr/bin/pm2, /usr/bin/npm
```

### 11.2 Jenkins 배포 스크립트

Jenkins 프로젝트의 **Build** → **Execute shell**에 아래 내용 입력:

```bash
#!/bin/bash
set -e

# 변수 설정
APP_DIR=/home/ubuntu/apps/doteline
CURRENT=$APP_DIR/current

echo "=========================================="
echo "DOTELINE 배포 시작: $(date)"
echo "=========================================="

# 1. 앱 디렉토리로 이동
cd $CURRENT

# 2. 최신 코드 가져오기 (Git 사용 시)
echo "[1/4] 최신 코드 가져오기..."
git pull origin main

# 3. 패키지 설치
echo "[2/4] 패키지 설치..."
npm ci --only=production

# 4. PM2 재시작 (무중단 배포)
echo "[3/4] 서비스 재시작..."
pm2 describe doteline-web > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "신규 실행..."
    pm2 start ecosystem.config.js --env production
else
    echo "무중단 재시작..."
    pm2 reload doteline-web
fi

# 5. 상태 저장
echo "[4/4] 상태 저장..."
pm2 save

echo "=========================================="
echo "배포 완료: $(date)"
echo "=========================================="

# 6. 상태 확인
pm2 status
```

---

## 12. 유지보수 가이드

### 12.1 코드 수정 후 반영 워크플로우

```
1. 로컬에서 코드 수정
     ↓
2. git commit & git push
     ↓
3. Jenkins에서 Build Now 클릭
     (또는 서버에서 수동 배포)
     ↓
4. 브라우저에서 확인
```

### 12.2 수동 배포 방법

Jenkins 없이 직접 배포할 때:

```bash
# 1. 서버 접속
ssh ubuntu@서버IP

# 2. 프로젝트 폴더 이동
cd /home/ubuntu/apps/doteline/current

# 3. 최신 코드 가져오기
git pull origin main

# 4. 패키지 설치 (package.json 변경 시)
npm ci --only=production

# 5. 앱 재시작 (무중단)
pm2 reload doteline-web

# 6. 상태 확인
pm2 status
```

### 12.3 로그 확인 방법

**문제 발생 시 로그를 확인하세요!**

```bash
# PM2 앱 로그 (실시간)
pm2 logs doteline-web

# PM2 앱 로그 (최근 100줄)
pm2 logs doteline-web --lines 100

# Nginx 접속 로그
sudo tail -f /var/log/nginx/doteline_access.log

# Nginx 에러 로그
sudo tail -f /var/log/nginx/doteline_error.log
```

> **팁**: `Ctrl + C`로 로그 보기 종료

### 12.4 서버 리소스 모니터링

```bash
# PM2 모니터링 (CPU, 메모리 사용량)
pm2 monit

# 디스크 사용량
df -h

# 메모리 사용량
free -h

# 프로세스 모니터링
htop
```

> **htop 설치**: `sudo apt install -y htop`

---

## 13. 문제 해결 (트러블슈팅)

### 13.1 "사이트에 연결할 수 없음" 오류

**원인 확인 순서**:

```bash
# 1. Node.js 앱이 실행 중인지 확인
pm2 status

# 2. Nginx가 실행 중인지 확인
sudo systemctl status nginx

# 3. 포트 3000이 열려있는지 확인
sudo lsof -i :3000

# 4. 방화벽 확인
sudo ufw status
```

### 13.2 "502 Bad Gateway" 오류

Nginx는 켜졌는데 Node.js가 꺼져있을 때 발생

```bash
# PM2 상태 확인
pm2 status

# 앱 재시작
pm2 restart doteline-web

# 그래도 안 되면 로그 확인
pm2 logs doteline-web --lines 50
```

### 13.3 PM2에서 "errored" 상태

앱에 오류가 있어서 시작 실패

```bash
# 에러 로그 확인
pm2 logs doteline-web --err --lines 50

# .env 파일 확인
cat /home/ubuntu/apps/doteline/current/.env

# 직접 실행해서 에러 확인
cd /home/ubuntu/apps/doteline/current
node app.js
```

### 13.4 포트 3000이 이미 사용 중

```bash
# 어떤 프로세스가 포트 사용 중인지 확인
sudo lsof -i :3000

# 해당 프로세스 종료
sudo kill -9 <PID>
```

### 13.5 디스크 용량 부족

```bash
# 용량 확인
df -h

# PM2 로그 정리
pm2 flush

# Nginx 로그 정리 (주의: 로그 삭제됨)
sudo truncate -s 0 /var/log/nginx/doteline_*.log

# 시스템 캐시 정리
sudo apt clean
```

### 13.6 메모리 부족

```bash
# 메모리 확인
free -h

# PM2 앱 재시작 (메모리 해제)
pm2 restart doteline-web
```

13.7 SSH Permission denied (publickey)
GitHub에 등록된 키와 서버의 실제 키(id_rsa.pub)가 일치하지 않을 때 발생했습니다.

해결: ssh-keygen -l -f ~/.ssh/id_rsa로 서버 지문을 확인하고, GitHub의 기존 키를 지운 뒤 cat ~/.ssh/id_rsa.pub 내용을 다시 등록했습니다.

13.8 폴더 소유권(Permission) 문제
접속 계정은 doteline인데 폴더 소유자가 root나 ubuntu로 되어 있으면 git pull이 거절됩니다.

해결: sudo chown -R doteline:doteline /home/ubuntu/apps/doteline 명령어로 주인을 바꿔주었습니다.

13.9 PM2 앱 중복 실행 (Port Conflict)
이름이 다른 두 앱이 같은 소스 코드를 실행하면 하나가 errored 상태가 됩니다.

해결: pm2 status로 목록 확인 후, pm2 delete [ID] 명령어로 중복된 프로세스를 삭제했습니다.

---

## 14. 자주 사용하는 명령어

### 14.1 PM2 명령어

| 명령어 | 설명 |
|--------|------|
| `pm2 status` | 앱 상태 확인 |
| `pm2 logs doteline-web` | 로그 보기 |
| `pm2 logs doteline-web --lines 100` | 최근 100줄 로그 |
| `pm2 restart doteline-web` | 앱 재시작 |
| `pm2 reload doteline-web` | 무중단 재시작 |
| `pm2 stop doteline-web` | 앱 중지 |
| `pm2 delete doteline-web` | 앱 삭제 |
| `pm2 monit` | 모니터링 화면 |
| `pm2 save` | 현재 상태 저장 |
| `pm2 flush` | 로그 파일 비우기 |

### 14.2 Nginx 명령어

| 명령어 | 설명 |
|--------|------|
| `sudo nginx -t` | 설정 문법 검사 |
| `sudo systemctl reload nginx` | 설정 다시 로드 |
| `sudo systemctl restart nginx` | Nginx 재시작 |
| `sudo systemctl status nginx` | Nginx 상태 확인 |

### 14.3 시스템 명령어

| 명령어 | 설명 |
|--------|------|
| `sudo reboot` | 서버 재시작 |
| `df -h` | 디스크 용량 확인 |
| `free -h` | 메모리 확인 |
| `htop` | 프로세스 모니터링 |

### 14.4 Git 명령어

| 명령어 | 설명 |
|--------|------|
| `git status` | 변경 사항 확인 |
| `git pull origin main` | 최신 코드 가져오기 |
| `git log --oneline -5` | 최근 커밋 5개 확인 |

---

## 15. 유지보수 및 운영 반영 방법

로컬(내 컴퓨터)에서 코드를 수정한 후, 실제 서버에 안전하게 반영하는 표준 절차입니다.

### 15.1 표준 배포 워크플로우 (Git 기반)

가장 권장되는 방식입니다. 에러를 최소화하고 무중단으로 반영할 수 있습니다.

```bash
# 1. 로컬 컴퓨터에서 작업 완료 후 Push
git add .
git commit -m "수정 내용: 메인 페이지 레이아웃 변경"
git push origin main

# 2. 서버 접속 (SSH)
ssh doteline@doteline.co.kr

# 3. 프로젝트 폴더로 이동
cd /home/ubuntu/apps/doteline/current

# 4. 최신 코드 가져오기
git pull origin main

# 5. 의존성 패키지 체크 (package.json을 수정했을 경우에만 실행)
# npm ci --only=production

# 6. 무중단 재시작 (PM2 Reload)
# restart와 달리 프로세스를 하나씩 교체하여 서비스 중단이 없습니다.
pm2 reload doteline-web
# 만약 환경변수 관련 수정하면 
pm2 restart doteline-web

# 7. 정상 작동 확인
pm2 status
15.2 긴급 수정 및 롤백 (Rollback)
업데이트 후 사이트에 문제가 생겼을 때, 즉시 이전 상태로 되돌리는 방법입니다.

# 1. Git 로그에서 이전 버전 확인
git log --oneline -5

# 2. 바로 이전 커밋으로 강제 되돌리기
git reset --hard HEAD^

# 3. 되돌린 버전으로 앱 재시작
pm2 reload doteline-web
15.3 실시간 상태 모니터링
운영 중 서버의 건강 상태를 확인하는 습관이 중요합니다.

실시간 로그 감시: 사용자가 접속할 때 에러가 나는지 확인합니다.

Bash

pm2 logs doteline-web
리소스 대시보드: 메모리 누수가 있는지, CPU 부하가 심한지 확인합니다.

Bash

pm2 monit
15.4 정기 점검 시 유용한 팁
로그 파일 비우기: 로그가 너무 많이 쌓여 용량을 차지할 때 실행합니다.

Bash

pm2 flush
Nginx 설정 변경 시: Nginx 설정을 바꿨다면 반드시 문법 검사 후 반영하세요.

Bash

sudo nginx -t && sudo systemctl reload nginx
최종 보안 및 관리 체크리스트
계정 권한: 모든 작업은 doteline 계정으로 수행하며, 폴더 소유권은 doteline:doteline을 유지합니다.

환경 변수: .env 파일은 Git에 포함되지 않으므로, 환경 변수 변경 시 서버의 shared/.env를 직접 수정합니다.

백업: 중요한 업데이트 전에는 current 폴더를 복사하여 백업본을 만듭니다. cp -r current current_backup_20260118

```
## 빠른 참조 카드

### 배포 후 확인 체크리스트

- [ ] `pm2 status` - 앱이 online 상태인가?
- [ ] `curl http://localhost:3000` - 로컬에서 응답하는가?
- [ ] 브라우저에서 `http://도메인` 접속 - 정상 표시되는가?
- [ ] `pm2 save` - 상태 저장했는가?

### 문제 발생 시 확인 순서

1. `pm2 status` - 앱 상태
2. `pm2 logs` - 앱 에러 로그
3. `sudo systemctl status nginx` - Nginx 상태
4. `sudo tail /var/log/nginx/doteline_error.log` - Nginx 에러

---

## 보안 체크리스트

| 항목 | 설정 방법 | 상태 |
|------|-----------|------|
| 방화벽 | `sudo ufw enable` | [ ] |
| SSH 포트만 허용 | `sudo ufw allow 22/tcp` | [ ] |
| HTTP 허용 | `sudo ufw allow 80/tcp` | [ ] |
| HTTPS 허용 | `sudo ufw allow 443/tcp` | [ ] |
| SSL 인증서 | `sudo certbot --nginx` | [ ] 다음주 예정 |
| PM2 자동 시작 | `pm2 startup && pm2 save` | [ ] |

---

**문서 작성일**: 2026-01-18
**Node.js 버전**: 20.x LTS
**서버 OS**: Ubuntu 22.04 LTS
**작성자**: DOTELINE 개발팀
