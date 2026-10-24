import type { Metadata, Viewport } from 'next';
import { sans, mono } from '@/lib/fonts';
import './portfolio.css';
import Intro from '@/components/Intro';

export const metadata: Metadata = {
  metadataBase: new URL('https://erdemsensoy.vercel.app'),
  title: 'Erdem Şensoy — Frontend Developer',
  description: 'Erdem Şensoy, İstanbul merkezli frontend developer. Projeler, teknolojiler, deneyim ve CV.',
  openGraph: { title: 'Erdem Şensoy — Frontend Developer', description: 'Fikirleri çalışan web ürünlerine dönüştürüyorum.', locale: 'tr_TR', type: 'website' },
  icons: { icon: '/ahtapot.png' }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// Tema ilk boyamadan önce uygulanır (es-theme yoksa sistem tercihi)
const themeInit = `try{var t=localStorage.getItem('es-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}try{if(sessionStorage.getItem('octo-in')==='1'||sessionStorage.getItem('octo-out')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='skip'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body><Intro />{children}</body>
    </html>
  );
}
