/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        page: '#f5f6f8',
        ink: '#1c2430',
        muted: '#667085',
        line: '#dfe3e8',
        brand: '#1f5fa8',
        'brand-soft': '#e8f0fa',
        good: '#1e7a46',
        bad: '#b42318',
      },
    },
  },
  plugins: [],
};
