'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { E } from './dc';
import ImageSlot from './ImageSlot';
import { Brand } from './Brand';
import Burger from './Burger';
import EN from '@/lib/en-freelance.json';
import { setLang, useLang, useT } from '@/lib/i18n';
import { octoArrive, octoLeave, startMagnet, startReveal } from '@/lib/freelance-logic';

const WA = 'https://wa.me/905468650875';
const O = <span style={{ color: '#E35D17' }}>.</span>;
const DOT = <span style={{ width: 6, height: 6, background: '#E35D17', borderRadius: '50%', flex: 'none' }}></span>;
const H2 = 'margin:0;font-size:clamp(30px,3.4vw,46px);line-height:1.05;letter-spacing:-0.04em;font-weight:600';
const ARTICLE = 'padding:clamp(24px,2.6vw,36px);border-right:1px solid #E6E6E6;border-bottom:1px solid #E6E6E6;display:flex;flex-direction:column;gap:16px';

type Service = { kol: string; title: string; text: string; bullets: string[]; price: string; days: string; media: React.ReactNode };

const laptop = (id: string, ph: string) => (
  <E st="aspect-ratio:16/10;background:#F2F2F0;display:flex;align-items:center;justify-content:center;margin-bottom:8px">
    <div style={{ width: '86%' }}><div style={{ background: '#111', borderRadius: '6px 6px 0 0', padding: '6px 6px 9px' }}><div style={{ aspectRatio: '16/10', background: '#fff', position: 'relative' }}><ImageSlot id={id} placeholder={ph} sizes="(max-width: 760px) 80vw, 30vw" /></div></div><div style={{ height: 7, background: '#CFCFCC', margin: '0 -5%', borderRadius: '0 0 5px 5px' }}></div></div>
  </E>
);

const services: Service[] = [
  { kol: 'Kol 01', title: 'QR menü', text: 'Masadaki QR kodu okutan müşterin menünü telefonunda görür. Fiyat değişince baskı gerekmez.',
    bullets: ['Fotoğraflı, kategorili menü', 'Çoklu dil (TR / EN)', "WhatsApp'tan sipariş"], price: '4.000 TL', days: 'Teslim: 3–5 gün',
    media: (
      <E className="f-qr" st="aspect-ratio:16/10;background:#F2F2F0;position:relative;overflow:hidden;margin-bottom:8px">
        <E className="f-phone" st="position:absolute;top:20px;bottom:20px;left:50%;transform:translateX(-50%);aspect-ratio:9/19;contain:size;background:#111;border-radius:24px"><E st="position:absolute;inset:6px;border-radius:19px;overflow:hidden;background:#fff"><ImageSlot id="hizmet-qr" placeholder="Di Döner QR menü (mobil)" sizes="20vw" /></E></E>
      </E>
    ) },
  { kol: 'Kol 02', title: 'İşletme web sitesi', text: "Google'da bulunan, telefonda hızlı açılan, müşteriyi aramaya ya da yol tarifine yönlendiren bir site.",
    bullets: ['Harita, arama ve WhatsApp butonu', 'Temel SEO, Google İşletme bağlantısı', 'Alan adı ve barındırma kurulumu'], price: '7.500 TL', days: 'Teslim: 7–14 gün',
    media: laptop('hizmet-isletme', 'Kumpirhane İstanbul (masaüstü)') },
  { kol: 'Kol 03', title: 'Kişisel / kurumsal site', text: 'Serbest çalışanlar, danışmanlar ve küçük şirketler için ne yaptığını ve nasıl ulaşılacağını net anlatan bir site.',
    bullets: ['Hakkında, hizmetler, iletişim sayfaları', 'İletişim formu', 'Alan adı ve barındırma kurulumu'], price: '6.000 TL', days: 'Teslim: 5–10 gün',
    media: laptop('hizmet-kisisel', 'Kişisel/kurumsal site') }
];

const care: [string, string][] = [
  ['İçerik güncelleme', 'Menü, fiyat, fotoğraf ve metin değişiklikleri.'],
  ['Alan adı ve barındırma', 'Yenileme tarihlerini ben takip ederim, siten kapanmaz.'],
  ['Teknik destek', 'Bir şey bozulursa düzeltir, küçük eklemeleri yaparım.'],
  ['Instagram', 'İstersen düzenli paylaşım tasarımı da pakete eklenir.']
];

const works: { href: string; slot: string; ph: string; name: string; badge: 'Müşteri' | 'Demo'; sub: string }[] = [
  { href: 'https://didoner.vercel.app', slot: 'is-1', ph: 'Di Döner QR menü görseli', name: 'Di Döner', badge: 'Müşteri', sub: 'QR menü · TR / EN · WhatsApp sipariş ↗' },
  { href: 'https://kumpirhaneistanbul.vercel.app', slot: 'is-3', ph: 'Kumpirhane İstanbul görseli', name: 'Kumpirhane İstanbul', badge: 'Demo', sub: 'İşletme web sitesi · SEO ↗' },
  { href: 'https://waffle7.vercel.app', slot: 'is-4', ph: 'Waffle7 QR menü görseli', name: 'Waffle7', badge: 'Demo', sub: 'QR menü ↗' }
];

