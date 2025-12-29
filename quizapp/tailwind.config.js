/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        sm: '4px',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green-500',
    'bg-blue-500',
    'bg-red-500',
    'text-green-500',
    'text-blue-500',
    'text-red-500',
    'border-green-500',
    'border-blue-500',
    'border-red-500',
    'from-green-400',
    'from-yellow-400',
    'from-red-400',
    'to-emerald-500',
    'to-orange-500',
    'to-rose-500',
  ],
}
