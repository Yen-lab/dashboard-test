# SNOW Dashboard — CLAUDE.md

> **작업 전 반드시 이 파일을 먼저 읽고 시작할 것.**

---

## 프로젝트 개요

- **프로젝트명**: SNOW 구독 프로모션 대시보드
- **파일 구조**: 단일 파일 (`index.html`) + `snow-ui-patch.js`, `logo.png`, `image.png`
- **목적**: SNOW 앱 구독 프로모션 소재 성과 분석 및 플래닝 지원 내부 대시보드
- **외부 라이브러리**: Chart.js 4.4.0, cobe 0.6.3 (인터랙티브 지구본)
- **피그마 디자인 규칙**: https://www.figma.com/design/9utkqftvM5DYcinJlKzps0/dashboard-design-rule?t=ObKerFMBVDmXgXI2-0

---

## 컬러 시스템 (블루 팔레트)

CSS 변수는 `:root`에 정의. **`--green`은 이름과 달리 블루(#007ae6)** — 절대 실제 그린으로 바꾸지 말 것.

```css
:root {
  --bg:      #F0FBFF;   /* 메인 배경: 연한 하늘색 */
  --card:    #FFFFFF;   /* 카드/사이드바 배경 */
  --border:  #EBEBEB;   /* 구분선, 카드 테두리 */

  /* 액센트 컬러 (모두 블루 계열) */
  --green:   #007ae6;   /* 메인 액센트 (이름 ≠ 색상, 블루임) */
  --splash:  #1a94ff;   /* 스플래시 구좌 색 */
  --san:     #4dacff;   /* SAN 구좌 색 */
  --popup:   #007ae6;   /* 일반팝업 구좌 색 */
  --ai:      #007ae6;   /* AI기능 태그 색 */

  /* 상태 컬러 */
  --growth:  #00B87C;   /* 상승 지표 (실제 그린) */
  --orange:  #FF6B35;   /* 경고/강조 */
  --red:     #FF4560;   /* 하락 지표 */
  --content: #FF6B9D;   /* 컨텐츠 태그 색 */

  /* 텍스트 */
  --text:    #1A1A1A;
  --sub:     #1A1A1A;   /* 서브 텍스트도 동일 */
  --mid:     #1A1A1A;

  --sidebar-w: 200px;
}
```

### 히트맵 셀 팔레트 (`cellBg(t)` 함수)
| t 범위 | 배경 |
|--------|------|
| 0 ~ 0.25 (하위 25%) | `repeating-linear-gradient(45deg, #e5f3ff 0px, #e5f3ff 1px, #ffffff 1px, #ffffff 6px)` 사선 줄무늬 |
| 0.25 ~ 0.40 | `#e5f3ff` |
| 0.40 ~ 0.60 | `#b3dbff` |
| 0.60 ~ 0.80 | `#4dacff` |
| 0.80 ~ 0.95 | `#007ae6` |
| 0.95 ~ 1.00 (상위 5%) | `#00294d` |

텍스트 색: `t < 0.40` → `#1A1A1A`, 이상 → `#ffffff`

---

## 절대 건드리지 말아야 할 것

1. **인트로 스크린** (`#intro-screen`, `#intro-globe-canvas`, 관련 JS) — cobe 지구본 + 그라데이션 애니메이션. 복잡한 이벤트 핸들러 포함.
2. **`:root` CSS 변수명** — 특히 `--green`은 블루임. 이름을 바꾸면 전체 UI 깨짐.
3. **카드 `border-radius: 20px`** — 전체 디자인 언어 핵심. 변경 금지.
4. **사이드바 너비 `--sidebar-w: 200px`** — 레이아웃 기준값.
5. **`cellBg(t)` / `cellFg(t)` 함수** (히트맵 색상) — 위 팔레트 스펙 유지.
6. **`snow-ui-patch.js`** — 패치 파일. 내용 변경 전 반드시 읽을 것.
7. **Chart.js 캔버스 ID** — `ctrTrendChart`, `retentionDonutChart`, `winbackTrendChart` 등 JS에서 직접 참조.

---

## 카드 / 버튼 / 사이드바 스타일 규칙

### 카드 (`.card`, `.chart-card`)
```css
background: var(--card);          /* #FFFFFF */
border: 1px solid var(--border);  /* #EBEBEB */
border-radius: 20px;
padding: 20px 24px;               /* .card 기준, .chart-card는 24px */
box-shadow: 0 2px 16px rgba(0,0,0,0.05);
```
- 강조 카드: `border-top: 3px solid {color}` 패턴 사용
- 차트 카드 제목: `.chart-card-title` — 13px, font-weight 600

### 필터 버튼 (`.filter-btn`)
- 기본: 투명 배경, `border: 1px solid var(--border)`, `border-radius: 20px`
- `.active`: `background: #1A1A1A`, `color: #ffffff`

### 탭 버튼 (`.tab-btn`) — 상단 구좌 필터
- 글래스모피즘 스타일: `backdrop-filter: blur(3px)`, 투명 배경
- `.active`: 구좌별 컬러(--splash/--san/--popup) 적용

### 사이드바 (`.nav-item`)
- 기본: `border-radius: 10px`, 호버 시 `background: #F5F5F5`
- **`.active`: `background: #1A1A1A`, `color: #ffffff`, `font-weight: 600`**
- 섹션 레이블 (`.nav-section-label`): 10px, 700, letter-spacing 1.5px, 대문자

### 태그 (`.tag`)
- 연한 회색 계열 기본. 컬러 강조 태그는 `background: rgba({color}, 0.12); color: {color}` 패턴.

### 등급 배지 (`.grade-badge`)
- `.grade-a`: green 계열, `.grade-b`: blue 계열, `.grade-c`/`.grade-d`: 회색 계열

---

## 페이지 구조 및 기능 설명

### 라우팅
- `data-page` 속성으로 페이지 전환. 클릭 시 `.page.active` 토글.
- `PAGE_TITLES` 객체로 상단 제목 표시.
- 탭 그룹(구좌 필터)은 `TAB_PAGES = ['home', 'slot']` 에서만 표시.

### 페이지 목록

| 섹션 | data-page | 페이지명 | 초기화 함수 | 설명 |
|------|-----------|----------|-------------|------|
| DASHBOARD | `home` | 대시보드 홈 | 즉시 렌더 | KPI 4종 + CTR 트렌드 차트. 구좌 탭 필터 적용. |
| DASHBOARD | `insight` | 주간 인사이트 | 즉시 렌더 | 주간 핵심 지표, 하락 소재, 피로도 요약 |
| ANALYSIS | `slot` | 구좌별 분석 | `initSlotCharts()` lazy | 스플래시/SAN/팝업 별 퍼널, CTR 히트맵, 상세 차트 |
| ANALYSIS | `category` | 카테고리 비교 | `initCategoryCharts()` lazy | AI기능 vs 컨텐츠 비교 차트 |
| ANALYSIS | `fatigue` | 피로도 모니터링 | `initFatigueCharts()` lazy | 소재 피로도 점수 테이블 및 교체 권장 목록 |
| PLANNING | `planning` | 소재 플래닝 | `initLookbook()` lazy | **검증 소재 재추천 카드(상단)** + 소재 룩북 그리드 + 월별 추천 소재 슬라이더 |
| RETENTION | `retention` | 재구독 & 윈백 | `initRetentionCharts()` lazy | 재구독율, 윈백, 이탈율 KPI + 도넛/트렌드 차트 |
| ARCHIVE | `archive` | 소재 아카이브 | `initArchive()` lazy | 검색바 + 카테고리/등급 필터 + 10개 소재 카드 그리드 |

### 소재 플래닝 (`planning`) 세부 구조
1. **검증 소재 재추천** — 구독 전환↑, 6주 이상 운영 기준 3개 카드 (하이라이트 특집 v2, 3DLash2 리마스터, Newyork 여행 시리즈)
2. **소재 룩북** — 카테고리/정렬 필터 + 그리드 + 시즌 TOP3 추천 (`id="lookbookGrid"`)
3. **소재 추천** — 월별 슬라이더, 추천 소재 3종, 프로모션 캘린더 타임라인

### 소재 아카이브 (`archive`) 세부 구조
- `initArchive()` 함수에 10개 샘플 데이터 인라인 정의
- 필터: 카테고리(전체/AI기능/컨텐츠) + 등급(전체/A/B/C) + 텍스트 검색 실시간 적용
- 카드: 등급별 상단 컬러 바 + CTR/주수/태그 표시

---

## 데이터 구조 메모

- 구좌별 CTR 히트맵 데이터: 각 슬롯 객체의 `heatmap: { [주차]: [월,화,수,목,금,토,일] }` 형태 (null = 데이터 없음)
- 소재 룩북 데이터: `LOOKBOOK_DATA` 배열 (라인 ~2400번대)
- 소재 추천 데이터: `REC_DATA` 객체 (1~12월 키) (라인 ~3520번대)
- 아카이브 데이터: `initArchive()` 함수 내 `ITEMS` 배열 (라인 ~3850번대)

---

## 주요 HTML ID 참조

| ID | 역할 |
|----|------|
| `#sidebar` | 200px 좌측 내비게이션 |
| `#main` | 우측 전체 영역 |
| `#topbar` | 상단 바 (페이지 제목 + 탭 + 우측 버튼) |
| `#content` | 스크롤 가능한 페이지 콘텐츠 영역 |
| `#page-{name}` | 각 페이지 컨테이너 (`.page` 클래스) |
| `#lookbookGrid` | 소재 룩북 카드 그리드 렌더링 대상 |
| `#archive-grid` | 소재 아카이브 카드 그리드 렌더링 대상 |
| `#archive-search` | 아카이브 검색 입력 |
| `#vh-table` | 홈 주차별 진입수 히트맵 테이블 |
