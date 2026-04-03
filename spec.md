# SNOW Dashboard — Product Spec

> 이 파일은 Cursor 등 AI 개발 도구가 읽고 바로 개발할 수 있도록 작성된 스펙 문서입니다.
> 코드 작업 전 이 파일과 `CLAUDE.md`를 반드시 먼저 읽으세요.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **서비스명** | SNOW 앱 구독 프로모션 대시보드 |
| **목적** | 매주 프로모션 소재 성과 분석 + 소재 추천 + 피로도 모니터링 |
| **파일 경로** | `/Users/user/Desktop/snow-dashboard/index.html` |
| **배포 URL** | https://Yen-lab.github.io/dashboard-test |
| **피그마** | https://www.figma.com/design/9utkqftvM5DYcinJlKzps0/dashboard-design-rule?t=ObKerFMBVDmXgXI2-0 |
| **사용자** | SNOW 마케팅 팀 내부 |

---

## 2. 기술 스택

| 구분 | 내용 |
|------|------|
| **구조** | 단일 HTML 파일 (`index.html`) — 빌드 도구 없음 |
| **차트** | Chart.js 4.4.0 (CDN) |
| **지구본** | cobe 0.6.3 (ESM, 인트로 화면 전용) |
| **스타일** | Vanilla CSS (`<style>` 인라인) — CSS 변수 시스템 |
| **로직** | Vanilla JS (`<script>` 인라인) — 모듈 없음 |
| **패키지 매니저** | 없음 (모두 CDN) |
| **보조 파일** | `snow-ui-patch.js`, `logo.png`, `image.png` |

> ⚠️ React/Vue/Tailwind 사용 금지. 기존 Vanilla JS+CSS 방식 유지.

---

## 3. 컬러 시스템

> 피그마 파일(`dashboard-design-rule`) Color Palette 섹션에서 직접 추출한 값입니다.

### 3-1. 블루 팔레트 (메인 팔레트)

| 토큰 | Hex | 용도 |
|------|-----|------|
| `$color.palette.blue-100` | `#e5f3ff` | 배경, 히트맵 낮은값, hover 배경 |
| `$color.palette.blue-200` | `#b3dbff` | 히트맵 중하위, 연한 강조 |
| `$color.palette.blue-300` | `#80c3ff` | 중간 강조 |
| `$color.palette.blue-400` | `#4dacff` | SAN 구좌 색상, 히트맵 중위 |
| `$color.palette.blue-500` | `#1a94ff` | 스플래시 구좌 색상, 인트로 강조 |
| `$color.palette.blue-600` | `#007ae6` | **키컬러** — 일반팝업, 버튼, 링크, --green 변수 |
| `$color.palette.blue-700` | `#005fb3` | 어두운 강조 |
| `$color.palette.blue-800` | `#004480` | 슬롯 배지 텍스트 |
| `$color.palette.blue-900` | `#00294d` | 히트맵 최고값, 최어두운 강조 |

### 3-2. 그레이 팔레트

| 토큰 | Hex | 용도 |
|------|-----|------|
| `$color.palette.gray-00` | `#FFFFFF` | 카드 배경, 흰색 |
| `$color.palette.gray-100` | `#F7F8F9` | 페이지 배경 대안 |
| (사용 중) | `#F0FBFF` | 실제 --bg 값 (하늘빛 흰색) |
| (사용 중) | `#EBEBEB` | --border 값 |
| (사용 중) | `#AAAAAA` | 비활성 텍스트 |
| (사용 중) | `#1A1A1A` | --text, --sub (기본 텍스트) |

### 3-3. 상태 컬러

| 이름 | Hex | 용도 |
|------|-----|------|
| 성장 (up) | `#00B87C` | 상승 지표 delta |
| 경고 (down) | `#FF4560` | 하락 지표, 피로도 critical |
| 오렌지 | `#FF6B35` | 피로도 warning, 강조 |
| 컨텐츠 | `#FF6B9D` | 컨텐츠 카테고리 태그, SAN 컨텐츠 |

### 3-4. CSS 변수 전체 (`:root`)

