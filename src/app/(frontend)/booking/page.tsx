import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, MessageCircle, Home, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pesanan Terkirim — MerapiStay',
  description: 'Pesanan Anda telah berhasil dikirim ke WhatsApp admin MerapiStay.',
  robots: { index: false }, // Halaman konfirmasi tidak perlu diindeks search engine
};

/**
 * Halaman konfirmasi setelah pengunjung mengirim pesanan via WhatsApp.
 * Menampilkan status sukses, instruksi langkah berikutnya, dan rekening bank.
 *
 * React Server Component — tidak ada state client-side yang diperlukan.
 */
export default function KonfirmasiBookingPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-stone-50 py-20 px-6">
      <div className="mx-auto max-w-xl w-full">

        {/* ─── KARTU KONFIRMASI ────────────────────────────────────── */}
        <div className="rounded-xl bg-white p-8 shadow-lg text-center">

          {/* Ikon sukses */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sage-100">
            <CheckCircle className="h-10 w-10 text-forest-800" aria-hidden="true" />
          </div>

          {/* Judul */}
          <h1 className="font-heading text-2xl font-bold text-stone-800 md:text-3xl">
            Pesanan Terkirim!
          </h1>
          <p className="mt-3 font-body text-base text-stone-600">
            Detail pesanan Anda telah otomatis dikirim ke WhatsApp admin.
            Admin kami akan segera menghubungi Anda untuk konfirmasi.
          </p>

          {/* ─── LANGKAH SELANJUTNYA ────────────────────────────────── */}
          <div className="mt-8 rounded-lg bg-stone-50 p-5 text-left">
            <h2 className="font-body text-sm font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Langkah Selanjutnya
            </h2>

            <ol className="space-y-4" role="list">
              {[
                {
                  ikon: MessageCircle,
                  judul: 'Tunggu Konfirmasi',
                  deskripsi: 'Admin akan membalas pesan WhatsApp Anda dan mengkonfirmasi ketersediaan kamar.',
                },
                {
                  ikon: ArrowRight,
                  judul: 'Transfer Pembayaran',
                  deskripsi: 'Lakukan transfer ke rekening yang diberikan admin. Simpan bukti transfer.',
                },
                {
                  ikon: CheckCircle,
                  judul: 'Terima Invoice',
                  deskripsi: 'Setelah pembayaran dikonfirmasi, invoice PDF akan dikirim otomatis ke email Anda.',
                },
              ].map((langkah, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-forest-800 text-white font-body text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-stone-800">{langkah.judul}</p>
                    <p className="font-body text-sm text-stone-500">{langkah.deskripsi}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ─── INFO REKENING BANK ──────────────────────────────────── */}
          <div className="mt-6 rounded-lg border border-terracotta-50 bg-terracotta-50 p-5 text-left">
            <p className="font-body text-sm font-semibold text-stone-800 mb-3">
              💳 Rekening Pembayaran
            </p>
            <div className="space-y-1.5 font-body text-sm text-stone-600">
              <p><span className="font-medium">Bank:</span> BCA / BRI / Mandiri</p>
              <p><span className="font-medium">No. Rek:</span> <span className="font-mono font-semibold text-stone-800">123-456-7890</span></p>
              <p><span className="font-medium">Atas Nama:</span> MerapiStay</p>
            </div>
            <p className="mt-3 font-body text-xs text-stone-400">
              * Detail rekening resmi akan dikonfirmasi oleh admin via WhatsApp.
            </p>
          </div>

          {/* Tombol kembali ke beranda */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-200 px-6 py-2.5 font-body text-sm font-semibold text-stone-600 transition-all duration-200 hover:border-forest-800 hover:text-forest-800"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Catatan kecil */}
        <p className="mt-6 text-center font-body text-sm text-stone-400">
          Ada pertanyaan? Hubungi kami di WhatsApp:{' '}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-forest-800 hover:underline"
          >
            +62 812-3456-7890
          </a>
        </p>
      </div>
    </div>
  );
}
