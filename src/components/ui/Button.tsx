import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Varian tombol berdasarkan Design System "Structured Nature".
 * primary: Tombol CTA utama — hijau forest dengan shape pill.
 * secondary: Tombol outline untuk aksi sekunder.
 * ghost: Tombol tanpa border untuk navigasi ringan.
 */
const buttonVariants = cva(
  // Base class — berlaku untuk semua varian
  'inline-flex items-center justify-center gap-2 font-body font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-800 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        // Tombol CTA utama: bg hijau forest, shape pill
        primary: 'bg-forest-800 text-white hover:bg-forest-900 shadow-md hover:shadow-lg active:scale-[0.98]',
        // Tombol outline: border hijau forest, bg transparan
        secondary: 'border-2 border-forest-800 text-forest-800 bg-transparent hover:bg-forest-800 hover:text-white',
        // Tombol ghost: tanpa border, subtle hover
        ghost: 'text-stone-600 hover:text-stone-800 hover:bg-stone-100',
        // Tombol destructive: untuk aksi berbahaya
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-full',
        md: 'h-11 px-6 text-base rounded-full',
        lg: 'h-13 px-8 text-lg rounded-full',
        // Tombol icon tanpa teks
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

/**
 * Komponen Button reusable dengan varian primary, secondary, ghost, dan danger.
 * Mendukung state loading dengan spinner otomatis.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading && (
          // Spinner loading sederhana
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
