'use client';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { E } from './dc';
import ImageSlot from './ImageSlot';
import { Brand } from './Brand';
import Burger from './Burger';
import ThemeIcon from './ThemeIcon';
import EN from '@/lib/en-portfolio.json';
import { setLang, useLang, useT } from '@/lib/i18n';
import { CV_URL, LIVE_LINKS } from '@/lib/links';
import { SOURCES } from '@/lib/sources.generated';
import {
  PalItem, arriveFromAgency, go, octoTransition, onKey, startCursor, startHero, startMagnet,
  startReveal, startStack, tok, toggleTheme
} from '@/lib/portfolio-logic';

const MAIL = 'erdemsensoyy@gmail.com';
const GH = 'https://github.com/erdemsnsy';

const techs: [string, string][] = [['React', 'fe'], ['Next.js', 'fe'], ['TypeScript', 'fe'], ['JavaScript', 'fe'], ['Tailwind CSS', 'fe'], ['HTML / CSS', 'fe'], ['Node.js', 'be'], ['Express', 'be'], ['Supabase', 'veri'], ['SQLite', 'veri'], ['SQL', 'veri'], ['Git', 'araç'], ['GitHub', 'araç'], ['Vercel', 'yayın']];

type Project = {
  num: string; title: string; titleSize: string; desc: string; stack: string[]; live: string; slot: string; slotPh: string; top: number; repo?: string;
  rows?: [string, string][];
};
const projects: Project[] = [
  { num: '01 · Öne çıkan', title: 'Streakly', titleSize: 'clamp(36px,4.2vw,64px)', top: 88, live: LIVE_LINKS.streakly, slot: 'v2-proje-1', slotPh: 'Streakly ekran görüntüsü',
    desc: 'Kaçırılan günde seriyi sıfırlamak yerine bekleten bir alışkanlık takip uygulaması. Cihazlar arası gerçek zamanlı eşitleme, arkadaşlarla ortak seri ve site kapalıyken çalışan bildirimler sunar.',
    stack: ['Next.js', 'TypeScript', 'Supabase'],
    rows: [['Problem', 'Klasik takip uygulamaları tek bir kaçırılan günde bütün seriyi sıfırlıyor.'], ['Çözüm', 'Seriyi sıfırlamak yerine bekleten bir sistem ve arkadaşlarla ortak seri.'], ['Teknik', 'Supabase ile cihazlar arası gerçek zamanlı eşitleme, site kapalıyken çalışan bildirimler.']] },
  { num: '02', title: 'Kodfolyo', titleSize: 'clamp(36px,4.2vw,64px)', top: 102, live: LIVE_LINKS.kodfolyo, repo: 'https://github.com/erdemsnsy/kodfolyo', slot: 'v2-proje-2', slotPh: 'Kodfolyo ekran görüntüsü',
    desc: 'GitHub verilerini otomatik olarak kişisel geliştirici portfolyosuna dönüştüren web uygulaması. AI destekli biyografi oluşturma ve tema özelleştirme sunar.', stack: ['Next.js', 'TypeScript', 'Supabase'] },
  { num: '03', title: 'Kâr Fişi', titleSize: 'clamp(36px,4.2vw,64px)', top: 116, live: LIVE_LINKS.karfisi, repo: 'https://github.com/erdemsnsy/karfisi', slot: 'v2-proje-3', slotPh: 'Kâr Fişi ekran görüntüsü',
    desc: 'E-ticaret satıcıları için net kâr ve kâr marjı hesaplayan finansal analiz uygulaması. Hedef fiyat önerisi ve toplu Excel analizi sunar.', stack: ['Node.js', 'Express', 'SQLite'] },
  { num: '04', title: 'Şensoy Hukuk ve Danışmanlık', titleSize: 'clamp(34px,3.8vw,56px)', top: 130, live: LIVE_LINKS.sensoyhukuk, repo: 'https://github.com/erdemsnsy/hukukvedanismanlik', slot: 'v2-proje-4', slotPh: 'Şensoy Hukuk ekran görüntüsü',
    desc: 'Hukuk büroları için makale yönetimi, hukuki hesaplama araçları ve dilekçe oluşturma modülleri içeren responsive web uygulaması.', stack: ['JavaScript', 'HTML', 'CSS'] }
];

