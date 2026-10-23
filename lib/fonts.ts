import { Schibsted_Grotesk, JetBrains_Mono } from 'next/font/google';

export const sans = Schibsted_Grotesk({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700', '800'], variable: '--font-sans', display: 'swap' });
export const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
