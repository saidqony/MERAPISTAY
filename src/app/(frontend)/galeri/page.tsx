import type { Metadata } from 'next';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { Mountain, ArrowLeft, Camera } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Galeri Foto Lengkap — MerapiStay',
  description:
    'Lihat keindahan sudut-sudut Homestay MerapiStay, suasana alam sekitar, dan kenyamanan kamar kami.',
};

interface GaleriItem {
  id?: string | null;
  foto?: {
    url?: string | null;
    alt?: string | null;
  } | string | null;
  caption?: string | null;
  kategori?: string; // 'alam' | 'kamar'
}

/**
 * Halaman Galeri Foto Lengkap Dinamis.
 * Menarik foto dari PengaturanSitus (Global) dan Foto Kamar (Collection Kamar).
 */
export default async function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filterKategori = resolvedSearchParams.kategori ?? 'semua';

  const payload = await getPayload({ config: configPromise });

  // 1. Tarik galeri utama dari Global Settings (Kategori: Alam / Homestay)
  const pengaturan = await payload.findGlobal({
    slug: 'pengaturan-situs',
    depth: 2,
  });

  const rawGaleriUtama = (pengaturan?.galeri as any[]) ?? [];
  const galeriUtamaMapped: GaleriItem[] = rawGaleriUtama.map((item) => ({
    id: item.id,
    foto: item.foto,
    caption: item.caption ?? 'Suasana Indah MerapiStay',
    kategori: 'alam',
  }));

  // 2. Tarik semua foto kamar (Kategori: Kamar)
  const { docs: kamarList } = await payload.find({
    collection: 'kamar',
    where: {
      tersedia: { equals: true },
    },
    depth: 2,
  });

  const kamarPhotos: GaleriItem[] = [];
  kamarList.forEach((kamar) => {
    const rawFotos = (kamar.fotoKamar as any[]) ?? [];
    rawFotos.forEach((item, idx) => {
      if (item.foto) {
        kamarPhotos.push({
          id: `kamar-${kamar.id}-${idx}`,
          foto: item.foto,
          caption: `${kamar.namaKamar} — ${item.caption ?? 'Detail Kamar'}`,
          kategori: 'kamar',
        });
      }
    });
  });

  // Gabungkan semua foto
  let gabunganFoto = [...galeriUtamaMapped, ...kamarPhotos];

  // Tambahkan fallback jika benar-benar kosong dari database
  if (gabunganFoto.length === 0) {
    gabunganFoto = [
      {
        id: 'fb-1',
        caption: 'Pemandangan Pagi Gunung Merapi dari Kamar Utama',
        kategori: 'alam',
        foto: {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRAaZ0_IxJ8n2jfNmQn6ljD-SEfU7LJt0ekumgw21AW0-dMLss-LM3liGMMd5LARzqpKac7fl-DJTgNOpnhvwx06soq5AK5Mp_loWphmW9-qQTZG96PA2hIOHSbANJhvEkdHZekQ4goPY6yXOqiVDfOGwI9G07L1SQto9N3BHB70-xI7ah2oTsNNqk1JL5B4B_aXgmc7Dekos7H9Y9jWvkLUe6RtM09Ngy61w7XR7j08t_KhLsC-GxzcOa-NW2hTmH1Acr2d8SI_A',
          alt: 'Kamar Merapi View'
        }
      },
      {
        id: 'fb-2',
        caption: 'Kamar Mandi Semi-Outdoor dengan Nuansa Alam Alami',
        kategori: 'kamar',
        foto: {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkcgIp4QWmJ9YB4XxadNw3fIaUD3LHTn3HQDR9UoLFuv4kpeeFDt1-RsANVZI9kTQWzxiO7vV1a9OhO5g3qjRlNGuXlF7Tts0VI_tcHral3UnzGLQYz0ktHCrQvJngikBLlMHzL7IPIf6VdjoZ11JQlZVZ4tL2I57dS6uvzVJhvgnZtayQ-osObWKN-M2OVxMKU9cluw5w9d3MX47AUHdtsLJUbRMIrDvNgSOoR3SqZMmrwBtaZ9Xoxio13rReOe-F-ADoeG2CckU',
          alt: 'Detail Kamar Mandi'
        }
      },
      {
        id: 'fb-3',
        caption: 'Balkon Pribadi untuk Menikmati Udara Segar Pegunungan',
        kategori: 'alam',
        foto: {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbWFC4xUEZPbHbopP6yiYiNT5qPJJgP2KhP8NlbErWDcfUb_5FdVOt5XwJvhp2lcyd5JSMGrEHgua40vQzaKuivNdvAGRjM1_-IQBF4VsRrRiGbo7ebFVq1VCtemVbm1pLatMhvpVYwB7FtYdk0RQ5FfssYn2ZOdApvdpEg5CHbJ3QXIr--prCkWRjPfKeHWXQ33kK4DcQ5IfMvOhTCYpf2yf99tjbU20o3sUOsCkJ94RWgbirf5pj-iLPAeZgf9Iw5WbTwmXoQA0',
          alt: 'Balkon View Gunung'
        }
      },
      {
        id: 'fb-4',
        caption: 'Detail Interior Kamar Tidur yang Hangat & Minimalis',
        kategori: 'kamar',
        foto: {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYuL_58HkcCWGmzzYz1CxNFz6gTxalc4L-Z7veEZS5j5CjNRtA96PQ6OskyYyvh6rywaeb2vjZiJXmgKYKJ2TCEYdpw5uRmYjukqyNZjeZSBytAFagspM_CQtgbZCxuQYqQGDZodU3xe8nz_f5vnZ52LDft1iByIyHgnSFKL2SuRjrWVaMGIxGUD6zQCVVNvJg1vrgprtt8Uk-TLUEcHl6iJJXcWCosaecOXwc20IjG1cdGSBxK9eI_xZ_lTuifRzscOK0vZhY1LQ',
          alt: 'Interior Bed Detail'
        }
      }
    ];
  }

  // Filter berdasarkan kategori yang dipilih
  const fotoList = filterKategori === 'semua'
    ? gabunganFoto
    : gabunganFoto.filter((item) => item.kategori === filterKategori);

  return (
    <main className="min-h-screen bg-stone-50 py-12">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Tombol kembali */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-forest-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Header Halaman */}
        <div className="mb-12 border-b border-stone-200 pb-8">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-sage-700">
            Aset Visual Homestay
          </span>
          <h1 className="mt-2 font-heading text-4xl font-bold text-stone-800 md:text-5xl">
            Galeri Keindahan MerapiStay
          </h1>
          <p className="mt-4 max-w-2xl font-body text-base text-stone-600">
            Kumpulan dokumentasi foto keindahan alam, sudut estetik homestay, dan detail kamar tidur yang kami persiapkan spesial untuk kunjungan Anda.
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { slug: 'semua', label: 'Semua Foto' },
              { slug: 'alam', label: 'Homestay & Alam' },
              { slug: 'kamar', label: 'Interior Kamar' },
            ].map((kat) => {
              const isActive = filterKategori === kat.slug;
              return (
                <Link
                  key={kat.slug}
                  href={`/galeri?kategori=${kat.slug}`}
                  className={`rounded-full px-5 py-2 font-body text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {kat.label}
                </Link>
              );
            })}
          </div>

          <div className="font-body text-sm text-stone-500">
            Menampilkan <span className="font-bold text-stone-800">{fotoList.length}</span> dokumentasi foto
          </div>
        </div>

        {/* Responsive Grid/Masonry Collage */}
        {fotoList.length > 0 ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 space-y-4">
            {fotoList.map((item, index) => {
              const fotoUrl = typeof item.foto === 'object' ? item.foto?.url ?? '/images/placeholder-room.jpg' : item.foto ?? '/images/placeholder-room.jpg';
              const fotoAlt = typeof item.foto === 'object' ? item.foto?.alt ?? `Dokumentasi MerapiStay ${index + 1}` : `Dokumentasi MerapiStay ${index + 1}`;

              return (
                <div
                  key={item.id ?? index}
                  className="break-inside-avoid relative overflow-hidden rounded-xl border border-stone-200/40 bg-white shadow-sm group cursor-pointer"
                >
                  <img
                    src={fotoUrl}
                    alt={fotoAlt}
                    className="w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  {/* Soft overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="font-body text-xs font-semibold text-white drop-shadow">
                      {item.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <Camera className="mx-auto h-12 w-12 text-stone-300" aria-hidden="true" />
            <p className="mt-4 font-heading text-lg font-semibold text-stone-700">Foto Tidak Ditemukan</p>
            <p className="mt-2 font-body text-sm text-stone-500">
              Belum ada berkas foto di bawah kategori ini.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
