import type { Metadata, Viewport } from 'next';
import { sans } from '@/lib/fonts';
import './freelance.css';

export const metadata: Metadata = {
  title: '08dijital — QR menü, web sitesi ve Instagram',
  description: 'Kafe, restoran ve küçük işletmeler için QR menü, web sitesi ve Instagram hizmeti. Tek kişiden, baştan sona.',
  openGraph: { title: '08dijital — İşletmenin dijital yüzü', description: 'QR menü, işletme web sitesi ve Instagram aynı elden.', locale: 'tr_TR', type: 'website', images: ['/ahtapot.png'] },
  icons: { icon: '/ahtapot.png' }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
