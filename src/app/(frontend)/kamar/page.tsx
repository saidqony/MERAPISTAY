import type { Metadata } from 'next';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';
import { RoomCard, type KamarCardProps } from '@/components/kamar/RoomCard';
import { Mountain, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pilih Kamar & Penginapan — MerapiStay',
  description:
    'Cari kamar homestay ternyaman di kaki Gunung Merapi. Nikmati pemandangan spektakuler dengan fasilitas lengkap.',
};

/**
 * Halaman Pemilihan Kamar Dinamis.
 * Server Component yang menarik data kamar langsung dari Payload CMS.
 */
export default async function KamarListingPage({
  searchParams,
}: {
  searchParams: Promise<{ kapasitas?: string; urutan?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filterKapasitas = resolvedSearchParams.kapasitas;
  const sortUrutan = resolvedSearchParams.urutan;

  const payload = await getPayload({ config: configPromise });

  // Ambil semua kamar aktif dari database
  const { docs: rawKamarList } = await payload.find({
    collection: 'kamar',
    where: {
      tersedia: { equals: true },
    },
    sort: 'urutan',
    depth: 2,
  });

  // Filter kapasitas secara server-side jika parameter dikirim
  let kamarList = [...rawKamarList];
  if (filterKapasitas && filterKapasitas !== 'semua') {
    const kapNum = parseInt(filterKapasitas, 10);
    if (!isNaN(kapNum)) {
      kamarList = kamarList.filter((k) => (k.kapasitas as number) >= kapNum);
    }
  }

  // Pengurutan harga
  if (sortUrutan === 'murah') {
    kamarList.sort((a, b) => (a.hargaPerMalam as number) - (b.hargaPerMalam as number));
  } else if (sortUrutan === 'mahal') {
    kamarList.sort((a, b) => (b.hargaPerMalam as number) - (a.hargaPerMalam as number));
  }

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
            Akomodasi Terkurasi
          </span>
          <h1 className="mt-2 font-heading text-4xl font-bold text-stone-800 md:text-5xl">
            Pilihan Kamar & Homestay
          </h1>
          <p className="mt-4 max-w-2xl font-body text-base text-stone-600">
            Pilih ruang ternyaman Anda untuk beristirahat. Dari kamar deluxe berpemandangan langsung Gunung Merapi hingga ruang keluarga yang hangat.
          </p>
        </div>

        {/* Panel Filter (Server-side URL-driven) */}
        <div className="mb-10 flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label htmlFor="kapasitas-select" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Kapasitas Tamu
              </label>
              <div className="relative">
                <select
                  id="kapasitas-select"
                  defaultValue={filterKapasitas ?? 'semua'}
                  className="appearance-none rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 pr-10 font-body text-sm font-medium text-stone-700 outline-none transition-all focus:border-forest-800 focus:bg-white"
                >
                  <option value="semua">Semua Kapasitas</option>
                  <option value="2">Minimal 2 Orang</option>
                  <option value="4">Minimal 4 Orang</option>
                  <option value="6">Minimal 6 Orang</option>
                  <option value="8">Minimal 8 Orang</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="urut-select" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Urutkan Harga
              </label>
              <select
                id="urut-select"
                defaultValue={sortUrutan ?? 'default'}
                className="appearance-none rounded-lg border border-stone-200 bg-stone-50 px-4 py-2 pr-10 font-body text-sm font-medium text-stone-700 outline-none transition-all focus:border-forest-800 focus:bg-white"
              >
                <option value="default">Rekomendasi</option>
                <option value="murah">Harga Terendah</option>
                <option value="mahal">Harga Tertinggi</option>
              </select>
            </div>
          </div>

          <div className="font-body text-sm text-stone-500">
            Menampilkan <span className="font-bold text-stone-800">{kamarList.length}</span> kamar tersedia
          </div>
        </div>

        {/* Script pembantu navigasi client-side di Server Component */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Helper script to enable window navigation within static select
              const kapasitasSelect = document.getElementById('kapasitas-select');
              if (kapasitasSelect) {
                kapasitasSelect.addEventListener('change', (e) => {
                  const params = new URLSearchParams(window.location.search);
                  if (e.target.value === 'semua') params.delete('kapasitas');
                  else params.set('kapasitas', e.target.value);
                  window.location.href = window.location.pathname + '?' + params.toString();
                });
              }
              const urutSelect = document.getElementById('urut-select');
              if (urutSelect) {
                urutSelect.addEventListener('change', (e) => {
                  const params = new URLSearchParams(window.location.search);
                  if (e.target.value === 'default') params.delete('urutan');
                  else params.set('urutan', e.target.value);
                  window.location.href = window.location.pathname + '?' + params.toString();
                });
              }
            `,
          }}
        />

        {/* Grid List Kamar */}
        {kamarList.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {kamarList.map((kamar) => (
              <div key={kamar.id} className="transition-transform duration-300 hover:-translate-y-1">
                <RoomCard
                  id={String(kamar.id)}
                  namaKamar={kamar.namaKamar as string}
                  slug={kamar.slug as string}
                  deskripsi={kamar.deskripsi as string}
                  hargaPerMalam={kamar.hargaPerMalam as number}
                  kapasitas={kamar.kapasitas as number}
                  kapasitasAnak={kamar.kapasitasAnak as number}
                  fasilitas={(kamar.fasilitas as Array<{ item: string }>) ?? []}
                  tersedia={kamar.tersedia as boolean}
                  fotoKamar={(kamar.fotoKamar as KamarCardProps['fotoKamar']) ?? []}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <Mountain className="mx-auto h-12 w-12 text-stone-300 animate-pulse" aria-hidden="true" />
            <p className="mt-4 font-heading text-lg font-semibold text-stone-700">Kamar Tidak Ditemukan</p>
            <p className="mt-2 font-body text-sm text-stone-500">
              Tidak ada kamar yang sesuai dengan kriteria filter Anda saat ini.
            </p>
            <Link
              href="/kamar"
              className="mt-6 inline-block rounded-lg bg-forest-800 px-6 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-forest-900"
            >
              Reset Semua Filter
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
