// Portfolyo etkileşim mantığı. Prototipteki (Portfolyo.dc.html) sınıf yöntemlerinin birebir taşınmış hali.
// `// @src:` işaretli bloklar "kaynak kodu" panelinde gösterilir (scripts/gen-sources.cjs).

export const OCTO = '/ahtapot.png';

export type PalItem = { label: string; hint: string; run: () => void };

// 08dijital'e geçiş: ekran kararırken ahtapot köşeden süzülerek gelir
export function octoTransition(href: string, cx: number, cy: number, reduce: boolean, go: (href: string) => void) {
  if (reduce || !document.body.animate) { go(href); return; }
  const x = cx || innerWidth / 2, y = cy || innerHeight / 2;
  const ov = document.createElement('div');
  Object.assign(ov.style, { position: 'fixed', inset: '0', zIndex: '10000', background: '#0E0E0E', clipPath: `circle(0px at ${x}px ${y}px)` });
  const img = document.createElement('img');
  img.src = OCTO; img.alt = '';
  Object.assign(img.style, { position: 'fixed', left: '50%', top: '50%', width: 'min(64vw, 640px)', height: 'auto', zIndex: '10001', pointerEvents: 'none', filter: 'drop-shadow(0 40px 80px rgba(227,93,23,.35))', transform: 'translate(-50%,-50%) translate(-70vw, 80vh) rotate(-50deg) scale(.35)' });
  document.body.append(ov, img);
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  ov.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 450, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' });
  img.animate([
    { transform: 'translate(-50%,-50%) translate(-70vw, 80vh) rotate(-50deg) scale(.35)' },
    { transform: 'translate(-50%,-50%) translate(4vw, -6vh) rotate(-8deg) scale(1.02)', offset: 0.6 },
    { transform: 'translate(-50%,-50%) translate(0, -2vh) rotate(4deg) scale(1)', offset: 0.82 },
    { transform: 'translate(-50%,-50%) translate(0, 0) rotate(0deg) scale(1)' }
  ], { duration: 800, delay: 100, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
  try { sessionStorage.setItem('octo-in', '1'); } catch (e) {}
  setTimeout(() => { go(href); }, 950);
}

export function arriveFromAgency(theme: string, reduce: boolean) {
  let on = false;
  try { on = sessionStorage.getItem('octo-out') === '1'; sessionStorage.removeItem('octo-out'); } catch (e) {}
  if (!on || reduce || !document.body.animate) return;
  const ov = document.createElement('div');
  Object.assign(ov.style, { position: 'fixed', inset: '0', zIndex: '10000', background: theme === 'dark' ? '#0E0E0E' : '#FAFAF8', pointerEvents: 'none' });
  document.body.append(ov);
  ov.animate({ clipPath: ['circle(150% at 50% 50%)', 'circle(0% at 50% 50%)'] }, { duration: 750, delay: 100, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' })
    .onfinish = () => ov.remove();
}

export function go(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const hdr = document.querySelector('header');
  const off = id === 'top' ? 0 : (hdr ? hdr.offsetHeight : 61) + 16;
  window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - off), behavior: 'smooth' });
}

// @src:theme
// Tema: View Transitions API ile butondan yayılan dairesel geçiş
export function toggleTheme(current: string, reduce: boolean, setTheme: (t: string) => void, e?: { clientX?: number; clientY?: number }) {
  const next = current === 'dark' ? 'light' : 'dark';
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('es-theme', next); } catch (_) {}
  };
  setTheme(next);
  const doc = document as any;
  if (!doc.startViewTransition || reduce) return apply();
  const x = e && e.clientX ? e.clientX : innerWidth - 60;
  const y = e && e.clientY ? e.clientY : 30;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = doc.startViewTransition(apply);
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(.6,0,.2,1)', pseudoElement: '::view-transition-new(root)' } as any
    );
  }).catch(() => {});
}
// @src:end

