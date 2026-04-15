# 열관류율 종합 검토 시스템 · MANMIN-Ver3.1

> 건축물 에너지절약설계기준 **국토교통부고시 제2025-738호** 기반  
> 반응형 PWA (데스크탑 · 태블릿 · 모바일 완벽 지원)

[![Version](https://img.shields.io/badge/MANMIN-Ver3.1-1d4ed8?style=flat-square)](https://github.com/GKDU/MANMIN-Ver3.1)
[![PWA](https://img.shields.io/badge/PWA-지원-059669?style=flat-square)](https://github.com/GKDU/MANMIN-Ver3.1)
[![License](https://img.shields.io/badge/License-MIT-f97316?style=flat-square)](LICENSE)

---

## 📋 개요

| 항목 | 내용 |
|------|------|
| **버전** | MANMIN-Ver3.1 |
| **기준 고시** | 국토교통부고시 제2025-738호 (2025.12.31) |
| **대상** | 건축물 에너지절약설계기준 열관류율 검토 |
| **프레임워크** | React 18 (UMD) + Babel Standalone |
| **배포 방식** | 단일 HTML 파일 + PWA |

---

## 🚀 주요 기능

### 📐 열관류율 자동 산출
- `U = 1/ΣR` 공식 실시간 계산
- 레이어 추가/삭제/순서 변경
- 재료 DB 150+ 자동완성 검색
- 공기층 특수 처리 (최대 R=0.086)

### 🗺️ 지역·부위 자동 기준 적용
- 4개 지역 (중부1/중부2/남부/제주)
- 별표1 기준 U값 자동 표시
- 부위별 표면저항 자동 적용 (별표5)

### ⚖️ 적합 판정
- 법정 기준 vs 설계값 실시간 비교
- 적합/부적합 즉시 판정
- 단열재 등급(가/나/다/라) 표시

### 🖨️ 출력 기능
- A4 보고서 인쇄/PDF 저장
- RTS 부하계산서 연동 (`localStorage`)

### 📱 PWA 지원
- 오프라인 동작 (Service Worker)
- 홈화면 설치 (Android/iOS)
- 반응형: 데스크탑 ↔ 태블릿 ↔ 모바일

### 💬 우측 하단 도움말 모달 (신규)
- 이용방법 5단계 가이드
- 계산식 및 산출 예시
- 표면저항 기준표 (별표5)
- 단열재 등급 기준 (별표2)
- 지역 구분 안내 (별표1)
- 관련 법령 자료 링크

---

## 📁 파일 구조

```
MANMIN-Ver3.1/
├── index.html          # 메인 앱 (단일 파일 SPA)
├── manifest.json       # PWA 매니페스트
├── sw.js               # Service Worker
├── favicon.ico         # 파비콘
├── icons/              # PWA 아이콘 세트
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── apple-touch-icon.png
│   └── brand-icon.png
├── screenshots/        # PWA 스크린샷
│   ├── desktop.png
│   └── mobile.png
└── README.md           # 이 파일
```

---

## 🛠️ 설치 및 배포

### GitHub Pages 배포
```bash
git clone https://github.com/GKDU/MANMIN-Ver3.1.git
cd MANMIN-Ver3.1
# GitHub Pages → Settings → Pages → Source: main branch
```

### 로컬 실행
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# 브라우저에서 http://localhost:8080 접속
```

> ⚠️ Service Worker는 HTTPS 또는 `localhost`에서만 작동합니다.

---

## 📊 재료 DB 구성

| 카테고리 | 재료 수 | 주요 재료 |
|---------|--------|---------|
| A. 금속계 | 7+ | 동, 알루미늄, 철, 강재 |
| C. 콘크리트계 | 10+ | 철근콘크리트, 경량콘크리트, 기포콘크리트 |
| D. 미장재료계 | 8+ | 시멘트몰탈, 모르타르, 플라스터 |
| E. 목재계 | 7+ | 소나무, 합판, 목재 |
| G. 요업제품계 | 12+ | 타일, 벽돌, 유리 |
| **K. 단열재계** | **40+** | EPS/XPS/PUR/PF/미네랄울/그라스울 |
| M. 창호·공기층 | 3 | 공기층, 이중창, 철제문 |

---

## 🔗 연계 시스템

| 시스템 | URL | 설명 |
|--------|-----|------|
| **🧱 WAP 열관류율** | 현재 페이지 (MANMIN-Ver3.1) | 열관류율 자동 산출 |
| **📊 RTS 부하계산서** | [manminkim-eng.github.io/Radiant-Time-Series-Method](https://manminkim-eng.github.io/Radiant-Time-Series-Method/) | RTS법 냉난방 부하계산 |

### 연동 흐름
```
열관류율 WAP (Ver3.1)
    ↓  U값 산출 완료
    ↓  [📤 RTS 전송] 버튼 클릭
    ↓  localStorage → MANMIN_UVAL_LIST / MANMIN_UVAL_LATEST
    ↓  새 탭으로 RTS 자동 오픈
RTS 부하계산서 Ver3.0
    ↓  [🔄 전송 데이터 불러오기] 클릭
    ↓  부위별 U값 자동 반영
    ↓  외부 열취득 CTS 계산 진행
```

---

## 🔗 관련 법령

- [건축물의 에너지절약 설계기준 (국토교통부고시 제2025-738호)](https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000228997)
- [별표1] 지역별 건축물 부위의 열관류율표
- [별표2] 단열재의 등급 분류
- [별표3] 단열재의 두께
- [별표4] 창 및 문의 단열성능
- [별표5] 표면 열전달저항
- [별표6] 중공층의 열저항

---

## 📝 변경 이력

### Ver3.1 (2025)
- ✅ 반응형 레이아웃 전면 개선 (데스크탑/태블릿/모바일)
- ✅ **우측 하단 도움말 모달 신설** (이용방법·계산식·관련자료)
- ✅ 재료 DB 자동완성 검색 개선
- ✅ 레이어 순서 변경(▲▼) 기능 추가
- ✅ RTS 전송 버튼 조건부 표시 개선
- ✅ PWA 매니페스트 `screenshots` 추가
- ✅ 디자인 통일성 강화 (MANMIN CSS 토큰 시스템)

### Ver3.0
- 초기 열관류율 WAP 구축
- 기본 PWA 지원

---

## 👤 개발

**Architect KIM MANMIN**  
만민 건축사사무소

---

## 📄 라이선스

MIT License — 자유로운 사용 가능, 출처 표기 권장.
