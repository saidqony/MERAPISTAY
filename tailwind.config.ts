import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Palet Warna "Structured Nature" ───────────────────────────
      colors: {
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          400: '#A8A29E',
          600: '#57534E',
          800: '#292524',
        },
        sage: {
          100: '#E8EDEA',
          700: '#4A5D52',
        },
        forest: {
          800: '#2D4A3E',
          900: '#1A2E26',
        },
        terracotta: {
          50: '#FDF2EE',
          600: '#C67C5B',
        },
      },

      // ─── Tipografi ──────────────────────────────────────────────────
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },

      // ─── Border Radius "Soft but Structural" ───────────────────────
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },

      // ─── Box Shadow — warna berbasis stone-800 (bukan hitam murni) ──
      boxShadow: {
        sm: '0 1px 2px 0 rgb(41 37 36 / 0.05)',
        md: '0 4px 6px -1px rgb(41 37 36 / 0.07)',
        lg: '0 10px 15px -3px rgb(41 37 36 / 0.08)',
        xl: '0 20px 25px -5px rgb(41 37 36 / 0.10)',
      },

      // ─── Animasi & Transisi ─────────────────────────────────────────
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-page': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
