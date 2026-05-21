import { Wifi, Wind, Droplets, Coffee, Tv, Car, Utensils, Mountain, ShowerHead, Bed } from 'lucide-react';

/**
 * Pemetaan nama fasilitas ke ikon Lucide React.
 * Kunci adalah kata kunci dalam nama fasilitas (case-insensitive).
 */
const IKON_FASILITAS: Record<string, React.ElementType> = {
  wifi: Wifi,
  internet: Wifi,
  ac: Wind,
  'air conditioner': Wind,
  'air panas': Droplets,
  shower: ShowerHead,
  tv: Tv,
  televisi: Tv,
  kopi: Coffee,
  coffee: Coffee,
  sarapan: Utensils,
  parkir: Car,
  view: Mountain,
  gunung: Mountain,
  kamar: Bed,
  bed: Bed,
};

/**
 * Menentukan ikon yang sesuai berdasarkan nama fasilitas.
 * Fallback ke titik bullet jika tidak ada pemetaan.
 */
function getIkonFasilitas(namaFasilitas: string): React.ElementType | null {
  const namaLower = namaFasilitas.toLowerCase();
  for (const [kunci, IkonKomponen] of Object.entries(IKON_FASILITAS)) {
    if (namaLower.includes(kunci)) {
      return IkonKomponen;
    }
  }
  return null;
}

interface FasilitasListProps {
  fasilitas: Array<{ item: string }>;
}

/**
 * Komponen daftar fasilitas kamar dengan ikon Lucide React.
 * Menampilkan grid 2 kolom dengan ikon dan label setiap fasilitas.
 */
export function FasilitasList({ fasilitas }: FasilitasListProps) {
  if (!fasilitas || fasilitas.length === 0) {
    return (
      <p className="font-body text-sm text-stone-400">
        Informasi fasilitas belum tersedia.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="list">
      {fasilitas.map((f, index) => {
        const IkonKomponen = getIkonFasilitas(f.item);

        return (
          <li
            key={index}
            className="flex items-center gap-2.5 rounded-sm bg-stone-50 px-3 py-2.5"
          >
            {IkonKomponen ? (
              <IkonKomponen
                className="h-4 w-4 flex-shrink-0 text-sage-700"
                aria-hidden="true"
              />
            ) : (
              // Fallback: titik dekoratif
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage-700" aria-hidden="true" />
            )}
            <span className="font-body text-sm text-stone-600">{f.item}</span>
          </li>
        );
      })}
    </ul>
  );
}
