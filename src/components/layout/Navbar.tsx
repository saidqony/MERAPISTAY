import Link from 'next/link';
import { Mountain, Phone } from 'lucide-react';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Komponen Navbar — header navigasi global.
 * Menggunakan sticky positioning dengan subtle backdrop untuk UX yang baik.
 * Server Component: menarik nama homestay dan nomor admin dinamis dari Payload CMS.
 */
export async function Navbar() {
  // Tarik data konfigurasi global
  const payload = await getPayload({ config: configPromise });
  const pengaturan = await payload.findGlobal({ slug: 'pengaturan-situs' });

  const namaHomestay = (pengaturan?.namaHomestay as string) ?? 'MerapiStay';
  const nomorAdmin = (pengaturan?.nomorAdmin as string) ?? '6285727443969';
  const nomorBersih = nomorAdmin.replace(/\D/g, '');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">

        {/* Logo & Brand Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-forest-800 transition-opacity hover:opacity-80"
          aria-label={`${namaHomestay} — Kembali ke Beranda`}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-forest-800">
            <Mountain className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <span className="font-heading text-xl font-bold text-stone-800">{namaHomestay}</span>
            <p className="hidden text-xs text-stone-400 sm:block">Magelang, Jawa Tengah</p>
          </div>
        </Link>

        {/* Navigasi Utama */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          <Link
            href="/kamar"
            className="font-body text-sm font-medium text-stone-600 transition-colors hover:text-forest-800"
          >
            Pilih Kamar
          </Link>
          <Link
            href="/galeri"
            className="font-body text-sm font-medium text-stone-600 transition-colors hover:text-forest-800"
          >
            Galeri
          </Link>
          <Link
            href="/#cara-memesan"
            className="font-body text-sm font-medium text-stone-600 transition-colors hover:text-forest-800"
          >
            Cara Memesan
          </Link>
          <Link
            href="/#lokasi"
            className="font-body text-sm font-medium text-stone-600 transition-colors hover:text-forest-800"
          >
            Lokasi
          </Link>
        </nav>

        {/* CTA Hubungi Kami */}
        <a
          href={`https://wa.me/${nomorBersih}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-forest-800 px-5 py-2.5 font-body text-sm font-semibold text-white transition-all duration-200 hover:bg-forest-900 hover:shadow-md"
          aria-label="Hubungi kami via WhatsApp"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Hubungi Kami</span>
        </a>
      </div>
    </header>
  );
}