// @src:palette
// Komut paleti: ⌘K / Ctrl+K ile açılır, ok tuşlarıyla gezilir
export type PalState = { pal: boolean; idx: number };
export type PalActions = {
  togglePal: () => void;
  close: () => void;
  setIdx: (f: (i: number) => number) => void;
  closePal: () => void;
};
export function onKey(e: KeyboardEvent, st: PalState, list: PalItem[], act: PalActions) {
  const k = (e.key || '').toLowerCase();
  if ((e.metaKey || e.ctrlKey) && k === 'k') {
    e.preventDefault();
    act.togglePal();
    return;
  }
  if (k === 'escape') { act.close(); return; }
  if (!st.pal) return;
  const n = Math.max(1, list.length);
  if (k === 'arrowdown') { e.preventDefault(); act.setIdx(i => (i + 1) % n); }
  if (k === 'arrowup') { e.preventDefault(); act.setIdx(i => (i - 1 + n) % n); }
  if (k === 'enter') {
    const it = list[st.idx];
    if (it) { e.preventDefault(); act.closePal(); setTimeout(it.run, 60); }
  }
}
// @src:end

// @src:hero
// Hero: yazıyı piksellerden örnekleyip yaylı parçacıklara çevirir, imleç onları iter
export function startHero(reduce: boolean) {
  let c: HTMLCanvasElement | null = null, ctx: CanvasRenderingContext2D | null = null;
  let w = 0, h = 0, dpr = 1, fg = '#111', frame = 0, ready = false, raf = 0;
  let nameKey = '', size = 1;
  type Pt = { ox: number; oy: number; x: number; y: number; vx: number; vy: number; a: boolean; rx: number; ry: number };
  let P: Pt[] = [], R = 100;
  const m = { x: -9999, y: -9999 };
  const move = (e: { clientX: number; clientY: number }) => { if (!c) return; const r = c.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
  const leave = () => { m.x = m.y = -9999; };
  window.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', leave);
  // Dokunmatik: parmakla dokunup sürükleyince de parçacıklar dağılır
  const touch = (e: TouchEvent) => { const t = e.touches && e.touches[0]; if (t) move(t); };
  const tend = () => setTimeout(leave, 120);
  window.addEventListener('touchstart', touch, { passive: true });
  window.addEventListener('touchmove', touch, { passive: true });
  window.addEventListener('touchend', tend);
  const face = () => getComputedStyle(document.body).fontFamily || '"Schibsted Grotesk", Helvetica, Arial, sans-serif';
  const fonts = document.fonts ? document.fonts.load(`700 100px ${face()}`, 'Erdem Şensoy.') : Promise.resolve();
  fonts.then(() => { ready = true; }, () => { ready = true; });
  const readyT = setTimeout(() => { ready = true; }, 1500);

  const build = () => {
    const r = c!.getBoundingClientRect();
    w = r.width; h = r.height;
    dpr = Math.min(2, devicePixelRatio || 1);
    c!.width = Math.round(w * dpr); c!.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const nb = document.getElementById('hero-name');
    const n = nb ? nb.getBoundingClientRect() : { left: r.left + 40, top: r.top + 40, width: w - 80, height: h * 0.5 } as DOMRect;
    const left = n.left - r.left, top = n.top - r.top;
    const mode = 'isim';
    const lines = ['Erdem', 'Şensoy'];
    const oc = document.createElement('canvas');
    oc.width = Math.ceil(w); oc.height = Math.ceil(h);
    const o = oc.getContext('2d')!;
    const ff = face();
    o.font = `700 100px ${ff}`;
    const maxW = Math.max(...lines.map(t => o.measureText(t).width)) + o.measureText('.').width;
    const lh = 0.92;
    const fs = Math.max(30, Math.min(n.width * 0.98 / maxW * 100, n.height / (lines.length * lh + 0.12)));
    const y0 = top + (n.height - lines.length * fs * lh) / 2 + fs * 0.8;
    nameKey = [Math.round(left), Math.round(top), Math.round(n.width), Math.round(n.height), mode, 'iki'].join();
    const gap = Math.max(3, Math.round(fs / 34));
    o.font = `700 ${fs}px ${ff}`;
    o.textBaseline = 'alphabetic';
    const sample = (accent: boolean) => {
      const d = o.getImageData(0, 0, oc.width, oc.height).data;
      for (let y = 0; y < oc.height; y += gap) for (let x = 0; x < oc.width; x += gap) {
        if (d[(y * oc.width + x) * 4 + 3] > 128) {
          const sx = reduce ? x : x + (Math.random() - 0.5) * w * 0.5;
          const sy = reduce ? y : y + (Math.random() - 0.5) * h * 0.5;
          P.push({ ox: x, oy: y, x: sx, y: sy, vx: 0, vy: 0, a: accent, rx: (Math.random() - 0.5) * w * 0.7, ry: -h * (0.15 + Math.random() * 0.75) });
        }
      }
    };
    P = [];
    const x0 = left - fs * 0.04;
    lines.forEach((t, k) => o.fillText(t, x0, y0 + k * fs * lh));
    sample(false);
    const lastY = y0 + (lines.length - 1) * fs * lh;
    const dotX = x0 + o.measureText(lines[lines.length - 1]).width;
    o.clearRect(0, 0, oc.width, oc.height);
    o.fillText('.', dotX, lastY);
    sample(true);
    R = Math.max(70, fs * 0.45);
    size = gap * 0.62;
  };

  const loop = () => {
    raf = requestAnimationFrame(loop);
    const nc = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
    if (nc !== c) { c = nc; ctx = c && c.getContext('2d'); P = []; }
    if (!c || !ctx || !ready) return;
    const r = c.getBoundingClientRect();
    if (r.bottom < 0 || r.width === 0) return;
    const nb = document.getElementById('hero-name');
    let key = nameKey;
    if (nb) { const n = nb.getBoundingClientRect(); key = [Math.round(n.left - r.left), Math.round(n.top - r.top), Math.round(n.width), Math.round(n.height), 'isim', 'iki'].join(); }
    if (!P.length || key !== nameKey || Math.abs(r.width - w) > 1 || Math.abs(r.height - h) > 1) build();
    if (frame++ % 20 === 0) fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#111';
    const s = size, R2 = R * R;
    // Kaydırdıkça harfler dağılıp yukarı süzülür
    const sp = reduce ? 0 : Math.min(1, Math.max(0, -r.top / (r.height * 0.7)));
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 1 - sp * 0.85;
    const hot: Pt[] = [];
    ctx.fillStyle = fg;
    ctx.beginPath();
    for (const p of P) {
      const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
      if (d2 < R2) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 5; p.vx += dx / d * f; p.vy += dy / d * f; }
      const tx = p.ox + p.rx * sp, ty = p.oy + p.ry * sp;
      p.vx = (p.vx + (tx - p.x) * 0.05) * 0.84;
      p.vy = (p.vy + (ty - p.y) * 0.05) * 0.84;
      p.x += p.vx; p.y += p.vy;
      if (p.a || Math.abs(p.x - tx) + Math.abs(p.y - ty) > 5) hot.push(p);
      else ctx.rect(p.x, p.y, s, s);
    }
    ctx.fill();
    ctx.fillStyle = '#E35D17';
    ctx.beginPath();
    for (const p of hot) ctx.rect(p.x, p.y, s, s);
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf); clearTimeout(readyT);
    window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave);
    window.removeEventListener('touchstart', touch); window.removeEventListener('touchmove', touch); window.removeEventListener('touchend', tend);
  };
}
// @src:end

