import type { CollectionConfig } from 'payload';

/**
 * Collection Media — menangani semua upload file (foto kamar, file PDF invoice).
 * Payload menyediakan collection ini secara built-in;
 * plugin storage-s3 di payload.config.ts mengarahkan file ke Supabase Storage.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Daftar Media',
  },
  upload: {
    // Batasi ukuran file maksimal 5MB
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
  },
  // Izinkan siapa saja membaca file media (URL foto kamar harus publik)
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Teks Alt (untuk aksesibilitas & SEO)',
      admin: {
        description: 'Deskripsi singkat gambar. Contoh: "Interior Kamar Merapi View dengan pemandangan gunung"',
      },
    },
  ],
};
