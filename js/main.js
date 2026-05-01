// ================= Yıl
(function () {
  var yearEl = document.getElementById('y');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ================= Navbar tema geçişi
(function () {
  var nav = document.getElementById('nav');
  var mainnav = document.getElementById('mainnav');
  if (!nav) return;

  function syncNav() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (y > 20) {
      nav.classList.add('navbar-scrolled', 'navbar-light');
      nav.classList.remove('navbar-top', 'navbar-dark');
    } else {
      nav.classList.add('navbar-top', 'navbar-light');
      nav.classList.remove('navbar-scrolled', 'navbar-dark');
    }
  }

  if (mainnav) {
    mainnav.addEventListener('show.bs.collapse', function () {
      nav.classList.add('navbar-scrolled', 'navbar-light');
      nav.classList.remove('navbar-top', 'navbar-dark');
    });
    mainnav.addEventListener('hidden.bs.collapse', function () {
      syncNav();
    });
  }

  window.addEventListener('load', syncNav);
  window.addEventListener('scroll', syncNav, { passive: true });
  window.addEventListener('resize', syncNav, { passive: true });
  syncNav();
})();

// ================= Scroll animasyonu: .neden-card
(function () {
  var target = document.querySelector('.neden-card');
  if (!('IntersectionObserver' in window) || !target) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  obs.observe(target);
})();

// ================= Image Comparison (Hero dahil)
(function initImageComparisons() {
  var comps = document.querySelectorAll('.img-compare');
  if (!comps.length) return;
  comps.forEach(setup);

  function setup(comp) {
    var handle = comp.querySelector('.ic-handle');
    var bottom = comp.querySelector('.ic-bottom');
    if (!handle || !bottom) return;

    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    var rect = function () { return comp.getBoundingClientRect(); };

    var initialPct = clamp(Number(comp.dataset.initial || 50), 0, 100);
    setRatio(initialPct);
    setKnobY(50);

    var dragging = false;

    // X ekseni: bölme yüzdesi
    function setRatio(percent) {
      percent = clamp(percent, 0, 100);
      comp.style.setProperty('--pos', percent + '%');
      handle.setAttribute('aria-valuenow', Math.round(percent));
    }

    function setFromClientX(clientX) {
      var r = rect();
      var x = clamp(clientX - r.left, 0, r.width);
      setRatio((x / r.width) * 100);
    }

    // Y ekseni: knob konumu (sadece görsel)
    function setKnobY(percentY) {
      percentY = clamp(percentY, 0, 100);
      comp.style.setProperty('--knobY', percentY + '%');
    }

    function setFromClientY(clientY) {
      var r = rect();
      var y = clamp(clientY - r.top, 0, r.height);
      setKnobY((y / r.height) * 100);
    }

    // Mouse
    comp.addEventListener('mousedown', function (e) {
      dragging = true;
      setFromClientX(e.clientX);
      setFromClientY(e.clientY);
      e.preventDefault();
    });
    window.addEventListener('mouseup', function () { dragging = false; }, { passive: true });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      setFromClientX(e.clientX);
      setFromClientY(e.clientY);
    }, { passive: true });

    // Touch
    comp.addEventListener('touchstart', function (e) {
      var t = e.touches && e.touches[0];
      if (!t) return;
      dragging = true;
      setFromClientX(t.clientX);
      setFromClientY(t.clientY);
    }, { passive: true });
    window.addEventListener('touchend', function () { dragging = false; }, { passive: true });
    window.addEventListener('touchcancel', function () { dragging = false; }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var t = e.touches && e.touches[0];
      if (!t) return;
      setFromClientX(t.clientX);
      setFromClientY(t.clientY);
    }, { passive: true });

    // Klavye (sadece X yüzdesi)
    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); nudge(-step); }
      if (e.key === 'ArrowRight') { e.preventDefault(); nudge(step); }
      if (e.key === 'Home')       { e.preventDefault(); setRatio(0); }
      if (e.key === 'End')        { e.preventDefault(); setRatio(100); }
    });

    function nudge(delta) {
      var now = Number(handle.getAttribute('aria-valuenow') || initialPct);
      setRatio(now + delta);
    }
  }
})();
