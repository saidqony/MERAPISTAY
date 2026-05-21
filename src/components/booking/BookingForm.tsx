'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, CalendarDays, Users, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  formatRupiah,
  hitungJumlahMalam,
  buildWhatsAppUrl,
  type PesananDetail,
} from '@/lib/utils';

interface BookingFormProps {
  kamarId: string | number;
  namaKamar: string;
  hargaPerMalam: number;
  kapasitas: number;
  kapasitasAnak: number;
  nomorAdmin: string; // Diambil dari Global PengaturanSitus di server
}

interface FormState {
  namaTamu: string;
  nomorWhatsApp: string;
  email: string;
  tanggalCheckIn: string;
  tanggalCheckOut: string;
  jumlahTamu: number;
  jumlahAnak: number;
}

interface FormErrors {
  namaTamu?: string;
  nomorWhatsApp?: string;
  email?: string;
  tanggalCheckIn?: string;
  tanggalCheckOut?: string;
  jumlahTamu?: string;
  jumlahAnak?: string;
}

/**
 * Komponen form pemesanan interaktif.
 * Client Component karena membutuhkan: useState, onChange, onSubmit, auto-hitung harga.
 *
 * Alur: Isi form → validasi → redirect ke WhatsApp dengan pesan pra-isi.
 */