// @src:stack
// Projeler: üst üste binen yapışkan kartlar, alttaki kart geldikçe üstteki küçülür
export function startStack(reduce: boolean) {
  let queued = false;
  const run = () => {
    queued = false;
    const hdr = document.querySelector('header');
    const hh = hdr ? hdr.offsetHeight : 61;
    document.documentElement.style.setProperty('--hdr', hh + 'px');
    const cards = [...document.querySelectorAll<HTMLElement>('[data-stack]')];
    cards.forEach((el, i) => {
      const inner = el.firstElementChild as HTMLElement | null;
      const next = cards[i + 1];
      if (!inner) return;
      const top = hh + 16 + i * 14;
      // Kart ekrana sığmıyorsa yapışkanlığı kapat ki içeriğin tamamı görülebilsin
      const fits = inner.offsetHeight <= innerHeight - top - 24;
      el.style.position = fits ? 'sticky' : 'relative';
      el.style.top = fits ? top + 'px' : '0px';
      let s = 1;
      if (fits && next && !reduce) {
        const a = el.getBoundingClientRect(), b = next.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height));
        s = 1 - p * 0.07;
      }
      inner.style.transform = `scale(${s.toFixed(4)})`;
    });
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  run();
  return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
}
// @src:end

// Kaydırınca beliren bölümler ve sayan rakamlar
export function startReveal(reduce: boolean) {
  if (!('IntersectionObserver' in window)) return () => {};
  const count = (el: HTMLElement) => {
    const end = +(el.dataset.count || 0), node = el.firstChild, t0 = performance.now();
    if (!node || reduce) return;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1200), e = 1 - Math.pow(1 - p, 3);
      node.nodeValue = String(Math.round(end * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target as HTMLElement;
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.querySelectorAll<HTMLElement>('[data-count]').forEach(count);
    io.unobserve(el);
  }), { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  const scan = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-rv])').forEach(el => {
    el.setAttribute('data-rv', '1');
    if (reduce) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)';
    el.style.transitionDelay = (el.dataset.reveal || 0) + 'ms';
    io.observe(el);
  });
  scan();
  const mo = new MutationObserver(scan);
  mo.observe(document.body, { childList: true, subtree: true });
  return () => { io.disconnect(); mo.disconnect(); };
}

