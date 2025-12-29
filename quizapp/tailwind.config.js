/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
  safelist: [
    'border-green-500',
    'bg-green-50',
    'text-green-900',
    'text-green-600',
    'border-blue-500',
    'bg-blue-50',
    'text-blue-900',
    'text-blue-600',
    'border-purple-500',
    'bg-purple-50',
    'text-purple-900',
    'text-purple-600',
  ],
}
