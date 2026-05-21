import Link from 'next/link';
import { Mountain, MapPin, Phone, Mail } from 'lucide-react';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Komponen Footer — area bawah halaman global.
 * Menampilkan informasi kontak, lokasi, navigasi cepat.
 * Server Component: Memuat data dari pengaturan global secara dinamis.
 */
export async function Footer() {
  const tahunSekarang = new Date().getFullYear();

  // Tarik data konfigurasi global
  const payload = await getPayload({ config: configPromise });
  const pengaturan = await payload.findGlobal({ slug: 'pengaturan-situs' });

  const namaHomestay = (pengaturan?.namaHomestay as string) ?? 'MerapiStay';
  const tagline = (pengaturan?.tagline as string) ?? 'Penginapan nyaman di kaki Gunung Merapi dan Merbabu dengan udara segar dan panorama pegunungan yang memukau.';
  const nomorAdmin = (pengaturan?.nomorAdmin as string) ?? '6285727443969';
  const alamat = (pengaturan?.alamat as string) ?? 'Jl. Kaki Gunung Merapi, Magelang, Jawa Tengah';
  const nomorBersih = nomorAdmin.replace(/\D/g, '');

  return (
    <footer className="bg-stone-800 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

          {/* Kolom Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-forest-800">
                <Mountain className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-heading text-xl font-bold">{namaHomestay}</span>
            </div>
            <p className="font-body text-sm leading-relaxed text-stone-400">
              {tagline}
            </p>
          </div>

          {/* Kolom Kontak */}
          <div className="space-y-4">
            <h3 className="font-body text-sm font-semibold uppercase tracking-widest text-stone-400">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-terracotta-600" aria-hidden="true" />
                <span className="font-body text-sm text-stone-300">
                  {alamat}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-terracotta-600" aria-hidden="true" />
                <a
                  href={`https://wa.me/${nomorBersih}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-stone-300 transition-colors hover:text-white"
                >
                  +{nomorAdmin.startsWith('62') ? nomorAdmin.replace(/^62/, '62 ') : nomorAdmin}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-terracotta-600" aria-hidden="true" />
                <a
                  href="mailto:info@merapistay.com"
                  className="font-body text-sm text-stone-300 transition-colors hover:text-white"
                >
                  info@merapistay.com
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom Navigasi Cepat */}
          <div className="space-y-4">
            <h3 className="font-body text-sm font-semibold uppercase tracking-widest text-stone-400">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/kamar', label: 'Pilih Kamar' },
                { href: '/galeri', label: 'Galeri Foto' },
                { href: '/#cara-memesan', label: 'Cara Memesan' },
                { href: '/#lokasi', label: 'Lokasi & Peta' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Garis pemisah & Copyright */}
        <div className="mt-12 border-t border-stone-700 pt-8 text-center">
          <p className="font-body text-sm text-stone-500">
            © {tahunSekarang} {namaHomestay}. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

