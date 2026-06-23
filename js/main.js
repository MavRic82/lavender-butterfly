/* ============================================================
   The Lavender Butterfly — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Nav: scroll state
     ---------------------------------------------------------- */
  const nav = document.getElementById('nav');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ----------------------------------------------------------
     Nav: mobile hamburger toggle
     ---------------------------------------------------------- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on link click inside mobile menu
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ----------------------------------------------------------
     Active nav link highlighting
     ---------------------------------------------------------- */
  (function setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  })();

  /* ----------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------- */
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     Shop: product category filter
     ---------------------------------------------------------- */
  function initFilter() {
    const filterBar = document.getElementById('filterBar');
    if (!filterBar) return;

    const grid          = document.getElementById('productsGrid');
    const countDisplay  = document.getElementById('productsCount');
    const cards         = grid ? Array.from(grid.querySelectorAll('.product-card')) : [];
    const filterBtns    = filterBar.querySelectorAll('.filter-btn');

    function updateCount(visible) {
      if (!countDisplay) return;
      countDisplay.textContent = 'Showing ' + visible + (visible === 1 ? ' piece' : ' pieces');
    }

    function filterProducts(category) {
      let visible = 0;
      cards.forEach(function (card) {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });
      updateCount(visible);
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active button
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Filter products
        const filter = btn.getAttribute('data-filter');
        filterProducts(filter);
      });
    });

    // Initialize count
    updateCount(cards.length);
  }

  /* ----------------------------------------------------------
     Contact form: demo submit handler
     ---------------------------------------------------------- */
  function initContactForm() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;

    // Pre-fill "subject" from URL query string (used by Inquire buttons)
    const params = new URLSearchParams(window.location.search);
    const item   = params.get('item');
    if (item) {
      const subjectEl = document.getElementById('subject');
      const messageEl = document.getElementById('message');
      if (subjectEl) subjectEl.value = 'inquiry';
      if (messageEl && messageEl.value === '') {
        messageEl.value = 'Hi Jen! I saw the “' + decodeURIComponent(item) + '” on your website and I’d love to know more about it. Is it still available?';
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const message = document.getElementById('message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        const first = [name, email, message].find(function (el) {
          return !el.value.trim();
        });
        if (first) {
          first.focus();
          first.style.borderColor = 'rgba(255,100,100,0.6)';
          setTimeout(function () {
            first.style.borderColor = '';
          }, 2500);
        }
        return;
      }

      // Simulate sending (no backend in static build)
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        form.style.display = 'none';
        success.classList.add('visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 900);
    });
  }

  /* ----------------------------------------------------------
     Smooth scroll for anchor links
     ---------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href   = anchor.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navH   = nav ? nav.offsetHeight : 0;
          const top    = target.getBoundingClientRect().top + window.scrollY - navH - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Butterfly video: fade in only after playing to prevent flash
     ---------------------------------------------------------- */
  function initButterflyVideo() {
    var video = document.querySelector('.butterfly-video');
    if (!video) return;

    function reveal() { video.classList.add('ready'); }

    video.addEventListener('playing', reveal, { once: true });
    // Fallback: if already ready (cached), show immediately
    if (video.readyState >= 3) reveal();
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  function init() {
    initReveal();
    initFilter();
    initContactForm();
    initSmoothScroll();
    initButterflyVideo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
