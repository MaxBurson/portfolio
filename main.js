(() => {
  'use strict';

  const D = window.PORTFOLIO || {};
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const mq = (q) => window.matchMedia(q).matches;
  const reduce = mq('(prefers-reduced-motion: reduce)');
  const fine = mq('(hover: hover) and (pointer: fine)');
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rich = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
  const pad = (n) => String(n).padStart(2, '0');
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), D);

  const ICON_ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const ICON_ARROW_SM = ICON_ARROW.replace(/width="18" height="18"/, 'width="14" height="14"');

  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };

  /* ───────────── Render content from data.js ───────────── */
  const roll = (t) => `<span class="roll"><span data-text="${esc(t)}">${esc(t)}</span></span>`;
  const lines = (arr) => (arr || []).map((l, i) => `<span class="line"><span class="line__inner" style="--i:${i}">${rich(l)}</span></span>`).join('');
  const isExternal = (u) => /^https?:\/\//.test(u || '');

  function art(p, label) {
    const c = p.colors || [];
    const style = `--c1:${esc(c[0] || '#ff6b3d')};--c2:${esc(c[1] || '#6b5bff')};--c3:${esc(c[2] || '#151515')}`;
    if (p.phone) {
      return `<div class="art art--phone" style="${style}"><span class="art__phone"><img src="${esc(p.phone)}" alt="" loading="lazy" decoding="async"></span></div>`;
    }
    const inner = p.image
      ? `<img src="${esc(p.image)}" alt="" loading="lazy" decoding="async">`
      : `<span class="art__label">${esc(label != null ? label : (p.short || p.title))}</span>`;
    return `<div class="art" style="${style}">${inner}</div>`;
  }

  function splitWords(str) {
    let em = false;
    return String(str || '').split(/(\*)/).map((piece) => {
      if (piece === '*') { em = !em; return ''; }
      return piece.split(/(\s+)/).map((t) => {
        if (!t) return '';
        if (/^\s+$/.test(t)) return ' ';
        return `<span class="w">${em ? '<em>' : ''}${esc(t)}${em ? '</em>' : ''}</span>`;
      }).join('');
    }).join('');
  }

  // Shared by every page: data bindings, year, footer links
  function renderCommon() {
    $$('[data-bind]').forEach((el) => { const v = get(el.dataset.bind); if (v != null) el.textContent = v; });
    $$('[data-bind-roll]').forEach((el) => { const v = get(el.dataset.bindRoll) || ''; el.textContent = v; el.dataset.text = v; });
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    $$('[data-words]').forEach((el) => { el.innerHTML = splitWords(el.textContent.trim()); });

    const socials = $('#socials');
    if (socials) {
      const links = (D.socials || []).filter((s) => s.url).map((s) =>
        `<a class="social" href="${esc(s.url)}" target="_blank" rel="noopener">${roll(s.label)}${ICON_ARROW_SM}</a>`);
      if (D.email) links.push(`<a class="social" href="mailto:${esc(D.email)}" data-copy-email>${roll('Email')}${ICON_ARROW_SM}</a>`);
      socials.innerHTML = links.join('');
    }
  }

  // Home page only
  function render() {
    renderCommon();
    if (!$('#hero-name')) return;
    document.title = `${D.name || 'Portfolio'} — ${D.role || 'Portfolio'}`;

    // Hero: name split into letters that rise in one after another
    const h = D.hero || {};
    let ci = 0;
    const chars = (t) => Array.from(String(t || '')).map((ch) =>
      ch === ' ' ? ' ' : `<span class="char" style="--i:${ci++}">${esc(ch)}</span>`).join('');
    $('#hero-name').setAttribute('aria-label', `${h.first || ''} ${h.last || ''}`.trim());
    $('#hero-first').innerHTML = chars(h.first);
    $('#hero-last').innerHTML = chars(h.last);
    $('#hero-aside').innerHTML = (h.aside || []).map(rich).join('<br>');
    $('#hero-intro').innerHTML = rich(h.intro);
    $('#hero-facts').innerHTML = (h.facts || []).map((f) =>
      `<div><dt class="mono">${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('');

    // Marquee (items doubled so each group is wider than the viewport)
    const m = (D.marquee || []).concat(D.marquee || []);
    const items = m.map((t) => `<span class="marquee__item">${esc(t)}</span><span class="marquee__sep" aria-hidden="true">✦</span>`).join('');
    $('.marquee').innerHTML = `<div class="marquee__group">${items}</div><div class="marquee__group" aria-hidden="true">${items}</div>`;

    // Work
    const projects = D.projects || [];
    $('#work-count').textContent = `${pad(projects.length)} ${projects.length === 1 ? 'project' : 'projects'}`;
    $('#work-list').innerHTML = projects.map((p, i) => {
      const href = p.link || '#work';
      const ext = isExternal(p.link) ? ' target="_blank" rel="noopener"' : '';
      return `
      <li class="work-row" data-reveal style="--d:${(i * 0.06).toFixed(2)}s">
        <a href="${esc(href)}"${ext} data-cursor-label="${esc(p.cta || (p.link ? 'View' : 'Soon'))}" data-index="${i}">
          <span class="work-row__thumb">${art(p)}</span>
          <span class="work-row__index mono">${pad(i + 1)}</span>
          <span class="work-row__main">
            <span class="work-row__title">${esc(p.title)}</span>
            <span class="work-row__desc">${esc(p.description)}</span>
          </span>
          <span class="work-row__tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</span>
          <span class="work-row__year mono">${esc(p.year)}</span>
          <span class="work-row__arrow">${ICON_ARROW}</span>
        </a>
      </li>`;
    }).join('');
    $('.preview__track').innerHTML = projects.map((p) => `<div class="preview__item">${art(p)}</div>`).join('');

    // About
    const a = D.about || {};
    $('#portrait').innerHTML = a.portrait
      ? art({ image: a.portrait, colors: ['#ff6b3d', '#6b5bff', '#151515'] })
      : art({ colors: ['#ff4d1c', '#ffb36b', '#1b1210'] }, D.initials || '');
    $('#statement').innerHTML = splitWords(a.statement);
    $('#about-paragraphs').innerHTML = (a.paragraphs || []).map((p, i) => `<p data-reveal style="--d:${(i * 0.08).toFixed(2)}s">${rich(p)}</p>`).join('');
    $('#stats').innerHTML = (a.stats || []).map((s, i) => `
      <div class="stat" data-reveal style="--d:${(i * 0.08).toFixed(2)}s">
        <span class="stat__value" data-count="${esc(s.value)}" data-suffix="${esc(s.suffix || '')}">0${esc(s.suffix || '')}</span>
        <span class="stat__label mono">${esc(s.label)}</span>
      </div>`).join('');
    $('#skills').innerHTML = (a.skills || []).map((g, i) => `
      <div data-reveal style="--d:${(i * 0.08).toFixed(2)}s">
        <h3 class="mono">${esc(g.group)}</h3>
        <ul>${(g.items || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>`).join('');

    // Experience
    $('#xp-list').innerHTML = (D.experience || []).map((x, i) => `
      <li class="xp__item${i === 0 ? ' is-open' : ''}" data-reveal style="--d:${(i * 0.06).toFixed(2)}s">
        <button class="xp__btn" type="button" aria-expanded="${i === 0}" aria-controls="xp-${i}">
          <span class="xp__period mono">${esc(x.period)}</span>
          <span class="xp__role">${esc(x.role)}</span>
          <span class="xp__company"><strong>${esc(x.company)}</strong>${x.location ? ` · ${esc(x.location)}` : ''}</span>
          <span class="xp__icon" aria-hidden="true"></span>
        </button>
        <div class="xp__panel" id="xp-${i}" role="region"><div>
          <div class="xp__content">
            ${x.summary ? `<p>${rich(x.summary)}</p>` : ''}
            ${(x.highlights || []).length ? `<ul>${x.highlights.map((h) => `<li>${rich(h)}</li>`).join('')}</ul>` : ''}
            ${(x.tags || []).length ? `<div class="xp__tags">${x.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
          </div>
        </div></div>
      </li>`).join('');
    if (D.resume) $('#resume-link').innerHTML = `<a href="${esc(D.resume)}" target="_blank" rel="noopener">${roll('Résumé ↗')}</a>`;
  }

  /* ───────────── Theme ───────────── */
  function initTheme() {
    const btn = $('.theme-toggle');
    const set = (t) => { root.dataset.theme = t; try { localStorage.setItem('theme', t); } catch (e) {} };
    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (!document.startViewTransition || reduce) { set(next); return; }
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.classList.add('theme-vt'); // only the theme switch uses the circular wipe
      const t = document.startViewTransition(() => set(next));
      t.finished.finally(() => root.classList.remove('theme-vt'));
      t.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
          { duration: 800, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
    });
  }

  /* ───────────── Preloader ───────────── */
  function preload() {
    return new Promise((resolve) => {
      const el = $('.preloader');
      let seen = false;
      try { seen = sessionStorage.getItem('loaded') === '1'; sessionStorage.setItem('loaded', '1'); } catch (e) {}
      if (!el) { resolve(); return; }
      if (reduce || seen) { el.remove(); resolve(); return; }
      const count = $('.preloader__count'), bar = $('.preloader__bar');
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      const t0 = performance.now(), dur = 1500;
      const tick = (now) => {
        const p = clamp((now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        count.textContent = String(Math.round(e * 100)).padStart(3, '0');
        bar.style.transform = `scaleX(${e})`;
        if (p < 1) { requestAnimationFrame(tick); return; }
        fonts.then(() => {
          el.classList.add('is-done');
          setTimeout(resolve, 250);
          setTimeout(() => el.remove(), 1300);
        });
      };
      requestAnimationFrame(tick);
    });
  }

  /* ───────────── Cursor + preview (single rAF loop) ───────────── */
  function initPointer() {
    if (!fine) return;
    root.classList.add('has-cursor');

    const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring');
    const lab = $('.cursor-label'), labText = $('.cursor-label__text');
    // Pages without the floating project preview get detached stand-ins
    const preview = $('.preview') || document.createElement('div');
    const track = $('.preview__track') || document.createElement('div');

    const ringPos = { x: pointer.x, y: pointer.y };
    const labPos = { x: pointer.x, y: pointer.y };
    const prev = { x: pointer.x, y: pointer.y, r: 0 };
    let shown = false;
    const k = reduce ? 1 : null;

    addEventListener('pointermove', (e) => {
      pointer.x = e.clientX; pointer.y = e.clientY;
      if (!shown) {
        shown = true;
        Object.assign(ringPos, pointer); Object.assign(labPos, pointer); Object.assign(prev, pointer);
        cur.classList.add('is-visible');
      }
    }, { passive: true });
    root.addEventListener('mouseleave', () => {
      shown = false; lastRow = null;
      cur.classList.remove('is-visible'); lab.classList.remove('is-active'); preview.classList.remove('is-active');
    });
    addEventListener('pointerdown', () => { cur.classList.add('is-down'); lab.classList.add('is-down'); });
    addEventListener('pointerup', () => { cur.classList.remove('is-down'); lab.classList.remove('is-down'); });

    let lastRow = null;
    const updateHover = (target) => {
      if (!target || !target.closest) return;
      const row = target.closest('.work-row > a');
      if (row !== lastRow) {
        lastRow = row;
        if (row) track.style.transform = `translateY(${-Number(row.dataset.index) * 100}%)`;
        preview.classList.toggle('is-active', !!row);
      }
      const labelEl = target.closest('[data-cursor-label]');
      const hit = target.closest('a, button, [data-cursor]');
      if (labelEl) {
        labText.textContent = labelEl.dataset.cursorLabel;
        lab.classList.add('is-active');
        cur.classList.add('is-label');
        cur.classList.remove('is-hover');
      } else {
        lab.classList.remove('is-active');
        cur.classList.remove('is-label');
        cur.classList.toggle('is-hover', !!hit);
      }
    };
    document.addEventListener('pointerover', (e) => updateHover(e.target));
    // Content moves under a still mouse while scrolling, so re-check what's under it
    let scrollCheck = false;
    addEventListener('scroll', () => {
      if (!shown || scrollCheck) return;
      scrollCheck = true;
      requestAnimationFrame(() => { scrollCheck = false; updateHover(document.elementFromPoint(pointer.x, pointer.y)); });
    }, { passive: true });

    const loop = () => {
      ringPos.x = lerp(ringPos.x, pointer.x, k || 0.2);
      ringPos.y = lerp(ringPos.y, pointer.y, k || 0.2);
      labPos.x = lerp(labPos.x, pointer.x, k || 0.16);
      labPos.y = lerp(labPos.y, pointer.y, k || 0.16);
      dot.style.transform = `translate3d(${pointer.x}px,${pointer.y}px,0)`;
      ring.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0)`;
      lab.style.transform = `translate3d(${labPos.x}px,${labPos.y}px,0)`;

      const nx = lerp(prev.x, pointer.x, k || 0.1), ny = lerp(prev.y, pointer.y, k || 0.1);
      prev.r = lerp(prev.r, clamp((nx - prev.x) * 0.5, -10, 10), 0.12);
      prev.x = nx; prev.y = ny;
      preview.style.transform = `translate3d(${nx}px,${ny}px,0) translate(-50%,-50%) rotate(${prev.r.toFixed(2)}deg)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ───────────── Magnetic elements ───────────── */
  function initMagnetic() {
    if (!fine || reduce) return;
    $$('[data-magnetic]').forEach((el) => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(x * s).toFixed(1)}px,${(y * s).toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ───────────── Scroll-driven bits ───────────── */
  function initScroll() {
    const header = $('.header'), progress = $('.progress');
    const st = $('.statement'), words = st ? $$('.w', st) : [];
    const para = reduce ? [] : $$('[data-parallax]');
    let lastY = scrollY, ticking = false, lit = -1;

    const update = () => {
      ticking = false;
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? clamp(y / max) : 0})`;

      if (!document.body.classList.contains('menu-open')) {
        header.classList.toggle('is-scrolled', y > 20);
        header.classList.toggle('is-hidden', y > lastY && y > 200);
      }
      lastY = y;

      if (!reduce && words.length) {
        const r = st.getBoundingClientRect();
        const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3));
        const n = Math.round(p * words.length);
        if (n !== lit) { lit = n; words.forEach((w, i) => w.classList.toggle('is-lit', i < n)); }
      }

      // Gentle parallax: offset by distance from the viewport centre
      para.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        const off = (r.top + r.height / 2 - innerHeight / 2) * (parseFloat(el.dataset.parallax) || 0.1);
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
      });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();

    // Reveal on enter
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        $$('[data-count]', e.target).forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal], [data-split]').forEach((el) => io.observe(el));

    // Active nav link
    const links = $$('.nav a[href^="#"]');
    const secIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.setAttribute('aria-current', l.getAttribute('href') === `#${e.target.id}` ? 'true' : 'false'));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => secIO.observe(s));
  }

  function countUp(el) {
    const raw = el.dataset.count, target = parseFloat(raw) || 0;
    const dec = (raw.split('.')[1] || '').length, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = target.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1800;
    const step = (now) => {
      const p = clamp((now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ───────────── Experience accordion ───────────── */
  function initAccordion() {
    $$('.xp__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.xp__item');
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open);
      });
    });
  }

  /* ───────────── Mobile menu ───────────── */
  function initMenu() {
    const btn = $('.menu-btn'), menu = $('#menu'), label = $('[data-menu-label]');
    const set = (open) => {
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-hidden', !open);
      menu.inert = !open;
      label.textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) $('.header').classList.remove('is-hidden');
    };
    btn.addEventListener('click', () => set(!menu.classList.contains('is-open')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) set(false); });
    matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) set(false); });
  }

  /* ───────────── Clock, copy email, toast ───────────── */
  function initClock() {
    const els = $$('[data-clock]');
    const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    if (D.timezone) opts.timeZone = D.timezone;
    let fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', opts); } catch (e) { delete opts.timeZone; fmt = new Intl.DateTimeFormat('en-GB', opts); }
    const tick = () => { const t = fmt.format(new Date()); els.forEach((el) => { el.textContent = t; }); };
    tick();
    setInterval(tick, 1000);
  }

  let toastTimer;
  function toast(msg) {
    const t = $('.toast');
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 2200);
  }

  function initCopy() {
    $$('[data-copy-email]').forEach((el) => {
      el.addEventListener('click', async (e) => {
        if (!navigator.clipboard) return; // falls back to the mailto link
        e.preventDefault();
        try { await navigator.clipboard.writeText(D.email); toast('Email copied to clipboard'); }
        catch (err) { location.href = `mailto:${D.email}`; }
      });
    });
  }

  /* ───────────── Light/dark compare slider (case studies) ───────────── */
  function initCompare() {
    $$('.compare').forEach((c) => {
      const input = $('input', c);
      const set = () => c.style.setProperty('--pos', `${input.value}%`);
      input.addEventListener('input', set);
      set();
    });
  }

  /* ───────────── Boot ───────────── */
  render();
  initCompare();
  initTheme();
  initPointer();
  initMagnetic();
  initScroll();
  initAccordion();
  initMenu();
  initClock();
  initCopy();
  preload().then(() => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
  });
})();
