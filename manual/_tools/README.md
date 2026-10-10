# 매뉴얼 재생성 도구 (열관류율 종합 검토 시스템 사용자 매뉴얼)

RTS·EPI 매뉴얼과 같은 공통 엔진(`manual_engine.py`: CSS·레이아웃·번호 배지)을 쓴다. 화면이 바뀌면 `bash build.sh <저장소 경로> <raw 폴더>` 한 번으로 아래 4단계가 돈다.

| 단계 | 명령 | 결과 |
|---|---|---|
| 1 캡처 | `node capture_uval.js <저장소 경로> <raw 폴더>` | 화면 PNG 19장 + `_marks.json`(번호 배지 % 좌표) + `_example.json`(예제 검증값) |
| 2 변환·생성 | PNG → WebP(품질 82)를 `../images/`, `_marks.json` 복사 → `MANUAL_DIR=.. python gen_manual_uval.py` | `../index.html` |
| 3 PDF | `node pdf_uval.js .. UVAL_사용자매뉴얼_Ver-5.0.pdf "열관류율 종합 검토 시스템 사용자 매뉴얼 Ver-5.0"` | A4 PDF |
| 4 검증 | `node verify_manual.js <저장소 경로>` | ✓/✗ 표 — 앱 기준값 = 매뉴얼 표, 예제 수치, 표시점 범위, 범례 수 |

- Playwright(Chromium) 필요. 모듈 경로는 환경변수 `MM_PW`, 라이브러리 폴더는 `MM_VENDOR`로 지정. `serve.js`가 CDN(unpkg·cdnjs·jsdelivr)과 Google Fonts를 로컬 파일로 대체한다.
- 예제 = 앱 초기값: 중부2지역 · 거실의 외벽 · 외기 직접 · 공동주택 외 / 몰탈 20 + XPS 1종 A-1 155 + RC 200 + 몰탈 20 → ΣR 6.268 · U 0.160 ≤ 0.240 적합. 부적합 비교는 XPS 80mm(U 0.296).
- 작성일은 캡처 때 2026-10-10으로 고정한다(`FREEZE`).
- 배지는 이미지에 그리지 않고 HTML 위에 겹친다 — 재캡처 후 본문 수정 불필요.
- 법령 값(4장)은 LawMCP 원문(2026-10-10 조회)에서 옮겼다. 고시가 바뀌면 `gen_manual_uval.py` 4장과 `verify_manual.js`를 함께 고친다.