```css
:root {
  --bg:        #F0FBFF;   /* 전체 배경 */
  --card:      #FFFFFF;   /* 카드 배경 */
  --border:    #EBEBEB;   /* 테두리 */
  --green:     #007ae6;   /* ⚠️ 이름과 달리 블루 — 키컬러 */
  --growth:    #00B87C;   /* 실제 그린 (상승 지표) */
  --orange:    #FF6B35;
  --red:       #FF4560;
  --text:      #1A1A1A;
  --sub:       #1A1A1A;
  --mid:       #1A1A1A;
  --splash:    #1a94ff;   /* 스플래시 구좌 */
  --san:       #4dacff;   /* SAN 구좌 */
  --popup:     #007ae6;   /* 일반팝업 구좌 */
  --content:   #FF6B9D;   /* 컨텐츠 카테고리 */
  --ai:        #007ae6;   /* AI기능 카테고리 */
  --sidebar-w: 200px;
}
```

---

## 4. 절대 건드리지 말아야 할 것

| 대상 | 이유 |
|------|------|
| `--green` CSS 변수명 | 전체 코드에서 키컬러로 사용. 실제 색은 블루(#007ae6). 이름 변경 시 전체 깨짐 |
| 인트로 스크린 (`#intro-screen`) | cobe 지구본 + 그라디언트 + 버블텍스트 복잡한 인터랙션 |
| `background: #1A1A1A` (텍스트 색) | 모든 텍스트 및 사이드바 active 상태의 기준 |
| `#FF4560` / `#FF6B35` (경고 색상) | 피로도 시각화 핵심 — 변경 시 사용자 인지 혼란 |
| `#00B87C` (성장 색상) | 상승 delta 표시 전체에 사용 |
| `border-radius: 20px` (카드) | 전체 디자인 언어 기준값 |
| `cellBg(t)` / `cellFg(t)` 함수 | 히트맵 6단계 팔레트 로직 |
| `snow-ui-patch.js` | 별도 패치 파일. 수정 전 반드시 내용 확인 |
| Chart.js 캔버스 ID | JS에서 직접 참조 (`ctrTrendChart` 등). 변경 시 차트 렌더 오류 |

---

## 5. 페이지 구조

```
#sidebar (200px)
│
├── DASHBOARD
│   ├── 대시보드 홈          (data-page="home")
│   └── 주간 인사이트        (data-page="insight")
│
├── ANALYSIS
│   ├── 구좌별 분석          (data-page="slot")     — 스플래시 / SAN / 일반팝업 서브탭
│   ├── 카테고리 비교        (data-page="category") — AI기능 vs 컨텐츠
│   └── 피로도 모니터링      (data-page="fatigue")
│
├── PLANNING
│   └── 소재 플래닝          (data-page="planning") — 검증 소재 재추천 + 룩북 + 월별 추천
│
├── RETENTION
│   └── 재구독 & 윈백        (data-page="retention")
│
└── ARCHIVE
    └── 소재 아카이브        (data-page="archive")  — 검색 + 필터 + 카드 그리드
```

### 페이지별 초기화 방식

| 페이지 | 초기화 | 방식 |
|--------|--------|------|
| home, insight | 즉시 실행 | 페이지 로드 시 렌더 |
| slot | `initSlotCharts(slot)` | 첫 진입 + 탭 전환 시 |
| category | `initCategoryCharts()` | lazy (첫 진입 1회) |
| fatigue | `initFatigueCharts()` | lazy |
| planning | `initLookbook()` | lazy |
| retention | `initRetentionCharts()` | lazy |
| archive | `initArchive()` | lazy |

### 탭 필터 표시 페이지
`TAB_PAGES = ['home', 'slot']` — 이 두 페이지에서만 상단 구좌 탭(전체/스플래시/SAN/일반팝업) 표시.

---

## 6. 데이터 구조

### 6-1. CSV 포맷 (SNOW 내보내기 형식)

```
행 0~3: 헤더/메타 (스킵)
행 4~: 데이터

컬럼:
  [0] 콘텐츠명 (소재 이름, 병합셀 → 비어있으면 이전 값 사용)
  [1] 날짜      (YY/MM/DD 형식)
  [2] 주차      (파서 내부에서 toKorWeek 변환)
  [3] 구좌      (현재 파서는 미사용, 기본 'splash')
  [4] 클릭수
  [5] 노출수(진입수 또는 뷰)
  [6] 클릭률    (CTR, %)
```

> 현재 CSV 파서는 스플래시 구좌 기준으로 구현되어 있음. 다구좌 통합 시 [3]컬럼 파싱 추가 필요.

### 6-2. 소재 데이터 오브젝트 (파싱 후 구조)

```js
{
  name:        string,     // 소재명
  cat:         'ai' | 'cont',
  slot:        'splash' | 'san' | 'popup',
  weekLabels:  string[],   // ['8월 4주', '9월 1주', ...]
  ctrTrend:    number[],   // 주차별 CTR (%)
  clicks:      number,     // 총 클릭수
  totalViews:  number,     // 총 노출수
  ctr:         number,     // 전체 CTR (%)
  runWeeks:    number,     // 운영 주수
  ctrDecline:  number,     // 피크 대비 하락률 (%)
  fatigue:     boolean,    // 피로도 감지 여부
  grade:       'A'|'B'|'C'|'D'
}
```

### 6-3. 카테고리 분류 로직 (`detectCat`)

```js
// 아래 키워드 포함 → 'cont' (컨텐츠)
const CONT_KEYWORDS = [
  'SUMMER','WINTER','SPRING','HEART','BLUE','VIVID','NEWYORK','HOLIDAY',
  '졸업','벚꽃','할로윈','추석','여름','휴가','크리스마스','시즌','할인'
];
// 나머지 → 'ai' (AI기능)
```

---

## 7. 주요 기능 로직

### 7-1. 소재 등급 산출 (`computeGrade`)

```js
// 평균 CTR 대비 비율로 등급 산정
// 기본 평균 CTR: 2.35% (CSV 없을 때 fallback)
const ratio = (소재 CTR / 평균 CTR) * 100;

A: ratio >= 120%   // 평균 대비 120% 이상
B: ratio >= 100%   // 평균 이상
C: ratio >= 80%    // 평균의 80% 이상
D: ratio < 80%     // 평균의 80% 미만
```

### 7-2. 피로도 감지 (`getSeverity`)

```js
// 슬라이더로 임계값 조정 가능 (기본값: 운영 3주 이상, CTR 전주 대비 -20% 이상)
const isOld  = runWeeks >= weekThreshold;      // 기본 3주
const isDrop = ctrDeclineWoW >= dropThreshold; // 기본 20%

'critical': isOld && isDrop  // 빨강 (#FF4560)
'warning':  isOld || isDrop  // 오렌지 (#FF6B35)
'normal':   그 외             // 파랑 (#1a94ff)
```

```
CSV 파서에서는 단순화:
fatigue = (runWeeks >= 3) && (ctrDecline >= 20)
```

### 7-3. 검증 소재 재추천 기준

```
구독 전환↑ + 6주 이상 운영 소재 → 검증 소재로 분류
현재 3개 하드코딩 샘플:
  1. 하이라이트 특집 v2 — CTR 4.67%, 9주, 일반팝업
  2. 3DLash2 리마스터   — CTR 2.64%, 7주, 스플래시
  3. Newyork 여행 시리즈 — CTR 2.62%, 8주, SAN
```

### 7-4. 히트맵 셀 색상 함수 (`cellBg(t)`)

```js
// t: 0 = 해당 월 최솟값, 1 = 최댓값 기준 상대값
t < 0.25  → 사선 줄무늬 (repeating-linear-gradient 45deg, #e5f3ff/#ffffff)
t < 0.40  → #e5f3ff
t < 0.60  → #b3dbff
t < 0.80  → #4dacff
t < 0.95  → #007ae6
t >= 0.95 → #00294d
// 텍스트: t < 0.40 → #1A1A1A, 이상 → #ffffff
```

---

## 8. 디자인 시스템

> 피그마 `dashboard-design-rule` 파일 기반.

### 8-1. 폰트 (피그마에서 확인)

```
서비스 내 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
피그마 디자인 폰트: Pretendard (한/영 공통)
```

| 스타일 | Size | Line Height | Letter Spacing | Weight |
|--------|------|-------------|----------------|--------|
| Headline 01 | 32px | 145% | -1px | Bold / Semibold |
| Headline 02 | 24px | 145% | -1px | Bold / Semibold |
| Subtitle 01 | 20px | 145% | -1px | Semibold / Medium |
| Subtitle 02 | 18px | 145% | -1px | Semibold / Medium |
| Body 01 | 16px | 145% | -1px | Semibold / Medium / Regular |
| Body 02 | 14px | 145% | -1px | Semibold / Medium / Regular |
| Caption 01 | 12px | 145% | -1px | Semibold / Medium / Regular |
| Caption 02 | 10px | 145% | -1px | Semibold / Medium / Regular |

### 8-2. 스페이싱 (피그마에서 확인)

| 토큰 | 값 | 용도 |
|------|----|------|
| spacing-1 | 4px | 최소 여백, 부연 요소 |
| spacing-2 | 8px | 버튼/칩 수평·수직 배열 |
| spacing-3 | 12px | 일반 내부 간격 |
| spacing-4 | 16px | 컴포넌트 간 간격 |
| spacing-5 | 20px | 네비게이션 ~ 타이틀 |

### 8-3. 카드 (`.card`, `.chart-card`)

```css
background:   #FFFFFF;
border:       1px solid #EBEBEB;
border-radius: 20px;           /* ⚠️ 변경 금지 */
padding:      20px 24px;       /* chart-card는 24px */
box-shadow:   0 2px 16px rgba(0,0,0,0.05);
```

강조 카드: `border-top: 3px solid {color}` 패턴 사용

### 8-4. 사이드바 (`.nav-item`)

```css
/* 기본 */
border-radius: 10px;
padding: 9px 12px;
color: #1A1A1A;

/* 호버 */
background: #F5F5F5;

/* 활성 ⚠️ 변경 금지 */
background: #1A1A1A;
color: #FFFFFF;
font-weight: 600;

/* 섹션 라벨 */
font-size: 10px;
font-weight: 700;
letter-spacing: 1.5px;
text-transform: uppercase;
color: #1A1A1A;
```

### 8-5. 버튼 (GlassEffect — `.tab-btn`, `.csv-upload-label`)

```css
border: 1px solid rgba(255,255,255,0.55);
background: rgba(255,255,255,0.22);
backdrop-filter: blur(3px);
box-shadow:
  0 4px 6px rgba(0,0,0,0.1),
  0 0 16px rgba(0,0,0,0.06),
  inset 2px 2px 1px rgba(255,255,255,0.55),
  inset -1px -1px 1px rgba(255,255,255,0.38);
border-radius: 20px;
transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 2.2);
```

### 8-6. 피로도 배지 (MetalButton 스타일)

```css
/* critical / warning 공통 */
background: linear-gradient(to bottom, #F08D8F, #A45253) padding-box,
            linear-gradient(to bottom, #5A0000, #FFAEB0) border-box;
border: 1.25px solid transparent;
color: #FFF7F0;
text-shadow: 0 -1px 0 rgba(146,64,14,1);
border-radius: 8px;
```

---

## 9. 인트로 화면

```
배경:     ./image.png (cover, center 20%)
레이어:   Three.js 그라디언트 (Gradient 라이브러리, snow-ui-patch.js)
지구본:   cobe 0.6.3 — canvas #intro-globe-canvas, 드래그 인터랙션
텍스트:   "SNOW Dashboard" — 버블 효과 (마우스오버 시 글자별 weight/scale 변환)
버튼:     "대시보드 시작하기 →" GlassEffect, 클릭 시 인트로 fadeOut (0.9s)
```

---

## 10. 데이터 한계 및 주의사항

| 한계 | 내용 |
|------|------|
| **구독 직접 추적 불가** | 팝업 이탈 후 재진입 구독 경로 추적 안 됨. 프로모션 직접 전환만 집계 가능. |
| **CTR 하락 원인 다변수** | 피로도 감지는 추정값. 시즌/외부 요인 배제 불가. |
| **재구독/윈백 데이터** | 별도 데이터 소스 필요. 현재 샘플 수치로 표시 중 (CSV와 별도). |
| **단일 파일 구조** | 코드가 3800+ 줄. 수정 시 관련 함수/섹션 먼저 grep으로 확인 후 작업. |
| **CSV 구좌 구분** | 현재 파서는 스플래시 단일 구좌 기준. 다구좌 CSV 업로드 시 별도 처리 필요. |

---

## 11. 월별 시즌 데이터

| 월 | 시즌/테마 |
|----|-----------|
| 1월 | 새해, 겨울 뷰티, 신년 혜택 |
| 2월 | 발렌타인, 졸업 준비, 봄 예고 |
| 3월 | 졸업, 벚꽃, 봄나들이 |
| 4월 | 벚꽃, 봄나들이, 봄 감성 |
| 5월 | 가정의달, 어린이날, 여름 시작 |
| 6월 | 여름 시작, 장마, 휴가 준비 |
| 7월 | 여름휴가, 바다, 워터파크 |
| 8월 | 여행, 일몰, 여름 마무리 |
| 9월 | 추석, 한복, 가을 |
| 10월 | 할로윈, 단풍, 가을 감성 |
| 11월 | 수능, 연말 준비, 가을→겨울 |
| 12월 | 크리스마스, 연말, 겨울 감성 |

---

## 12. 주요 ID/클래스 참조 (개발 시 참고)

### HTML ID

| ID | 역할 |
|----|------|
| `#sidebar` | 200px 좌측 네비게이션 |
| `#main` | 우측 전체 영역 |
| `#topbar` | 상단 바 |
| `#content` | 스크롤 가능 콘텐츠 영역 |
| `#page-{name}` | 각 페이지 컨테이너 (`.page` 클래스로 show/hide) |
| `#lookbookGrid` | 소재 룩북 카드 렌더링 |
| `#archive-grid` | 소재 아카이브 카드 렌더링 |
| `#archive-search` | 아카이브 검색 입력 |
| `#fatigueList` | 피로도 소재 목록 렌더링 |
| `#weekBadge` | 상단 주차 배지 |
| `#page-title-text` | 상단 바 페이지 제목 |
| `#csvToast` | CSV 업로드 토스트 메시지 |

### 주요 클래스

| 클래스 | 역할 |
|--------|------|
| `.page` | 모든 페이지 컨테이너. `.active` 추가 시 표시 |
| `.card` | 기본 KPI 카드 (radius 20px) |
| `.chart-card` | 차트/섹션 카드 |
| `.nav-item` | 사이드바 메뉴 항목 |
| `.tab-btn` | 구좌 탭 버튼 (GlassEffect) |
| `.filter-btn` | 필터 버튼 (룩북, 아카이브) |
| `.grade-badge.grade-{a/b/c/d}` | 소재 등급 배지 |
| `.slot-badge.{splash/san/popup}` | 구좌 배지 |
| `.mat-card` | 소재 룩북 카드 |
| `.fatigue-item.{critical/warning}` | 피로도 목록 아이템 |

---

## 13. 피그마 연동

- **MCP 연동**: `@figma/mcp` — `~/.claude/mcp.json`에 설정 완료
- **파일 키**: `9utkqftvM5DYcinJlKzps0`
- **주요 섹션 Node ID**:

| 섹션 | Node ID |
|------|---------|
| Color Palette (전체) | `1:74` |
| Gray 팔레트 | `1:75` |
| Chromatic (orange/blue/green/red/yellow) | `1:89` |
| Blue 팔레트 (100~900) | `1:103` (Frame 10) |
| Color Roles / Tokens | `1:151` |
| Typography | `1:691` |
| Spacing | `1:810` |

---

*최종 업데이트: 2026-04-01*
