export function initMotion(signal) {
  var S = { signal: signal };
  var pg = document.querySelector('.pg');
  if (!pg || pg.dataset.rv) return;
  pg.dataset.rv = '1';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // the star chart answers the pointer: hover a star to light its lines, and the sky drifts a little
  var chart = pg.querySelector('.chart');
  if (chart) {
    var stars = chart.querySelectorAll('.star'), lines = chart.querySelectorAll('[data-a]');
    var on = function (k) {
      chart.classList.add('focus');
      stars.forEach(function (s) { s.classList.toggle('on', s.dataset.k === k); s.classList.remove('near'); });
      lines.forEach(function (l) {
        var hit = l.dataset.a === k || l.dataset.b === k;
        l.classList.toggle('on', hit);
        if (hit) {
          var other = l.dataset.a === k ? l.dataset.b : l.dataset.a;
          var o = chart.querySelector('.star[data-k="' + other + '"]'); if (o) o.classList.add('near');
        }
      });
    };
    var off = function () {
      chart.classList.remove('focus');
      stars.forEach(function (s) { s.classList.remove('on', 'near'); });
      lines.forEach(function (l) { l.classList.remove('on'); });
    };
    stars.forEach(function (s) {
      s.addEventListener('mouseenter', function () { on(s.dataset.k); });
      s.addEventListener('focus', function () { on(s.dataset.k); });
      s.addEventListener('mouseleave', off);
      s.addEventListener('blur', off);
    });
    if (!reduce) {
      var layers = chart.querySelectorAll('.par');
      chart.addEventListener('mousemove', function (e) {
        var r = chart.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach(function (g) { var d = +g.dataset.d; g.style.transform = 'translate(' + (-dx * d) + 'px,' + (-dy * d) + 'px)'; });
      });
      chart.addEventListener('mouseleave', function () { layers.forEach(function (g) { g.style.transform = ''; }); });
    }
  }

  // the welcome record: on a fresh visit, tapping it starts the music and opens the site.
  // Coming back to this page in the same visit, there is no record: just the same soft fade as every page.
  var loader = pg.querySelector('.loader');
  if (loader) {
    var seen = false;
    try { seen = sessionStorage.getItem('ashik-entered-v2') === '1'; } catch (e) {}
    var root = document.documentElement, prevOv = root.style.overflow;
    var lift = function (delay) {
      setTimeout(function () { loader.classList.add('gone'); root.style.overflow = prevOv; }, delay);
    };
    if (seen) {
      loader.style.display = 'none';
    } else {
      root.style.overflow = 'hidden';
      var disc = loader.querySelector('.ld-disc');
      var enter = function () {
        if (loader.classList.contains('go')) return;
        loader.classList.add('go');
        try { sessionStorage.setItem('ashik-entered-v2', '1'); } catch (e) {}
        var rec = pg.querySelector('#rec');
        if (rec && rec.getAttribute('aria-pressed') !== 'true') rec.click();
        if (window.__ashikAudioResume) window.__ashikAudioResume();
        lift(450);
      };
      if (disc) disc.addEventListener('click', enter);
    }
  }

  // the bar stays at the top; a hairline appears once the page moves under it
  var bar = pg.querySelector('.nav');
  if (bar) {
    // sections land just under the bar, whether the link is on this page or another
    var navH = bar.offsetHeight;
    var setH = function () { if (bar.classList.contains('open')) return; navH = Math.ceil(bar.getBoundingClientRect().height); pg.style.setProperty('--navh', navH + 'px'); };
    setH(); window.addEventListener('resize', setH, S);
    var toHash = function (smooth) {
      if (!location.hash || location.hash.length < 2) return;
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!t) return;
      var root = document.scrollingElement || document.documentElement;
      if (root.scrollHeight > window.innerHeight + 2) {
        var y = t.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
      } else {
        // shown inside a taller frame (like the design canvas): let the outer view scroll instead
        t.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
      }
    };
    // arriving from another page: settle once fonts and photos have taken their space
    if (location.hash) {
      var settle = function () { setH(); toHash(false); };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
      window.addEventListener('load', settle, S);
      setTimeout(settle, 900);
    }
    // links to this page: glide to the section
    pg.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="#"]'); if (!a) return;
      var u; try { u = new URL(a.getAttribute('href'), location.href); } catch (x) { return; }
      if (u.pathname !== location.pathname || !u.hash) return;
      var t = document.getElementById(decodeURIComponent(u.hash.slice(1))); if (!t) return;
      e.preventDefault();
      history.pushState(null, '', u.hash);
      setH(); toHash(!reduce);
      var fix = function () { window.removeEventListener('scrollend', fix); toHash(false); };
      window.addEventListener('scrollend', fix, S);
    });
    window.addEventListener('hashchange', function () { setH(); toHash(false); }, S);
    var onScroll = function () { bar.classList.toggle('stuck', (window.scrollY || document.documentElement.scrollTop) > 8); };
    window.addEventListener('scroll', onScroll, { passive: true, signal: signal }); onScroll();
  }

  // the travel map: hover or tap a place to fly the route; it tours by itself while nobody touches it
  var map = pg.querySelector('.map');
  if (map) {
    var tgs = map.querySelectorAll('.tg'), lands = map.querySelectorAll('.land.seen');
    var cur = -1, touched = false, tour = null;
    var show = function (k) {
      if (k === cur) return; cur = k;
      map.classList.toggle('focus', k > -1);
      tgs.forEach(function (g) {
        var on = +g.dataset.k === k; g.classList.toggle('on', on);
        var am = g.querySelector('animateMotion');
        if (am) { try { on ? am.beginElement() : am.endElement(); } catch (e) {} }
      });
      lands.forEach(function (l) { l.classList.toggle('on', l.dataset.k !== undefined && +l.dataset.k === k); });
    };
    tgs.forEach(function (g) {
      var k = +g.dataset.k;
      g.addEventListener('mouseenter', function () { touched = true; show(k); });
      g.addEventListener('focus', function () { touched = true; show(k); });
      g.addEventListener('click', function () { touched = true; show(cur === k ? -1 : k); });
      g.addEventListener('mouseleave', function () { show(-1); });
      g.addEventListener('blur', function () { show(-1); });
    });
  }

  // numbers count up from zero the first time they come into view
  var nums = pg.querySelectorAll('.sn[data-n]');
  var veilEl = pg.querySelector('.veil');
  var live = !reduce && 'IntersectionObserver' in window && !(veilEl && getComputedStyle(veilEl).display === 'none');
  if (nums.length && live) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, to = +el.dataset.n, t0 = null, dur = 1600;
        var step = function (t) {
          if (t0 === null) t0 = t;
          var k = Math.min((t - t0) / dur, 1), v = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(to * v);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { n.textContent = '0'; cio.observe(n); });
  }

  // pages that are still being written: a small note instead of a dead end
  var soon = pg.querySelectorAll('.qa .btn');
  if (soon.length) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = '<b>Still being written.</b><span>This page is under construction. Check back soon.</span>';
    pg.appendChild(t); var tt;
    soon.forEach(function (b) { b.addEventListener('click', function () { t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2800); }); });
  }

  // phone menu
  var mb = pg.querySelector('.mb'), navEl = pg.querySelector('.nav');
  var setMenu = function (open) {
    navEl.classList.toggle('open', open);
    mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    mb.textContent = open ? 'Close' : 'Menu';
  };
  if (mb && navEl) {
    mb.addEventListener('click', function () { setMenu(!navEl.classList.contains('open')); });
    // a tap anywhere outside the bar, or on a link inside it, closes the menu
    document.addEventListener('click', function (e) {
      if (!navEl.classList.contains('open')) return;
      if (!navEl.contains(e.target) || e.target.closest('nav a')) setMenu(false);
    }, S);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navEl.classList.contains('open')) { setMenu(false); mb.focus(); } }, S);
  }

  // notebook topics
  var tps = pg.querySelectorAll('.tp');
  if (tps.length) {
    var rows = pg.querySelectorAll('.entries li');
    tps.forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.dataset.t;
        tps.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        rows.forEach(function (r) { r.hidden = !(t === 'all' || r.dataset.t.split(' ').indexOf(t) > -1); });
      });
    });
  }

  // content fades in from the paper as you scroll, photographs develop out of white
  if (reduce || !('IntersectionObserver' in window)) return;
  var sel = ['.folio', '.sky .h2', '.sky .two .body', '.chart-wrap', '.q', '.bcol', '.four > div',
    '.rare .kicker', '.rare-top', '.rare .lead', '.path li', '.prods > div',
    '.slsn .kicker', '.slsn h2', '.sl-a .btn', '.sl-b h3', '.sl-l', '.sl-list li',
    '.record .h2', '.record .intro', '.sleeve', '.ho-head', '.honours li',
    '.wip .h2', '.wip .body', '.qa',
    '.places .h2', '.places .body', '.route-wrap', '.trip .tx', '.trip .print',
    '.shelf .h2', '.shelf .body', '.paint-wrap', '.nb .l', '.sheet',
    '.contact h2', '.contact .ca', '.contact .soc li',
    '.mline', '.mhead', '.mintro > *', '.feat .sheet', '.fart', '.ixhead', '.entries li', '.margin .card',
    '.abopen .folio', '.ol', '.print.op', '.glance', '.ch .cn', '.ch .ct', '.ch .mn', '.band p', '.abclose h2', '.abclose p', '.cbtns',
    '.shart', '.covers .cv', '.auth', '.mgs', '.later', '.sh-en .two > *', '.sh-bn .two > *', '.mg .h2',
    '.sthead > *', '.stfig', '.stbody > *', '.stfoot > div'].join(',');
  var els = Array.prototype.slice.call(pg.querySelectorAll(sel));
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  els.forEach(function (el) {
    var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--rd', Math.min(sib, 5) * 110 + 'ms');
    el.classList.add('rv');
    io.observe(el);
  });
  pg.classList.add('rvon');
}
