import { cn } from '@/lib/utils';
import { type InputHTMLAttributes, forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Komponen Input form reusable dengan label, error state, dan hint text.
 * Mengikuti Design System: border stone-400, focus ring forest-800, radius-sm.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    // Gunakan useId untuk ID yang unik dan aksesibel (menghindari duplikasi ID)
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-sm font-semibold text-stone-800"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-terracotta-600" aria-label="wajib diisi">*</span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            // Base style
            'h-11 w-full rounded-sm border px-4 py-2.5 font-body text-base text-stone-800 placeholder:text-stone-400 bg-white',
            // Border normal
            'border-stone-400',
            // Focus state: border berubah ke forest-800 dengan ring halus
            'focus:outline-none focus:border-forest-800 focus:ring-2 focus:ring-forest-800/20 transition-all duration-150 ease-in-out',
            // Error state
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            // Disabled state
            'disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />

        {/* Pesan error — ditampilkan jika ada validasi gagal */}
        {error && (
          <p id={`${inputId}-error`} className="font-body text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Teks hint — ditampilkan jika tidak ada error */}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="font-body text-sm text-stone-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
