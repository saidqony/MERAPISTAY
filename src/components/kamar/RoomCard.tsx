'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Users, ArrowRight } from 'lucide-react';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { formatRupiah } from '@/lib/utils';

/**
 * Tipe data kamar yang diterima komponen ini.
 * Disesuaikan dengan struktur data Payload CMS collection Kamar.
 */
export interface KamarCardProps {
  id: string;
  namaKamar: string;
  slug: string;
  deskripsi: string;
  hargaPerMalam: number;
  kapasitas: number;
  kapasitasAnak?: number;
  fasilitas: Array<{ item: string }>;
  tersedia: boolean;
  fotoKamar: Array<{
    url?: string | null;
    alt?: string | null;
    sizes?: {
      card?: { url?: string | null } | null;
      thumbnail?: { url?: string | null } | null;
    } | null;
  }>;
}

/**
 * Komponen kartu kamar untuk katalog di landing page.
 * Menampilkan foto, nama, fasilitas ringkas, harga, dan tombol CTA.
 *
 * Layout: gambar (4:3) → nama kamar → fasilitas → harga → tombol
 * Hover: shadow naik + translateY(-4px) sesuai Design System.
 */
export function RoomCard({
  namaKamar,
  slug,
  deskripsi,
  hargaPerMalam,
  kapasitas,
  kapasitasAnak,
  fasilitas,
  tersedia,
  fotoKamar,
}: KamarCardProps) {
  // Gunakan foto pertama sebagai thumbnail kartu
  const fotoUtama = fotoKamar?.[0];
  const urlFoto = fotoUtama?.sizes?.card?.url ?? fotoUtama?.url ?? '/images/placeholder-room.jpg';
  const altFoto = fotoUtama?.alt ?? `Foto ${namaKamar}`;

  // Tampilkan maksimal 3 fasilitas di kartu, sisanya disembunyikan
  const fasilitasTampil = fasilitas?.slice(0, 3) ?? [];

  return (
    <article className="group flex flex-col overflow-hidden rounded-md bg-white shadow-md transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lg">

      {/* Gambar kamar — aspek rasio 4:3 */}
      <Link
        href={`/kamar/${slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={`Lihat detail ${namaKamar}`}
        tabIndex={-1}
      >
        <Image
          src={urlFoto}
          alt={altFoto}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badge status ketersediaan di atas gambar */}
        <div className="absolute left-3 top-3">
          <Badge
            variant={getStatusBadgeVariant(tersedia)}
            dot
          >
            {tersedia ? 'Tersedia' : 'Penuh'}
          </Badge>
        </div>
      </Link>

      {/* Konten kartu */}
      <div className="flex flex-1 flex-col gap-3 p-5">

        {/* Nama Kamar */}
        <Link href={`/kamar/${slug}`}>
          <h3 className="font-heading text-xl font-semibold text-stone-800 transition-colors hover:text-forest-800">
            {namaKamar}
          </h3>
        </Link>

        {/* Deskripsi singkat */}
        <p className="line-clamp-2 font-body text-sm text-stone-600">
          {deskripsi}
        </p>

        {/* Kapasitas & Fasilitas */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Kapasitas tamu */}
          <span className="flex items-center gap-1 font-body text-xs text-stone-400">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {kapasitas} Dewasa{kapasitasAnak && kapasitasAnak > 0 ? `, ${kapasitasAnak} Anak` : ''}
          </span>

          {/* Titik pemisah */}
          {fasilitasTampil.length > 0 && (
            <span className="text-stone-300" aria-hidden="true">·</span>
          )}

          {/* Fasilitas */}
          {fasilitasTampil.map((f, index) => (
            <span key={index} className="font-body text-xs text-stone-400">
              {f.item}
              {index < fasilitasTampil.length - 1 && (
                <span className="ml-2 text-stone-300" aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Spacer agar harga dan tombol selalu di bawah */}
        <div className="flex-1" />

        {/* Harga per malam */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-body text-2xl font-bold text-forest-800">
              {formatRupiah(hargaPerMalam)}
            </span>
            <span className="ml-1 font-body text-sm text-stone-400">/ malam</span>
          </div>
        </div>

        {/* Tombol CTA */}
        <Link
          href={`/kamar/${slug}`}
          className={[
            'flex w-full items-center justify-center gap-2 rounded-full py-2.5 px-5',
            'font-body text-sm font-semibold transition-all duration-200',
            tersedia
              ? 'bg-forest-800 text-white hover:bg-forest-900 hover:shadow-md active:scale-[0.98]'
              : 'cursor-not-allowed bg-stone-100 text-stone-400',
          ].join(' ')}
          aria-label={tersedia ? `Pesan ${namaKamar}` : `${namaKamar} sudah penuh`}
          onClick={(e) => !tersedia && e.preventDefault()}
        >
          {tersedia ? (
            <>
              Lihat Detail
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            'Tidak Tersedia'
          )}
        </Link>
      </div>
    </article>
  );
}
