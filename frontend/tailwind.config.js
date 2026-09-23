/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        serif: ['DM Serif Display', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        base: '#0b1225',
        surface: '#151c35',
        raised: 'rgba(255, 255, 255, 0.07)',
        inset: 'rgba(10, 16, 34, 0.56)',
        line: '#2b3450',
        'line-strong': '#3b4665',
        brand: {
          DEFAULT: '#ff9da1',
          50: '#fff1f2',
          100: '#ffe0e2',
          200: '#ffc4c7',
          300: '#ffadb1',
          400: '#ff9da1',
          500: '#ff858c',
          600: '#dc626c',
        },
      },
    },
  },
  plugins: [],
};
