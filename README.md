# MerapiStay 🏔️

Website pemesanan homestay kaki Gunung Merapi & Merbabu, Magelang.

**Stack:** Next.js 15 · Payload CMS v3 · Supabase · Resend · Vercel

---

## Prasyarat

- Node.js >= 18.x
- npm >= 9.x
- Akun Supabase (database + storage)
- Akun Resend (email service)

---

## Instalasi

### 1. Install dependensi

```bash
npm install
```

### 2. Konfigurasi Environment Variables

Salin template dan isi dengan nilai asli:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Payload CMS — buat string acak minimal 32 karakter
PAYLOAD_SECRET=

# Supabase PostgreSQL — WAJIB gunakan Transaction Pooler (port 6543)
DATABASE_URI=postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Supabase Storage S3
S3_ENDPOINT=https://[project-ref].supabase.co/storage/v1/s3
S3_BUCKET=homestay-media
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=ap-southeast-1

# Resend
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=invoice@domain-anda.com

# URL aplikasi
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Setup Supabase

Di Supabase dashboard:
1. **Database** → Salin **Transaction Pooler** connection string (bukan Direct Connection)
2. **Storage** → Buat bucket baru bernama `homestay-media` dengan akses **Public**
3. **Storage** → Buat S3 access key di Settings → Storage

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Struktur Folder

```
src/
├── app/
│   ├── (frontend)/          # Halaman publik
│   │   ├── page.tsx         # Landing page + katalog kamar
│   │   ├── kamar/[slug]/    # Detail kamar + form booking
│   │   └── booking/         # Konfirmasi setelah pesan
│   ├── (payload)/admin/     # Admin dashboard Payload CMS
│   └── api/[...slug]/       # REST API Payload
├── collections/             # Skema data Payload
│   ├── Kamar.ts
│   ├── Pesanan.ts           # + hook invoice otomatis
│   └── Media.ts
├── globals/
│   └── PengaturanSitus.ts   # Konfigurasi situs global
├── lib/
│   ├── utils.ts             # Helper functions
│   ├── pdf.ts               # Generator invoice PDF
│   └── email.ts             # Pengiriman email (Resend)
└── components/
    ├── ui/                  # Button, Input, Badge, Card
    ├── kamar/               # RoomCard, FasilitasList
    ├── booking/             # BookingForm
    └── layout/              # Navbar, Footer
```

---

## Alur Sistem Otomatis Invoice

```
Admin ubah status pesanan → "Lunas"
         │
         ▼
Payload afterChange Hook (Pesanan.ts)
         │
         ├─► Generate PDF (lib/pdf.ts)
         ├─► Kirim Email + PDF (lib/email.ts via Resend)
         └─► Update field invoiceTerkirim = true
```

---

## Deployment ke Vercel

1. Push repository ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set semua environment variables di Vercel dashboard
4. Deploy — Vercel otomatis menjalankan `npm run build`

> **Penting:** Pastikan `DATABASE_URI` menggunakan **Transaction Pooler** Supabase (port 6543), bukan Direct Connection (port 5432).

---

## Scripts

| Perintah | Keterangan |
|----------|------------|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build produksi |
| `npm run typecheck` | Cek TypeScript errors |
| `npm run payload` | Payload CLI |
