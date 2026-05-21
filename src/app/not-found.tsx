import Link from 'next/link';
import { Mountain, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Halaman Tidak Ditemukan | MerapiStay',
  description: 'Halaman yang Anda cari tidak ditemukan. Kembali ke katalog kamar MerapiStay.',
};

/**
 * Halaman 404 kustom — ditampilkan saat rute tidak ditemukan.
 * Menggunakan tema Design System "Structured Nature" dengan elemen alam.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-stone-50 px-6 py-20 text-center">

      {/* Ikon dekoratif */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-sage-100">
        <Mountain className="h-12 w-12 text-forest-800" aria-hidden="true" />
      </div>

      {/* Kode error besar */}
      <p className="font-heading text-8xl font-bold text-stone-100 select-none" aria-hidden="true">
        404
      </p>

      {/* Pesan utama */}
      <h1 className="mt-2 font-heading text-2xl font-bold text-stone-800 md:text-3xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mx-auto mt-4 max-w-md font-body text-base text-stone-600">
        Sepertinya halaman yang Anda cari sudah tidak ada atau alamatnya berubah.
        Yuk kembali ke katalog kamar kami!
      </p>

      {/* Tombol kembali */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-3 font-body text-sm font-semibold text-white transition-all duration-200 hover:bg-forest-900 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Beranda
        </Link>
        <Link
          href="/#katalog"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-200 px-6 py-3 font-body text-sm font-semibold text-stone-600 transition-all duration-200 hover:border-forest-800 hover:text-forest-800"
        >
          Lihat Kamar
        </Link>
      </div>
    </div>
  );
}
