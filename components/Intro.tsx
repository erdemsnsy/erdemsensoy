'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import './intro.css';

// Oturum başına bir kez oynayan tanıtım: ipten sarkan ahtapot, alttan yükselen perde, "tanıtımı geç".
// Ahtapot geçişlerinden (octo-in / octo-out) gelindiğinde ve reduced-motion'da atlanır (layout'taki head script'i).
export default function Intro() {
  const lang = useLang();
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro === 'skip') { setDone(true); return; }
    try { sessionStorage.setItem('intro-seen', '1'); } catch (e) {}
    document.body.style.overflow = 'hidden';
    const end = setTimeout(() => setDone(true), 3000);
    return () => { clearTimeout(end); document.body.style.overflow = ''; };
  }, []);

  useEffect(() => { if (done) document.body.style.overflow = ''; }, [done]);

  useEffect(() => {
    if (!skip) return;
    const id = setTimeout(() => setDone(true), 380);
    return () => clearTimeout(id);
  }, [skip]);

  if (done) return null;
  return (
    <div className={'intro' + (skip ? ' is-skip' : '')} aria-hidden="true">
      <div className="intro-curtain" />
      <div className="intro-rope">
        <div className="intro-thread" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="intro-octo" src="/ahtapot.png" alt="" />
      </div>
      <button className="intro-skip" onClick={() => setSkip(true)}>{lang === 'en' ? 'SKIP INTRO' : 'TANITIMI GEÇ'}</button>
    </div>
  );
}
