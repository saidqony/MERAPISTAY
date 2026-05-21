import { Resend } from 'resend';
import { formatRupiah, formatTanggal } from './utils';

/**
 * Parameter yang dibutuhkan untuk mengirim email invoice.
 */
export interface SendInvoiceEmailParams {
  to: string;
  nomorInvoice: string;
  namaTamu: string;
  namaKamar: string;
  tanggalCheckIn: string;
  tanggalCheckOut: string;
  totalHarga: number;
  pdfBuffer: Buffer;
}

/**
 * Mengirim email invoice kepada tamu via Resend.
 * Menyertakan file PDF sebagai lampiran.
 *
 * Fungsi ini menggunakan graceful degradation:
 * jika terjadi error, exception dibiarkan naik ke hook
 * yang menanganinya tanpa menghambat operasi admin.
 */
export async function sendInvoiceEmail(params: SendInvoiceEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[sendInvoiceEmail] Peringatan: RESEND_API_KEY tidak ditemukan di environment. Pengiriman email dilewati.');
    return;
  }

  const resend = new Resend(apiKey);

  const {
    to,
    nomorInvoice,
    namaTamu,
    namaKamar,
    tanggalCheckIn,
    tanggalCheckOut,
    totalHarga,
    pdfBuffer,
  } = params;

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  // Template HTML email yang bersih dan responsif
  const htmlBody = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice Pemesanan — MerapiStay</title>
    </head>
    <body style="margin:0;padding:0;background-color:#FAFAF9;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:24px 0;">
        <tr>
          <td>
            <!-- Header -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#2D4A3E;border-radius:12px 12px 0 0;">
              <tr>
                <td style="padding:32px 40px;">
                  <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">MerapiStay</h1>
                  <p style="margin:6px 0 0;color:#adcebe;font-size:13px;">Homestay Kaki Gunung Merapi & Merbabu, Magelang</p>
                </td>
              </tr>
            </table>

            <!-- Body -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:0 0 12px 12px;border:1px solid #E8EDEA;border-top:none;">
              <tr>
                <td style="padding:36px 40px;">
                  <!-- Status Lunas -->
                  <div style="background-color:#E8EDEA;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
                    <p style="margin:0;color:#4A5D52;font-size:14px;font-weight:600;">✅ Pembayaran Berhasil Diterima</p>
                    <p style="margin:4px 0 0;color:#57534E;font-size:13px;">Nomor Invoice: <strong>${nomorInvoice}</strong></p>
                  </div>

                  <!-- Salam -->
                  <p style="color:#292524;font-size:16px;margin:0 0 8px;">Halo, <strong>${namaTamu}</strong>!</p>
                  <p style="color:#57534E;font-size:14px;line-height:1.6;margin:0 0 28px;">
                    Terima kasih telah melakukan pembayaran. Kami dengan senang hati mengkonfirmasi bahwa
                    pemesanan Anda telah dikonfirmasi. Invoice resmi telah kami lampirkan dalam email ini.
                  </p>

                  <!-- Detail Pesanan -->
                  <h3 style="color:#292524;font-size:14px;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Detail Pemesanan</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8EDEA;border-radius:8px;overflow:hidden;">
                    <tr style="background-color:#FAFAF9;">
                      <td style="padding:12px 16px;color:#57534E;font-size:13px;">Kamar</td>
                      <td style="padding:12px 16px;color:#292524;font-size:13px;font-weight:600;text-align:right;">${namaKamar}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 16px;color:#57534E;font-size:13px;border-top:1px solid #E8EDEA;">Check-in</td>
                      <td style="padding:12px 16px;color:#292524;font-size:13px;font-weight:600;text-align:right;border-top:1px solid #E8EDEA;">${formatTanggal(tanggalCheckIn)}</td>
                    </tr>
                    <tr style="background-color:#FAFAF9;">
                      <td style="padding:12px 16px;color:#57534E;font-size:13px;border-top:1px solid #E8EDEA;">Check-out</td>
                      <td style="padding:12px 16px;color:#292524;font-size:13px;font-weight:600;text-align:right;border-top:1px solid #E8EDEA;">${formatTanggal(tanggalCheckOut)}</td>
                    </tr>
                    <tr style="background-color:#2D4A3E;">
                      <td style="padding:14px 16px;color:#adcebe;font-size:13px;font-weight:600;">Total Pembayaran</td>
                      <td style="padding:14px 16px;color:#ffffff;font-size:16px;font-weight:700;text-align:right;">${formatRupiah(totalHarga)}</td>
                    </tr>
                  </table>

                  <!-- Langkah Selanjutnya -->
                  <div style="margin-top:28px;padding:20px;background-color:#FDF2EE;border-radius:8px;border-left:3px solid #C67C5B;">
                    <p style="margin:0 0 8px;color:#292524;font-size:13px;font-weight:600;">📋 Langkah Selanjutnya</p>
                    <p style="margin:0;color:#57534E;font-size:13px;line-height:1.6;">
                      Mohon simpan invoice ini sebagai bukti pembayaran Anda.
                      Tunjukkan kepada petugas saat check-in. Kami tidak sabar untuk menyambut Anda! 🏔️
                    </p>
                  </div>

                  <!-- Penutup -->
                  <p style="margin:28px 0 0;color:#57534E;font-size:14px;line-height:1.6;">
                    Jika ada pertanyaan, silakan hubungi kami melalui WhatsApp.
                    Sampai jumpa di MerapiStay!
                  </p>
                  <p style="margin:8px 0 0;color:#292524;font-size:14px;font-weight:600;">Tim MerapiStay 🌿</p>
                </td>
              </tr>
            </table>

            <!-- Footer Email -->
            <p style="text-align:center;color:#A8A29E;font-size:11px;margin:20px 0 0;">
              Email ini dikirim secara otomatis oleh sistem MerapiStay.<br>
              Homestay Kaki Gunung Merapi & Merbabu, Magelang, Jawa Tengah.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Kirim email via Resend API dengan PDF terlampir
  const { error } = await resend.emails.send({
    from: `MerapiStay <${fromEmail}>`,
    to: [to],
    subject: `Invoice ${nomorInvoice} — Pemesanan ${namaKamar} ✅`,
    html: htmlBody,
    attachments: [
      {
        filename: `${nomorInvoice}-MerapiStay.pdf`,
        // Resend menerima lampiran dalam format base64
        content: pdfBuffer.toString('base64'),
      },
    ],
  });

  // Lempar error jika pengiriman gagal agar bisa ditangkap oleh hook
  if (error) {
    throw new Error(`[sendInvoiceEmail] Resend API error: ${error.message}`);
  }
}
