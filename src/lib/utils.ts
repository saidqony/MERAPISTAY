import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Menggabungkan class Tailwind secara aman, menghindari konflik utility class.
 * Menggunakan clsx untuk logika kondisional dan tailwind-merge untuk deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Memformat angka ke format mata uang Rupiah Indonesia.
 * Contoh: 450000 → "Rp 450.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Memformat tanggal ke format panjang bahasa Indonesia.
 * Contoh: "2026-05-21" → "21 Mei 2026"
 */
export function formatTanggal(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Menghitung jumlah malam antara tanggal check-in dan check-out.
 * Mengembalikan minimal 1 malam untuk mencegah nilai 0 atau negatif.
 */
export function hitungJumlahMalam(checkIn: Date | string, checkOut: Date | string): number {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;

  const selisihMs = checkOutDate.getTime() - checkInDate.getTime();
  const jumlahMalam = Math.floor(selisihMs / (1000 * 60 * 60 * 24));

  // Pastikan selalu minimal 1 malam
  return Math.max(jumlahMalam, 1);
}

/**
 * Tipe data detail pesanan untuk membangun pesan WhatsApp.
 */
export interface PesananDetail {
  namaKamar: string;
  namaTamu: string;
  tanggalCheckIn: string;
  tanggalCheckOut: string;
  jumlahTamu: number;
  jumlahAnak?: number;
  totalHarga: number;
}

/**
 * Membangun URL redirect ke WhatsApp dengan pesan pra-isi berisi detail pesanan.
 * Menggunakan API wa.me untuk kompatibilitas lintas platform (iOS, Android, Desktop).
 */
export function buildWhatsAppUrl(nomorAdmin: string, detail: PesananDetail): string {
  const jumlahMalam = hitungJumlahMalam(detail.tanggalCheckIn, detail.tanggalCheckOut);

  const pesan = [
    `Halo, saya ingin memesan kamar di MerapiStay.`,
    ``,
    `📋 *Detail Pemesanan:*`,
    `• Nama: ${detail.namaTamu}`,
    `• Kamar: ${detail.namaKamar}`,
    `• Check-in: ${formatTanggal(detail.tanggalCheckIn)}`,
    `• Check-out: ${formatTanggal(detail.tanggalCheckOut)}`,
    `• Lama Menginap: ${jumlahMalam} malam`,
    `• Jumlah Tamu: ${detail.jumlahTamu} Dewasa${detail.jumlahAnak && detail.jumlahAnak > 0 ? `, ${detail.jumlahAnak} Anak` : ''}`,
    `• Total: ${formatRupiah(detail.totalHarga)}`,
    ``,
    `Mohon konfirmasi ketersediaan kamar. Terima kasih! 🙏`,
  ].join('\n');

  // Encode pesan agar aman digunakan sebagai URL parameter
  const pesanEncoded = encodeURIComponent(pesan);
  const nomorBersih = nomorAdmin.replace(/\D/g, ''); // Hapus semua karakter bukan angka

  return `https://wa.me/${nomorBersih}?text=${pesanEncoded}`;
}
