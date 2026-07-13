import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AnalyticsBeacon } from '@/components/AnalyticsBeacon';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: 'Dynamics DMG 360 — Innovamos, conectamos, transformamos',
  description:
    'Soluciones 360° en administración, ingeniería industrial y tecnología. Negocio → Procesos → Tecnología.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${space.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <AnalyticsBeacon />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
