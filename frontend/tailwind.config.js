/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        base: '#070b14',
        surface: '#0e1626',
        raised: 'rgba(255, 255, 255, 0.06)',
        inset: 'rgba(8, 13, 26, 0.5)',
        line: '#1c2739',
        'line-strong': '#2a3852',
        brand: {
          DEFAULT: '#f59e0b',
          50: '#fff8eb',
          100: '#fdefc8',
          200: '#fbdf8c',
          300: '#f9cb4f',
          400: '#f6b625',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
    },
  },
  plugins: [],
};
