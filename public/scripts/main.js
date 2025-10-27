(function () {
  'use strict';

  const selectors = {
    menuToggle: '#menuToggle',
    mainNav: '#mainNav',
    navLinks: '#mainNav a',
    header: 'header',
    heroStats: '.hero-stats',
    anchorLinks: 'a[href^="#"]',
    yearTargets: '#currentYear, #year, [data-current-year]'
  };

  const toggleNavigation = (nextState, elements) => {
    const { menuToggle, mainNav, overlay } = elements;
    if (!menuToggle || !mainNav) return;

    const shouldOpen = typeof nextState === 'boolean'
      ? nextState
      : !menuToggle.classList.contains('is-active');

    menuToggle.setAttribute('aria-expanded', String(shouldOpen));
    menuToggle.classList.toggle('is-active', shouldOpen);
    mainNav.classList.toggle('is-active', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);

    if (overlay) overlay.classList.toggle('is-active', shouldOpen);
  };

  const setupNavigation = () => {
    const menuToggle = document.querySelector(selectors.menuToggle);
    const mainNav = document.querySelector(selectors.mainNav);

    if (!menuToggle || !mainNav) return;

    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    const elements = { menuToggle, mainNav, overlay };

    menuToggle.addEventListener('click', () => toggleNavigation(undefined, elements));
    overlay.addEventListener('click', () => toggleNavigation(false, elements));

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleNavigation(false, elements));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) toggleNavigation(false, elements);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') toggleNavigation(false, elements);
    });
  };

  const setupSmoothScroll = () => {
    document.querySelectorAll(selectors.anchorLinks).forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('http')) return;

      link.addEventListener('click', event => {
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  };

  const setupHeaderWatcher = () => {
    const header = document.querySelector(selectors.header);
    if (!header) return;

    const toggleScrolledClass = () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    };

    toggleScrolledClass();
    window.addEventListener('scroll', toggleScrolledClass);
  };

  const animateCounters = () => {
    const stats = document.querySelector(selectors.heroStats);
    if (!stats) return;

    const numbers = stats.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        numbers.forEach(numberEl => {
          const targetValue = parseInt(numberEl.dataset.target || numberEl.textContent, 10);
          if (Number.isNaN(targetValue)) return;

          const duration = 1600;
          const start = performance.now();

          const step = now => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            numberEl.textContent = `${Math.round(targetValue * eased)}+`;
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        });

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    observer.observe(stats);
  };

  const updateCurrentYear = () => {
    const year = new Date().getFullYear();
    document.querySelectorAll(selectors.yearTargets).forEach(el => {
      el.textContent = String(year);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    updateCurrentYear();
    setupNavigation();
    setupSmoothScroll();
    setupHeaderWatcher();
    animateCounters();
  });
})();
