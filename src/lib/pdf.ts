import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatRupiah, formatTanggal, hitungJumlahMalam } from './utils';

/**
 * Tipe data yang dibutuhkan untuk generate invoice PDF.
 */
export interface InvoiceData {
  nomorInvoice: string;
  namaTamu: string;
  namaKamar: string;
  tanggalCheckIn: string;
  tanggalCheckOut: string;
  jumlahTamu: number;
  totalHarga: number;
  tanggalBayar: Date;
}

/**
 * Warna yang digunakan dalam dokumen invoice.
 * Menggunakan palet Design System "Structured Nature".
 */
const WARNA = {
  // forest-800: #2D4A3E
  utama: rgb(0.176, 0.29, 0.243),
  // stone-800: #292524
  teks: rgb(0.161, 0.145, 0.141),
  // stone-600: #57534E
  tekstSekunder: rgb(0.341, 0.325, 0.306),
  // sage-100: #E8EDEA → sebagai garis tipis
  garis: rgb(0.91, 0.929, 0.918),
  // white
  putih: rgb(1, 1, 1),
};

/**
 * Menghasilkan dokumen invoice dalam format PDF sebagai Buffer.
 * Menggunakan pdf-lib untuk pembuatan dokumen server-side tanpa dependensi browser.
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const {
    nomorInvoice,
    namaTamu,
    namaKamar,
    tanggalCheckIn,
    tanggalCheckOut,
    jumlahTamu,
    totalHarga,
    tanggalBayar,
  } = data;

  // Buat dokumen PDF baru berukuran A4
  const pdfDoc = await PDFDocument.create();
  const halaman = pdfDoc.addPage([595.28, 841.89]); // Dimensi A4 dalam points

  const { width, height } = halaman.getSize();

  // Gunakan font bawaan untuk menghindari dependensi font eksternal
  const fontTebal = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontBiasa = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const jumlahMalam = hitungJumlahMalam(tanggalCheckIn, tanggalCheckOut);
  const hargaPerMalam = Math.round(totalHarga / jumlahMalam);

  // ─── HEADER ────────────────────────────────────────────────────────
  // Blok warna hijau forest di bagian atas sebagai header
  halaman.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: WARNA.utama,
  });

  // Nama homestay di header
  halaman.drawText('MerapiStay', {
    x: 48,
    y: height - 52,
    size: 28,
    font: fontTebal,
    color: WARNA.putih,
  });

  // Tagline
  halaman.drawText('Homestay Kaki Gunung Merapi & Merbabu, Magelang', {
    x: 48,
    y: height - 76,
    size: 10,
    font: fontBiasa,
    color: rgb(0.8, 0.9, 0.85),
  });

  // Label "INVOICE" di kanan header
  halaman.drawText('INVOICE', {
    x: width - 130,
    y: height - 52,
    size: 22,
    font: fontTebal,
    color: WARNA.putih,
  });

  halaman.drawText(nomorInvoice, {
    x: width - 130,
    y: height - 76,
    size: 12,
    font: fontBiasa,
    color: rgb(0.8, 0.9, 0.85),
  });

  // ─── INFO TANGGAL INVOICE ──────────────────────────────────────────
  let posY = height - 155;

  halaman.drawText('Tanggal Pembayaran:', {
    x: 48,
    y: posY,
    size: 10,
    font: fontBiasa,
    color: WARNA.tekstSekunder,
  });
  halaman.drawText(formatTanggal(tanggalBayar), {
    x: 200,
    y: posY,
    size: 10,
    font: fontTebal,
    color: WARNA.teks,
  });

  posY -= 18;
  halaman.drawText('Status Pembayaran:', {
    x: 48,
    y: posY,
    size: 10,
    font: fontBiasa,
    color: WARNA.tekstSekunder,
  });
  halaman.drawText('LUNAS ✓', {
    x: 200,
    y: posY,
    size: 10,
    font: fontTebal,
    color: WARNA.utama,
  });

  // ─── INFO TAMU ────────────────────────────────────────────────────
  posY -= 40;
  halaman.drawText('DETAIL TAMU', {
    x: 48,
    y: posY,
    size: 9,
    font: fontTebal,
    color: WARNA.tekstSekunder,
  });

  posY -= 4;
  // Garis pemisah tipis
  halaman.drawLine({
    start: { x: 48, y: posY },
    end: { x: width - 48, y: posY },
    thickness: 0.5,
    color: WARNA.garis,
  });

  posY -= 20;
  halaman.drawText('Nama Tamu:', {
    x: 48,
    y: posY,
    size: 10,
    font: fontBiasa,
    color: WARNA.tekstSekunder,
  });
  halaman.drawText(namaTamu, {
    x: 200,
    y: posY,
    size: 10,
    font: fontTebal,
    color: WARNA.teks,
  });

  posY -= 18;
  halaman.drawText('Jumlah Tamu:', {
    x: 48,
    y: posY,
    size: 10,
    font: fontBiasa,
    color: WARNA.tekstSekunder,
  });
  halaman.drawText(`${jumlahTamu} orang`, {
    x: 200,
    y: posY,
    size: 10,
    font: fontTebal,
    color: WARNA.teks,
  });

  // ─── DETAIL PESANAN ───────────────────────────────────────────────
  posY -= 40;
  halaman.drawText('DETAIL PEMESANAN', {
    x: 48,
    y: posY,
    size: 9,
    font: fontTebal,
    color: WARNA.tekstSekunder,
  });

  posY -= 4;
  halaman.drawLine({
    start: { x: 48, y: posY },
    end: { x: width - 48, y: posY },
    thickness: 0.5,
    color: WARNA.garis,
  });

  // Header tabel
  posY -= 20;
  halaman.drawRectangle({
    x: 48,
    y: posY - 4,
    width: width - 96,
    height: 22,
    color: rgb(0.945, 0.953, 0.949), // sage-100
  });

  halaman.drawText('Deskripsi', { x: 56, y: posY + 2, size: 9, font: fontTebal, color: WARNA.teks });
  halaman.drawText('Qty', { x: 320, y: posY + 2, size: 9, font: fontTebal, color: WARNA.teks });
  halaman.drawText('Harga Satuan', { x: 370, y: posY + 2, size: 9, font: fontTebal, color: WARNA.teks });
  halaman.drawText('Total', { x: width - 120, y: posY + 2, size: 9, font: fontTebal, color: WARNA.teks });

  // Baris data kamar
  posY -= 28;
  halaman.drawText(namaKamar, { x: 56, y: posY, size: 10, font: fontBiasa, color: WARNA.teks });
  halaman.drawText(`${jumlahMalam} malam`, { x: 320, y: posY, size: 10, font: fontBiasa, color: WARNA.teks });
  halaman.drawText(formatRupiah(hargaPerMalam), { x: 370, y: posY, size: 10, font: fontBiasa, color: WARNA.teks });
  halaman.drawText(formatRupiah(totalHarga), { x: width - 120, y: posY, size: 10, font: fontTebal, color: WARNA.teks });

  // Tanggal menginap di bawah nama kamar
  posY -= 16;
  halaman.drawText(
    `${formatTanggal(tanggalCheckIn)} — ${formatTanggal(tanggalCheckOut)}`,
    { x: 56, y: posY, size: 9, font: fontBiasa, color: WARNA.tekstSekunder }
  );

  // ─── TOTAL ────────────────────────────────────────────────────────
  posY -= 30;
  halaman.drawLine({
    start: { x: 48, y: posY },
    end: { x: width - 48, y: posY },
    thickness: 0.5,
    color: WARNA.garis,
  });

  posY -= 20;
  halaman.drawText('TOTAL PEMBAYARAN', {
    x: 48,
    y: posY,
    size: 12,
    font: fontTebal,
    color: WARNA.teks,
  });
  halaman.drawText(formatRupiah(totalHarga), {
    x: width - 120,
    y: posY,
    size: 14,
    font: fontTebal,
    color: WARNA.utama,
  });

  // ─── CATATAN PEMBAYARAN ───────────────────────────────────────────
  posY -= 60;
  halaman.drawText('Terima kasih telah memilih MerapiStay!', {
    x: 48,
    y: posY,
    size: 12,
    font: fontTebal,
    color: WARNA.utama,
  });
  posY -= 18;
  halaman.drawText('Kami berharap Anda menikmati pengalaman menginap di kaki Gunung Merapi.', {
    x: 48,
    y: posY,
    size: 10,
    font: fontBiasa,
    color: WARNA.tekstSekunder,
  });
  posY -= 14;
  halaman.drawText('Sampai jumpa kembali! 🏔️', {
    x: 48,
    y: posY,
    size: 10,
    font: fontBiasa,
    color: WARNA.tekstSekunder,
  });

  // ─── FOOTER ──────────────────────────────────────────────────────
  halaman.drawLine({
    start: { x: 48, y: 70 },
    end: { x: width - 48, y: 70 },
    thickness: 0.5,
    color: WARNA.garis,
  });
  halaman.drawText('MerapiStay — Homestay Kaki Gunung Merapi & Merbabu, Magelang, Jawa Tengah', {
    x: 48,
    y: 52,
    size: 8,
    font: fontBiasa,
    color: WARNA.tekstSekunder,
  });
  halaman.drawText('Dokumen ini dibuat secara otomatis oleh sistem. Tidak memerlukan tanda tangan.', {
    x: 48,
    y: 36,
    size: 8,
    font: fontBiasa,
    color: rgb(0.7, 0.7, 0.7),
  });

  // Serialize PDF ke bytes dan kembalikan sebagai Buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
