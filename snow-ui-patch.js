/**
 * SNOW Dashboard — UI/UX 개선 스크립트 v2.0
 * index.html </body> 닫기 태그 바로 위에 추가하세요
 *
 * 포함 기능:
 *  1. KPI 카드 카운트업 애니메이션
 *  2. 페이지 전환 트랜지션
 *  3. 헤더 스크롤 shadow
 *  4. 피로도 게이지 SVG 애니메이션
 *  5. CSV 드롭존 drag-over 클래스
 *  6. 테이블 정렬
 *  7. 사이드바 모바일 토글
 */

(function () {
  'use strict';

  /* ── 1. 카운트업 애니메이션 ── */
  function animateCountUp(el) {
    const raw = el.textContent.trim();
    const isPercent = raw.includes('%');
    const isComma   = raw.includes(',');
    const num = parseFloat(raw.replace(/[,%]/g, ''));
    if (isNaN(num)) return;

    const duration = 1200;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const v = num * easeOut(p);
      let display;
      if (isComma && v >= 1000) {
        display = Math.round(v).toLocaleString('ko-KR');
      } else {
        display = isPercent ? v.toFixed(2) : Math.round(v).toString();
      }
      el.textContent = display + (isPercent ? '%' : '');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* IntersectionObserver로 뷰포트 진입 시 카운트업 */
  function initCountUp() {
    const selectors = [
      '.kpi-value', '.metric-value', '.stat-number',
      '.kpi-card .value', '.kpi-card h2', '.kpi-card strong',
      '[class*="kpi"] [class*="number"]',
      '[class*="metric"] [class*="value"]'
    ];
    const els = document.querySelectorAll(selectors.join(','));

    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCountUp(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    els.forEach(el => {
      el.classList.add('count-up');
      obs.observe(el);
    });
  }

  /* ── 2. 페이지 전환 (기존 showPage / navigateTo 함수 래핑) ── */
  function wrapPageTransition() {
    // 공통 패턴: 모든 페이지 섹션 숨기고 대상만 보이는 방식
    const pageSelectors = [
      '.page', '.dashboard-page', '.content-section',
      '[id$="-page"]', '[id$="-section"]'
    ];

    const pages = document.querySelectorAll(pageSelectors.join(','));

    function triggerPageAnimation(targetEl) {
      if (!targetEl) return;
      targetEl.style.animation = 'none';
      targetEl.offsetHeight; // reflow
      targetEl.style.animation = '';
      targetEl.classList.add('page-entering');
      setTimeout(() => targetEl.classList.remove('page-entering'), 400);

      // 카운트업 재실행 (페이지 전환 시)
      const nums = targetEl.querySelectorAll('.count-up');
      nums.forEach(el => {
        setTimeout(() => animateCountUp(el), 150);
      });
    }

    // 사이드바 nav 클릭에 훅
    const navItems = document.querySelectorAll(
      '.nav-item, .sidebar-item, aside a, aside li[onclick], aside button'
    );
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        setTimeout(() => {
          const activePage = document.querySelector(
            '.page:not([style*="display: none"]), .content-section.active'
          );
          triggerPageAnimation(activePage);
          initCountUp();
        }, 50);
      });
    });
  }

  /* ── 3. 헤더 스크롤 shadow ── */
  function initHeaderScroll() {
    const header = document.querySelector(
      '.dashboard-header, .page-header, header.main, header'
    );
    if (!header) return;

    const main = document.querySelector(
      '.main-content, .content-area, main, .dashboard-main'
    );
    const scrollEl = main || window;

    scrollEl.addEventListener('scroll', () => {
      const scrollY = main ? main.scrollTop : window.scrollY;
      header.classList.toggle('scrolled', scrollY > 8);
    }, { passive: true });
  }

  /* ── 4. 피로도 게이지 SVG 애니메이션 ── */
  function initGaugeAnimation() {
    const circles = document.querySelectorAll(
      '.fatigue-gauge circle[stroke-dasharray], .gauge-ring, [class*="gauge"] circle'
    );
    circles.forEach(c => {
      const total = parseFloat(c.getAttribute('stroke-dasharray')) || 283;
      const offset = parseFloat(c.getAttribute('stroke-dashoffset')) || 0;
      c.setAttribute('stroke-dashoffset', total);
      c.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
      setTimeout(() => {
        c.setAttribute('stroke-dashoffset', offset);
      }, 400);
    });
  }

  /* ── 5. CSV 드롭존 drag-over 클래스 ── */
  function initDropzone() {
    const zones = document.querySelectorAll(
      '.drop-zone, .csv-drop, [class*="dropzone"], [class*="drop-zone"]'
    );
    zones.forEach(zone => {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', () => zone.classList.remove('drag-over'));
    });
  }

  /* ── 6. 테이블 클릭 정렬 ── */
  function initTableSort() {
    document.querySelectorAll('table').forEach(table => {
      const headers = table.querySelectorAll('th');
      let sortCol = -1, sortAsc = true;

      headers.forEach((th, i) => {
        th.setAttribute('title', '클릭하여 정렬');
        th.addEventListener('click', () => {
          const tbody = table.querySelector('tbody');
          if (!tbody) return;

          sortAsc = (sortCol === i) ? !sortAsc : true;
          sortCol = i;

          // 정렬 인디케이터
          headers.forEach(h => h.removeAttribute('data-sort'));
          th.setAttribute('data-sort', sortAsc ? 'asc' : 'desc');

          const rows = Array.from(tbody.querySelectorAll('tr'));
          rows.sort((a, b) => {
            const aText = a.cells[i]?.textContent.trim() || '';
            const bText = b.cells[i]?.textContent.trim() || '';
            const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
            const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));

            if (!isNaN(aNum) && !isNaN(bNum)) {
              return sortAsc ? aNum - bNum : bNum - aNum;
            }
            return sortAsc
              ? aText.localeCompare(bText, 'ko')
              : bText.localeCompare(aText, 'ko');
          });

          rows.forEach(r => tbody.appendChild(r));
        });
      });
    });

    // 정렬 인디케이터 CSS 동적 추가
    const style = document.createElement('style');
    style.textContent = `
      th[data-sort="asc"]::after  { content: ' ↑'; color: var(--blue-600); }
      th[data-sort="desc"]::after { content: ' ↓'; color: var(--blue-600); }
    `;
    document.head.appendChild(style);
  }

  /* ── 7. 사이드바 모바일 토글 ── */
  function initMobileSidebar() {
    if (window.innerWidth > 768) return;

    const sidebar = document.querySelector('.sidebar, aside');
    if (!sidebar) return;

    // 햄버거 버튼 없으면 생성
    if (!document.querySelector('.sidebar-toggle')) {
      const btn = document.createElement('button');
      btn.className = 'sidebar-toggle';
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>`;
      btn.style.cssText = `
        position: fixed; top: 12px; left: 12px; z-index: 1000;
        background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
        padding: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        display: flex; align-items: center; justify-content: center;
      `;
      btn.addEventListener('click', () => sidebar.classList.toggle('open'));
      document.body.appendChild(btn);
    }
  }

  /* ── 8. 등급 배지 자동 클래스 부여 ── */
  function initGradeBadges() {
    document.querySelectorAll('td, .grade-badge, [class*="grade"]').forEach(el => {
      const t = el.textContent.trim();
      if (/^[ABCD]$/.test(t)) {
        el.classList.add(`grade-${t.toLowerCase()}`);
        el.style.cssText += `
          display: inline-block;
          padding: 2px 10px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
        `;
      }
    });
  }

  /* ── 9. 스크롤 기반 카드 stagger 등장 ── */
  function initScrollReveal() {
    const style = document.createElement('style');
    style.textContent = `
      .reveal-ready {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .reveal-ready.revealed {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    const targets = document.querySelectorAll(
      '.kpi-card, .metric-card, .stat-card, .material-card, .lookbook-card, .rank-card'
    );

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('revealed'), i * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(el => {
      el.classList.add('reveal-ready');
      obs.observe(el);
    });
  }

  /* ── 10. 실시간 시계 (헤더에 있다면) ── */
  function initClock() {
    const clockEl = document.querySelector('.header-time, .realtime-clock, [id*="clock"]');
    if (!clockEl) return;

    function tick() {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ── Init 전체 실행 ── */
  function init() {
    initCountUp();
    wrapPageTransition();
    initHeaderScroll();
    initGaugeAnimation();
    initDropzone();
    initTableSort();
    initMobileSidebar();
    initGradeBadges();
    initScrollReveal();
    initClock();
    console.log('[SNOW Dashboard] UI patch v2.0 loaded ✓');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 페이지 전환 후 재실행을 위해 전역 노출
  window.SNOW_UI = { reinit: init, countUp: animateCountUp };

})();