const why: [string, string, string][] = [
  ['01', 'Doğrudan iletişim', 'Aracı yok; tasarımı ve kodu yapan kişiyle konuşursun.'],
  ['02', 'Mobil öncelikli', 'Müşterilerin siteni çoğunlukla telefondan açar; tasarım oradan başlar.'],
  ['03', 'Menü, site ve Instagram tek elden', 'Üç ayrı kişiyle uğraşmana gerek kalmaz.'],
  ['04', 'Teslimden sonra da destek', 'Güncelleme ve teknik sorunlar için ulaşabileceğin biri olur.']
];

const steps: [string, string, string, string, string][] = [
  ['Adım 1', 'Tanışma', 'İhtiyacını konuşuruz; kapsam, süre ve fiyat netleşir.', 'Senden', 'İşletmenin adı ve ne istediğin'],
  ['Adım 2', 'Tasarım', 'İçeriklerinle ilk taslağı hazırlar, sana gösteririm.', 'Senden', 'Menü / hizmet listesi, fotoğraf, logo'],
  ['Adım 3', 'Geliştirme', 'Onayladığın tasarımı kodlarım. 2 revizyon hakkın var.', 'Senden', 'Geri bildirim'],
  ['Adım 4', 'Yayın', 'Alan adına bağlar, yayına alırım. QR kodların hazır olur.', 'Sonra', 'İstersen bakım paketi']
];

const compare: [string, string, string][] = [
  ['Menü değişince', 'Talep aç, sırayı bekle', "WhatsApp'tan yaz, aynı gün güncel"],
  ['QR menü', 'Çoğu zaman hizmet listesinde yok', 'Ana hizmet; TR / EN dahil'],
  ['Instagram', 'Ayrı ekip, ayrı teklif', 'Siteyle aynı elden, aynı düzende'],
  ['Teklif', 'Paketler ve ek kalemler', 'İşletmene göre tek, net fiyat'],
  ['Alan adı', 'Bazen ajans adına kalır', 'Baştan senin adına kayıtlı']
];

const faq: [string, string][] = [
  ['Alan adı ve barındırma kimin adına olur?', 'Alan adı senin işletmenin adına kaydedilir. Kurulumu ben yaparım, sahibi sen olursun.'],
  ['Menüdeki fiyatları kendim değiştirebilir miyim?', 'Bakım paketindeysen bana yazman yeterli, aynı gün güncellerim. İstersen kendin düzenleyebileceğin bir panel de ekleyebilirim.'],
  ['Fiyatlandırma nasıl çalışıyor?', 'Her işletmenin ihtiyacı farklı olduğu için fiyatı konuştuktan sonra net olarak veririm. Ücretin yarısı başlarken, kalanı yayına alırken ödenir.'],
  ['Instagram hesabımı da yönetiyor musun?', "Evet. Profil düzeni, paylaşım tasarımları ve site ile Instagram'ın birbirine bağlanması dahil. Kapsamı birlikte belirleriz."],
  ['İstanbul dışından çalışıyor musun?', "Evet. Süreç Instagram, WhatsApp ve e-posta üzerinden yürüdüğü için Türkiye'nin her yerinden çalışabiliriz."]
];

const chipLabels = ['QR menü', 'İşletme sitesi', 'Kişisel / kurumsal site', 'Sosyal medya', 'Bakım'];
const budgets = ['5.000 TL altı', '5.000–15.000 TL', '15.000 TL üzeri', 'Emin değilim'];
const whens = ['Hemen', 'Bu ay içinde', '1–2 ay içinde', 'Sadece bakıyorum'];

const contactPill = 'display:flex;align-items:center;gap:12px;padding:14px 22px 14px 16px;border:1px solid #333;border-radius:999px;font-size:16px;font-weight:500;transition:border-color .2s,background .2s';
const contactPillHv = 'border-color:#fff;background:#1C1C1C;color:#fff';