type Exp = { date: string; now: boolean; kind: string; title: string; org: string; text: string; octo?: boolean };
const exps: Exp[] = [
  { date: 'Ağu 2026 — Devam ediyor', now: true, kind: 'İş', title: 'Freelance Web Geliştirici', org: 'Serbest çalışma · 08dijital', octo: true,
    text: 'İşletmelere yönelik web siteleri ve QR menü çözümlerini Next.js, TypeScript, Tailwind CSS ve Supabase ile geliştiriyorum. Müşteri bulma, arayüz tasarımı, geliştirme, Vercel üzerinden yayına alma ve yapay zekâ destekli bakım süreçlerini uçtan uca tek başıma yürütüyorum.' },
  { date: 'Tem 2026 — Ağu 2026', now: false, kind: 'Staj', title: 'Teknik Destek Stajyeri', org: 'CoreX Holding BV · İstanbul',
    text: 'Son kullanıcılara donanım, ağ ve çevre birimi arızalarında birinci seviye teknik destek sağladım. Kurumsal cihazlarda işletim sistemi kurulumu ve kullanıcı hazırlığı, BT envanter sayımı, asset tag kontrolü ve zimmet dokümantasyonunu yürüttüm.' },
  { date: 'Eyl 2024 — Devam ediyor', now: true, kind: 'Eğitim', title: 'Ön Lisans · Bilgisayar Programcılığı', org: 'Kastamonu Üniversitesi · Kastamonu',
    text: "Beklenen mezuniyet: 2027. Okulda öğrendiklerimi kendi projelerimde ve 08dijital'de gerçek müşterilerle uyguluyorum." }
];

const approach: [string, string, string, string][] = [
  ['01', 'Kullanıcının nerede vazgeçtiğine bakarım', "Streakly'de seri tek bir kaçırılan günde sıfırlanmasın diye bekleten bir sistem kurdum.", '0'],
  ['02', 'Bir işi baştan sona yürütürüm', "08dijital'de müşteri bulmaktan tasarıma, yayına almaya ve bakıma kadar her adımı ben yapıyorum.", '80'],
  ['03', 'Gerçek kullanıcı için yayına alırım', "Di Döner'in QR menüsü şu an gerçek müşteriler tarafından kullanılıyor.", '160']
];

const certs: [string, string, string][] = [
  ['Develop Agents in Microsoft Foundry', 'Microsoft', '0'],
  ['Platformlarla Yapay Zekâ Ajanı Geliştirme', 'BTK Akademi', '90'],
  ['Yapay Zekâ ile Web ve Mobil Uygulama Geliştirme', 'BTK Akademi', '180'],
  ['Versiyon Kontrolleri: Git ve GitHub', 'BTK Akademi', '270']
];

const O = <span style={{ color: '#E35D17' }}>.</span>;
const chipSt = 'border:1px solid var(--line);padding:5px 12px;border-radius:999px';
const rowSt = 'display:grid;grid-template-columns:84px minmax(0,1fr);gap:14px;padding:12px 0;border-bottom:1px solid var(--line);font-size:15px;line-height:1.5';
const iconLinkSt = 'width:64px;height:64px;border:1px solid #333;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:border-color .2s,background .2s';
const iconLinkHv = 'border-color:#E35D17;background:#E35D17;color:#fff';

