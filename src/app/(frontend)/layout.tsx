import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── Google Fonts ─────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
  display: 'swap',
});

// ─── Metadata Default Aplikasi ────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'MerapiStay — Homestay Kaki Gunung Merapi & Merbabu',
    template: '%s | MerapiStay',
  },
  description:
    'Nikmati pengalaman menginap yang nyaman di kaki Gunung Merapi dan Merbabu, Magelang. Pemandangan gunung yang memukau, udara segar, dan fasilitas lengkap.',
  keywords: ['homestay merapi', 'penginapan magelang', 'homestay merbabu', 'villa merapi magelang'],
  authors: [{ name: 'MerapiStay' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SERVER_URL,
    siteName: 'MerapiStay',
    title: 'MerapiStay — Homestay Kaki Gunung Merapi & Merbabu',
    description: 'Nikmati pengalaman menginap di kaki Gunung Merapi, Magelang.',
  },
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen bg-white font-body text-stone-800 antialiased">
        <Navbar />
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
