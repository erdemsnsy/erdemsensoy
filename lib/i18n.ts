'use client';
import { useCallback, useSyncExternalStore } from 'react';

export type Lang = 'tr' | 'en';

// İki sayfa `es-lang` anahtarını ortak kullanır.
let lang: Lang = 'tr';
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  // Kayıtlı tercih yoksa tarayıcı diline bak: Türkçe değilse İngilizce
  try {
    const saved = localStorage.getItem('es-lang');
    lang = saved ? (saved === 'en' ? 'en' : 'tr') : (/^tr/i.test(navigator.language || 'tr') ? 'tr' : 'en');
  } catch (e) {}
  document.documentElement.lang = lang;
}
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const getSnapshot = (): Lang => { load(); return lang; };
const getServerSnapshot = (): Lang => 'tr';

export function setLang(next: Lang) {
  try { localStorage.setItem('es-lang', next); } catch (e) {}
  lang = next;
  document.documentElement.lang = next;
  listeners.forEach(f => f());
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Sözlükte karşılığı olmayan metin olduğu gibi kalır (prototipteki `EN[key]` davranışı).
export function useT(dict: Record<string, string>) {
  const l = useLang();
  return useCallback((tr: string) => (l === 'en' && dict[tr]) || tr, [l, dict]);
}