export default function Portfolio() {
  const router = useRouter();
  const lang = useLang();
  const t = useT(EN);
  const L = useCallback((tr: string, en: string) => (lang === 'en' ? en : tr), [lang]);

  const [theme, setTheme] = useState('light');
  const [pal, setPal] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const [code, setCode] = useState(false);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const [menu, setMenu] = useState(false);
  const reduce = useRef(false);
  const copyT = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copyMail = useCallback(() => {
    try { navigator.clipboard.writeText(MAIL); } catch (e) {}
    setCopied(true);
    clearTimeout(copyT.current); copyT.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  const themeRef = useRef(theme);
  themeRef.current = theme;
  const doToggle = useCallback((e?: { clientX?: number; clientY?: number }) => toggleTheme(themeRef.current, reduce.current, setTheme, e), []);
  const goFreelance = useCallback((href: string) => router.push(href), [router]);

  const items: PalItem[] = useMemo(() => {
    const dark = theme === 'dark';
    return [
      { label: L('Projeler', 'Projects'), hint: L('Bölüm', 'Section'), run: () => go('projeler') },
      { label: L('Teknolojiler', 'Stack'), hint: L('Bölüm', 'Section'), run: () => go('teknolojiler') },
      { label: L('Deneyim', 'Experience'), hint: L('Bölüm', 'Section'), run: () => go('deneyim') },
      { label: L('İletişim', 'Contact'), hint: L('Bölüm', 'Section'), run: () => go('iletisim') },
      { label: dark ? L('Açık temaya geç', 'Switch to light theme') : L('Koyu temaya geç', 'Switch to dark theme'), hint: L('Tema', 'Theme'), run: () => doToggle() },
      { label: L('Sayfanın kaynak kodunu göster', "Show this page's source code"), hint: L('Geliştirici', 'Developer'), run: () => setCode(true) },
      { label: L('E-postayı kopyala', 'Copy email'), hint: MAIL, run: () => copyMail() },
      { label: L('GitHub profilini aç', 'Open GitHub profile'), hint: 'github.com/erdemsnsy', run: () => window.open(GH, '_blank') },
      { label: L('LinkedIn profilini aç', 'Open LinkedIn profile'), hint: 'erdem-sensoy', run: () => window.open('https://www.linkedin.com/in/erdem-sensoy', '_blank') },
      { label: L('08dijital (freelance) sayfası', '08dijital (freelance) page'), hint: L('Sayfa', 'Page'), run: () => { location.href = '/freelance'; } }
    ];
  }, [theme, L, doToggle, copyMail]);

  const list = useMemo(() => {
    const qq = q.trim().toLocaleLowerCase('tr');
    return items.filter(i => !qq || (i.label + ' ' + i.hint).toLocaleLowerCase('tr').includes(qq));
  }, [items, q]);
  const pidx = Math.min(idx, Math.max(0, list.length - 1));

  // Klavye işleyicisi her zaman son durumu görsün
  const live = useRef({ pal, idx, list });
  live.current = { pal, idx, list };

  useEffect(() => {
    let th = 'light';
    try { th = localStorage.getItem('es-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (e) {}
    document.documentElement.dataset.theme = th;
    setTheme(th);
    const rd = matchMedia('(prefers-reduced-motion: reduce)').matches;
    reduce.current = rd;
    const rs = () => setDesktop(window.innerWidth >= 760);
    rs();
    window.addEventListener('resize', rs);

    // Deneyim (mobil): kaydırdıkça çizgi dolar, ulaşılan kayıtların noktası turuncu olur
    const prog = () => {
      const el = document.querySelector<HTMLElement>('.p-exps');
      if (!el) return;
      const r = el.getBoundingClientRect(), ref = window.innerHeight * 0.55;
      el.style.setProperty('--p', String(Math.min(1, Math.max(0, (ref - r.top) / r.height))));
      [...el.children].forEach(k => k.classList.toggle('on', k.getBoundingClientRect().top < ref));
    };
    prog();
    window.addEventListener('scroll', prog, { passive: true });
    window.addEventListener('resize', prog);

    const key = (e: KeyboardEvent) => onKey(e, live.current, live.current.list, {
      togglePal: () => { setPal(p => !p); setQ(''); setIdx(0); },
      close: () => { setPal(false); setCode(false); setMenu(false); },
      setIdx,
      closePal: () => setPal(false)
    });
    const click = (e: MouseEvent) => {
      const tg = e.target as Element;
      const fr = tg.closest && tg.closest('a[href="/freelance"]');
      if (fr && !e.metaKey && !e.ctrlKey) { e.preventDefault(); octoTransition(fr.getAttribute('href')!, e.clientX, e.clientY, rd, goFreelance); return; }
      const a = tg.closest && tg.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      if (!id) return;
      e.preventDefault();
      go(id);
    };
    window.addEventListener('keydown', key);
    document.addEventListener('click', click);
    arriveFromAgency(th, rd);
    const introOn = document.documentElement.dataset.intro !== 'skip' && !!document.querySelector('.intro');
    let offHero = () => {};
    const heroT = setTimeout(() => { offHero = startHero(rd); }, introOn ? 2200 : 0);
    const offs = [() => { clearTimeout(heroT); offHero(); }, startStack(rd), startReveal(rd), startMagnet(rd)];
    if (matchMedia('(pointer: fine)').matches) offs.push(startCursor());
    return () => {
      window.removeEventListener('resize', rs); window.removeEventListener('scroll', prog); window.removeEventListener('resize', prog); window.removeEventListener('keydown', key); document.removeEventListener('click', click);
      offs.forEach(f => f());
    };
  }, [goFreelance]);

  useEffect(() => {
    if (pal) { const id = setTimeout(() => { const i = document.getElementById('pal-input'); if (i) i.focus(); }, 30); return () => clearTimeout(id); }
  }, [pal]);

  const codeData = useMemo(() => {
    if (!code) return { text: '', lines: [] as { n: number; toks: ReturnType<typeof tok> }[] };
    const text = SOURCES[tab];
    return { text, lines: text.split('\n').map((l, j) => ({ n: j + 1, toks: tok(l) })) };
  }, [code, tab]);
  const tabNames = lang === 'en' ? ['Hero particles', 'Card stack', 'Command palette', 'Theme switch'] : ['Hero parçacıkları', 'Kart yığını', 'Komut paleti', 'Tema geçişi'];

  const openLink = (e: React.MouseEvent<HTMLElement>) => { const h = e.currentTarget.dataset.href; if (h && !h.startsWith('[')) window.open(h, '_blank'); };
  const trActive = lang === 'tr', enActive = lang === 'en';

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>

        <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: '1px solid var(--line)', transition: 'background .3s' }}>
          <E st="max-width:1280px;margin:0 auto;padding:12px clamp(20px,4vw,48px);display:flex;align-items:center;justify-content:space-between;gap:12px 24px;flex-wrap:wrap">
            <a href="#top" style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em' }}>Erdem Şensoy<span style={{ color: '#E35D17' }}>.</span></a>
            <E as="nav" st="display:flex;align-items:center;gap:10px 22px;flex-wrap:wrap;font-size:14px">
              {desktop && <><a href="#projeler">{t('Projeler')}</a><a href="#teknolojiler">{t('Teknolojiler')}</a><a href="#deneyim">{t('Deneyim')}</a><a href="#iletisim">{t('İletişim')}</a></>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <E as="button" onClick={(e: React.MouseEvent) => doToggle(e)} title="Tema değiştir" data-magnetic="1" st="all:unset;cursor:pointer;width:36px;height:36px;border:1px solid var(--line);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px" hv="border-color:var(--fg)"><ThemeIcon dark={theme === 'dark'} /></E>
              </div>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, letterSpacing: '0.04em' }}>
                <E as="button" onClick={() => setLang('tr')} st={`all:unset;cursor:pointer;font-weight:${trActive ? 700 : 400};color:${trActive ? 'var(--fg)' : 'var(--mute)'}`}>TR</E>
                <span style={{ color: 'var(--mute)' }}>/</span>
                <E as="button" onClick={() => setLang('en')} st={`all:unset;cursor:pointer;font-weight:${enActive ? 700 : 400};color:${enActive ? 'var(--fg)' : 'var(--mute)'}`}>EN</E>
              </span>
              {!desktop && <Burger open={menu} onClick={() => setMenu(m => !m)} label="Menü" color="var(--fg)" border="var(--line)" />}
            </E>
          </E>
          {!desktop && menu && (
            <E className="m-menu" onClick={() => setMenu(false)} st="position:absolute;top:100%;left:0;right:0;background:var(--bg);border-bottom:1px solid var(--line);padding:4px clamp(20px,4vw,48px) 20px;display:flex;flex-direction:column;box-shadow:0 20px 40px rgba(0,0,0,.12)">
              {[['#projeler', 'Projeler'], ['#teknolojiler', 'Teknolojiler'], ['#deneyim', 'Deneyim'], ['#iletisim', 'İletişim']].map(([h, l]) => (
                <E as="a" key={h} href={h} st="font-size:24px;font-weight:600;letter-spacing:-0.03em;padding:15px 0;border-bottom:1px solid var(--line)">{t(l)}</E>
              ))}
            </E>
          )}
        </header>

        <section id="top" className="p-hero" style={{ position: 'relative', height: 'calc(100svh - var(--hdr, 61px))', minHeight: 520, overflow: 'hidden', background: 'var(--bg)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', margin: 0 }}>Erdem Şensoy, Frontend Developer</h1>
          <canvas id="hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', touchAction: 'pan-y' }}></canvas>
          <E className="p-hero-in" st="position:relative;width:100%;height:100%;max-width:1280px;margin:0 auto;padding:clamp(24px,3.4vw,48px) clamp(20px,4vw,48px);display:flex;flex-direction:column;justify-content:center;gap:clamp(20px,2.6vw,36px);pointer-events:none">
            <E st="display:flex;justify-content:space-between;align-items:center;gap:12px 24px;flex-wrap:wrap;font-size:14px;color:var(--mute)">
              <span>{t('Frontend Developer · İstanbul')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E35D17', flex: 'none', animation: 'pulse 2s infinite' }}></span>{t('Tam zamanlı pozisyonlara açığım')}</span>
            </E>
            <div id="hero-name" className="p-hero-name" style={{ width: '100%', flex: '1 1 0', minHeight: 110, maxHeight: 470 }}></div>
            <E st="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:24px 48px;align-items:end;border-top:1px solid var(--line);padding-top:clamp(20px,2.4vw,32px);pointer-events:auto">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <E as="p" st="margin:0;font-size:clamp(22px,2.4vw,34px);line-height:1.15;letter-spacing:-0.035em;font-weight:500;max-width:22ch;text-wrap:balance">{t('Fikirleri çalışan web ürünlerine dönüştürüyorum')}{O}</E>
              </div>
              <div className="p-hero-btns" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <E as="a" href="#projeler" data-magnetic="1" st="background:#E35D17;color:#fff;padding:16px 26px;font-weight:600;font-size:16px;border-radius:999px;white-space:nowrap" hv="background:var(--fg);color:var(--bg)">{t('Projeleri gör ↓')}</E>
                <E as="a" href={CV_URL} data-magnetic="1" st="border:1px solid var(--line);padding:15px 26px;font-weight:600;font-size:16px;border-radius:999px;white-space:nowrap;background:var(--bg)" hv="border-color:var(--fg);color:var(--fg)">{t("CV'yi indir")}</E>
              </div>
            </E>
          </E>
        </section>

        <section id="projeler" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(64px,8vw,104px) clamp(20px,4vw,48px) clamp(32px,4vw,56px)' }}>
          <div data-reveal="0" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 14, color: 'var(--mute)' }}>{t('01 / Projeler')}</span>
            <E st="display:flex;justify-content:space-between;align-items:flex-end;gap:16px 24px;flex-wrap:wrap"><h2 style={{ margin: 0, fontSize: 'clamp(40px,6vw,96px)', lineHeight: 0.95, letterSpacing: '-0.055em', fontWeight: 600 }}>{t('Seçili projeler')}{O}</h2><E as="a" href={GH} target="_blank" data-magnetic="1" st="border:1px solid var(--line);padding:12px 20px;font-size:15px;font-weight:600;border-radius:999px;white-space:nowrap" hv="border-color:var(--fg);color:var(--fg)">{t("Tüm projeler GitHub'da ↗")}</E></E>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4vh', marginTop: 40 }}>
            {projects.map(p => (
              <div key={p.slot} data-stack="1" style={{ position: 'sticky', top: p.top }}>
                <E className="p-card" st="transform-origin:50% 0;will-change:transform;background:var(--card);border:1px solid var(--line);border-radius:28px;padding:clamp(20px,2.6vw,36px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:28px 44px;min-height:min(60vh,520px)">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14 }}><span style={{ color: '#E35D17', fontWeight: 600 }}>{t(p.num)}</span><span style={{ color: 'var(--mute)' }}>2026</span></div>
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <E as="h3" st={`margin:0;font-size:${p.titleSize};line-height:0.95;letter-spacing:-0.05em;font-weight:600`}>{t(p.title)}</E>
                      <E as="p" className="p-desc" st="margin:0;font-size:17px;line-height:1.55;color:var(--mute);text-wrap:pretty">{t(p.desc)}</E>
                      {p.rows && (
                        <div className="p-rows" style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line)' }}>
                          {p.rows.map(([k, v]) => (
                            <E key={k} st={rowSt}><span style={{ color: 'var(--mute)' }}>{t(k)}</span><span>{t(v)}</span></E>
                          ))}
                        </div>
                      )}
                      <E st={`display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap${p.rows ? '' : ';border-top:1px solid var(--line);padding-top:16px'}`}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13 }}>{p.stack.map(s => <E as="span" key={s} st={chipSt}>{s}</E>)}</div>
                        <div style={{ display: 'flex', gap: 18, fontWeight: 600, fontSize: 15 }}><a href={p.live}>{t('Canlı site ↗')}</a>{p.repo && <a href={p.repo} target="_blank">{t('Kaynak kod ↗')}</a>}</div>
                      </E>
                    </div>
                  </div>
                  <E className="p-slot" data-cursor="Aç ↗" data-href={p.live} onClick={openLink} st="cursor:none;border-radius:18px;overflow:hidden;background:var(--chip);min-height:240px;position:relative"><ImageSlot id={p.slot} placeholder={p.slotPh} /></E>
                </E>
              </div>
            ))}
          </div>
        </section>

        <section id="teknolojiler" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px,7vw,96px) clamp(20px,4vw,48px)' }}>
          <div data-reveal="0" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 14, color: 'var(--mute)' }}>{t('02 / Teknolojiler')}</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(30px,3.4vw,46px)', lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 600 }}>{t('Her gün kullandığım araçlar')}{O}</h2>
          </div>
          <div data-reveal="100" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 14px', marginTop: 32, borderTop: '2px solid var(--fg)', paddingTop: 22 }}>
            {techs.map(([name, cat], i) => (
              <E as="span" key={name} st="display:inline-flex;align-items:baseline;gap:14px;font-size:clamp(26px,3.8vw,60px);font-weight:600;letter-spacing:-0.05em;line-height:1.08;cursor:default;transition:color .2s" hv="color:#E35D17"><span>{name}<sup style={{ fontSize: 12, letterSpacing: '0.02em', fontWeight: 500, color: 'var(--mute)', marginLeft: 4, verticalAlign: 'super' }}>{cat}</sup></span><span style={{ color: 'var(--line)', fontWeight: 300 }}>{i < techs.length - 1 ? '/' : ''}</span></E>
            ))}
          </div>
        </section>

        <section id="deneyim" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,4vw,48px) clamp(56px,7vw,96px)' }}>
          <div data-reveal="0" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
            <span style={{ fontSize: 14, color: 'var(--mute)' }}>{t('03 / Deneyim')}</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(30px,3.4vw,46px)', lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 600 }}>{t('Deneyim ve eğitim')}{O}</h2>
          </div>
          <div className="p-exps" style={{ borderTop: '2px solid var(--fg)', display: 'flex', flexDirection: 'column' }}>
            {exps.map(x => (
              <E key={x.title} className="p-exp" data-reveal="0" st="display:flex;flex-wrap:wrap;gap:0 clamp(20px,4vw,56px)">
                <E st="flex:0 0 180px;padding:24px 0 0;display:flex;flex-direction:column;gap:10px;align-items:flex-start"><span style={{ fontSize: 15, color: 'var(--mute)', lineHeight: 1.4, textWrap: 'balance' }}>{t(x.date)}</span>{x.now && <span style={{ fontSize: 12, fontWeight: 600, color: '#E35D17', border: '1px solid #E35D17', padding: '3px 10px', borderRadius: 999 }}>{t('Şu an')}</span>}</E>
                <E st="flex:1 1 320px;min-width:0;position:relative;padding:24px 0 24px clamp(24px,3vw,40px);border-left:1px solid var(--line);display:flex;flex-direction:column;gap:8px">
                  <E as="span" className={x.now ? 'p-dot now' : 'p-dot'} st={x.now ? 'position:absolute;left:-6px;top:30px;width:11px;height:11px;border-radius:50%;background:#E35D17' : 'position:absolute;left:-6px;top:30px;width:11px;height:11px;border-radius:50%;background:var(--bg);border:2px solid var(--mute);box-sizing:border-box'}></E>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mute)' }}>{t(x.kind)}</span>
                  <E as="span" st="font-size:clamp(22px,2.2vw,30px);font-weight:600;letter-spacing:-0.03em;line-height:1.15">{t(x.title)}</E>
                  <span style={{ fontSize: 16, color: 'var(--mute)' }}>{t(x.org)}</span>
                  <p style={{ margin: '8px 0 0', fontSize: 16, lineHeight: 1.6, maxWidth: '68ch', opacity: 0.82 }}>{t(x.text)}</p>
                  {x.octo && (
                    <E as="a" href="/freelance" data-cursor="Git →" st="cursor:none;display:flex;align-items:center;background:var(--sbg);color:#fff;padding:clamp(20px,2.4vw,32px);min-height:clamp(160px,14vw,200px);overflow:hidden;position:relative;border-radius:20px;margin:8px 0 4px;max-width:720px" hv="color:#fff">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/ahtapot.png" alt="" style={{ position: 'absolute', right: 'clamp(-70px,-4vw,-30px)', bottom: 'clamp(-110px,-7vw,-50px)', width: 'clamp(170px,20vw,260px)', height: 'auto', transform: 'rotate(-18deg)', pointerEvents: 'none', filter: 'drop-shadow(0 30px 60px rgba(227,93,23,.25))' }} />
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 'min(460px,78%)' }}>
                        <span style={{ fontSize: 14, color: '#AAA' }}>{t('Müşteri işleri')}</span>
                        <E as="span" st="font-size:clamp(22px,2.2vw,30px);line-height:1.1;letter-spacing:-0.035em;font-weight:600">{t('08dijital ile işletmeler için yaptığım işler')}</E>
                        <span style={{ fontSize: 15, lineHeight: 1.5, color: '#CCC' }}>{t('QR menü, işletme web sitesi ve kişisel/kurumsal site projeleri.')}</span>
                        <span style={{ alignSelf: 'flex-start', background: '#E35D17', color: '#fff', padding: '11px 18px', fontWeight: 600, fontSize: 14, borderRadius: 999, whiteSpace: 'nowrap', marginTop: 4 }}>{t('08dijital sayfasına git →')}</span>
                      </div>
                    </E>
                  )}
                </E>
              </E>
            ))}
          </div>
        </section>

        <section style={{ background: 'var(--sbg)', color: '#fff' }}>
          <E st="max-width:1280px;margin:0 auto;padding:clamp(56px,7vw,96px) clamp(20px,4vw,48px)">
            <div data-reveal="0" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              <span style={{ fontSize: 14, color: '#AAA' }}>{t('04 / Yaklaşım')}</span>
              <h2 style={{ margin: 0, fontSize: 'clamp(30px,3.4vw,46px)', lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 600 }}>{t('Nasıl çalışırım')}{O}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid #fff' }}>
              {approach.map(([n, h, d, dl]) => (
                <E key={n} data-reveal={dl} st="display:flex;flex-wrap:wrap;gap:10px 32px;align-items:baseline;padding:clamp(20px,2.2vw,28px) 0;border-bottom:1px solid #333;transition:padding .25s" hv="padding-left:16px"><span style={{ fontSize: 14, fontWeight: 600, color: '#E35D17', flex: '0 0 40px' }}>{n}</span><E as="span" st="font-size:clamp(24px,2.8vw,40px);font-weight:600;letter-spacing:-0.04em;line-height:1.05;flex:1 1 300px">{t(h)}</E><span style={{ fontSize: 16, lineHeight: 1.6, color: '#AAA', flex: '1 1 240px' }}>{t(d)}</span></E>
              ))}
            </div>
          </E>
        </section>

        <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(56px,7vw,96px) clamp(20px,4vw,48px)' }}>
          <E st="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:32px 64px;align-items:start">
            <div data-reveal="0" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontSize: 14, color: 'var(--mute)' }}>{t('05 / Sertifikalar')}</span>
              <h2 style={{ margin: 0, fontSize: 'clamp(30px,3.4vw,46px)', lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 600 }}>{t('Sertifikalar')}{O}</h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: 'var(--mute)', maxWidth: '34ch' }}>{t('Yapay zekâ ajanları, uygulama geliştirme ve versiyon kontrolü üzerine tamamladığım eğitimler.')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid var(--fg)' }}>
              {certs.map(([n, org, dl]) => (
                <E key={n} data-reveal={dl} st="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 24px;align-items:baseline;padding:22px 0;border-bottom:1px solid var(--line);transition:padding .25s" hv="padding-left:16px"><E as="span" st="font-size:clamp(19px,1.7vw,24px);font-weight:600;letter-spacing:-0.025em;line-height:1.25">{t(n)}</E><span style={{ fontSize: 14, color: 'var(--mute)', whiteSpace: 'nowrap' }}>{org}</span></E>
              ))}
            </div>
          </E>
        </section>

        <section id="iletisim" style={{ background: 'var(--sbg)', color: '#fff' }}>
          <E st="max-width:1280px;margin:0 auto;padding:clamp(48px,5vw,72px) clamp(20px,4vw,48px);display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px">
            <span data-reveal="0" style={{ fontSize: 14, color: '#AAA' }}>{t('06 / İletişim')}</span>
            <h2 data-reveal="60" style={{ margin: 0, fontSize: 'clamp(40px,5.6vw,84px)', lineHeight: 0.95, letterSpacing: '-0.055em', fontWeight: 600 }}>{t('Birlikte çalışalım')}{O}</h2>
            <p data-reveal="120" style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: '#BBB', maxWidth: '44ch', textWrap: 'balance' }}>{t('Tam zamanlı frontend pozisyonlarına açığım. En hızlı e-postadan ulaşırsın.')}</p>
            <div data-reveal="180" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
              <E as="a" href={CV_URL} data-magnetic="1" st="background:#E35D17;color:#fff;padding:18px 30px;font-weight:600;font-size:17px;border-radius:999px;white-space:nowrap" hv="background:#fff;color:#111">{t("CV'yi indir ↓")}</E>
              <E as="button" onClick={copyMail} data-magnetic="1" st="all:unset;cursor:pointer;border:1px solid #444;padding:17px 26px;font-weight:600;font-size:17px;border-radius:999px;white-space:nowrap" hv="border-color:#fff">{copied ? L('Kopyalandı ✓', 'Copied ✓') : L('E-postayı kopyala', 'Copy email')}</E>
            </div>
            <div data-reveal="240" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
              <E as="a" href={`mailto:${MAIL}`} aria-label="E-posta" title="E-posta" data-magnetic="1" st={iconLinkSt} hv={iconLinkHv}><Brand name="gmail" size={26} /></E>
              <E as="a" href="https://www.linkedin.com/in/erdem-sensoy" target="_blank" aria-label="LinkedIn" title="LinkedIn" data-magnetic="1" st={iconLinkSt} hv={iconLinkHv}><span style={{ width: 26, height: 26, borderRadius: 5, background: '#fff', color: '#0E0E0E', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.02em' }}>in</span></E>
              <E as="a" href={GH} target="_blank" aria-label="GitHub" title="GitHub" data-magnetic="1" st={iconLinkSt} hv={iconLinkHv}><Brand name="github" size={26} /></E>
            </div>
          </E>
        </section>

        <footer style={{ maxWidth: 1280, margin: '0 auto', padding: '28px clamp(20px,4vw,48px) 40px' }}>
          <E st="display:flex;justify-content:space-between;align-items:center;gap:16px 32px;flex-wrap:wrap;font-size:14px;color:var(--mute)">
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em', color: 'var(--fg)' }}>Erdem Şensoy<span style={{ color: '#E35D17' }}>.</span></span>
            <span style={{ display: 'flex', gap: 20 }}><a href="#top" style={{ color: 'var(--fg)' }}>{t('Başa dön ↑')}</a></span>
          </E>
        </footer>

        {pal && (
          <E onClick={() => setPal(false)} st="position:fixed;inset:0;z-index:95;background:rgba(10,10,10,.45);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;justify-content:center;align-items:flex-start;padding:14vh 16px 16px">
            <E onClick={(e: React.MouseEvent) => e.stopPropagation()} st="width:min(620px,100%);background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.35);overflow:hidden">
              <E st="display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid var(--line)">
                <span style={{ color: '#E35D17', fontWeight: 700, fontSize: 18 }}>⌘</span>
                <E as="input" id="pal-input" value={q} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQ(e.target.value); setIdx(0); }} placeholder={t('Nereye gitmek istersin?')} autoComplete="off" st="flex:1;min-width:0;border:none;outline:none;background:transparent;color:var(--fg);font-size:18px;font-family:inherit" />
                <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 999, background: 'var(--chip)', color: 'var(--mute)' }}>esc</span>
              </E>
              <E st="max-height:52vh;overflow:auto;padding:8px;display:flex;flex-direction:column;gap:2px">
                {list.map((it, i) => {
                  const active = i === pidx;
                  return (
                    <E as="button" key={it.label} onClick={() => { setPal(false); setTimeout(it.run, 60); }} onMouseEnter={() => { if (idx !== i) setIdx(i); }}
                      st={`all:unset;box-sizing:border-box;cursor:pointer;width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:13px 14px;border-radius:14px;font-size:16px;font-weight:500${active ? ';background:#E35D17;color:#fff' : ''}`}>
                      <span>{it.label}</span><span style={active ? { fontSize: 13, opacity: 0.85 } : { fontSize: 13, color: 'var(--mute)' }}>{it.hint}</span>
                    </E>
                  );
                })}
                {list.length === 0 && <div style={{ padding: '18px 14px', color: 'var(--mute)', fontSize: 15 }}>{t('Sonuç yok.')}</div>}
              </E>
              <div style={{ display: 'flex', gap: 18, padding: '12px 20px', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--mute)' }}><span>{t('↑ ↓ seç')}</span><span>{t('↵ aç')}</span><span>{t('esc kapat')}</span></div>
            </E>
          </E>
        )}

        {code && (
          <>
            <div onClick={() => setCode(false)} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,.35)' }}></div>
            <E as="aside" st="position:fixed;top:0;right:0;bottom:0;width:min(660px,100vw);z-index:91;background:#0B0B0B;color:#D4D4D4;display:flex;flex-direction:column;border-left:1px solid #222;box-shadow:-30px 0 80px rgba(0,0,0,.3)">
              <E st="padding:20px 24px 16px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:1px solid #222">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 20, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}><span style={{ color: '#E35D17', fontFamily: "var(--font-mono),'JetBrains Mono',monospace", fontSize: 16 }}>&lt;/&gt;</span> {t('Bu sayfanın kaynak kodu')}</span><span style={{ fontSize: 14, color: '#888' }}>{t('Aşağıdaki kod şu an bu sayfayı çalıştırıyor.')}</span></div>
                <E as="button" onClick={() => setCode(false)} st="all:unset;cursor:pointer;font-size:14px;border:1px solid #333;padding:8px 14px;border-radius:999px;color:#fff;white-space:nowrap" hv="border-color:#fff">{t('Kapat ✕')}</E>
              </E>
              <E st="display:flex;gap:6px;padding:12px 24px;border-bottom:1px solid #222;flex-wrap:wrap">
                {tabNames.map((name, i) => i === tab ? (
                  <E as="button" key={name} onClick={() => { setTab(i); setCodeCopied(false); }} st="all:unset;cursor:pointer;padding:7px 14px;border-radius:999px;background:#E35D17;color:#fff;font-size:13px;font-weight:500">{name}</E>
                ) : (
                  <E as="button" key={name} onClick={() => { setTab(i); setCodeCopied(false); }} st="all:unset;cursor:pointer;padding:7px 14px;border-radius:999px;border:1px solid #333;color:#BBB;font-size:13px;font-weight:500" hv="border-color:#fff;color:#fff">{name}</E>
                ))}
              </E>
              <div style={{ flex: 1, overflow: 'auto', padding: '16px 0', fontFamily: "var(--font-mono),'JetBrains Mono',monospace", fontSize: 12.5, lineHeight: 1.7 }}>
                {codeData.lines.map(ln => (
                  <div key={ln.n} style={{ display: 'flex', gap: 18, padding: '0 24px', whiteSpace: 'pre' }}><span style={{ width: 26, textAlign: 'right', color: '#444', flex: 'none', userSelect: 'none' }}>{ln.n}</span><span>{ln.toks.map((tk, k) => <span key={k} style={{ color: tk.c }}>{tk.t}</span>)}</span></div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 24px', borderTop: '1px solid #222', fontSize: 14 }}>
                <E as="button" onClick={() => { try { navigator.clipboard.writeText(codeData.text); } catch (e) {} setCodeCopied(true); }} st="all:unset;cursor:pointer;padding:9px 16px;border-radius:999px;background:#fff;color:#111;font-weight:600" hv="background:#E35D17;color:#fff">{codeCopied ? L('Kopyalandı ✓', 'Copied ✓') : L('Kodu kopyala', 'Copy code')}</E>
                <a href={GH} target="_blank" style={{ color: '#BBB' }}>{t("GitHub'da gör ↗")}</a>
              </div>
            </E>
          </>
        )}
      </div>
    </>
  );
}