// MÄ±knatÄ±slÄ± butonlar
export function startMagnet(reduce: boolean) {
  if (reduce || !matchMedia('(pointer: fine)').matches) return () => {};
  let cur: HTMLElement | null = null;
  const move = (e: PointerEvent) => {
    const el = (e.target as Element).closest && ((e.target as Element).closest('[data-magnetic]') as HTMLElement | null);
    if (cur && cur !== el) { cur.style.transform = ''; }
    cur = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25, y = (e.clientY - r.top - r.height / 2) * 0.35;
    el.style.transition = 'transform .2s ease-out';
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  document.addEventListener('pointermove', move, { passive: true });
  return () => document.removeEventListener('pointermove', move);
}

// Özel imleç: projelerin üzerinde büyüyüp "Aç" yazar
export function startCursor() {
  const dot = document.createElement('div');
  const label = document.createElement('span');
  dot.appendChild(label);
  Object.assign(dot.style, { position: 'fixed', left: '0', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#E35D17', border: '1.5px solid #E35D17', pointerEvents: 'none', zIndex: '9999', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '600', fontFamily: "var(--font-sans),'Schibsted Grotesk',sans-serif", whiteSpace: 'nowrap', opacity: '0', boxSizing: 'border-box', transition: 'width .25s, height .25s, background .25s, opacity .2s' });
  document.body.appendChild(dot);
  let x = -100, y = -100, tx = x, ty = y, mode = '', raf = 0;
  const set = (md: string) => {
    if (md === mode) return;
    mode = md;
    if (md === 'big') { dot.style.width = dot.style.height = '88px'; dot.style.background = '#E35D17'; }
    else if (md === 'ring') { dot.style.width = dot.style.height = '36px'; dot.style.background = 'transparent'; label.textContent = ''; }
    else { dot.style.width = dot.style.height = '10px'; dot.style.background = '#E35D17'; label.textContent = ''; }
  };
  const move = (e: PointerEvent) => {
    tx = e.clientX; ty = e.clientY; dot.style.opacity = '1';
    const t = e.target as Element;
    const big = t.closest && (t.closest('[data-cursor]') as HTMLElement | null);
    if (big) { label.textContent = big.dataset.cursor || ''; set('big'); }
    else if (t.closest && t.closest('a,button,input')) set('ring');
    else set('');
  };
  const out = () => { dot.style.opacity = '0'; };
  const loop = () => {
    x += (tx - x) * 0.22; y += (ty - y) * 0.22;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  };
  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', out);
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', out); dot.remove(); };
}

export type Tok = { t: string; c: string };
export function tok(line: string): Tok[] {
  const re = /(\/\/.*$)|(`[^`]*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(const|let|var|if|else|for|return|new|this|function|class|true|false|null|of|in|while|try|catch)\b|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)(?=\s*\()/g;
  const out: Tok[] = []; let last = 0, mm: RegExpExecArray | null;
  while ((mm = re.exec(line))) {
    if (mm.index > last) out.push({ t: line.slice(last, mm.index), c: '#D4D4D4' });
    out.push({ t: mm[0], c: mm[1] ? '#6E6E6E' : mm[2] ? '#F2B880' : mm[3] ? '#E35D17' : mm[4] ? '#C7A6FF' : '#86C5FF' });
    last = re.lastIndex;
    if (!mm[0]) re.lastIndex++;
  }
  if (last < line.length) out.push({ t: line.slice(last), c: '#D4D4D4' });
  if (!out.length) out.push({ t: ' ', c: '#D4D4D4' });
  return out;
}

