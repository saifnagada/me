/* ============================================================
   NAGADIC — script.js
   ============================================================ */

// ── 1. GRAIN CANVAS ──────────────────────────────────────────
(function grain() {
  const canvas = document.getElementById('grain');
  const ctx    = canvas.getContext('2d');
  let   frame  = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function render() {
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    frame++;
    requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener('resize', resize);
})();


// ── 2. CUSTOM CURSOR ─────────────────────────────────────────
(function cursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (window.matchMedia('(hover: none)').matches) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function followRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();

  // Hover states
  document.querySelectorAll('a, button, .pcard').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    });
  });
})();


// ── 3. NAV SCROLL ────────────────────────────────────────────
(function navScroll() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


// ── 4. SCROLL REVEAL ─────────────────────────────────────────
(function reveal() {
  const els = document.querySelectorAll('[data-reveal]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));

  // Hero elements trigger on load
  const heroEls = document.querySelectorAll('.eyebrow, .hero-foot');
  setTimeout(() => {
    heroEls.forEach(el => el.classList.add('revealed'));
  }, 100);
})();


// ── 5. MAGNETIC PLATFORM CARDS ───────────────────────────────
(function magnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.06;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.06;
      card.style.transform = `translate(${x}px, ${y}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ── 6. STAGGER PLATFORM CARDS ON ENTER ───────────────────────
(function staggerCards() {
  const grid = document.querySelector('.platforms-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.pcard');

  // Set initial state
  cards.forEach((c, i) => {
    c.style.opacity  = '0';
    c.style.transform = 'translateY(24px)';
    c.style.transition = `opacity 0.6s ease ${i * 0.06}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(c => {
          c.style.opacity   = '1';
          c.style.transform = 'translateY(0)';
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  io.observe(grid);
})();


// ── 7. MARQUEE PAUSE ON HOVER ────────────────────────────────
(function marqueePause() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const wrap = track.parentElement;

  wrap.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  wrap.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


// ── 8. TITLE HOVER GLITCH (subtle) ───────────────────────────
(function titleHover() {
  const solid   = document.querySelector('.line--1 .word');
  const outline = document.querySelector('.line--2 .word');
  if (!solid || !outline) return;

  solid.addEventListener('mouseenter', () => {
    solid.style.transition = 'letter-spacing 0.3s ease';
    solid.style.letterSpacing = '0.02em';
  });
  solid.addEventListener('mouseleave', () => {
    solid.style.letterSpacing = '-0.02em';
  });

  outline.addEventListener('mouseenter', () => {
    outline.style.transition = 'letter-spacing 0.3s ease';
    outline.style.letterSpacing = '0.04em';
  });
  outline.addEventListener('mouseleave', () => {
    outline.style.letterSpacing = '0.01em';
  });
})();
