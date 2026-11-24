# 매뉴얼 재생성 도구 (열관류율 종합 검토 시스템 사용자 매뉴얼)

RTS·EPI 매뉴얼과 같은 공통 엔진(`manual_engine.py`: CSS·레이아웃·번호 배지)을 쓴다. 화면이 바뀌면 `bash build.sh <저장소 경로> <raw 폴더>` 한 번으로 아래 4단계가 돈다.

| 단계 | 명령 | 결과 |
|---|---|---|
| 1 캡처 | `node capture_uval.js <저장소 경로> <raw 폴더>` | 화면 PNG 25장 + `_marks.json`(번호 배지 % 좌표) + `_example.json`(예제 · 부적합 · 계산 불가 · 공기층 · 층간바닥 검증값) |
| 2 변환·생성 | PNG → WebP(품질 82)를 `../images/`, `_marks.json` 복사 → `MANUAL_DIR=.. python gen_manual_uval.py` | `../index.html` |
| 3 PDF | `node pdf_uval.js .. UVAL_사용자매뉴얼_Ver-6.1.pdf "열관류율 종합 검토 시스템 사용자 매뉴얼 Ver-6.1"` | A4 PDF |
| 4 검증 | `node verify_manual.js <저장소 경로>` | ✓/✗ 표 — 앱 기준값 = 매뉴얼 표, 예제 수치, 표시점 범위, 범례 수 |

- Playwright(Chromium) 필요. 모듈 경로는 환경변수 `MM_PW`, 라이브러리 폴더는 `MM_VENDOR`, 로컬 서버 포트는 `MM_PORT`(캡처 기본 8893 · PDF 기본 8895)로 지정. `serve.js`가 CDN(unpkg·cdnjs·jsdelivr)과 Google Fonts를 로컬 파일로 대체한다(vendor가 없는 PC는 `setup()`을 빈 함수로 바꾼 사본으로 CDN을 그대로 통과).
- 예제 = 앱 초기값: 중부2지역 · 거실의 외벽 · 외기 직접 · 공동주택 외 / 몰탈 20 + XPS 1종 A-1 155 + RC 200 + 몰탈 20 → ΣR 6.268 · U 0.160 ≤ 0.240 적합. 부적합 비교는 XPS 80mm(U 0.296).
- Ver-6.1(웹 v6.1.6) 추가 장면: s22 · s22b 계산 불가(XPS 두께 빈 칸) · s23 공기층(공장생산 30mm → R 0.170) · s24 바닥난방인 층간바닥(Ro 미적용 → ΣR 6.201 · U 0.161).
- 작성일은 캡처 때 2026-11-24로 고정한다(`FREEZE`, Ver-5.0은 2026-10-10).
- 배지는 이미지에 그리지 않고 HTML 위에 겹친다 — 재캡처 후 본문 수정 불필요.
- 법령 값(4장)은 LawMCP 원문(2026-10-10 조회)에서 옮겼다. 고시가 바뀌면 `gen_manual_uval.py` 4장과 `verify_manual.js`를 함께 고친다.
