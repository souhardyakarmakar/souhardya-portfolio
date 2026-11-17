/* ============================================================
   FRENCH CAT — script.js
   Intro handling · navigation · reveal · particles · ambient FX
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const body = document.body;

  const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reduced = () => reducedMq.matches;

  body.classList.add('is-booting');

  /* ------------------------------------------------------------
     INTRO — cinematic video, graceful fallback, no skip control
     ------------------------------------------------------------ */
  const intro = $('#intro');
  let introFinished = false;

  const endIntro = () => {
    if (introFinished) return;
    introFinished = true;
    body.classList.remove('is-booting');
    body.classList.remove('intro-lock');
    if (intro) {
      intro.classList.add('is-exiting');
      setTimeout(() => intro.remove(), 1100);
    }
  };

  const initIntro = () => {
    const video = $('#intro-video');
    if (!intro || !video) { endIntro(); return; }
    if (reduced()) { intro.remove(); endIntro(); return; }

    body.classList.add('intro-lock');
    const loader = $('#intro-loader');
    const fallback = $('#intro-fallback');
    let fallbackShown = false;

    const hideLoader = () => { if (loader) loader.classList.add('is-hidden'); };

    const showFallback = () => {
      if (fallbackShown) return;
      fallbackShown = true;
      hideLoader();
      video.style.display = 'none';
      if (fallback) {
        fallback.hidden = false;
        requestAnimationFrame(() => fallback.classList.add('is-visible'));
      }
      setTimeout(endIntro, 2600);
    };

    video.addEventListener('loadeddata', hideLoader);
    video.addEventListener('playing', hideLoader);
    video.addEventListener('ended', endIntro);
    video.addEventListener('error', showFallback);

    if (video.readyState >= 2) hideLoader();
    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => (video.error ? showFallback() : endIntro()));
    }
    setTimeout(() => { if (!fallbackShown && video.readyState < 2) showFallback(); }, 15000);
    setTimeout(endIntro, 30000);
  };

  /* ------------------------------------------------------------
     NAVIGATION — scrolled state, mobile menu, active section
     ------------------------------------------------------------ */
  const initNav = () => {
    const nav = $('#nav');
    const toggle = $('#nav-toggle');
    const menu = $('#mobile-menu');
    if (!nav) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        nav.classList.toggle('is-scrolled', window.scrollY > 24);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const closeMenu = () => {
      body.classList.remove('menu-open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
      if (menu) menu.setAttribute('aria-hidden', 'true');
    };
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = body.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.setAttribute('aria-hidden', String(!open));
      });
      $$('.mobile-link', menu).forEach(l => l.addEventListener('click', closeMenu));
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    const links = $$('.nav-link', nav);
    const sections = $$('main section[id]');
    if ('IntersectionObserver' in window && links.length) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            const id = '#' + en.target.id;
            links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === id));
          }
        });
      }, { rootMargin: '-38% 0px -55% 0px' });
      sections.forEach(s => io.observe(s));
    }
  };

  /* ------------------------------------------------------------
     SCROLL REVEAL
     ------------------------------------------------------------ */
  const initReveal = () => {
    const els = $$('[data-reveal]');
    if (!els.length) return;
    if (reduced() || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-revealed');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  };

  /* ------------------------------------------------------------
     HERO PARTICLES
     ------------------------------------------------------------ */
  const initParticles = () => {
    const canvas = $('#particles');
    const hero = $('#home');
    if (!canvas || !hero || reduced()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, raf = null, running = false;
    let parts = [];

    const seed = () => {
      const n = Math.min(90, Math.round((w * h) / 24000));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.1,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -0.05 - Math.random() * 0.12,
        a: 0.12 + Math.random() * 0.3,
        ph: Math.random() * Math.PI * 2,
        c: Math.random() < 0.3 ? '184,217,255' : '245,246,247'
      }));
    };
    const resize = () => {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy; p.ph += 0.02;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        const tw = 0.6 + 0.4 * Math.sin(p.ph);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',' + (p.a * tw).toFixed(3) + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!running && parts.length) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); };

    new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? start() : stop())), { threshold: 0 }).observe(hero);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    window.addEventListener('resize', resize);
    resize();
    start();
  };

  /* ------------------------------------------------------------
     CURSOR-RESPONSIVE AMBIENT LIGHT (desktop)
     ------------------------------------------------------------ */
  const initCursorLight = () => {
    if (!finePointer || reduced()) return;
    let cx = window.innerWidth / 2, cy = window.innerHeight * 0.3, raf = null;
    const apply = () => {
      raf = null;
      body.style.setProperty('--mx', cx + 'px');
      body.style.setProperty('--my', cy + 'px');
    };
    window.addEventListener('pointermove', e => {
      cx = e.clientX; cy = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    apply();
  };

  /* ------------------------------------------------------------
     3D TILT — hero mark + core visualization (desktop)
     ------------------------------------------------------------ */
  const initTilt = () => {
    if (!finePointer || reduced()) return;
    $$('[data-tilt]').forEach(el => {
      const strength = parseFloat(el.getAttribute('data-tilt')) || 4;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (x * strength).toFixed(2) +
          'deg) rotateX(' + (-y * strength).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
      });
    });
  };

  /* ------------------------------------------------------------
     SCROLL PARALLAX — hero background layers
     ------------------------------------------------------------ */
  const initParallax = () => {
    const layers = $$('[data-parallax]');
    if (!layers.length || reduced()) return;
    let ticking = false;
    const upd = () => {
      ticking = false;
      const y = window.scrollY;
      layers.forEach(l => {
        l.style.transform = 'translate3d(0,' + (y * parseFloat(l.getAttribute('data-parallax'))).toFixed(1) + 'px,0)';
      });
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  };

  /* ------------------------------------------------------------
     CARD SPOTLIGHT — hover light follows the pointer (desktop)
     ------------------------------------------------------------ */
  const initSpotlight = () => {
    if (!finePointer || reduced()) return;
    $$('.glass-card').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--cy', (e.clientY - r.top) + 'px');
      });
    });
  };

  /* ------------------------------------------------------------
     STAY TUNED — honest inline confirmation, no fake signup
     ------------------------------------------------------------ */
  const initStay = () => {
    const btn = $('#stay-btn');
    const note = $('#stay-note');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.textContent = 'NOTED — THANK YOU';
      btn.setAttribute('aria-expanded', 'true');
      if (note) {
        note.hidden = false;
        requestAnimationFrame(() => note.classList.add('is-visible'));
      }
    });
  };

  /* ------------------------------------------------------------
     REDUCED MOTION — live switch
     ------------------------------------------------------------ */
  const onReducedChange = () => {
    if (!reducedMq.matches) return;
    $$('[data-reveal]').forEach(el => el.classList.add('is-revealed'));
    endIntro();
  };
  try { reducedMq.addEventListener('change', onReducedChange); } catch (e) { /* older browsers */ }

  /* ------------------------------------------------------------
     BOOT
     ------------------------------------------------------------ */
  const boot = () => {
    initIntro();
    initNav();
    initReveal();
    initParticles();
    initCursorLight();
    initTilt();
    initParallax();
    initSpotlight();
    initStay();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
