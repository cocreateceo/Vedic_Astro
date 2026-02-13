import type { Metadata } from 'next';
import { Cinzel, Poppins, Noto_Sans_Devanagari } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { SignThemeProvider } from '@/context/SignThemeContext';
import SignBackgroundOverlay from '@/components/theme/SignBackgroundOverlay';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OmSound from '@/components/layout/OmSound';
import PageTransition from '@/components/layout/PageTransition';
import ScrollProgress from '@/components/ui/ScrollProgress';
import SmoothScroll from '@/components/layout/SmoothScroll';
import TempleGopuramFrame from '@/components/ui/TempleGopuramFrame';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vedic_Astro - Authentic Vedic Astrology & Horoscopes',
  description: 'Your trusted source for authentic Vedic astrology. Get free horoscopes, birth charts, compatibility readings, and personalized predictions based on ancient Indian astrology.',
  keywords: 'vedic astrology, jyotish, horoscope, kundli, birth chart, zodiac, rashifal, compatibility, panchang',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable} ${notoDevanagari.variable}`}>
      <body className="font-body bg-cosmic-bg text-text-primary">
        <AuthProvider>
          <SignThemeProvider>
            <SignBackgroundOverlay />
            <SmoothScroll />
            <ScrollProgress />
            <TempleGopuramFrame />
            <OmSound />
            <Navbar />
            <main className="pt-[72px]">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SignThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
