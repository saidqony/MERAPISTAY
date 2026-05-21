import type { GlobalConfig } from 'payload';

/**
 * Global PengaturanSitus — konfigurasi operasional homestay.
 * Diakses admin untuk mengatur nama, nomor WA, rekening bank, dll.
 * Diakses frontend untuk membangun link WhatsApp redirect.
 */
export const PengaturanSitus: GlobalConfig = {
  slug: 'pengaturan-situs',
  label: 'Pengaturan Situs',
  admin: {
    description: 'Konfigurasi umum website: nama homestay, nomor WhatsApp admin, dan rekening bank untuk transfer.',
  },
  // Izinkan frontend membaca pengaturan (misalnya nomor WA admin)
  access: {
    read: () => true,
  },
  fields: [
    // ─── Identitas Homestay ──────────────────────────────────────────
    {
      name: 'namaHomestay',
      type: 'text',
      label: 'Nama Homestay',
      required: true,
      defaultValue: 'MerapiStay',
      admin: {
        description: 'Nama yang ditampilkan di header website dan invoice.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      admin: {
        description: 'Kalimat singkat di bawah nama. Contoh: "Menginap di Kaki Gunung Merapi"',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo Homestay',
      relationTo: 'media',
      admin: {
        description: 'Upload logo dalam format PNG atau WebP dengan background transparan.',
      },
    },

    // ─── Kontak ──────────────────────────────────────────────────────
    {
      name: 'nomorAdmin',
      type: 'text',
      label: 'Nomor WhatsApp Admin',
      required: true,
      admin: {
        description: 'Format internasional tanpa +. Contoh: 6281234567890. Digunakan untuk redirect pesan booking.',
      },
    },
    {
      name: 'alamat',
      type: 'textarea',
      label: 'Alamat Lengkap Homestay',
      admin: {
        description: 'Ditampilkan di footer dan invoice.',
      },
    },

    // ─── Rekening Bank ───────────────────────────────────────────────
    {
      name: 'rekBank',
      type: 'group',
      label: 'Rekening Bank untuk Transfer Pembayaran',
      admin: {
        description: 'Informasi rekening yang ditampilkan di halaman konfirmasi dan invoice.',
      },
      fields: [
        {
          name: 'namaBank',
          type: 'text',
          label: 'Nama Bank',
          admin: { description: 'Contoh: BCA, BRI, Mandiri' },
        },
        {
          name: 'nomorRek',
          type: 'text',
          label: 'Nomor Rekening',
        },
        {
          name: 'atasNama',
          type: 'text',
          label: 'Atas Nama',
        },
      ],
    },
    // ─── Galeri Foto Homestay ─────────────────────────────────────────
    {
      name: 'galeri',
      type: 'array',
      label: 'Galeri Foto Homestay',
      labels: {
        singular: 'Foto',
        plural: 'Daftar Foto Galeri',
      },
      admin: {
        description: 'Daftar foto keindahan homestay, view pegunungan, dan fasilitas untuk ditampilkan di landing page.',
      },
      fields: [
        {
          name: 'foto',
          type: 'upload',
          relationTo: 'media',
          label: 'File Foto',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption Singkat',
        },
      ],
    },
  ],
};
