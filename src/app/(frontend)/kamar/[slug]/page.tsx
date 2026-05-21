import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';
import Image from 'next/image';
import { MapPin, Users, Moon } from 'lucide-react';
import { FasilitasList } from '@/components/kamar/FasilitasList';
import { BookingForm } from '@/components/booking/BookingForm';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/utils';

interface PageParams {
  params: Promise<{ slug: string }>;
}

/**
 * Menghasilkan semua slug kamar untuk Static Site Generation (SSG).
 * Next.js akan pre-render semua halaman detail kamar saat build.
 */
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: 'kamar',
    select: { slug: true },
    limit: 100,
  });

  return docs.map((kamar) => ({
    slug: kamar.slug as string,
  }));
}

/**
 * Menghasilkan metadata dinamis berdasarkan data kamar.
 */
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  // Normalisasi slug untuk case-insensitivity dan space replacement
  const normalizedSlug = decodeURIComponent(slug)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

  const { docs } = await payload.find({
    collection: 'kamar',
    where: {
      or: [
        { slug: { equals: slug } },
        { slug: { like: normalizedSlug } },
        { slug: { like: decodeURIComponent(slug).trim().replace(/\s+/g, '-') } },
        { slug: { like: decodeURIComponent(slug).trim() } },
      ],
    },
    depth: 1,
    limit: 1,
  });

  const kamar = docs[0];
  if (!kamar) return { title: 'Kamar Tidak Ditemukan' };

  return {
    title: `${kamar.namaKamar} — ${formatRupiah(kamar.hargaPerMalam as number)} / malam`,
    description: kamar.deskripsi as string,
  };
}

/**
 * Halaman Detail Kamar.
 * React Server Component dengan data fetching langsung ke Payload.
 * BookingForm di-render sebagai Client Component (interaktif).
 */
export default async function DetailKamarPage({ params }: PageParams) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  // Normalisasi slug untuk case-insensitivity dan space replacement
  const normalizedSlug = decodeURIComponent(slug)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

  // Ambil data kamar berdasarkan slug asli atau yang dinormalisasi
  const { docs } = await payload.find({
    collection: 'kamar',
    where: {
      or: [
        { slug: { equals: slug } },
        { slug: { like: normalizedSlug } },
        { slug: { like: decodeURIComponent(slug).trim().replace(/\s+/g, '-') } },
        { slug: { like: decodeURIComponent(slug).trim() } },
      ],
    },
    depth: 2,
    limit: 1,
  });

  const kamar = docs[0];

  // Redirect ke 404 jika kamar tidak ditemukan
  if (!kamar) notFound();

  // Ambil pengaturan situs untuk nomor WA admin
  const pengaturan = await payload.findGlobal({ slug: 'pengaturan-situs' });

  const nomorAdmin = (pengaturan?.nomorAdmin as string) ?? '6285727443969';
  const fotoList = (kamar.fotoKamar as Array<{ url?: string | null; alt?: string | null; sizes?: { card?: { url?: string | null } | null } | null }>) ?? [];
  const fasilitas = (kamar.fasilitas as Array<{ item: string }>) ?? [];

  // URL foto utama untuk hero
  const fotoUtama = fotoList[0];
  const urlFotoUtama = fotoUtama?.sizes?.card?.url ?? fotoUtama?.url ?? '/images/placeholder-room.jpg';

  return (
    <>
      {/* ─── HERO FOTO ─────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[320px] overflow-hidden bg-stone-200" aria-label="Foto utama kamar">
        <Image
          src={urlFotoUtama}
          alt={fotoUtama?.alt ?? `Foto ${kamar.namaKamar}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/40" aria-hidden="true" />
      </section>

      {/* ─── KONTEN UTAMA ──────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

            {/* ─── KOLOM KIRI: Info Kamar ───────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Header Kamar */}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(kamar.tersedia as boolean)} dot>
                    {(kamar.tersedia as boolean) ? 'Tersedia' : 'Penuh'}
                  </Badge>
                  <span className="font-body text-sm text-stone-400">
                    <MapPin className="inline h-3.5 w-3.5 mr-1" aria-hidden="true" />
                    Kaki Gunung Merapi, Magelang
                  </span>
                </div>

                <h1 className="font-heading text-3xl font-bold text-stone-800 md:text-4xl">
                  {kamar.namaKamar as string}
                </h1>

                {/* Kapasitas & Harga */}
                <div className="mt-4 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1.5 font-body text-sm text-stone-600">
                    <Users className="h-4 w-4 text-sage-700" aria-hidden="true" />
                    Maks. {kamar.kapasitas as number} tamu
                  </div>
                  <div className="flex items-center gap-1.5 font-body text-sm text-stone-600">
                    <Moon className="h-4 w-4 text-sage-700" aria-hidden="true" />
                    Per malam
                  </div>
                  <div>
                    <span className="font-body text-2xl font-bold text-forest-800">
                      {formatRupiah(kamar.hargaPerMalam as number)}
                    </span>
                    <span className="ml-1 font-body text-sm text-stone-400">/ malam</span>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-stone-800 mb-3">
                  Tentang Kamar Ini
                </h2>
                <p className="font-body text-base leading-relaxed text-stone-600">
                  {kamar.deskripsi as string}
                </p>
              </div>

              {/* Fasilitas */}
              {fasilitas.length > 0 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold text-stone-800 mb-4">
                    Fasilitas
                  </h2>
                  <FasilitasList fasilitas={fasilitas} />
                </div>
              )}

              {/* Galeri Foto Tambahan */}
              {fotoList.length > 1 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold text-stone-800 mb-4">
                    Galeri Foto
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {fotoList.slice(1).map((foto, index) => (
                      <div
                        key={index}
                        className="relative aspect-[4/3] overflow-hidden rounded-md"
                      >
                        <Image
                          src={foto.sizes?.card?.url ?? foto.url ?? '/images/placeholder-room.jpg'}
                          alt={foto.alt ?? `Foto ${kamar.namaKamar} ${index + 2}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ─── KOLOM KANAN: Form Booking (Sticky) ──────────────── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {(kamar.tersedia as boolean) ? (
                <BookingForm
                  kamarId={kamar.id}
                  namaKamar={kamar.namaKamar as string}
                  hargaPerMalam={kamar.hargaPerMalam as number}
                  kapasitas={kamar.kapasitas as number}
                  kapasitasAnak={(kamar.kapasitasAnak as number) ?? 0}
                  nomorAdmin={nomorAdmin}
                />
              ) : (
                <div className="rounded-lg border border-stone-100 bg-stone-50 p-6 text-center">
                  <p className="font-heading text-lg font-semibold text-stone-400">
                    Kamar Tidak Tersedia
                  </p>
                  <p className="mt-2 font-body text-sm text-stone-400">
                    Kamar ini sedang penuh. Silakan pilih kamar lain atau hubungi kami.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
