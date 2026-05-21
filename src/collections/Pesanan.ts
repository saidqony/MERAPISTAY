import type { CollectionConfig } from 'payload';
import { generateInvoicePDF } from '@/lib/pdf';
import { sendInvoiceEmail } from '@/lib/email';

/**
 * Collection Pesanan — menyimpan data pemesanan tamu.
 * Hanya admin yang bisa membaca dan mengubah data pesanan.
 *
 * Hook afterChange memicu otomatisasi:
 *   Status "menunggu" → "lunas" = generate PDF + kirim email invoice
 */
export const Pesanan: CollectionConfig = {
  slug: 'pesanan',
  labels: {
    singular: 'Pesanan',
    plural: 'Daftar Pesanan',
  },
  admin: {
    useAsTitle: 'namaTamu',
    defaultColumns: ['namaTamu', 'kamar', 'tanggalCheckIn', 'tanggalCheckOut', 'status', 'invoiceTerkirim'],
    description: 'Kelola pesanan masuk. Ubah status ke "Lunas" untuk memicu pengiriman invoice otomatis.',
  },
  fields: [
    // ─── Data Tamu ───────────────────────────────────────────────────
    {
      name: 'namaTamu',
      type: 'text',
      label: 'Nama Lengkap Tamu',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'nomorWhatsApp',
          type: 'text',
          label: 'Nomor WhatsApp',
          required: true,
          admin: {
            description: 'Format internasional tanpa +. Contoh: 6281234567890',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Alamat Email',
          required: true,
          admin: {
            description: 'Invoice PDF akan dikirim ke email ini.',
          },
        },
      ],
    },

    // ─── Detail Pemesanan ────────────────────────────────────────────
    {
      name: 'kamar',
      type: 'relationship',
      label: 'Kamar yang Dipesan',
      relationTo: 'kamar',
      required: true,
      hasMany: false,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tanggalCheckIn',
          type: 'date',
          label: 'Tanggal Check-In',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'tanggalCheckOut',
          type: 'date',
          label: 'Tanggal Check-Out',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'jumlahTamu',
          type: 'number',
          label: 'Jumlah Tamu Dewasa',
          required: true,
          min: 1,
        },
        {
          name: 'jumlahAnak',
          type: 'number',
          label: 'Jumlah Anak-Anak',
          required: true,
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'totalHarga',
          type: 'number',
          label: 'Total Harga (IDR)',
          required: true,
          admin: {
            description: 'Dihitung otomatis: harga per malam × jumlah malam',
          },
        },
      ],
    },

    // ─── Status Pembayaran ───────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      label: 'Status Pembayaran',
      required: true,
      defaultValue: 'menunggu',
      options: [
        { label: '⏳ Menunggu Pembayaran', value: 'menunggu' },
        { label: '✅ Lunas', value: 'lunas' },
        { label: '❌ Dibatalkan', value: 'dibatalkan' },
      ],
      admin: {
        description: 'Ubah ke "Lunas" untuk memicu pengiriman invoice otomatis via email.',
      },
    },

    // ─── Field Admin Internal ────────────────────────────────────────
    {
      name: 'catatanAdmin',
      type: 'textarea',
      label: 'Catatan Admin (Internal)',
      admin: {
        description: 'Catatan ini tidak akan terlihat oleh tamu.',
      },
    },
    {
      name: 'tanggalPembuatan',
      type: 'date',
      label: 'Tanggal Pemesanan Dibuat',
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },

    // ─── Status Invoice (Read-Only, dikontrol sistem) ────────────────
    {
      name: 'invoiceTerkirim',
      type: 'checkbox',
      label: 'Invoice Sudah Terkirim',
      defaultValue: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Otomatis dicentang sistem saat invoice berhasil terkirim ke email tamu.',
      },
    },
    {
      name: 'fileInvoice',
      type: 'upload',
      label: 'File Invoice PDF',
      relationTo: 'media',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'File PDF yang dihasilkan otomatis oleh sistem.',
      },
    },
  ],

  // ─── Hook Otomatisasi Invoice ────────────────────────────────────
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        // Hanya proses saat operasi update (bukan create baru)
        if (operation !== 'update') return;

        // Hindari infinite loop: jika hook dipicu oleh update internal sistem, lewati
        if (req.context?.preventInvoiceHook) return;

        const prevStatus = previousDoc?.status as string | undefined;
        const newStatus = doc?.status as string;

        // Hanya lanjut jika status baru berubah menjadi "lunas"
        if (prevStatus === 'lunas' || newStatus !== 'lunas') return;

        // Hindari pengiriman ulang invoice yang sudah pernah terkirim
        if (doc.invoiceTerkirim) {
          console.log(`[InvoiceHook] Invoice untuk pesanan ${doc.id} sudah pernah terkirim. Dilewati.`);
          return;
        }

        try {
          // Ambil data relasi kamar untuk detail invoice
          const kamarData = await req.payload.findByID({
            collection: 'kamar',
            id: typeof doc.kamar === 'object' ? doc.kamar.id : doc.kamar,
          });

          // Siapkan nomor invoice dengan format INV-00001
          const nomorInvoice = `INV-${String(doc.id).padStart(5, '0')}`;

          // Generate dokumen PDF invoice di server-side
          const pdfBuffer = await generateInvoicePDF({
            nomorInvoice,
            namaTamu: doc.namaTamu as string,
            namaKamar: kamarData.namaKamar as string,
            tanggalCheckIn: doc.tanggalCheckIn as string,
            tanggalCheckOut: doc.tanggalCheckOut as string,
            jumlahTamu: doc.jumlahTamu as number,
            totalHarga: doc.totalHarga as number,
            tanggalBayar: new Date(),
          });

          // Kirim email dengan lampiran PDF via Resend
          await sendInvoiceEmail({
            to: doc.email as string,
            nomorInvoice,
            namaTamu: doc.namaTamu as string,
            namaKamar: kamarData.namaKamar as string,
            tanggalCheckIn: doc.tanggalCheckIn as string,
            tanggalCheckOut: doc.tanggalCheckOut as string,
            totalHarga: doc.totalHarga as number,
            pdfBuffer,
          });

          // Tandai invoice sebagai terkirim agar tidak dikirim ulang
          // Gunakan context flag untuk mencegah hook berjalan rekursif
          await req.payload.update({
            collection: 'pesanan',
            id: doc.id,
            data: { invoiceTerkirim: true },
            context: { preventInvoiceHook: true },
          });

          console.log(`[InvoiceHook] Invoice ${nomorInvoice} berhasil dikirim ke ${doc.email}`);

        } catch (error) {
          // Graceful degradation: log error tapi JANGAN throw agar operasi admin tidak terganggu
          console.error(`[InvoiceHook] Gagal memproses invoice untuk pesanan ${doc.id}:`, error);
        }
      },
    ],
  },
};
