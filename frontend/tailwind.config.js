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
        base: '#070b14',
        surface: '#0e1626',
        raised: 'rgba(255, 255, 255, 0.06)',
        inset: 'rgba(8, 13, 26, 0.5)',
        line: '#1c2739',
        'line-strong': '#2a3852',
        brand: {
          DEFAULT: '#c9a84c',
          50: '#faf6ea',
          100: '#f3ead0',
          200: '#e7d6a4',
          300: '#d9bf72',
          400: '#d0b055',
          500: '#c9a84c',
          600: '#a5822b',
        },
      },
    },
  },
  plugins: [],
};
