import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Komponen Card reusable — kontainer konten dengan bayangan dan radius.
 * Digunakan sebagai wrapper untuk berbagai blok konten di halaman.
 */
export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-white transition-shadow duration-300',
        // Varian tampilan
        variant === 'default' && 'shadow-md hover:shadow-lg',
        variant === 'bordered' && 'border border-stone-100 shadow-sm',
        variant === 'flat' && 'bg-stone-50',
        // Padding
        padding === 'none' && 'p-0',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-6',
        padding === 'lg' && 'p-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Sub-komponen Card.Header untuk judul area kartu.
 */
export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Sub-komponen Card.Body untuk konten utama kartu.
 */
export function CardBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Sub-komponen Card.Footer untuk area bawah kartu.
 */
export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 border-t border-stone-100 pt-4', className)} {...props}>
      {children}
    </div>
  );
}
