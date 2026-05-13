# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

운동 트래커 웹앱. 빌드 시스템·패키지 매니저·테스트 프레임워크 없음. GitHub Pages로 배포.

**실행 방법**: 브라우저에서 `index.html`을 직접 열거나 로컬 HTTP 서버 사용.
```bash
python3 -m http.server 8080
# 또는
npx serve .
```

## Architecture

3개 파일로 구성:

| 파일 | 내용 |
|------|------|
| `index.html` | Alpine.js 디렉티브가 포함된 HTML 마크업만 존재 |
| `style.css` | 커스텀 CSS — phone shell, 카드, 입력 상태 클래스, 애니메이션 등 |
| `app.js` | 전역 타이머 함수(`startTimer`/`stopTimer`/`updateTimerUI`), `showToast`, `DEFAULT_DAYS` 상수, Alpine `app()` 컴포넌트 |

**외부 의존성** (CDN, 오프라인 불가):
- Alpine.js 3.13.5
- Tailwind CSS 2.2.19
- Noto Sans KR (Google Fonts)

## State & Persistence

localStorage 키 패턴:
- `wt3_routine` — 커스텀 루틴 (`days` 배열 JSON)
- `wt3_YYYY-MM-DD` — 당일 운동 기록 (`workoutData` 객체)
- `wt3_def_YYYY-MM-DD` — 스마트 기본값 carry-over (`smartDefaults` 객체)
- `wt3_tab_YYYY-MM-DD` — 마지막으로 선택한 탭 인덱스

`workoutData` 키 형식: `"dayIdx_exIdx_fieldName"` (예: `"0_1_weight_2"`, `"0_1_set_2"`)

## Smart Default 로직

입력 우선순위 (높→낮): 사용자가 직접 입력한 값 → `smartDefaults` carry-over → `ex.defaultWeight`/`ex.defaultReps` → `ex.reps` (목표 횟수).

세트 완료(`toggleSet`) 시 해당 세트의 실제 값이 다음 세트의 `smartDefaults`로 전파됨.

## Key UI Patterns

- **`.is-default`** / **`.is-real`** / **`.is-done`** — 입력 필드의 세 가지 CSS 상태
- **Desktop mode**: `#phone-shell`이 최대 480px 카드로 렌더링, `@media (min-width: 481px)` 규칙으로 notch/home bar 표시
- **Modal**: `modal-overlay` + `modal-sheet` 패턴, `@click.self`로 외부 클릭 닫기
- 타이머(`timer-float`)는 Alpine 외부 전역 함수로 관리 — Alpine 상태와 공유하지 않음
