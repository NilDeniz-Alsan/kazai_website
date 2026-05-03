// ================= Theme toggle
(function () {
  var html = document.documentElement;
  var btn  = document.getElementById('theme-toggle');

  // Detect saved preference, then OS preference
  var saved = localStorage.getItem('kazai-theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var initial = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  if (btn) {
    btn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('kazai-theme', next);
    });
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-bs-theme', theme);
  }
})();

// ================= Year
(function () {
  var yearEl = document.getElementById('y');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ================= Navbar scroll class
(function () {
  var nav = document.getElementById('nav');
  var mainnav = document.getElementById('mainnav');
  if (!nav) return;

  function syncNav() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (y > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  if (mainnav) {
    mainnav.addEventListener('show.bs.collapse', function () {
      nav.classList.add('scrolled');
    });
    mainnav.addEventListener('hidden.bs.collapse', function () {
      syncNav();
    });
  }

  window.addEventListener('load', syncNav);
  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();
})();

// ================= Scroll-triggered fade-up animations
(function () {
  if (!('IntersectionObserver' in window)) {
    // Fallback: make all visible immediately
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { obs.observe(el); });
})();

// ================= Image Comparison
(function initImageComparisons() {
  var comps = document.querySelectorAll('.img-compare');
  if (!comps.length) return;
  comps.forEach(setup);

  function setup(comp) {
    var handle = comp.querySelector('.ic-handle');
    if (!handle) return;

    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var rect  = function () { return comp.getBoundingClientRect(); };

    var initialPct = clamp(Number(comp.dataset.initial || 50), 0, 100);
    setRatio(initialPct);
    setKnobY(68);

    var dragging = false;

    function setRatio(pct) {
      pct = clamp(pct, 0, 100);
      comp.style.setProperty('--pos', pct + '%');
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }

    function setFromX(clientX) {
      var r = rect();
      setRatio(((clientX - r.left) / r.width) * 100);
    }

    function setKnobY(pct) {
      comp.style.setProperty('--knobY', clamp(pct, 0, 100) + '%');
    }

    function setFromY(clientY) {
      var r = rect();
      setKnobY(((clientY - r.top) / r.height) * 100);
    }

    // Mouse
    comp.addEventListener('mousedown', function (e) {
      dragging = true;
      setFromX(e.clientX);
      setFromY(e.clientY);
      e.preventDefault();
    });
    window.addEventListener('mouseup',   function () { dragging = false; }, { passive: true });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      setFromX(e.clientX);
      setFromY(e.clientY);
    }, { passive: true });

    // Touch
    comp.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      if (!t) return;
      dragging = true;
      setFromX(t.clientX);
      setFromY(t.clientY);
    }, { passive: true });
    window.addEventListener('touchend',    function () { dragging = false; }, { passive: true });
    window.addEventListener('touchcancel', function () { dragging = false; }, { passive: true });
    window.addEventListener('touchmove',   function (e) {
      if (!dragging) return;
      var t = e.touches[0];
      if (!t) return;
      setFromX(t.clientX);
      setFromY(t.clientY);
    }, { passive: true });

    // Keyboard
    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 2;
      var now  = Number(handle.getAttribute('aria-valuenow') || initialPct);
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setRatio(now - step); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setRatio(now + step); }
      if (e.key === 'Home')       { e.preventDefault(); setRatio(0); }
      if (e.key === 'End')        { e.preventDefault(); setRatio(100); }
    });
  }
})();

// ================= Typing Effect
(function () {
  var el = document.querySelector('.typing-text');
  if (!el) return;
  var text = el.getAttribute('data-text') || '';
  var i = 0;
  el.textContent = '';
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 90);
    }
  }
  setTimeout(type, 600);
})();
