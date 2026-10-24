// 08dijital etkileşim mantığı. Prototipteki (Freelance.dc.html) sınıf yöntemlerinin birebir taşınmış hali.
import { OCTO } from './portfolio-logic';

// Portfolyo'ya dönüş: ahtapot tıklanan noktada küçükten büyüyüp yukarı uçar
export function octoLeave(href: string, cx: number, cy: number, reduce: boolean, go: (href: string) => void) {
  if (reduce || !document.body.animate) { go(href); return; }
  let dark = false;
  try { dark = localStorage.getItem('es-theme') === 'dark'; } catch (e) {}
  const x = cx || innerWidth / 2, y = cy || innerHeight / 2;
  const ov = document.createElement('div');
  Object.assign(ov.style, { position: 'fixed', inset: '0', zIndex: '10000', background: dark ? '#0E0E0E' : '#FAFAF8', clipPath: `circle(0px at ${x}px ${y}px)` });
  const img = document.createElement('img');
  img.src = OCTO; img.alt = '';
  Object.assign(img.style, { position: 'fixed', left: x + 'px', top: y + 'px', width: '220px', height: 'auto', zIndex: '10001', pointerEvents: 'none', transform: 'translate(-50%,-50%) scale(.2)' });
  document.body.append(ov, img);
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  img.animate([
    { transform: 'translate(-50%,-50%) scale(.2) rotate(0deg)' },
    { transform: 'translate(-50%,-50%) translate(0,-14vh) scale(1) rotate(-12deg)', offset: 0.45 },
    { transform: 'translate(-50%,-50%) translate(-30vw,-110vh) scale(.6) rotate(-40deg)' }
  ], { duration: 1000, easing: 'cubic-bezier(.3,.6,.3,1)', fill: 'forwards' });
  ov.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 700, delay: 350, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' });
  try { sessionStorage.setItem('octo-out', '1'); } catch (e) {}
  setTimeout(() => { go(href); }, 1100);
}

export function octoArrive(reduce: boolean) {
  let on = false;
  try { on = sessionStorage.getItem('octo-in') === '1'; sessionStorage.removeItem('octo-in'); } catch (e) {}
  if (!on || reduce || !document.body.animate) return;
  const ov = document.createElement('div');
  Object.assign(ov.style, { position: 'fixed', inset: '0', zIndex: '10000', background: '#0E0E0E', pointerEvents: 'none' });
  const img = document.createElement('img');
  img.src = OCTO; img.alt = '';
  Object.assign(img.style, { position: 'fixed', left: '50%', top: '50%', width: 'min(64vw, 640px)', height: 'auto', zIndex: '10001', pointerEvents: 'none', filter: 'drop-shadow(0 40px 80px rgba(227,93,23,.35))', transform: 'translate(-50%,-50%)' });
  document.body.append(ov, img);
  img.animate([
    { transform: 'translate(-50%,-50%) rotate(0deg) scale(1)' },
    { transform: 'translate(-50%,-50%) translate(0, 3vh) rotate(-6deg) scale(.96)', offset: 0.25 },
    { transform: 'translate(-50%,-50%) translate(70vw, -90vh) rotate(35deg) scale(.5)' }
  ], { duration: 700, delay: 100, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
  ov.animate({ opacity: [1, 0] }, { duration: 400, delay: 450, easing: 'ease-out', fill: 'forwards' })
    .onfinish = () => { ov.remove(); img.remove(); };
}

export function startReveal(reduce: boolean) {
  if (reduce || !('IntersectionObserver' in window)) return () => {};
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const t = en.target as HTMLElement;
    t.style.opacity = '1'; t.style.transform = 'none';
    io.unobserve(t);
  }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  const prep = (el: HTMLElement, delay: number) => {
    if (el.dataset.rv || getComputedStyle(el).position === 'absolute') return;
    el.dataset.rv = '1';
    el.style.opacity = '0'; el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)';
    el.style.transitionDelay = delay + 'ms';
    io.observe(el);
  };
  document.querySelectorAll<HTMLElement>('section:not(#top)').forEach(s => {
    const root = (s.children.length === 1 ? s.firstElementChild : s) as HTMLElement;
    ([...root.children] as HTMLElement[]).forEach(b => {
      const kids = [...b.children] as HTMLElement[];
      const grid = getComputedStyle(b).display === 'grid' && kids.length > 2 && kids.length < 12;
      if (grid) kids.forEach((k, i) => prep(k, (i % 4) * 90));
      else prep(b, 0);
    });
  });
  return () => io.disconnect();
}

export function startMagnet(reduce: boolean) {
  if (reduce || !matchMedia('(pointer: fine)').matches) return () => {};
  let cur: HTMLElement | null = null;
  const move = (e: PointerEvent) => {
    const tg = e.target as Element;
    let el = (tg.closest && tg.closest('a,button')) as HTMLElement | null;
    if (el && !(parseFloat(getComputedStyle(el).borderTopLeftRadius) >= 100)) el = null;
    if (cur && cur !== el) cur.style.transform = '';
    cur = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transition = 'transform .2s ease-out, background .2s, color .2s, border-color .2s';
    el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px)`;
  };
  document.addEventListener('pointermove', move, { passive: true });
  return () => document.removeEventListener('pointermove', move);
}
