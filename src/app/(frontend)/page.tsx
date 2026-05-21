import type { Metadata } from 'next';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';
import { RoomCard, type KamarCardProps } from '@/components/kamar/RoomCard';
import { Mountain, ChevronDown, CheckCircle, MessageCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'MerapiStay — Homestay Kaki Gunung Merapi & Merbabu, Magelang',
  description:
    'Temukan penginapan nyaman dengan pemandangan Gunung Merapi yang menakjubkan. Reservasi mudah, langsung via WhatsApp.',
};

interface GaleriItem {
  id?: string | null;
  foto?: {
    url?: string | null;
    alt?: string | null;
    sizes?: {
      card?: {
        url?: string | null;
      } | null;
    } | null;
  } | string | null;
  caption?: string | null;
}

/**
 * Landing Page — Katalog Kamar.
 * React Server Component: fetch data langsung dari Payload CMS di server.
 * Tidak ada client-side fetching, sehingga lebih cepat dan SEO-friendly.
 */
export default async function BerandaPage() {
  // Ambil data kamar dari Payload CMS secara server-side
  const payload = await getPayload({ config: configPromise });

  const { docs: kamarList } = await payload.find({
    collection: 'kamar',
    where: {
      tersedia: { equals: true },
    },
    sort: 'urutan',
    depth: 2, // Populate relasi fotoKamar (media)
  });

  // Ambil data konfigurasi global (termasuk galeri foto)
  const pengaturan = await payload.findGlobal({
    slug: 'pengaturan-situs',
    depth: 2,
  });

  const galeriList = (pengaturan?.galeri as GaleriItem[]) ?? [];

  return (
    <>
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-stone-800"
        aria-label="Hero — Selamat datang di MerapiStay"
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-800/40 to-stone-900/80" />

        {/* Background texture — pola titik alam */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        {/* Konten Hero */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          {/* Badge lokasi */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm animate-fade-up">
            <Mountain className="h-4 w-4 text-terracotta-600" aria-hidden="true" />
            <span className="font-body text-sm font-medium text-white/90">
              Kaki Gunung Merapi & Merbabu, Magelang
            </span>
          </div>

          {/* Judul Hero */}
          <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl animate-fade-up animation-delay-100">
            Menginap di Kaki
            <br />
            <span className="text-terracotta-600">Gunung Merapi</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-white/75 animate-fade-up animation-delay-200">
            Rasakan kesejukan udara pegunungan, panorama gunung yang memukau,
            dan keramahan khas Magelang. Reservasi mudah langsung via WhatsApp.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-up animation-delay-300">
            <Link
              href="#katalog"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-8 py-3.5 font-body text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-forest-900 hover:shadow-xl"
            >
              Lihat Kamar Tersedia
            </Link>
            <Link
              href="#cara-memesan"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-8 py-3.5 font-body text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/60 hover:bg-white/10"
            >
              Cara Memesan
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/50" aria-hidden="true" />
        </div>
      </section>

      {/* ─── SECTION STATISTIK ────────────────────────────────────────── */}
      <section className="bg-white py-12" aria-label="Keunggulan MerapiStay">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { angka: '100%', label: 'View Gunung' },
              { angka: '2 Jam', label: 'dari Yogyakarta' },
              { angka: '24/7', label: 'Layanan Admin' },
              { angka: `${kamarList.length}+`, label: 'Pilihan Kamar' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-3xl font-bold text-forest-800">{stat.angka}</p>
                <p className="mt-1 font-body text-sm text-stone-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION KATALOG KAMAR ────────────────────────────────────── */}
      <section
        id="katalog"
        className="bg-stone-50 py-20"
        aria-labelledby="heading-katalog"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          {/* Header section */}
          <div className="mb-12 text-center">
            <span className="font-body text-sm font-semibold uppercase tracking-widest text-sage-700">
              Pilihan Penginapan
            </span>
            <h2
              id="heading-katalog"
              className="mt-3 font-heading text-3xl font-bold text-stone-800 md:text-4xl"
            >
              Kamar Tersedia
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base text-stone-600">
              Setiap kamar dirancang untuk memberikan kenyamanan maksimal
              dengan sentuhan alam pegunungan Magelang.
            </p>
          </div>

          {/* Grid Katalog Kamar */}
          {kamarList.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {kamarList.map((kamar) => (
                <RoomCard
                  key={kamar.id}
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
              ))}
            </div>
          ) : (
            // State kosong jika tidak ada kamar tersedia
            <div className="py-24 text-center">
              <Mountain className="mx-auto h-12 w-12 text-stone-300" aria-hidden="true" />
              <p className="mt-4 font-body text-stone-400">
                Semua kamar sedang penuh. Silakan cek kembali nanti atau hubungi kami.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── SECTION GALERI FOTO ───────────────────────────────────────── */}
      <section
        id="galeri"
        className="bg-stone-100 py-20"
        aria-labelledby="heading-galeri"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          {/* Header section */}
          <div className="mb-12 text-center">
            <span className="font-body text-sm font-semibold uppercase tracking-widest text-sage-700">
              Dokumentasi Homestay
            </span>
            <h2
              id="heading-galeri"
              className="mt-3 font-heading text-3xl font-bold text-stone-800 md:text-4xl"
            >
              Galeri Foto Keindahan
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base text-stone-600">
              Intip sudut ternyaman, keindahan pemandangan alam, serta suasana menenangkan di kaki Gunung Merapi.
            </p>
          </div>

          {/* Asymmetric Bento/Collage Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 h-[800px] md:h-[650px]">
            {/* Tentukan item galeri (gunakan database jika ada, atau fallback visual premium) */}
            {(() => {
              const displayList = galeriList.length > 0 ? galeriList.slice(0, 4) : [
                {
                  id: 'fb-1',
                  caption: 'Pemandangan Pagi Gunung Merapi dari Kamar Utama',
                  foto: {
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRAaZ0_IxJ8n2jfNmQn6ljD-SEfU7LJt0ekumgw21AW0-dMLss-LM3liGMMd5LARzqpKac7fl-DJTgNOpnhvwx06soq5AK5Mp_loWphmW9-qQTZG96PA2hIOHSbANJhvEkdHZekQ4goPY6yXOqiVDfOGwI9G07L1SQto9N3BHB70-xI7ah2oTsNNqk1JL5B4B_aXgmc7Dekos7H9Y9jWvkLUe6RtM09Ngy61w7XR7j08t_KhLsC-GxzcOa-NW2hTmH1Acr2d8SI_A',
                    alt: 'Kamar Merapi View'
                  }
                },
                {
                  id: 'fb-2',
                  caption: 'Kamar Mandi Semi-Outdoor dengan Nuansa Alam Alami',
                  foto: {
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkcgIp4QWmJ9YB4XxadNw3fIaUD3LHTn3HQDR9UoLFuv4kpeeFDt1-RsANVZI9kTQWzxiO7vV1a9OhO5g3qjRlNGuXlF7Tts0VI_tcHral3UnzGLQYz0ktHCrQvJngikBLlMHzL7IPIf6VdjoZ11JQlZVZ4tL2I57dS6uvzVJhvgnZtayQ-osObWKN-M2OVxMKU9cluw5w9d3MX47AUHdtsLJUbRMIrDvNgSOoR3SqZMmrwBtaZ9Xoxio13rReOe-F-ADoeG2CckU',
                    alt: 'Detail Kamar Mandi'
                  }
                },
                {
                  id: 'fb-3',
                  caption: 'Balkon Pribadi untuk Menikmati Udara Segar Pegunungan',
                  foto: {
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbWFC4xUEZPbHbopP6yiYiNT5qPJJgP2KhP8NlbErWDcfUb_5FdVOt5XwJvhp2lcyd5JSMGrEHgua40vQzaKuivNdvAGRjM1_-IQBF4VsRrRiGbo7ebFVq1VCtemVbm1pLatMhvpVYwB7FtYdk0RQ5FfssYn2ZOdApvdpEg5CHbJ3QXIr--prCkWRjPfKeHWXQ33kK4DcQ5IfMvOhTCYpf2yf99tjbU20o3sUOsCkJ94RWgbirf5pj-iLPAeZgf9Iw5WbTwmXoQA0',
                    alt: 'Balkon View Gunung'
                  }
                },
                {
                  id: 'fb-4',
                  caption: 'Detail Interior Kamar Tidur yang Hangat & Minimalis',
                  foto: {
                    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYuL_58HkcCWGmzzYz1CxNFz6gTxalc4L-Z7veEZS5j5CjNRtA96PQ6OskyYyvh6rywaeb2vjZiJXmgKYKJ2TCEYdpw5uRmYjukqyNZjeZSBytAFagspM_CQtgbZCxuQYqQGDZodU3xe8nz_f5vnZ52LDft1iByIyHgnSFKL2SuRjrWVaMGIxGUD6zQCVVNvJg1vrgprtt8Uk-TLUEcHl6iJJXcWCosaecOXwc20IjG1cdGSBxK9eI_xZ_lTuifRzscOK0vZhY1LQ',
                    alt: 'Interior Bed Detail'
                  }
                }
              ];

              return displayList.map((item, index) => {
                const fotoUrl = typeof item.foto === 'object' ? item.foto?.url ?? '/images/placeholder-room.jpg' : item.foto ?? '/images/placeholder-room.jpg';
                const fotoAlt = typeof item.foto === 'object' ? item.foto?.alt ?? `Foto Galeri ${index + 1}` : `Foto Galeri ${index + 1}`;

                // Variasi styling grid berdasarkan index untuk tampilan asimetris premium
                let gridClasses = "relative overflow-hidden rounded-xl group cursor-pointer shadow-md border border-stone-200/20";
                if (index === 0) {
                  // Foto Utama: Besar (kiri)
                  gridClasses += " sm:col-span-2 sm:row-span-2";
                } else if (index === 1) {
                  // Atas kanan
                  gridClasses += " sm:col-span-1 sm:row-span-1";
                } else if (index === 2) {
                  // Bawah kanan 1
                  gridClasses += " sm:col-span-1 sm:row-span-1";
                } else if (index === 3) {
                  // Bawah kanan 2
                  gridClasses += " sm:col-span-2 sm:row-span-1";
                }

                return (
                  <div key={item.id ?? index} className={gridClasses}>
                    <Image
                      src={fotoUrl}
                      alt={fotoAlt}
                      fill
                      sizes={index === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"}
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                    {/* Caption Overlay - Soft glassmorphic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="font-body text-sm font-medium text-white drop-shadow">
                        {item.caption ?? 'Keindahan MerapiStay'}
                      </p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* ─── SECTION CARA MEMESAN ─────────────────────────────────────── */}
      <section
        id="cara-memesan"
        className="bg-white py-20"
        aria-labelledby="heading-cara-memesan"
      >
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="mb-12 text-center">
            <span className="font-body text-sm font-semibold uppercase tracking-widest text-sage-700">
              Mudah & Cepat
            </span>
            <h2
              id="heading-cara-memesan"
              className="mt-3 font-heading text-3xl font-bold text-stone-800 md:text-4xl"
            >
              Cara Memesan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                ikon: CheckCircle,
                langkah: '01',
                judul: 'Pilih Kamar',
                deskripsi: 'Telusuri katalog kamar kami dan pilih yang paling sesuai dengan kebutuhan Anda.',
              },
              {
                ikon: MessageCircle,
                langkah: '02',
                judul: 'Isi Form & Chat',
                deskripsi: 'Isi formulir pemesanan. Sistem akan otomatis membuka WhatsApp dengan detail pesanan Anda.',
              },
              {
                ikon: CreditCard,
                langkah: '03',
                judul: 'Transfer & Konfirmasi',
                deskripsi: 'Lakukan pembayaran via transfer bank. Invoice PDF akan dikirim ke email Anda.',
              },
            ].map((item) => (
              <div key={item.langkah} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
                  <item.ikon className="h-7 w-7 text-forest-800" aria-hidden="true" />
                </div>
                <span className="font-body text-xs font-bold tracking-widest text-stone-300">
                  LANGKAH {item.langkah}
                </span>
                <h3 className="mt-2 font-heading text-xl font-semibold text-stone-800">
                  {item.judul}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-stone-600">
                  {item.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION LOKASI ───────────────────────────────────────────── */}
      <section
        id="lokasi"
        className="bg-stone-50 py-20"
        aria-labelledby="heading-lokasi"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-10 text-center">
            <span className="font-body text-sm font-semibold uppercase tracking-widest text-sage-700">
              Temukan Kami
            </span>
            <h2
              id="heading-lokasi"
              className="mt-3 font-heading text-3xl font-bold text-stone-800 md:text-4xl"
            >
              Lokasi Strategis
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-body text-base text-stone-600">
              Terletak di kaki Gunung Merapi, mudah dijangkau dari Yogyakarta dan Solo.
            </p>
          </div>

          {/* Embed Google Maps */}
          <div className="overflow-hidden rounded-lg shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63252.06408!2d110.4!3d-7.541!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5955555555!2sGunung%20Merapi!5e0!3m2!1sid!2sid"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi MerapiStay di kaki Gunung Merapi, Magelang"
            />
          </div>
        </div>
      </section>

      {/* ─── CTA AKHIR HALAMAN ────────────────────────────────────────── */}
      <section className="bg-forest-800 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Siap Memesan Kamar?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-white/75">
            Hubungi kami sekarang dan dapatkan kamar terbaik untuk liburan Anda
            di kaki Gunung Merapi.
          </p>
          <Link
            href="#katalog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-body text-base font-semibold text-forest-800 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            Lihat Kamar Tersedia
          </Link>
        </div>
      </section>
    </>
  );
}