export function BookingForm({ kamarId, namaKamar, hargaPerMalam, kapasitas, kapasitasAnak, nomorAdmin }: BookingFormProps) {
  const router = useRouter();

  // Tanggal minimal adalah hari ini
  const hariIni = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<FormState>({
    namaTamu: '',
    nomorWhatsApp: '',
    email: '',
    tanggalCheckIn: '',
    tanggalCheckOut: '',
    jumlahTamu: 1,
    jumlahAnak: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Hitung jumlah malam dan total harga secara reaktif
  const { jumlahMalam, totalHarga } = useMemo(() => {
    if (!form.tanggalCheckIn || !form.tanggalCheckOut) {
      return { jumlahMalam: 0, totalHarga: 0 };
    }
    const malam = hitungJumlahMalam(form.tanggalCheckIn, form.tanggalCheckOut);
    return {
      jumlahMalam: malam,
      totalHarga: malam * hargaPerMalam,
    };
  }, [form.tanggalCheckIn, form.tanggalCheckOut, hargaPerMalam]);

  // Tangani perubahan input
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['jumlahTamu', 'jumlahAnak'].includes(name) ? Number(value) : value,
    }));
    // Hapus error field yang sedang diubah
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // Validasi form sebelum redirect ke WhatsApp
  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.namaTamu.trim()) {
      newErrors.namaTamu = 'Nama lengkap wajib diisi.';
    }
    if (!form.nomorWhatsApp.trim()) {
      newErrors.nomorWhatsApp = 'Nomor WhatsApp wajib diisi.';
    } else if (!/^[0-9]{9,15}$/.test(form.nomorWhatsApp.replace(/[\s+\-()]/g, ''))) {
      newErrors.nomorWhatsApp = 'Format nomor WhatsApp tidak valid.';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Alamat email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (!form.tanggalCheckIn) {
      newErrors.tanggalCheckIn = 'Tanggal check-in wajib dipilih.';
    }
    if (!form.tanggalCheckOut) {
      newErrors.tanggalCheckOut = 'Tanggal check-out wajib dipilih.';
    } else if (form.tanggalCheckIn && form.tanggalCheckOut <= form.tanggalCheckIn) {
      newErrors.tanggalCheckOut = 'Tanggal check-out harus setelah check-in.';
    }
    if (form.jumlahTamu < 1 || form.jumlahTamu > kapasitas) {
      newErrors.jumlahTamu = `Jumlah tamu dewasa harus antara 1 dan ${kapasitas}.`;
    }
    if (form.jumlahAnak < 0 || form.jumlahAnak > kapasitasAnak) {
      newErrors.jumlahAnak = `Jumlah anak-anak harus antara 0 dan ${kapasitasAnak}.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle submit: validasi → simpan ke Payload → redirect ke WhatsApp
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      // Simpan pesanan ke Payload CMS via REST API
      const response = await fetch('/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaTamu: form.namaTamu,
          nomorWhatsApp: form.nomorWhatsApp.replace(/[\s+\-()]/g, ''),
          email: form.email,
          kamar: kamarId, // Kirim ID kamar asli untuk relationship field Payload CMS
          tanggalCheckIn: form.tanggalCheckIn,
          tanggalCheckOut: form.tanggalCheckOut,
          jumlahTamu: form.jumlahTamu,
          jumlahAnak: form.jumlahAnak,
          totalHarga,
          status: 'menunggu',
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan pesanan.');
      }

      // Bangun URL WhatsApp dengan pesan pra-isi detail pesanan
      const pesananDetail: PesananDetail = {
        namaKamar,
        namaTamu: form.namaTamu,
        tanggalCheckIn: form.tanggalCheckIn,
        tanggalCheckOut: form.tanggalCheckOut,
        jumlahTamu: form.jumlahTamu,
        jumlahAnak: form.jumlahAnak,
        totalHarga,
      };

      const waUrl = buildWhatsAppUrl(nomorAdmin, pesananDetail);

      // Redirect ke halaman konfirmasi lalu buka WhatsApp di tab baru
      router.push('/booking?status=success');
      window.open(waUrl, '_blank', 'noopener,noreferrer');

    } catch (err) {
      console.error('[BookingForm] Gagal memproses pesanan:', err);
      // Tetap redirect ke WhatsApp meskipun penyimpanan gagal
      // agar pengunjung tidak kehilangan momentum pemesanan
      const pesananDetail: PesananDetail = {
        namaKamar,
        namaTamu: form.namaTamu,
        tanggalCheckIn: form.tanggalCheckIn,
        tanggalCheckOut: form.tanggalCheckOut,
        jumlahTamu: form.jumlahTamu,
        jumlahAnak: form.jumlahAnak,
        totalHarga,
      };
      const waUrl = buildWhatsAppUrl(nomorAdmin, pesananDetail);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-stone-100 bg-white p-6 shadow-lg">
      <h2 className="font-heading text-xl font-semibold text-stone-800 mb-1">
        Pesan Kamar Ini
      </h2>
      <p className="font-body text-sm text-stone-400 mb-6">
        Isi formulir di bawah, kami akan menghubungi Anda via WhatsApp.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Nama Lengkap */}
        <Input
          id="booking-nama"
          name="namaTamu"
          label="Nama Lengkap"
          type="text"
          placeholder="Contoh: Budi Santoso"
          value={form.namaTamu}
          onChange={handleChange}
          error={errors.namaTamu}
          required
          autoComplete="name"
        />

        {/* Nomor WhatsApp */}
        <Input
          id="booking-wa"
          name="nomorWhatsApp"
          label="Nomor WhatsApp"
          type="tel"
          placeholder="Contoh: 08123456789"
          value={form.nomorWhatsApp}
          onChange={handleChange}
          error={errors.nomorWhatsApp}
          required
          autoComplete="tel"
          hint="Kami akan menghubungi Anda di nomor ini."
        />

        {/* Email */}
        <Input
          id="booking-email"
          name="email"
          label="Alamat Email"
          type="email"
          placeholder="Contoh: budi@email.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
          hint="Invoice akan dikirim ke email ini setelah pembayaran."
        />

        {/* Tanggal Check-in & Check-out */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="booking-checkin"
            name="tanggalCheckIn"
            label="Check-in"
            type="date"
            min={hariIni}
            value={form.tanggalCheckIn}
            onChange={handleChange}
            error={errors.tanggalCheckIn}
            required
          />
          <Input
            id="booking-checkout"
            name="tanggalCheckOut"
            label="Check-out"
            type="date"
            min={form.tanggalCheckIn || hariIni}
            value={form.tanggalCheckOut}
            onChange={handleChange}
            error={errors.tanggalCheckOut}
            required
          />
        </div>

        {/* Jumlah Tamu & Anak-Anak */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="booking-jumlah-tamu"
            name="jumlahTamu"
            label={`Dewasa (Maks. ${kapasitas})`}
            type="number"
            min={1}
            max={kapasitas}
            value={form.jumlahTamu}
            onChange={handleChange}
            error={errors.jumlahTamu}
            required
          />
          <Input
            id="booking-jumlah-anak"
            name="jumlahAnak"
            label={`Anak-Anak (Maks. ${kapasitasAnak})`}
            type="number"
            min={0}
            max={kapasitasAnak}
            value={form.jumlahAnak}
            onChange={handleChange}
            error={errors.jumlahAnak}
            required
            hint="Di bawah 12 thn"
          />
        </div>

        {/* Ringkasan Harga (ditampilkan jika tanggal sudah dipilih) */}
        {jumlahMalam > 0 && (
          <div className="rounded-md bg-sage-100 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sage-700 mb-1">
              <Calculator className="h-4 w-4" aria-hidden="true" />
              <span className="font-body text-sm font-semibold">Ringkasan Biaya</span>
            </div>
            <div className="flex justify-between font-body text-sm text-stone-600">
              <span>{formatRupiah(hargaPerMalam)} × {jumlahMalam} malam</span>
              <span>{formatRupiah(totalHarga)}</span>
            </div>
            <div className="border-t border-sage-700/20 pt-2 flex justify-between font-body font-bold text-stone-800">
              <span>Total</span>
              <span className="text-forest-800">{formatRupiah(totalHarga)}</span>
            </div>
          </div>
        )}

        {/* Tombol Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full gap-2.5"
          id="booking-submit-btn"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {isLoading ? 'Memproses...' : 'Pesan via WhatsApp'}
        </Button>

        <p className="text-center font-body text-xs text-stone-400">
          Dengan menekan tombol di atas, Anda akan diarahkan ke WhatsApp
          untuk melanjutkan proses pemesanan.
        </p>
      </form>
    </div>
  );
}
