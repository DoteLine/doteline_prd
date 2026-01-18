# DOTELINE SEO 설정 가이드

이 문서는 DOTELINE 웹사이트의 검색엔진 최적화(SEO) 설정에 대해 설명합니다.

## 목차
1. [개요](#개요)
2. [기본 메타 태그](#기본-메타-태그)
3. [Open Graph (소셜 미디어)](#open-graph-소셜-미디어)
4. [Twitter Card](#twitter-card)
5. [구조화된 데이터 (JSON-LD)](#구조화된-데이터-json-ld)
6. [robots.txt](#robotstxt)
7. [sitemap.xml](#sitemapxml)
8. [검색엔진 등록](#검색엔진-등록)
9. [추가 최적화 권장사항](#추가-최적화-권장사항)

---

## 개요

SEO(Search Engine Optimization)는 검색엔진에서 웹사이트가 더 잘 검색되도록 최적화하는 작업입니다. 이 프로젝트에서는 다음과 같은 SEO 설정을 적용했습니다.

### 적용된 파일 목록

| 파일 경로 | 설정 내용 |
|-----------|-----------|
| `public/index.html` | 기본 메타 태그, Open Graph, Twitter Card, JSON-LD |
| `src/pages/Main/Main.html` | 기본 메타 태그, Open Graph, Twitter Card |
| `public/robots.txt` | 크롤러 접근 제어 |
| `public/sitemap.xml` | 사이트맵 |
| `.env` | SEO 관련 환경변수 |

---

## 기본 메타 태그

### 위치
- `public/index.html:7-13`
- `src/pages/Main/Main.html:7-13`

### 설정 내용

```html
<!-- 기본 SEO 메타 태그 -->
<title>DOTELINE - 프리미엄 LED 드라이버 칩 솔루션</title>
<meta name="description" content="도트라인은 고품질 LED 드라이버 칩과 디스플레이 솔루션을 제공합니다...">
<meta name="keywords" content="LED, 드라이버칩, 디스플레이, 도트라인, DOTELINE, LED솔루션...">
<meta name="author" content="DOTELINE">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{{BASE_URL}}">
```

### 각 태그 설명

| 태그 | 용도 |
|------|------|
| `title` | 검색 결과에 표시되는 페이지 제목 (50-60자 권장) |
| `description` | 검색 결과에 표시되는 페이지 설명 (150-160자 권장) |
| `keywords` | 페이지 관련 키워드 (쉼표로 구분) |
| `author` | 콘텐츠 작성자/회사명 |
| `robots` | 검색엔진 크롤러 지시사항 |
| `canonical` | 중복 콘텐츠 방지를 위한 대표 URL |

---

## Open Graph (소셜 미디어)

### 위치
- `public/index.html:15-24`
- `src/pages/Main/Main.html:15-22`

### 설정 내용

```html
<!-- Open Graph (Facebook, LinkedIn 등) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="DOTELINE">
<meta property="og:title" content="DOTELINE - 프리미엄 LED 드라이버 칩 솔루션">
<meta property="og:description" content="도트라인은 고품질 LED 드라이버 칩과 디스플레이 솔루션을 제공합니다...">
<meta property="og:url" content="{{BASE_URL}}">
<meta property="og:image" content="{{BASE_URL}}/resources/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
```

### 필수 준비사항

**og:image 이미지 준비**
- 파일 경로: `/resources/og-image.jpg`
- 권장 크기: 1200 x 630 픽셀
- 파일 형식: JPG 또는 PNG
- 용량: 8MB 이하

---

## Twitter Card

### 위치
- `public/index.html:26-30`
- `src/pages/Main/Main.html:24-28`

### 설정 내용

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="DOTELINE - 프리미엄 LED 드라이버 칩 솔루션">
<meta name="twitter:description" content="도트라인은 고품질 LED 드라이버 칩과 디스플레이 솔루션을 제공합니다.">
<meta name="twitter:image" content="{{BASE_URL}}/resources/og-image.jpg">
```

### Twitter Card 유형

| 유형 | 설명 |
|------|------|
| `summary` | 작은 이미지와 텍스트 |
| `summary_large_image` | 큰 이미지와 텍스트 (권장) |
| `app` | 앱 다운로드 카드 |
| `player` | 비디오/오디오 플레이어 |

---

## 구조화된 데이터 (JSON-LD)

### 위치
- `public/index.html:41-102`

### 설정 내용

**1. 조직(Organization) 스키마**
```json
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DOTELINE",
    "alternateName": "도트라인",
    "url": "{{BASE_URL}}",
    "logo": "{{BASE_URL}}/resources/icon/logo.png",
    "description": "도트라인은 고품질 LED 드라이버 칩과 디스플레이 솔루션을 제공하는 전문 기업입니다."
}
```

**2. 웹사이트(WebSite) 스키마**
```json
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DOTELINE",
    "url": "{{BASE_URL}}",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "{{BASE_URL}}/product?search={search_term_string}",
        "query-input": "required name=search_term_string"
    }
}
```

**3. 빵부스러기(BreadcrumbList) 스키마**
```json
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "홈", "item": "{{BASE_URL}}"},
        {"@type": "ListItem", "position": 2, "name": "제품", "item": "{{BASE_URL}}/product"},
        {"@type": "ListItem", "position": 3, "name": "솔루션", "item": "{{BASE_URL}}/solution"}
    ]
}
```

### JSON-LD 검증 도구
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## robots.txt

### 위치
- `public/robots.txt`

### 설정 내용

```txt
# 모든 검색엔진 봇 허용
User-agent: *
Allow: /

# 관리자/개발 영역 차단
Disallow: /server/
Disallow: /node_modules/
Disallow: /logs/

# 사이트맵 위치
Sitemap: https://doteline.co.kr/sitemap.xml
```

### 주요 지시어

| 지시어 | 설명 |
|--------|------|
| `User-agent: *` | 모든 크롤러에 적용 |
| `Allow: /` | 해당 경로 크롤링 허용 |
| `Disallow: /path/` | 해당 경로 크롤링 차단 |
| `Sitemap:` | 사이트맵 위치 명시 |

---

## sitemap.xml

### 위치
- `public/sitemap.xml`

### 설정 내용

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://doteline.co.kr/</loc>
        <lastmod>2025-01-18</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <!-- 추가 URL들... -->
</urlset>
```

### 각 태그 설명

| 태그 | 설명 | 값 |
|------|------|-----|
| `loc` | 페이지 URL | 전체 URL |
| `lastmod` | 마지막 수정일 | YYYY-MM-DD |
| `changefreq` | 변경 빈도 | always, hourly, daily, weekly, monthly, yearly, never |
| `priority` | 우선순위 | 0.0 ~ 1.0 |

### 사이트맵 업데이트
새 페이지 추가 시 sitemap.xml에 해당 URL을 추가해야 합니다.

---

## 검색엔진 등록

### Google Search Console

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가 → URL 접두어 방식으로 `https://doteline.co.kr` 입력
3. HTML 태그 또는 DNS 레코드로 소유권 확인
4. 사이트맵 제출: `https://doteline.co.kr/sitemap.xml`

### Naver Search Advisor

1. [Naver Search Advisor](https://searchadvisor.naver.com/) 접속
2. 사이트 등록
3. 소유권 확인 (HTML 파일 업로드 또는 메타 태그)
4. 사이트맵 제출

### Daum/Kakao

1. [Daum 검색등록](https://register.search.daum.net/index.daum) 접속
2. 사이트 정보 입력 및 등록

### Bing Webmaster Tools

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) 접속
2. 사이트 추가
3. 소유권 확인
4. 사이트맵 제출

---

## 추가 최적화 권장사항

### 1. 페이지 속도 최적화
- 이미지 압축 (WebP 형식 권장)
- CSS/JS 파일 minify
- 브라우저 캐싱 활용
- CDN 사용

### 2. 모바일 최적화
- 반응형 디자인 적용 ✅
- 터치 친화적 UI
- 모바일 페이지 속도 최적화

### 3. HTTPS 적용
- SSL 인증서 설치 ✅
- HTTP → HTTPS 리다이렉트 설정

### 4. 콘텐츠 최적화
- 고품질 콘텐츠 작성
- 키워드 자연스럽게 배치
- 내부 링크 구조 최적화
- 이미지 alt 속성 추가

### 5. 정기적인 모니터링
- Google Search Console에서 색인 상태 확인
- 검색 순위 모니터링
- 사이트맵 정기 업데이트

---

## 환경변수 설정

`.env` 파일에서 SEO 관련 환경변수를 설정할 수 있습니다:

```env
# SEO 설정
SITE_NAME=DOTELINE
SITE_DESCRIPTION=프리미엄 LED 드라이버 칩 솔루션 - 도트라인
SITE_KEYWORDS=LED,드라이버칩,디스플레이,도트라인,DOTELINE,LED솔루션
BASE_URL=https://doteline.co.kr
DOMAIN=doteline.co.kr
```

---

## 체크리스트

배포 전 확인사항:

- [ ] og:image 이미지 파일 준비 (`/resources/og-image.jpg`)
- [ ] 로고 이미지 확인 (`/resources/icon/logo.png`)
- [ ] .env 파일의 BASE_URL, DOMAIN 설정
- [ ] sitemap.xml의 URL 및 날짜 업데이트
- [ ] Google Search Console 등록
- [ ] Naver Search Advisor 등록
- [ ] SSL 인증서 적용 확인

---

## 참고 자료

- [Google 검색 센터](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Naver 검색 가이드](https://searchadvisor.naver.com/guide)
