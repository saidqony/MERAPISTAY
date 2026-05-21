import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

// Koleksi data
import { Kamar } from './collections/Kamar';
import { Pesanan } from './collections/Pesanan';
import { Media } from './collections/Media';

// Konfigurasi global situs
import { PengaturanSitus } from './globals/PengaturanSitus';

// Validasi environment variables kritis saat startup
const requiredEnvVars = [
  'PAYLOAD_SECRET',
  'DATABASE_URI',
  'S3_ENDPOINT',
  'S3_BUCKET',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'RESEND_API_KEY',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `[MerapiStay] Environment variable "${envVar}" belum dikonfigurasi. Periksa file .env Anda.`
    );
  }
}

export default buildConfig({
  // ─── Kunci Enkripsi ─────────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET!,

  // ─── Editor Teks Kaya ────────────────────────────────────────────
  editor: lexicalEditor(),

  // ─── Collections & Globals ───────────────────────────────────────
  collections: [Kamar, Pesanan, Media],
  globals: [PengaturanSitus],

  // ─── Database: Supabase PostgreSQL via adapter resmi ────────────
  // Gunakan Transaction Pooler Supabase (port 6543) untuk serverless
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
  }),

  // ─── File Storage: Supabase Storage S3-Compatible ───────────────
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const projectRef = 'wueottmbuaohvnmyuleo';
            const bucket = process.env.S3_BUCKET || 'homestay-media';
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `https://${projectRef}.supabase.co/storage/v1/object/public/${bucket}/${key}`;
          },
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT!,
        region: process.env.S3_REGION ?? 'ap-southeast-2',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true, // Diperlukan untuk Supabase S3-compatible API
      },
    }),
  ],

  // ─── Image Optimization ──────────────────────────────────────────
  sharp,

  // ─── Konfigurasi Admin Panel ─────────────────────────────────────
  admin: {
    meta: {
      titleSuffix: '— MerapiStay Admin',
      description: 'Dashboard pengelola homestay Merapi & Merbabu, Magelang.',
    },
  },

  // ─── TypeScript Auto-Generate ────────────────────────────────────
  typescript: {
    outputFile: 'src/payload-types.ts',
  },

  // ─── GraphQL ─────────────────────────────────────────────────────
  graphQL: {
    schemaOutputFile: 'src/generated-schema.graphql',
  },
});