export default function Freelance() {
  const router = useRouter();
  const lang = useLang();
  const t = useT(EN);

  const [open, setOpen] = useState(0);
  const [name, setName] = useState('');
  const [biz, setBiz] = useState('');
  const [msg, setMsg] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [when, setWhen] = useState('');
  const [sent, setSent] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [cta, setCta] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const [menu, setMenu] = useState(false);
  const formRef = useRef(formOpen);
  formRef.current = formOpen;

  const goHome = useCallback((href: string) => router.push(href), [router]);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setFormOpen(false); setMenu(false); } };
    const click = (e: MouseEvent) => {
      const tg = e.target as Element;
      const pf = tg.closest && tg.closest('a[href="/"]');
      if (pf && !e.metaKey && !e.ctrlKey) { e.preventDefault(); octoLeave(pf.getAttribute('href')!, e.clientX, e.clientY, reduce, goHome); return; }
      const a = tg.closest && tg.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      if (formRef.current) setFormOpen(false);
      const tt = (el.tagName === 'SECTION' && el.id !== 'top' && el.firstElementChild) as HTMLElement | false || el;
      const hdr = document.querySelector('header');
      const off = (hdr ? hdr.offsetHeight : 61) + (tt === el ? 0 : 24);
      window.scrollTo({ top: Math.max(0, tt.getBoundingClientRect().top + window.scrollY - off), behavior: 'smooth' });
    };
    const scroll = () => {
      const c = document.getElementById('iletisim');
      const nearContact = c && c.getBoundingClientRect().top < window.innerHeight;
      setCta(window.innerWidth <= 720 && window.scrollY > window.innerHeight * 0.8 && !nearContact);
    };
    const rs = () => setDesktop(window.innerWidth >= 760);
    rs();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    window.addEventListener('resize', rs);
    window.addEventListener('keydown', key);
    document.addEventListener('click', click);
    octoArrive(reduce);
    const offMagnet = startMagnet(reduce);
    let offReveal = () => {};
    const rv = setTimeout(() => { offReveal = startReveal(reduce); }, 50);
    return () => {
      clearTimeout(rv); offReveal(); offMagnet();
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); window.removeEventListener('resize', rs);
      window.removeEventListener('keydown', key); document.removeEventListener('click', click);
      document.body.style.overflow = '';
    };
  }, [goHome]);

  useEffect(() => { document.body.style.overflow = formOpen ? 'hidden' : ''; }, [formOpen]);

  const text = useMemo(() => ['Merhaba 08dijital,', name && `Ben ${name}.`, biz && `İşletme: ${biz}`, sel.length && `İlgilendiğim: ${sel.join(', ')}`, budget && `Bütçe: ${budget}`, when && `Başlangıç: ${when}`, msg].filter(Boolean).join('\n'), [name, biz, sel, budget, when, msg]);
  const waHref = WA + '?text=' + encodeURIComponent(text);
  const mailHref = 'mailto:08dijital@gmail.com?subject=' + encodeURIComponent('Proje talebi' + (biz ? ' – ' + biz : '')) + '&body=' + encodeURIComponent(text);
  const markSent = () => { setTimeout(() => setSent(true), 300); };
  const openForm = () => setFormOpen(true);
  const trActive = lang === 'tr', enActive = lang === 'en';

  const single = (arr: string[], cur: string, set: (v: string) => void) => arr.map(l => {
    const on = cur === l;
    return on
      ? <E as="button" className="f-chip" key={l} onClick={() => set('')} st="all:unset;cursor:pointer;padding:12px 16px;font-size:14px;background:#E35D17;color:#fff;border:1px solid #E35D17;border-radius:999px">{t(l)}</E>
      : <E as="button" className="f-chip" key={l} onClick={() => set(l)} st="all:unset;cursor:pointer;padding:12px 16px;font-size:14px;color:#fff;border:1px solid #444;border-radius:999px" hv="border-color:#fff">{t(l)}</E>;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: '#0E0E0E', color: '#fff', borderBottom: '1px solid #2A2A2A' }}>
        <E st="max-width:1280px;margin:0 auto;padding:14px clamp(20px,4vw,48px);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em' }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/ahtapot.png" alt="" style={{ width: 28, height: 28 }} /><span>08dijital<span style={{ color: '#E35D17' }}>.</span></span></a>
          <E as="nav" st="display:flex;align-items:center;gap:16px 24px;flex-wrap:wrap;font-size:14px">
            {desktop && <><a href="#hizmetler">{t('Hizmetler')}</a><a href="#surec">{t('Süreç')}</a><a href="#isler">{t('İşler')}</a><a href="#sss">{t('SSS')}</a></>}
            <span style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, letterSpacing: '0.04em' }}>
              <E as="button" onClick={() => setLang('tr')} st={`all:unset;cursor:pointer;font-weight:${trActive ? 700 : 400};color:${trActive ? '#fff' : '#888'}`}>TR</E>
              <span style={{ color: '#555' }}>/</span>
              <E as="button" onClick={() => setLang('en')} st={`all:unset;cursor:pointer;font-weight:${enActive ? 700 : 400};color:${enActive ? '#fff' : '#888'}`}>EN</E>
            </span>
            {desktop
              ? <E as="a" href="#iletisim" st="background:#fff;color:#111;padding:10px 16px;font-weight:600;border-radius:999px;white-space:nowrap;flex:none" hv="background:#E35D17;color:#fff">{t('Projeni konuşalım')}</E>
              : <Burger open={menu} onClick={() => setMenu(m => !m)} label="Menü" color="#fff" border="#444" />}
          </E>
        </E>
        {!desktop && menu && (
          <E className="m-menu" onClick={() => setMenu(false)} st="position:absolute;top:100%;left:0;right:0;background:#0E0E0E;border-bottom:1px solid #2A2A2A;padding:4px clamp(20px,4vw,48px) 20px;display:flex;flex-direction:column;box-shadow:0 20px 40px rgba(0,0,0,.35)">
            {[['#hizmetler', 'Hizmetler'], ['#surec', 'Süreç'], ['#isler', 'İşler'], ['#sss', 'SSS']].map(([h, l]) => (
              <E as="a" key={h} href={h} st="font-size:24px;font-weight:600;letter-spacing:-0.03em;padding:15px 0;border-bottom:1px solid #2A2A2A">{t(l)}</E>
            ))}
            <E as="a" href="#iletisim" st="margin-top:18px;background:#E35D17;color:#fff;padding:16px 20px;font-weight:600;font-size:16px;border-radius:999px;text-align:center" hv="background:#fff;color:#111">{t('Projeni konuşalım')}</E>
          </E>
        )}
      </header>

      <section id="top" className="f-top" style={{ background: '#0E0E0E', color: '#fff', overflow: 'hidden', minHeight: 'calc(100svh - 61px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="f-octo" src="/ahtapot.png" alt="08dijital maskotu turuncu ahtapot" style={{ position: 'absolute', right: 'clamp(-340px,-16vw,-90px)', bottom: 'clamp(-260px,-14vw,-80px)', width: 'clamp(420px,62vw,1040px)', height: 'auto', transform: 'rotate(-22deg)', transformOrigin: '60% 60%', animation: 'octo 7s ease-in-out infinite', filter: 'drop-shadow(0 40px 80px rgba(227,93,23,.25))', pointerEvents: 'none' }} />
          <E className="f-hero-in" st="position:relative;z-index:1;width:100%;max-width:1280px;margin:0 auto;padding:clamp(40px,5vw,72px) clamp(20px,4vw,48px);display:flex;flex-direction:column">
            <h1 className="f-h1" style={{ margin: 0, fontSize: 'clamp(42px,9.6vw,156px)', lineHeight: 0.94, letterSpacing: '-0.055em', fontWeight: 600 }}><span style={{ display: 'block', whiteSpace: 'nowrap' }}>{t('İşletmenin')}</span><span style={{ display: 'block', whiteSpace: 'nowrap' }}>{t('dijital yüzü')}{O}</span></h1>
            <E as="p" st="margin:clamp(28px,3vw,44px) 0 0;font-size:clamp(17px,1.4vw,20px);line-height:1.55;color:#BBB;max-width:40ch;text-wrap:pretty">{t('Müşterin seni bulsun, menüne baksın, sana ulaşsın. Gerisini ben hallederim.')}</E>
            <div className="f-hero-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 'clamp(32px,3.4vw,48px)' }}>
              <E as="a" href="#iletisim" st="background:#E35D17;color:#fff;padding:16px 26px;font-weight:600;font-size:16px;border-radius:999px;white-space:nowrap;flex:none" hv="background:#fff;color:#111">{t('Projeni konuşalım')}</E>
              <E as="a" href="#hizmetler" st="border:1px solid #555;padding:15px 26px;font-weight:600;font-size:16px;border-radius:999px;white-space:nowrap;flex:none;background:rgba(14,14,14,.6)" hv="border-color:#fff;color:#fff">{t('Hizmetleri gör')}</E>
            </div>
            <div className="f-trust" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', marginTop: 'clamp(28px,3vw,40px)', fontSize: 14, color: '#BBB' }}>
              {['Ücretsiz ilk görüşme', 'Aracı yok, doğrudan iletişim', 'Teslimden sonra da destek'].map(x => <span key={x} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{DOT}{t(x)}</span>)}
            </div>
          </E>
        </div>
      </section>

      <section id="hizmetler" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(72px,9vw,128px) clamp(20px,4vw,48px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 14, color: '#777' }}>{t('01 / Hizmetler')}</span>
            <E as="h2" st={`${H2};max-width:20ch`}>{t('İşletmenin internette ihtiyacı olan her şey, tek kişiden.')}</E>
          </div>
          <E as="a" href="#iletisim" st="border:1px solid #CCC;padding:13px 20px;font-size:15px" hv="border-color:#111;color:#111">{t('Teklif al →')}</E>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', borderTop: '1px solid #E6E6E6', borderLeft: '1px solid #E6E6E6' }}>
          {services.map(s => (
            <E as="article" key={s.title} st={ARTICLE}>
              {s.media}
              <span style={{ fontSize: 13, color: '#E35D17', fontWeight: 600 }}>{t(s.kol)}</span>
              <h3 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.03em', fontWeight: 600 }}>{t(s.title)}</h3>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: '#555' }}>{t(s.text)}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 15 }}>
                {s.bullets.map(b => <span key={b} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>{DOT}{t(b)}</span>)}
              </div>
              <E st="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-end;padding-top:16px;border-top:1px solid #E6E6E6;font-size:15px;margin-top:auto"><div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 13, color: '#777' }}>{t('Başlangıç')}</span><span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em' }}>{s.price}</span></div><div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}><span style={{ fontSize: 13, color: '#777' }}>{t(s.days)}</span><a href="#iletisim" style={{ fontWeight: 600 }}>{t('Teklif al →')}</a></div></E>
            </E>
          ))}

          <E as="article" st="grid-column:1/-1;padding:clamp(32px,4vw,56px) clamp(24px,2.6vw,36px);border-right:1px solid #E6E6E6;border-bottom:1px solid #E6E6E6;display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px">
            <span style={{ fontSize: 13, color: '#E35D17', fontWeight: 600 }}>{t('Kol 04 · Ek hizmet')}</span>
            <E as="h3" st="margin:0;font-size:clamp(28px,3vw,40px);letter-spacing:-0.035em;font-weight:600">{t('Sosyal medya')}</E>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: '#555', maxWidth: '52ch' }}>{t("Siten hazır olunca müşterin seni çoğunlukla Instagram'da bulur. Profilini ve paylaşımlarını sitenle aynı düzene getiririm.")}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 28px', fontSize: 15, marginTop: 4 }}>
              {['Profil ve bio düzeni', 'Paylaşım ve hikâye tasarımları', 'Öne çıkanlar kapakları', 'Menü ve site linkleri'].map(b => <span key={b} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{DOT}{t(b)}</span>)}
            </div>
            <span style={{ fontSize: 15, color: '#777', marginTop: 6 }}>{t('Başlangıç')} <strong style={{ color: '#111', fontWeight: 600 }}>{t('aylık 2.000 TL')}</strong></span>
            <a href="#iletisim" style={{ fontWeight: 600, fontSize: 15 }}>{t('Teklif al →')}</a>
          </E>
        </div>
      </section>

      <section style={{ background: '#0E0E0E', color: '#fff' }}>
        <E st="max-width:1280px;margin:0 auto;padding:clamp(64px,8vw,112px) clamp(20px,4vw,48px);display:flex;flex-wrap:wrap;gap:48px 64px">
          <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <span style={{ fontSize: 14, color: '#AAA' }}>{t('02 / Bakım ve destek')}</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(32px,4vw,54px)', lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 600 }}>{t('Yayına aldıktan sonra da buradayım')}{O}</h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: '#BBB', maxWidth: '44ch' }}>{t("Fiyatın değişti, yeni ürün geldi, çalışma saatin değişti: WhatsApp'tan yaz, aynı gün güncelleyeyim. Aylık ücret, ne kadar destek istediğine göre belirlenir.")}</p>
            <E as="a" href="#iletisim" st="align-self:flex-start;background:#fff;color:#111;padding:14px 22px;font-weight:600;border-radius:999px" hv="background:#E35D17;color:#fff">{t('Bakım paketini sor')}</E>
          </div>
          <div style={{ flex: '1.3 1 440px', display: 'flex', flexDirection: 'column', borderTop: '1px solid #333' }}>
            {care.map(([a, b]) => (
              <div key={a} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)', gap: 16, padding: '22px 0', borderBottom: '1px solid #333' }}><span style={{ fontWeight: 600, fontSize: 17 }}>{t(a)}</span><span style={{ color: '#AAA', lineHeight: 1.5 }}>{t(b)}</span></div>
            ))}
          </div>
        </E>
      </section>

      <section id="isler" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(72px,9vw,128px) clamp(20px,4vw,48px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
          <span style={{ fontSize: 14, color: '#777' }}>{t('03 / Seçili işler')}</span>
          <E as="h2" st={`${H2};max-width:20ch`}>{t('Yayında olan işler.')}</E>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: '48px 28px' }}>
          {works.map(w => (
            <a key={w.slot} href={w.href} target="_blank" style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid #111', paddingTop: 20 }}>
              <div style={{ aspectRatio: '4/3', border: '1px solid #E6E6E6', position: 'relative' }}><ImageSlot id={w.slot} placeholder={w.ph} sizes="(max-width: 760px) 100vw, 33vw" /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{w.name}</span>
                {w.badge === 'Müşteri'
                  ? <span style={{ fontSize: 12, fontWeight: 600, background: '#111', color: '#fff', padding: '4px 8px' }}>{t('Müşteri')}</span>
                  : <span style={{ fontSize: 12, fontWeight: 600, border: '1px solid #E35D17', color: '#E35D17', padding: '3px 8px' }}>Demo</span>}
              </div>
              <span style={{ fontSize: 14, color: '#666' }}>{t(w.sub)}</span>
            </a>
          ))}
        </div>
      </section>

      <section style={{ background: '#0E0E0E', color: '#fff', overflow: 'hidden' }}>
        <E st="max-width:1280px;margin:0 auto;padding:clamp(64px,7vw,96px) clamp(20px,4vw,48px);display:flex;flex-wrap:wrap;align-items:center;gap:40px 64px">
          <div style={{ flex: '1 1 380px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="f-why-octo" src="/ahtapot.png" alt="" style={{ width: 'min(100%,540px)', height: 'auto', transform: 'rotate(-8deg)', filter: 'drop-shadow(0 30px 50px rgba(227,93,23,.2))' }} />
          </div>
          <div style={{ flex: '1 1 440px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, color: '#AAA' }}>{t('04 / Neden 08dijital')}</span>
            <h2 style={{ margin: '16px 0 32px', fontSize: 'clamp(34px,4.4vw,60px)', lineHeight: 0.98, letterSpacing: '-0.045em', fontWeight: 600 }}>{t('Sekiz kol, tek kişi')}{O}</h2>
            {why.map(([n, h, d], i) => (
              <div key={n} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', padding: '20px 0', borderTop: i === 0 ? '1px solid #fff' : '1px solid #333', ...(i === why.length - 1 ? { borderBottom: '1px solid #333' } : null) }}><span style={{ fontSize: 14, fontWeight: 600, color: '#E35D17' }}>{n}</span><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 19, fontWeight: 600 }}>{t(h)}</span><span style={{ color: '#AAA', lineHeight: 1.5 }}>{t(d)}</span></div></div>
            ))}
          </div>
        </E>
      </section>

      <section id="surec" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(72px,9vw,120px) clamp(20px,4vw,48px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 14, color: '#777' }}>{t('05 / Süreç')}</span>
            <h2 style={{ margin: 0, fontSize: 'clamp(30px,3.4vw,46px)', lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 600, maxWidth: '18ch' }}>{t('Bir mesajla başlar, yayında biter')}{O}</h2>
          </div>
          <E as="a" href="#iletisim" st="background:#111;color:#fff;padding:14px 22px;font-weight:600;border-radius:999px" hv="background:#E35D17;color:#fff">{t('Konuşmaya başla')}</E>
        </div>
        <div className="f-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', borderTop: '2px solid #111' }}>
          {steps.map(([a, b, c, d, e], i) => (
            <E key={a} className="f-step" st={`position:relative;padding:${i === 0 ? '36px 28px 32px 0' : '36px 28px 32px'};display:flex;flex-direction:column;gap:14px;${i === 0 ? 'border-left:none' : 'border-left:1px solid #E6E6E6'};transition:background .25s,color .25s`} hv="background:#0E0E0E;color:#fff">
              <span style={{ position: 'absolute', top: -7, left: i === 0 ? 0 : 27, width: 12, height: 12, borderRadius: '50%', background: '#E35D17' }}></span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#E35D17' }}>{t(a)}</span>
              <span style={{ fontSize: 'clamp(26px,2.4vw,32px)', fontWeight: 600, letterSpacing: '-0.035em' }}>{t(b)}</span>
              <span style={{ fontSize: 15, lineHeight: 1.55, opacity: 0.72 }}>{t(c)}</span>
              <span style={{ marginTop: 'auto', paddingTop: 18, fontSize: 14, lineHeight: 1.45 }}><span style={{ opacity: 0.55 }}>{t(d)}</span><br />{t(e)}</span>
            </E>
          ))}
        </div>
      </section>

      <section style={{ background: '#0E0E0E', color: '#fff' }}>
        <E st="max-width:1280px;margin:0 auto;padding:clamp(72px,9vw,120px) clamp(20px,4vw,48px)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}><span style={{ fontSize: 14, color: '#AAA' }}>{t('06 / Karşılaştırma')}</span><h2 style={{ margin: 0, fontSize: 'clamp(30px,3.4vw,46px)', lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 600 }}>{t('Klasik ajans ve 08dijital')}{O}</h2></div>
          <div style={{ overflowX: 'auto' }}><div className="f-cmp" style={{ minWidth: 560, display: 'grid', gridTemplateColumns: '0.8fr 1fr 1fr', fontSize: 15, borderTop: '1px solid #fff' }}>
            <span style={{ padding: '16px 12px 16px 0', borderBottom: '1px solid #333' }}></span><span style={{ padding: '16px 12px', borderBottom: '1px solid #333', color: '#999' }}>{t('Klasik ajans')}</span><span style={{ padding: '16px 12px', borderBottom: '1px solid #333', fontWeight: 700, color: '#E35D17' }}>08dijital</span>
            {compare.map(([a, b, c], i) => {
              const bb = i < compare.length - 1 ? { borderBottom: '1px solid #333' } : null;
              return (
                <Row key={a}>
                  <span style={{ padding: '18px 12px 18px 0', ...bb, color: '#DDD' }}>{t(a)}</span><span style={{ padding: '18px 12px', ...bb, color: '#999', lineHeight: 1.45 }}>{t(b)}</span><span style={{ padding: '18px 12px', ...bb, fontWeight: 600, lineHeight: 1.45 }}>{t(c)}</span>
                </Row>
              );
            })}
          </div></div>
        </E>
      </section>

      <section id="sss" style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(72px,9vw,120px) clamp(20px,4vw,48px) clamp(40px,5vw,64px)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, marginBottom: 40 }}>
          <span style={{ fontSize: 14, color: '#777' }}>{t('07 / Sık sorulanlar')}</span>
          <h2 style={{ margin: 0, fontSize: 'clamp(30px,3.4vw,46px)', lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 600 }}>{t('Başlamadan önce bilmek istediklerin')}{O}</h2>
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', borderTop: '1px solid #111' }}>
          {faq.map(([qq, a], i) => {
            const o = open === i;
            return (
              <div key={qq} style={{ borderBottom: '1px solid #E6E6E6' }}>
                <E as="button" className="f-q" onClick={() => setOpen(o ? -1 : i)} st="all:unset;cursor:pointer;width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 0;font-size:18px;font-weight:500;box-sizing:border-box"><span>{t(qq)}</span><span style={{ width: 24, flex: 'none', color: '#E35D17', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, lineHeight: 1, transition: 'transform .3s ease', transform: o ? 'rotate(45deg)' : 'none' }}>+</span></E>
                <div style={{ display: 'grid', gridTemplateRows: o ? '1fr' : '0fr', transition: 'grid-template-rows .35s ease' }}><div style={{ overflow: 'hidden' }}><p className="f-a" style={{ margin: 0, padding: '0 0 24px', fontSize: 16, lineHeight: 1.6, color: '#555', maxWidth: '64ch' }}>{t(a)}</p></div></div>
              </div>
            );
          })}
          <span style={{ textAlign: 'center', fontSize: 14, color: '#777', marginTop: 16 }}>{t('Aklındaki soru burada yok mu?')} <a href={WA} target="_blank" style={{ color: '#111', fontWeight: 600 }}>{t("WhatsApp'tan sor →")}</a></span>
        </div>
      </section>

      <section id="iletisim" style={{ background: '#0E0E0E', color: '#fff', position: 'relative', marginTop: 'clamp(110px,12vw,150px)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ahtapot.png" alt="" style={{ position: 'absolute', top: 'clamp(-130px,-10vw,-90px)', left: '50%', transform: 'translateX(-50%) rotate(8deg)', width: 'clamp(170px,17vw,240px)', height: 'auto', pointerEvents: 'none', animation: 'octo2 6s ease-in-out infinite' }} />
        <E st="max-width:1280px;margin:0 auto;padding:clamp(120px,12vw,160px) clamp(20px,4vw,48px) clamp(64px,7vw,96px);display:flex;flex-direction:column;align-items:center;text-align:center;gap:24px">
          <span style={{ fontSize: 14, color: '#AAA' }}>{t('Sıra senin işletmende')}</span>
          <h2 style={{ margin: 0, fontSize: 'clamp(48px,7.4vw,112px)', lineHeight: 0.92, letterSpacing: '-0.055em', fontWeight: 600 }}>{t('Projeni konuşalım')}{O}</h2>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: '#BBB', maxWidth: '44ch' }}>{t('Ne yapmak istediğini anlat. İlk görüşme ücretsiz ve bağlayıcı değil; 24 saat içinde dönüş yaparım.')}</p>
          <E as="button" onClick={openForm} st="all:unset;cursor:pointer;background:#E35D17;color:#fff;padding:20px 34px;font-weight:600;font-size:18px;border-radius:999px;margin-top:8px" hv="background:#fff;color:#111">{t('Ücretsiz görüşelim →')}</E>
          <E st="width:100%;max-width:820px;border-top:1px solid #2A2A2A;margin-top:40px;padding-top:32px;display:flex;flex-direction:column;align-items:center;gap:18px">
            <span style={{ fontSize: 14, color: '#999' }}>{t('ya da doğrudan yaz')}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              <E as="a" href="https://instagram.com/08dijitalcom" target="_blank" st={contactPill} hv={contactPillHv}><Brand name="instagram" size={22} />@08dijitalcom</E>
              <E as="a" href={WA} target="_blank" st={contactPill} hv={contactPillHv}><Brand name="whatsapp" size={22} />0546 865 08 75</E>
              <E as="a" href="mailto:08dijital@gmail.com" st={contactPill} hv={contactPillHv}><Brand name="gmail" size={22} />08dijital@gmail.com</E>
            </div>
          </E>
        </E>
      </section>

      <footer style={{ maxWidth: 1280, margin: '0 auto', padding: '28px clamp(20px,4vw,48px) 0', overflow: 'hidden' }}>
        <E st="display:flex;justify-content:space-between;align-items:center;gap:20px 32px;flex-wrap:wrap;font-size:14px">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em' }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/ahtapot.png" alt="" style={{ width: 24, height: 24 }} />08dijital<span style={{ color: '#E35D17', marginLeft: -8 }}>.</span></span>
          <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap', color: '#444' }}><a href="#hizmetler">{t('Hizmetler')}</a><a href="#surec">{t('Süreç')}</a><a href="#isler">{t('İşler')}</a><a href="#sss">{t('SSS')}</a><a href="https://instagram.com/08dijitalcom" target="_blank">Instagram</a><a href="/">{t('Portfolyo')}</a></nav>
        </E>
        <div style={{ marginTop: 24, borderTop: '1px solid #E6E6E6', paddingTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#777' }}><a href="#top">{t('Başa dön ↑')}</a></div>
        <div style={{ fontSize: 'clamp(48px,8vw,120px)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1, margin: 'clamp(12px,1.6vw,20px) 0 0', paddingBottom: 'clamp(20px,2.4vw,32px)', textAlign: 'center', whiteSpace: 'nowrap', color: '#111', userSelect: 'none' }}>08dijital<span style={{ color: '#E35D17' }}>.</span></div>
      </footer>

      {cta && !formOpen && (
        <E as="button" onClick={openForm} st="all:unset;cursor:pointer;position:fixed;left:16px;right:16px;bottom:16px;z-index:30;box-sizing:border-box;height:54px;display:flex;align-items:center;justify-content:center;background:#E35D17;color:#fff;font-weight:600;font-size:16px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.25)">{t('Teklif al →')}</E>
      )}

      {formOpen && (
        <E st="position:fixed;inset:0;z-index:100;background:#0E0E0E;color:#fff;display:flex;flex-direction:column;overflow:auto">
          <E st="max-width:1280px;width:100%;margin:0 auto;padding:18px clamp(20px,4vw,48px);display:flex;justify-content:space-between;align-items:center;gap:16px;border-bottom:1px solid #2A2A2A">
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em' }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/ahtapot.png" alt="" style={{ width: 28, height: 28 }} />08dijital<span style={{ color: '#E35D17', marginLeft: -10 }}>.</span></span>
            <E as="button" onClick={() => { setFormOpen(false); setSent(false); }} st="all:unset;cursor:pointer;font-size:15px;border:1px solid #444;padding:10px 16px;border-radius:999px" hv="border-color:#fff">{t('Kapat ✕')}</E>
          </E>
          <E st="flex:1;max-width:1280px;width:100%;margin:0 auto;padding:clamp(24px,4vw,56px) clamp(20px,4vw,48px);display:flex;flex-wrap:wrap;align-items:center;gap:40px 72px">
            <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
              <span style={{ fontSize: 14, color: '#AAA' }}>{t('Ücretsiz görüşme')}</span>
              <h2 style={{ margin: 0, fontSize: 'clamp(40px,5.6vw,84px)', lineHeight: 0.95, letterSpacing: '-0.05em', fontWeight: 600 }}>{t('Biraz anlat, gerisini konuşalım')}{O}</h2>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: '#BBB', maxWidth: '38ch' }}>{t("Gönder'e bastığında mesajın hazır şekilde WhatsApp'ta açılır. 24 saat içinde dönüş yaparım.")}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="f-form-octo" src="/ahtapot.png" alt="" style={{ width: 'clamp(160px,18vw,260px)', height: 'auto', transform: 'rotate(-10deg)', marginTop: 8 }} />
            </div>
            {sent ? (
              <E st="flex:1.1 1 420px;display:flex;flex-direction:column;gap:20px;border-top:1px solid #fff;padding-top:32px">
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#E35D17' }}></span>
                <h3 style={{ margin: 0, fontSize: 'clamp(32px,3.6vw,52px)', lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 600 }}>{t('Mesajın elime ulaştı')}{O}</h3>
                <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: '#BBB', maxWidth: '40ch' }}>{t('24 saat içinde dönüş yapacağım. Acil bir durumsa WhatsApp\'tan doğrudan da yazabilirsin.')}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                  <E as="button" onClick={() => { setFormOpen(false); setSent(false); }} st="all:unset;cursor:pointer;background:#fff;color:#111;padding:15px 24px;font-weight:600;border-radius:999px" hv="background:#E35D17;color:#fff">{t('Siteye dön')}</E>
                  <E as="button" onClick={() => setSent(false)} st="all:unset;cursor:pointer;border:1px solid #555;padding:14px 22px;font-weight:600;border-radius:999px" hv="border-color:#fff">{t('Mesajı düzenle')}</E>
                </div>
              </E>
            ) : (
              <div style={{ flex: '1.1 1 420px', display: 'flex', flexDirection: 'column', gap: 26 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,190px),1fr))', gap: 26 }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#AAA' }}>{t('Adın')}<E as="input" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder={t('Adın soyadın')} st="border:none;border-bottom:1px solid #444;padding:12px 0;font-size:19px;outline:none;background:transparent;color:#fff" fc="border-bottom-color:#E35D17" /></label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#AAA' }}>{t('İşletmenin adı')}<E as="input" value={biz} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBiz(e.target.value)} placeholder={t('Ör. Kafe adı')} st="border:none;border-bottom:1px solid #444;padding:12px 0;font-size:19px;outline:none;background:transparent;color:#fff" fc="border-bottom-color:#E35D17" /></label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span style={{ fontSize: 13, color: '#AAA' }}>{t('Neye ihtiyacın var?')}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {chipLabels.map(l => {
                      const on = sel.includes(l);
                      const toggle = () => setSel(s => (on ? s.filter(x => x !== l) : [...s, l]));
                      return on
                        ? <E as="button" className="f-chip" key={l} onClick={toggle} st="all:unset;cursor:pointer;padding:11px 16px;font-size:15px;background:#E35D17;color:#fff;border:1px solid #E35D17;border-radius:999px">{t(l)}</E>
                        : <E as="button" className="f-chip" key={l} onClick={toggle} st="all:unset;cursor:pointer;padding:11px 16px;font-size:15px;color:#fff;border:1px solid #444;border-radius:999px" hv="border-color:#fff">{t(l)}</E>;
                    })}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 26 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#AAA' }}>{t('Bütçe')}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{single(budgets, budget, setBudget)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#AAA' }}>{t('Ne zaman başlamak istersin?')}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{single(whens, when, setWhen)}</div>
                  </div>
                </div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#AAA' }}>{t('Kısaca anlat')}<E as="textarea" value={msg} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMsg(e.target.value)} rows={4} placeholder={t('Ne yapmak istiyorsun? Varsa Instagram ya da site linkin…')} st="border:1px solid #444;padding:14px;font-size:17px;outline:none;resize:none;line-height:1.5;background:transparent;color:#fff" fc="border-color:#E35D17" /></label>
                <div className="f-send" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <E as="a" href={waHref} target="_blank" onClick={markSent} st="background:#E35D17;color:#fff;padding:17px 26px;font-weight:600;font-size:17px;border-radius:999px" hv="background:#fff;color:#111">{t('WhatsApp ile gönder')}</E>
                  <E as="a" href={mailHref} onClick={markSent} st="border:1px solid #555;padding:16px 24px;font-weight:600;border-radius:999px" hv="border-color:#fff;color:#fff">{t('E-posta ile gönder')}</E>
                </div>
              </div>
            )}
          </E>
        </E>
      )}
    </div>
  );
}

// Karşılaştırma tablosunda satır hücrelerini (grid öğeleri) kapsayıcı olmadan yerleştirir
function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
