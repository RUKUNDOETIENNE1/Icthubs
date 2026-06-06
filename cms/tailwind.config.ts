import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0d1d2c',
          green: '#2c7a4d',
          light: '#e0ece6',
        },
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0,0,0,0.04)',
        md: '0 4px 16px rgba(0,0,0,0.06)',
        lg: '0 8px 24px rgba(0,0,0,0.08)',
        xl: '0 12px 32px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        sm: '16px',
        md: '24px',
        lg: '32px',
      }
    },
  },
  plugins: [typography],
} satisfies Config
