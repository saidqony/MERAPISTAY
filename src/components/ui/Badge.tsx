import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Varian badge status sesuai Design System:
 * tersedia: sage-100 bg + sage-700 teks (hijau lembut)
 * terbatas: terracotta-50 bg + terracotta-600 teks (oranye hangat)
 * penuh: stone-100 bg + stone-400 teks (abu netral)
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        tersedia: 'bg-sage-100 text-sage-700',
        terbatas: 'bg-terracotta-50 text-terracotta-600',
        penuh: 'bg-stone-100 text-stone-400',
        // Varian generik untuk label lainnya
        info: 'bg-blue-50 text-blue-700',
      },
    },
    defaultVariants: {
      variant: 'tersedia',
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
  dot?: boolean; // Tampilkan titik indikator di depan teks
}

/**
 * Badge status pill untuk menampilkan ketersediaan kamar.
 * Tersedia / Terbatas / Penuh.
 */
export function Badge({ variant, className, children, dot = false }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'tersedia' && 'bg-sage-700',
            variant === 'terbatas' && 'bg-terracotta-600',
            variant === 'penuh' && 'bg-stone-400',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

/**
 * Helper untuk menentukan varian badge berdasarkan status tersedia/penuh.
 */
export function getStatusBadgeVariant(tersedia: boolean): BadgeProps['variant'] {
  return tersedia ? 'tersedia' : 'penuh';
}
