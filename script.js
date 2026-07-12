/* =========================================================
   LUMIÈRE 光之珠宝 · 交互脚本 v2
   动效词汇：cubic-bezier(0.16, 1, 0.3, 1)
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. Header 滚动样式 ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Hero 文案入场（页面加载时上移淡入） ---------- */
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) {
    const children = Array.from(heroCopy.children);
    children.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 900ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)';
      window.setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 120 + i * 120);
    });
  }

  /* Hero 视觉淡入（错峰） */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateY(24px)';
    heroVisual.style.transition = 'opacity 1200ms cubic-bezier(0.16,1,0.3,1) 300ms, transform 1200ms cubic-bezier(0.16,1,0.3,1) 300ms';
    window.setTimeout(() => {
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateY(0)';
    }, 200);
  }

  /* ---------- 3. 移动端菜单 ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('is-open');
      mobileNav.hidden = !isOpen;
      mobileNav.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        menuToggle.classList.remove('is-open');
        mobileNav.hidden = true;
        mobileNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 4. 产品分类筛选 ---------- */
  const tabs = document.querySelectorAll('.filter-tabs .tab');
  const cards = document.querySelectorAll('.product-card');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- 5. 滚动进入视口淡入 ---------- */
  const revealSelectors = [
    '.section-header',
    '.collection-card',
    '.product-card',
    '.story-visual',
    '.story-content',
    '.service-item',
    '.qr-card',
    '.follow-text',
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 6. FAB 切换 ---------- */
  const fabToggle = document.getElementById('fabToggle');
  const fabPanel = document.getElementById('fabPanel');
  if (fabToggle && fabPanel) {
    const closeFab = () => {
      fabToggle.classList.remove('is-open');
      fabPanel.classList.remove('is-open');
      fabPanel.hidden = true;
      fabToggle.setAttribute('aria-expanded', 'false');
    };
    fabToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = fabToggle.classList.toggle('is-open');
      fabPanel.hidden = !isOpen;
      fabPanel.classList.toggle('is-open', isOpen);
      fabToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (!fabPanel.contains(e.target) && !fabToggle.contains(e.target)) closeFab();
    });
    // ESC 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeFab();
    });
  }

  /* ---------- 7. 返回顶部 ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 8. Hero 箭头切换（演示进度条） ---------- */
  const arrows = document.querySelectorAll('.hero-arrows .hero-arrow');
  const progressFill = document.querySelector('.hero-progress-fill');
  const progressNum = document.querySelector('.hero-progress-num');
  let heroIdx = 1;
  const total = 3;
  const updateProgress = () => {
    if (progressFill) progressFill.style.width = (heroIdx / total * 100) + '%';
    if (progressNum) progressNum.textContent = String(heroIdx).padStart(2, '0');
  };
  arrows.forEach((arr, idx) => {
    arr.addEventListener('click', () => {
      heroIdx = idx === 0
        ? (heroIdx - 1 < 1 ? total : heroIdx - 1)
        : (heroIdx + 1 > total ? 1 : heroIdx + 1);
      updateProgress();
    });
  });

  /* ---------- 9. 平滑滚动锚点 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const offset = header ? header.offsetHeight - 1 : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
})();