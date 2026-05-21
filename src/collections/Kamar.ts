import type { CollectionConfig } from 'payload';

/**
 * Collection Kamar — menyimpan data setiap kamar homestay.
 * Diakses publik untuk katalog dan halaman detail kamar.
 */
export const Kamar: CollectionConfig = {
  slug: 'kamar',
  labels: {
    singular: 'Kamar',
    plural: 'Daftar Kamar',
  },
  admin: {
    useAsTitle: 'namaKamar',
    defaultColumns: ['namaKamar', 'hargaPerMalam', 'kapasitas', 'tersedia', 'urutan'],
    description: 'Kelola data kamar homestay: foto, harga, fasilitas, dan ketersediaan.',
  },
  // Izinkan siapa saja membaca data kamar (untuk halaman publik)
  access: {
    read: () => true,
  },
  fields: [
    // ─── Informasi Dasar ────────────────────────────────────────────
    {
      name: 'namaKamar',
      type: 'text',
      label: 'Nama Kamar',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL',
      required: true,
      unique: true,
      admin: {
        description: 'Digunakan sebagai URL halaman detail. Contoh: kamar-merapi-view',
        position: 'sidebar',
      },
    },
    {
      name: 'deskripsi',
      type: 'textarea',
      label: 'Deskripsi Kamar',
      required: true,
      admin: {
        description: 'Deskripsi singkat yang menarik untuk ditampilkan di katalog.',
      },
    },

    // ─── Harga & Kapasitas ──────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'hargaPerMalam',
          type: 'number',
          label: 'Harga Per Malam (IDR)',
          required: true,
          min: 0,
          admin: {
            description: 'Contoh: 450000 (tanpa titik/koma)',
          },
        },
        {
          name: 'kapasitas',
          type: 'number',
          label: 'Kapasitas Tamu Dewasa',
          required: true,
          defaultValue: 2,
          min: 1,
        },
        {
          name: 'kapasitasAnak',
          type: 'number',
          label: 'Kapasitas Anak-Anak',
          required: true,
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Jumlah maksimal anak-anak yang diperbolehkan menginap.',
          },
        },
      ],
    },

    // ─── Fasilitas ──────────────────────────────────────────────────
    {
      name: 'fasilitas',
      type: 'array',
      label: 'Fasilitas Kamar',
      admin: {
        description: 'Tambahkan fasilitas satu per satu. Contoh: WiFi, AC, Kamar Mandi Dalam.',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          label: 'Nama Fasilitas',
          required: true,
        },
      ],
    },

    // ─── Foto Kamar ─────────────────────────────────────────────────
    {
      name: 'fotoKamar',
      type: 'upload',
      label: 'Foto Kamar',
      relationTo: 'media',
      required: true,
      hasMany: true,
      admin: {
        description: 'Upload minimal 1 foto. Foto pertama akan ditampilkan sebagai thumbnail katalog.',
      },
    },

    // ─── Status & Urutan ────────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'tersedia',
          type: 'checkbox',
          label: 'Tersedia untuk Dipesan',
          defaultValue: true,
          admin: {
            description: 'Hilangkan centang untuk menyembunyikan kamar dari katalog publik.',
          },
        },
        {
          name: 'urutan',
          type: 'number',
          label: 'Urutan Tampil',
          defaultValue: 0,
          admin: {
            description: 'Angka lebih kecil tampil lebih awal. Contoh: 1, 2, 3...',
          },
        },
      ],
    },
  ],
};
