import type { Metadata, Viewport } from 'next';
import { sans } from '@/lib/fonts';
import './freelance.css';
import Intro from '@/components/Intro';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://erdemsensoy.vercel.app'),
  title: '08dijital — QR menü, web sitesi ve Instagram',
  description: 'Kafe, restoran ve küçük işletmeler için QR menü, web sitesi ve Instagram hizmeti. Tek kişiden, baştan sona.',
  openGraph: { title: '08dijital — İşletmenin dijital yüzü', description: 'QR menü, işletme web sitesi ve Instagram aynı elden.', locale: 'tr_TR', type: 'website' },
  icons: { icon: '/ahtapot.png' }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

const introInit = `try{var t=localStorage.getItem('es-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}try{if(sessionStorage.getItem('octo-in')==='1'||sessionStorage.getItem('octo-out')==='1'||sessionStorage.getItem('intro-seen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='skip'}catch(e){}try{if(sessionStorage.getItem('octo-in')==='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.octo='in'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={sans.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: introInit }} /></head>
      <body><Intro />{children}<Analytics /></body>
    </html>
  );
}
